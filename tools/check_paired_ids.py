#!/usr/bin/env python3
#
# Resurrexit Image to Lyric parser for index
# -----------------------------------------------------------------------------

import sys
import os
import re
import lib
import json
import frontmatter
from unidecode import unidecode
from pprint import pprint

book_file = "songbook.csv"

if len(sys.argv) < 2:
	print("Please supply a folder to parse")
	exit()
else:
	if os.path.isdir(sys.argv[1]):
		book_path = os.path.abspath(sys.argv[1])
		langs = ["en-us", "es-es"]
		ids = []
		for i in range(300):
			ids.append({
				"id": i,
				"en-us": '',
				"es-es": ''
			})
		for lang in langs:
			lang_path = os.path.join(book_path, lang)
			for f in os.listdir(lang_path):
				if os.path.isfile(os.path.join(lang_path, f)) and f.endswith('.md'):
					psalm_path = os.path.join(lang_path, f)
					with open(psalm_path) as l:
						psalm = frontmatter.load(l)
					if not psalm['id']:
						print(f"Psalm missing id: {psalm_path}")
					elif ids[psalm['id']][lang]:
						print(f"ID {psalm['id']} already has a {lang} psalm: {ids[psalm['id']][lang]} from {psalm_path}")
					else:
						ids[psalm['id']][lang] = psalm['title']
		book_string = "ID,EN-US,ES-ES\n"
		for i in ids:
			book_string += f"{i['id']},\"{i['en-us']}\",\"{i['es-es']}\"\n"
		with open(book_file, 'w') as f:
			f.write(book_string)
	else:
		print("Invalid path")
