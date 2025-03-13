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

checks = ["id", "page", "title", "step", "lang"]

if len(sys.argv) < 2:
	print("Please supply a folder to parse")
	exit()
else:
	if os.path.isdir(sys.argv[1]):
		lang_path = os.path.abspath(sys.argv[1])
		langs = ["en-us", "es-es"]
		lang = lib.prompt(langs, "What language?")
		lyrics = []
		for f in os.listdir(lang_path):
			if os.path.isfile(os.path.join(lang_path, f)) and f.endswith('.md'):
				lyrics.append(os.path.join(lang_path, f))
		count = 0
		error = 0
		for lyric in lyrics:
			found_error = False
			with open(lyric) as l:
				psalm = frontmatter.load(l)
			if not psalm['id']: found_error = True
			if not psalm['page']: found_error = True
			if not psalm['title']: found_error = True
			if not psalm['step']: found_error = True
			if langs[lang] != psalm['lang']: found_error = True
			if found_error:
				print(f"Psalm missing page frontmatter: {lyric}")
				error += 1
			count += 1
		print(f"Parsed {count} psalms")
		if error:
			print(f"Errors: {error}")
	else:
		print("Invalid path")
