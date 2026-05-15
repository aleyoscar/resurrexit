#!/usr/bin/env python3
"""
import_lyrics.py

Usage:
  python import_lyrics.py SOURCE_DIR TARGET_DIR
  optional args: --source-ext, --target-ext, --done-folder

Behavior:
  - Collects files with source-ext in SOURCE_DIR
  - For each file:
      * normalize to Unix line endings
      * fuzzy, case-insensitive search for similar filenames in TARGET_DIR (top 5)
      * prompt user to pick one (or skip)
      * append original content to chosen target file
      * move source file to SOURCE_DIR/<DONE_FOLDER>/
"""
import argparse
import difflib
import shutil
import sys
from pathlib import Path

def parse_args():
    p = argparse.ArgumentParser(description="Fuzzy-merge files from source into target by name.")
    p.add_argument("source", type=Path, help="Local source directory")
    p.add_argument("target", type=Path, help="Local target directory")
    p.add_argument("--source-ext", default=".txt", help="File extension to look for in source (default: .txt)")
    p.add_argument("--target-ext", default=".md", help="File extension to look for in target (default: .md)")
    p.add_argument("--done-folder", default="_DONE", help="Folder name to move processed source files into (default: _DONE)")
    return p.parse_args()

def to_unix_contents(bytes_data: bytes) -> bytes:
    # Replace CRLF and lone CR with LF
    return bytes_data.replace(b'\r\n', b'\n').replace(b'\r', b'\n')

def collect_files(directory: Path, ext: str):
    ext = ext if ext.startswith(".") else f".{ext}"
    return sorted([p for p in directory.iterdir() if p.is_file() and p.suffix.lower() == ext.lower()])

def base_name_no_ext(path: Path):
    return path.stem.lower()

def best_matches(name: str, candidates: list[str], n=5):
    # difflib works on strings; it returns close matches by sequence similarity
    return difflib.get_close_matches(name, candidates, n=n, cutoff=0)

def prompt_pick(source_path: Path, matches: list[Path]) -> Path | None:
    print(f"\nSource: {source_path.name}")
    if not matches:
        print("  No matches found in target directory.")
        return None
    print("  Top matches:")
    for i, m in enumerate(matches, start=1):
        print(f"   {i}) {m.name}")
    print("   s) skip this file")
    default_prompt = "Choose a match number (1-{}) or 's' to skip: ".format(len(matches))
    while True:
        choice = input(default_prompt).strip().lower()
        if choice == 's' or choice == '':
            return None
        if choice.isdigit():
            idx = int(choice)
            if 1 <= idx <= len(matches):
                return matches[idx-1]
        print("  Invalid choice. Try again.")

def ensure_done_folder(src_dir: Path, done_name: str) -> Path:
    done = src_dir / done_name
    done.mkdir(parents=True, exist_ok=True)
    return done

def main():
    args = parse_args()

    src = args.source
    tgt = args.target
    src_ext = args.source_ext
    tgt_ext = args.target_ext
    done_name = args.done_folder

    if not src.is_dir():
        print("Source is not a directory.", file=sys.stderr); sys.exit(2)
    if not tgt.is_dir():
        print("Target is not a directory.", file=sys.stderr); sys.exit(2)

    source_files = collect_files(src, src_ext)
    if not source_files:
        print("No source files found. Exiting.")
        return

    target_files = collect_files(tgt, tgt_ext)
    target_names = [base_name_no_ext(p) for p in target_files]

    done_folder = ensure_done_folder(src, done_name)

    for s in source_files:
        # Read bytes, normalize line endings to LF, overwrite source file
        try:
            raw = s.read_bytes()
        except Exception as e:
            print(f"Failed to read {s}: {e}", file=sys.stderr)
            continue
        unix_bytes = to_unix_contents(raw)
        try:
            s.write_bytes(unix_bytes)
        except Exception as e:
            print(f"Failed to write normalized contents to {s}: {e}", file=sys.stderr)
            continue

        # fuzzy match against target basenames
        matches_idx = best_matches(base_name_no_ext(s), target_names, n=5)
        matches_paths = [target_files[target_names.index(m)] for m in matches_idx] if matches_idx else []

        chosen = prompt_pick(s, matches_paths)
        if chosen is None:
            continue

        # Append source content to chosen target file
        try:
            # read normalized content (we already wrote unix_bytes)
            content = unix_bytes
            with chosen.open("r+b") as f:  # append in binary
                # insert a single LF separator if target doesn't end with newline
                f.seek(0, 2)
                if f.tell() > 0:
                    f.seek(-1, 2)
                    last = f.read(1)
                    if last != b'\n':
                        f.write(b'\n')
                f.write(content)
            print(f"Appended {s.name} -> {chosen.name}")
        except Exception as e:
            print(f"Failed to append {s} to {chosen}: {e}", file=sys.stderr)
            continue

        # Move original source file to done folder
        dest = done_folder / s.name
        try:
            shutil.move(str(s), str(dest))
            print(f"Moved {s.name} -> {dest}")
        except Exception as e:
            print(f"Failed to move {s} to {dest}: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()

