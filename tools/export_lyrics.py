#!/usr/bin/env python3
#
# Resurrexit Lyric to CSV parser for import into ProcessWire
# -----------------------------------------------------------------------------

import os
import re
import json
import frontmatter
from unidecode import unidecode
from pprint import pprint

def urlify(text):
	return '-'.join(simplify(text).split())

def insert_chords(c, text):
	c = c.rstrip()
	while c:
		i = c.rfind(' ') + 1
		text = text[:i] + "<span class='chord'>" + c[i:] + "</span>" + text[i:]
		c = c[:i].rstrip()
	return text

def simplify(text):
	new_text = unidecode(text).lower()
	return ' '.join(re.sub(r"[^a-z0-9 ]+", '', new_text).strip().split())

def dedup(text):
	return ' '.join(list(set(simplify(text).split())))

def arr_to_html(arr):
	html= ""
	for column in arr["columns"]:
		html += "<div class='column'>"
		for section in column["sections"]:
			html += f"<div class='section {section['class']} {section['lang']}'>"
			for line in section["lines"]:
				line = line.replace('[', "<span class='chord'>")
				line = line.replace(']', "</span>")
				line = re.sub(r"[*]{1}([^*]+)[*]{1}", r"<strong>\1</strong>", line)
				html += f"<p class='line'>{line}</p>"
			html += "</div>"
		html += "</div>"
	return html

songbook_path = os.path.abspath("songbook/")
languages = [f for f in os.listdir(songbook_path) if os.path.isdir(os.path.join(songbook_path, f))]
with open("settings.json") as f:
	settings = json.load(f)
count = 0

for language in languages:
	language_count = 0
	print(f">> {language}")
	language_path = os.path.join(songbook_path, language)
	lyrics = [f for f in os.listdir(language_path) if os.path.isfile(os.path.join(language_path, f)) and f.endswith('.md') ]
	csv_path = os.path.join(language_path, '_psalms.csv')
	csv_string = [','.join([
		'title',
		'psalm_subtitle',
		'psalm_id',
		'psalm_step',
		'psalm_tags',
		'psalm_capo',
		'psalm_audio',
		'psalm_html',
		'psalm_text'
	])]
	lyrics.sort()
	for lyric in lyrics:
		print(f"   {lyric}")
		# PARSE EACH LINE OF LYRIC FILE
		with open(os.path.join(language_path, lyric), encoding='utf-8') as f:
			psalm = frontmatter.load(f)
		try:
			csv_row = ','.join([
				f"\"{psalm['title']}\"",
				f"\"{psalm['subtitle']}\"",
				f"\"{psalm['id']}\"",
				f"\"{psalm['step']}\"",
				f"\"{'|'.join(psalm['tags']) if len(psalm['tags']) > 0 else ''}\"",
				f"\"{psalm['capo']}\"",
				f"\"https://aleyoscar.com/audio/{language}/{urlify(psalm['title'])}.mp3\""
			])
		except KeyError:
			print(f"<< ERROR >> Invalid keys for {language}: {lyric}")
			continue
		started_chords = False
		chord_line = ""
		html = {"columns": [{"sections": []}]}
		text = f"{psalm['title']} {psalm['subtitle']}"
		for line in psalm.content.splitlines():
			stripped = line.strip()
			if stripped:
				# print(f"   Parsing: {stripped}")
				if stripped in settings["sections"]: # START SECTION
					# print(f"      Starting section {stripped}")
					html["columns"][-1]["sections"].append({
						"class": settings["sections"][stripped],
						"lang": language,
						"lines": []
					})
				elif set(stripped.split()).issubset(set(settings["chords_raw"][language])):
					# print(set(stripped.split()))
					# print(set(settings["chords_raw"][language]))
					# print(f"      Found chords: {stripped}")
					started_chords = True
					chord_line = line
				elif stripped == "---":
					# print(f"      Starting column")
					html["columns"].append({"sections": []})
				else:
					# print(f"      Found line: {stripped}")
					text += f" {stripped}"
					if started_chords:
						started_chords = False
						chord_line = chord_line.rstrip()
						while chord_line:
							i = chord_line.rfind(' ') + 1
							stripped = f"{stripped[:i]}[{chord_line[i:]}]{stripped[i:]}"
							chord_line = chord_line[:i].rstrip()
					# print(f"      Inserting {stripped}")
					html["columns"][-1]["sections"][-1]["lines"].append(stripped)
		csv_string.append(f"{csv_row},\"{arr_to_html(html)}\",\"{dedup(text)}\"")
		language_count += 1
		count += 1
	print(f"Parsed {language_count} lyric files for {language}")
	with open(csv_path, 'w') as f:
		f.write("\n".join(csv_string))
print(f"Parsed {count} lyric files total")
