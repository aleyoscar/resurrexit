#!/usr/bin/env python3
#
# Resurrexit set steps by page number
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
		latin = input("Step: ")
		start_page = int(input("Start page: "))
		end_page = int(input("End page: "))
		for lyric in lyrics:
			with open(lyric) as l:
				psalm = frontmatter.load(l)
			if 'page' in psalm:
				page = 0
				try:
					if '-' in psalm['page']:
						page = int(psalm['page'].split('-')[0])
					else:
						page = int(psalm['page'])
				except ValueError:
					print(f"Unable to parse page number: {psalm['page']}")
					error += 1
					continue
				if page >= start_page and page <= end_page:
					print(f"Tagging {psalm['title']} as {latin}")
					psalm['step'] = latin
					frontmatter.dump(psalm, lyric)
					lib.end_file_with(lyric, "\n")
					count += 1
			else:
				print(f"Psalm missing page frontmatter: {lyric}")
				error += 1
		print(f"Parsed {count} psalms")
		if error:
			print(f"Errors: {error}")
	else:
		print("Invalid path")
