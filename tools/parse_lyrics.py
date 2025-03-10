#!/usr/bin/env python3
#
# Resurrexit Image to Lyric parser
# -----------------------------------------------------------------------------

import json
import pytesseract as pyt
import pandas as pd
import frontmatter
import sys
import lib
import os
from PIL import Image

if len(sys.argv) < 2:
	print("Please supply an image or folder to parse")
	exit()

images = []
if os.path.isfile(sys.argv[1]):
	images.append(sys.argv[1])
elif os.path.isdir(sys.argv[1]):
	for f in os.listdir(sys.argv[1]):
		if os.path.isfile(os.path.join(sys.argv[1], f)):
			images.append(os.path.join(sys.argv[1], f))
else:
	print("Invalid path")
	exit()

images.sort()

def get_type(row):
	if row["blocks"][0]["box"][3] <= settings["title_y"]:
		return "title"
	elif row["blocks"][0]["box"][3] <= settings["sub_y"]:
		return "subtitle"
	elif len(row["blocks"]) == 1 and lib.get_int(row["blocks"][0]["text"]) is not None:
		return "number"
	else:
		return "line"

DEBUG = False
count = 0

with open("settings.json") as f:
	settings = json.load(f)

for image_file in images:
	with Image.open(image_file) as im:
		raw = pyt.image_to_data(im, output_type=pyt.Output.DICT, lang='spa')
		width = im.width
		height = im.height
	# df = pd.DataFrame(raw)
	# print(df.tail(10))
	# limit = 20
	# count = 0
	rows = {}
	blocks = []
	columns = lib.prompt(["Skip", "1", "2"], f"Columns for {image_file}?")
	if not columns:
		continue
	# blocks = [''] * 20
	for i, text in enumerate(raw["text"]):
		if text:
			block = {
				"block": raw["block_num"][i],
				"par": raw["par_num"][i],
				"line": raw["line_num"][i],
				"word": raw["word_num"][i],
				"box": [
					raw["left"][i],
					raw["top"][i],
					raw["left"][i] + raw["width"][i],
					raw["top"][i] + raw["height"][i]
				],
				"text": lib.cleanup(raw["text"][i]),
			}
			blocks.append(block)
			y = int(block["box"][3] - (block["box"][3] - block["box"][1]) / 2)
			if block["box"][2] > width / 2 and y > settings["sub_y"] and columns == 2:
				y += height
			if len(rows):
				found = False
				for key, value in rows.items():
					k = int(key)
					if y > k - settings["row_limit"] and y < k + settings["row_limit"]:
						rows[key]["blocks"].append(block)
						found = True
						break
				if not found:
					rows[f"{y:04d}"] = {
						"type": "",
						"blocks": [block]
					}
			else:
				rows[f"{y:04d}"] = {
					"type": "",
					"blocks": [block]
				}
			# key = f"{blocks[-1]['block']:02}-{blocks[-1]['line']:02}"
			# if key in lines:
			# 	lines[key].append(blocks[-1])
			# else:
			# 	lines[key] = [blocks[-1]]
			# if len(lines):
			# 	found = False
			# 	for line in lines:
			# 		if line.in_limit(raw["top"][i]):
			# 			line.text.append(text)
			# 			found = True
			# 			break
			# 	if not found:
			# 		lines.append(Line(raw["top"][i], text))
			# else:
			# 	lines.append(Line(raw["top"][i], text))
			# count += 1
			# if count > limit:
			# 	break

	# SPLIT COLUMNS
	# for key, arr in rows.items():
	# 	for i, block in enumerate(arr["blocks"][:]):
	# 		if block["box"][2] > width / 2:
	# 			try:
	# 				rows[key + "-1"]["blocks"].append(block)
	# 			except KeyError:
	# 				rows[key + "-1"] = {
	# 					"type": "",
	# 					"blocks": [block]
	# 				}
	# 			del rows[key]["blocks"][i]

	# IDENTIFY ROW TYPE
	for key, arr in rows.items():
		found = 0
		for block in arr["blocks"]:
			if block["text"].title() in settings["chords_raw"]["es-es"]:
				found += 1
		if found == len(arr["blocks"]):
			rows[key]["type"] = "chords"
			for i, val in enumerate(arr["blocks"]):
				rows[key]["blocks"][i]["text"] = rows[key]["blocks"][i]["text"].title()
		else:
			rows[key]["type"] = get_type(rows[key])

	# SPACE CHORDS
	for key, value in dict(sorted(rows.items())).items():
		if value["type"] == "chords":
			if DEBUG: print(f"Found chords: {key}")
			last_chars = 0
			temp = list(rows)
			try:
				next = str(temp[temp.index(key) + 1])
			except (ValueError, IndexError):
				next = None
			if next is not None:
				if DEBUG: print(f"  Next line: {next}")
				for chord in value["blocks"]:
					if DEBUG: print(f"  Analyzing chord: {chord['text']}")
					last_word = None
					chars = 0
					for word in rows[next]["blocks"]:
						last_word = word
						if word["box"][2] > chord["box"][0]:
							if DEBUG: print(f"    Found word below: {word['text']}")
							break
						chars += len(word["text"]) + 1
					if last_word is not None:
						word_width = last_word["box"][2] - last_word["box"][0]
						chord_loc = chord["box"][0] - last_word["box"][0]
						chord_ratio = chord_loc / word_width
						if DEBUG: print(f"    Width ({last_word['text']}): {last_word['box'][2]}-{last_word['box'][0]}={word_width} | Chord: {chord_loc} | Ratio: {chord_ratio:.2f}")
						char = int(chord_ratio * len(last_word['text']))
						padding = chars + char - last_chars
						if DEBUG: print(f"    Chars: {chars} | Char: {char} | Last: {last_chars} | Padding: {chars}+{char}-{last_chars}={padding}")
						last_chars += chars + len(chord["text"])
						if DEBUG: print(f"    Setting last to: {chars}+{len(chord['text'])}={last_chars}")
						chord["text"] = f"{' ' * padding}{chord['text']}"

	# CREATE LYRICS
	lines = []
	spacer = "---"
	lyric = frontmatter.loads('')
	for key, arr in rows.items():
		match arr["type"]:
			case "title":
				title = " ".join([b["text"] for b in arr["blocks"]])
				lyric["title"] = title
				lyric["capo"] = 0
				lyric["step"] = ''
				lyric["lang"] = 'es-es'
				lyric["tags"] = []
			case "subtitle":
				i = 0
				if rows[key]["blocks"][0]["text"].lower() == "cejilla":
					lyric["capo"] = lib.get_int(rows[key]["blocks"][1]["text"].replace("*", ""))
					i = 3
				lyric["subtitle"] = " ".join([b["text"] for b in arr["blocks"]][i:])
			case "number":
				lyric["id"] = lib.get_int(arr["blocks"][0]["text"])
			case "line":
				line = " ".join([b["text"] for b in arr["blocks"]])
				if spacer and int(key) > height:
					lines.append(spacer)
					spacer = ""
				if not lib.single_alpha(line):
					lines.append(line)
			case "chords":
				if spacer and int(key) > height:
					lines.append(spacer)
					spacer = ""
				lines.append(''.join([b["text"] for b in arr["blocks"]]))

	lyric.content = "\n".join(lines)

	# PRINT LINES
	if "title" in lyric:
		lyric_file = os.path.join(settings["lyric_path"], f"{lib.hyphenize(lyric['title'])}.md")
	else:
		lyric_file = os.path.join(settings["lyric_path"], f"_{count:03d}.md")
	frontmatter.dump(lyric, lyric_file)
	count +=1
print(f"\nDone. Parsed {count} file(s)")
