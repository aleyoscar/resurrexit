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
from pypdf import PdfReader

if len(sys.argv) < 2:
	print("Please supply a file to parse")
	exit()
else:
	if os.path.isfile(sys.argv[1]):
		langs = ["en-us", "es-es"]
		lang_num = lib.prompt(langs, "What language?")
		lang = langs[lang_num]
		latin = input("Latin: ")
		start_page = int(input("Start page: ")) - 1
		end_page = int(input("End page: "))
		count = 0
		error = 0
		reader = PdfReader(sys.argv[1])
		page_num = start_page + 1
		for page in reader.pages[start_page:end_page]:
			page_text = page.extract_text()
			i = 0
			title = ''
			found_title = False
			for line in page_text.split("\n"):
				title = ' '.join(re.sub(r"\d*", "", line).strip().split())
				psalm_file = os.path.join("songbook", lang, f"{lib.hyphenize(title)}.md")
				if os.path.isfile(psalm_file):
					found_title = True
					with open(psalm_file) as f:
						psalm = frontmatter.load(f)
					psalm['step'] = latin
					frontmatter.dump(psalm, psalm_file)
					count += 1
					break
				i += 1
			if found_title:
				print(f"{i}: {title}")
			else:
				print(f"   << ERROR >> Title not found for page: {page_num}")
				error += 1
			page_num += 1
		print(f"\nFound {count} titles.")
		if error:
			print(f"Couldn't find {error} titles.")

		# for line in lines:
		# 	line_count += 1
		# 	title = line.strip()
		# 	title = re.sub(r"\.*", "", title) # Remove periods
		# 	title = re.sub(r"•*", "", title) # Remove dots
		# 	title = ' '.join(title.split()) # Remove duplicate spaces
		# 	match = re.search(r" (\d+$)", title)
		# 	if match:
		# 		try:
		# 			id = int(match.group(1)) # Set ID
		# 		except ValueError:
		# 			print(f"\n<<ERROR>> Cannot convert {match.group(1)} to int on line {line_count}\n")
		# 			continue
		# 		title = re.sub(r" (\d+$)", "", title).strip() # Remove page number
		# 	if title and id:
		# 		hyphenized = lib.hyphenize(title)
		# 		psalm_file = os.path.join("songbook", lang, f"{hyphenized}.md")
		# 		print(f"{title}|{id}|{hyphenized}")
		# 		psalm = None
		# 		if type == 0:
		# 			if os.path.isfile(psalm_file):
		# 				with open(psalm_file) as l:
		# 					psalm = frontmatter.load(l)
		# 			else:
		# 				psalm = frontmatter.loads('')
		# 				psalm['subtitle'] = ''
		# 				psalm['step'] = ''
		# 				psalm['tags'] = []
		# 				psalm['capo'] = 0
		# 			psalm['title'] = title.upper()
		# 			psalm['id'] = id
		# 			psalm['lang'] = lang
		#
		# 			frontmatter.dump(psalm, psalm_file)
		# 			lib.end_file_with(psalm_file, "\n")
		# 			count += 1
		# 		else:
		# 			if os.path.isfile(psalm_file):
		# 				with open(psalm_file) as p:
		# 					psalm = frontmatter.load(p)
		# 				if psalm['id'] == id:
		# 					if type == 1:
		# 						psalm['step'] = latin
		# 					elif type == 2:
		# 						if latin not in psalm['tags']:
		# 							psalm['tags'].append(latin)
		# 					frontmatter.dump(psalm, psalm_file)
		# 					lib.end_file_with(psalm_file, "\n")
		# 					count += 1
		# 				else:
		# 					print(f"\n<ERROR> Psalm ids do not match for line: {line_count}\n")
		# 					error += 1
		# 			else:
		# 				print(f"\n<<ERROR>> No psalm file found: {psalm_file}\n")
		# 				error += 1
		# 	else:
		# 		print(f"\n<<ERROR>> No title and id found for line: {line_count}\n")
		# 		error += 1
		# print(f"Parsed {count} psalms")
		# if error:
		# 	print(f"Errors: {error}")
	else:
		print("Invalid path")
