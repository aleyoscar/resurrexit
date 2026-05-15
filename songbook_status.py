#!/usr/bin/env python3

import os
from pathlib import Path
from collections import defaultdict

try:
    import frontmatter
except ImportError:
    print("Error: python-frontmatter is not installed.")
    print("Install it with: pip install python-frontmatter")
    exit(1)

def songbook_status(folder_path):
    """
    Count markdown files in a folder, categorizing by presence of body content.

    Returns:
        dict: {
            'total': int,
            'with_body': int,
            'without_body': int,
            'files': list of tuples (filename, has_body)
        }
    """
    counts = {
        'total': 0,
        'with_body': 0,
        'without_body': 0,
        'files': []
    }

    if not os.path.isdir(folder_path):
        return counts

    # Iterate through all markdown files
    for file_path in Path(folder_path).glob('**/*.md'):
        counts['total'] += 1

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)

                # Check if the content (body) is non-empty
                has_body = bool(post.content.strip())

                if has_body:
                    counts['with_body'] += 1
                else:
                    counts['without_body'] += 1

                counts['files'].append((file_path.name, has_body))

        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    return counts

def main():
    """Main function to iterate through all language folders in songbook/"""

    songbook_path = Path('songbook')

    if not songbook_path.exists():
        print(f"Error: {songbook_path} directory not found")
        return

    # Get all language folders (subdirectories)
    language_folders = [d for d in songbook_path.iterdir() if d.is_dir()]

    if not language_folders:
        print(f"No language folders found in {songbook_path}")
        return

    print("=" * 80)
    print("Markdown File Analysis - Songbook by Language")
    print("=" * 80)
    print()

    # Track totals across all languages
    total_all = 0
    total_with_body_all = 0
    total_without_body_all = 0

    # Process each language folder
    for lang_folder in sorted(language_folders):
        lang_name = lang_folder.name
        print(f"Language: {lang_name}")
        print("-" * 80)

        counts = songbook_status(lang_folder)

        total = counts['total']
        with_body = counts['with_body']
        without_body = counts['without_body']

        total_all += total
        total_with_body_all += with_body
        total_without_body_all += without_body

        if total == 0:
            print("  No markdown files found")
        else:
            percentage_with_body = (with_body / total * 100) if total > 0 else 0
            print(f"  Total markdown files: {total}")
            print(f"  Files with body content: {with_body} ({percentage_with_body:.1f}%)")
            print(f"  Files without body content: {without_body} ({100-percentage_with_body:.1f}%)")

        print()

    # Print summary
    print("=" * 80)
    print("SUMMARY - All Languages")
    print("=" * 80)
    print(f"Total markdown files: {total_all}")
    print(f"Files with body content: {total_with_body_all}")
    print(f"Files without body content: {total_without_body_all}")

    if total_all > 0:
        percentage = (total_with_body_all / total_all * 100)
        print(f"Overall percentage with body: {percentage:.1f}%")

    print()

if __name__ == '__main__':
    main()
