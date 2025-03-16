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

if len(sys.argv) < 2:
	print("Please supply a folder to parse")
	exit()
else:
	if os.path.isdir(sys.argv[1]):
		audio_path = os.path.abspath(sys.argv[1])
		langs = ["en-us", "es-es"]
		lang = lib.prompt(langs, "What language?")
		lyric_path = os.path.abspath(os.path.join("songbook", langs[lang]))
		audio = []
		lyrics = []
		for f in os.listdir(audio_path):
			if os.path.isfile(os.path.join(audio_path, f)):
				audio.append(f)
		for f in os.listdir(lyric_path):
			if os.path.isfile(os.path.join(lyric_path, f)) and f.endswith('.md'):
				lyrics.append(f.replace('.md', ''))
		count = 0
		error = 0
		for a in audio:
			found_error = False
			if not a.endswith('.mp3'):
				print(f"Not an MP3 file: {a}")
				found_error = True
			if len(a.split('_')) <= 1:
				print(f"No cantor: {a}")
				found_error = True
			if not a.split('_')[0] in lyrics:
				print(f"No matching lyric file: {a}")
				found_error = True
			if found_error:
				error += 1
			count += 1
		print(f"Parsed {count} psalms")
		if error:
			print(f"Errors: {error}")
	else:
		print("Invalid path")
