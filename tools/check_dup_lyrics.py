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
			found = ''
			if 'page' in psalm:
				check_dash = ''
				if '-' in psalm['page']:
					check_dash = psalm['page'].split('-')[0]
				for p in psalms:
					if check_dash:
						if check_dash == p['page']:
							found = p['title']
							break
					if p['page'] == psalm['page']:
						found = p['title']
						break
				if found:
					print(f"Duplicate psalm found: {found} = {lyric}|{psalm['page']}")
					error += 1
				else:
					psalms.append({
						"title": psalm['title'],
						"page": psalm['page']
					})
					count += 1
			else:
				print(f"Psalm missing page frontmatter: {lyric}")
				error += 1
		print(f"Parsed {count} psalms")
		if error:
			print(f"Errors: {error}")
	else:
		print("Invalid path")
