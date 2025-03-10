import re
from unidecode import unidecode

def get_int(text):
	try:
		return int(text)
	except ValueError:
		return None

def cleanup(text, debug=False):
	# FIND 'aA' AND REMOVE 'a'
	lower_upper = r'(?<!\d)[a-z](?=[A-Z])'
	matches = re.finditer(lower_upper, text)
	for match in matches:
		if debug: print(f"Match found at position: {match.start()}: {match.group()}")
		if debug: print(f"  Old text: {text}")
		text = text[:match.start()] + text[match.start() + len(match.group()):]
		if debug: print(f"  New text: {text}")

	# FIND ANY CHARACTER IN LIST AND REMOVE
	unwanted = ['+', '¢', '&']
	for char in unwanted:
		text = text.replace(char, '')

	return text.strip()

def simplify(text):
	new_text = unidecode(text).lower()
	return ' '.join(re.sub(r"[^a-z0-9 ]+", '', new_text).strip().split())

def dedup(text):
	return ' '.join(list(set(simplify(text).split())))

def hyphenize(text):
	return '-'.join(simplify(text).split())

def single_alpha(text):
	return len(text) == 1 and text.isalpha()

def prompt(options, message=''):
	while True:
		print(message)
		for i, value in enumerate(options):
			print(f"{i}: {value}")
		response = input(f"Select (0-{len(options) - 1}): ")
		try:
			answer = int(response)
			if answer >= 0 and answer < len(options):
				return answer
			else:
				print(f"Please select an option between 0 and {len(options) - 1}.")
		except ValueError:
			print(f"Please type an integer between 0 and {len(options) - 1}.")
