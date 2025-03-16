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
		suffix = input("Suffix to append: ")
		audios = []
		for f in os.listdir(audio_path):
			if os.path.isfile(os.path.join(audio_path, f)) and f.endswith('.mp3'):
				audios.append(os.path.join(audio_path, f))
		count = 0
		for audio in audios:
			print(f"Renaming: {audio} > {audio.split('.')[0]}_{suffix}.mp3")
			os.rename(audio, f"{audio.split('.')[0]}_{suffix}.mp3")
			count += 1
		print(f"Parsed {count} psalms")
	else:
		print("Invalid path")
