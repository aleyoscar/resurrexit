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
		langs = ["en-us", "es-es"]
		lang_num = lib.prompt(langs, "What language?")
		lang = langs[lang_num]
		type = lib.prompt(["Main", "Step", "Category"], "What type of list?")
		if type > 0:
			latin = input("Latin abbreviation: ")
		count = 0
		error = 0
		line_count = 0
		with open(sys.argv[1]) as f:
			lines = f.readlines()
		for line in lines:
			line_count += 1
			title = line.strip()
			title = re.sub(r"\.*", "", title) # Remove periods
			title = re.sub(r"•*", "", title) # Remove dots
			title = ' '.join(title.split()) # Remove duplicate spaces
			match = re.search(r" (\d+$)", title)
			if match:
				id = match.group(1) # Set ID
				title = re.sub(r" (\d+$)", "", title).strip() # Remove page number
			if title and id:
				hyphenized = lib.hyphenize(title)
				psalm_file = os.path.join("songbook", lang, f"{hyphenized}.md")
				print(f"{title}|{id}|{hyphenized}")
				psalm = None
				if type == 0:
					if os.path.isfile(psalm_file):
						with open(psalm_file) as l:
							psalm = frontmatter.load(l)
					else:
						psalm = frontmatter.loads('')
						psalm['subtitle'] = ''
						psalm['step'] = ''
						psalm['tags'] = []
						psalm['capo'] = 0
					psalm['title'] = title.upper()
					psalm['id'] = id
					psalm['lang'] = lang

					frontmatter.dump(psalm, psalm_file)
					lib.end_file_with(psalm_file, "\n")
					count += 1
				else:
					if os.path.isfile(psalm_file):
						with open(psalm_file) as p:
							psalm = frontmatter.load(p)
						if psalm['id'] == id:
							if type == 1:
								psalm['step'] = latin
							elif type == 2:
								if latin not in psalm['tags']:
									psalm['tags'].append(latin)
							frontmatter.dump(psalm, psalm_file)
							lib.end_file_with(psalm_file, "\n")
							count += 1
						else:
							print(f"\n<ERROR> Psalm ids do not match for line: {line_count}\n")
							error += 1
					else:
						print(f"\n<<ERROR>> No psalm file found: {psalm_file}\n")
						error += 1
			else:
				print(f"\n<<ERROR>> No title and id found for line: {line_count}\n")
				error += 1
		print(f"Parsed {count} psalms")
		if error:
			print(f"Errors: {error}")
	else:
		print("Invalid path")
