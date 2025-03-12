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
	print("Please supply a file to parse")
	exit()
else:
	if os.path.isfile(sys.argv[1]):
		count = 0
		error = 0
		line_count = 0
		psalms = []
		with open(sys.argv[1]) as f:
			lines = f.readlines()
		for line in lines:
			line_count += 1
			title = line.strip()
			title = re.sub(r"\.*", "", title) # Remove periods
			title = re.sub(r"•*", "", title) # Remove dots
			title = title.replace('(', '- ') # Replace opening '(' with dashes '-'
			title = title.replace(')', '') # Remove closing ')'
			title = ' '.join(title.split()) # Remove duplicate spaces
			match = re.search(r" (\d+)(-\d+)?$", title)
			if match:
				try:
					id = int(match.group(1)) # Set ID
					page = f"{match.group(1)}{match.group(2)}"
				except ValueError:
					print(f"\n<<ERROR>> Cannot convert {match.group(1)} to int on line {line_count}\n")
					continue
				title = re.sub(r" (\d+$)", "", title).strip() # Remove page number
			if title and id:
				psalms.append({
					"id": id,
					"page": page,
					"title": title,
					"line": line_count
				})
				count += 1
			else:
				print(f"\n<<ERROR>> No title and id found for line: {line_count}\n")
				error += 1
		print(f"Parsed {count} psalms")
		if error:
			print(f"Errors: {error}")
		for p1 in psalms:
			for p2 in psalms:
				if p1['page'] == p2['page'] and p1['title'] != p2['title']:
					print(f"Found duplicate on line {p2['line']} for: {p1['title']}|{p1['id']}")
	else:
		print("Invalid path")
