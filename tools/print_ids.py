#!/usr/bin/env python3
#
# Resurrexit print a list of all psalms with their ids
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
		lyric_path = os.path.abspath(sys.argv[1])
		lyrics = []
		for f in os.listdir(lyric_path):
			if os.path.isfile(os.path.join(lyric_path, f)) and f.endswith('.md'):
				lyrics.append(os.path.join(lyric_path, f))
		psalms = []
		count = 0
		error = 0
		for lyric in lyrics:
			with open(lyric) as l:
				psalm = frontmatter.load(l)
			if 'id' in psalm and 'title' in psalm:
				psalms.append(f"{psalm['title']} | {psalm['id']}")
				count += 1
			else:
				print(f"Psalm missing page frontmatter: {lyric}")
				error += 1
		psalms.sort()
		for p in psalms:
			print(p)
		print(f"Parsed {count} psalms")
		if error:
			print(f"Errors: {error}")
	else:
		print("Invalid path")
