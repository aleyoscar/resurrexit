from pathlib import Path
from unidecode import unidecode
import json, frontmatter, re

# Remove all diacritics and non-alpha characters and convert to lowercase
def normalize(text):
	return re.sub(r'[^a-zA-Z\s]', '', unidecode(text.lower()))

# Remove duplicates from a string
def dedup(text):
	words = []
	for word in list(set(text.strip().split())):
		words.append(word)
	return " ".join(sorted(words))

# load settings.json file
def load_settings(filename):
	with open(filename, 'r', encoding='utf-8') as f:
		settings = json.load(f)
	return settings

# load chord naming convention
def load_chords(lang):
	with open('static/chords.json', 'r', encoding='utf-8') as f:
		chord_data = json.load(f)
	if lang in chord_data:
		return chord_data[lang]
	return None

# return an array with all different variations of chords
def load_raw_chords(chord_data):
	chords = {}
	for chord in chord_data["chords"]:
		for alt in chord:
			chords[alt] = f"{alt}"
			for quality in chord_data["qualities"]:
				chords[f"{alt}{quality}"] = f"{alt}|{quality}"
	return chords

# get chord information for root and quality and return as html span string
def get_chord_data(chord, data):
	key = -1
	for i, c in enumerate(data["chords"]):
		for alt in c:
			if chord.split('|')[0] == alt:
				key = i
	chord_raw = chord.replace('|', '')
	chord_root = chord.split('|')[0]
	chord_quality = '' if len(chord.split('|')) < 2 else chord.split('|')[1]
	if key >= 0:
		return f"<span data-key='{key}' data-root='{chord_root}' data-quality='{chord_quality}' class='chord'>{chord_raw}</span>"

# Load psalm markdown files and parse into html
def load_psalms(settings):
	base_dir = Path('songbook')
	psalms = []
	for lang_dir in base_dir.iterdir():
		if lang_dir.is_dir() and lang_dir.name in settings['languages']:
			chords = load_chords(settings['languages'][lang_dir.name]['chords'])
			language = lang_dir.name
			for md_file in lang_dir.glob('*.md'):
				with open(md_file, encoding='utf-8') as f:
					post = frontmatter.load(f)
				psalm_data = post.metadata
				if not all(k in psalm_data for k in ['capo', 'id', 'lang', 'page', 'step', 'subtitle', 'tags', 'title']):
					print(f"Warning: Missing fields in {md_file}")
					continue
				if psalm_data['lang'] != language:
					print(f"Warning: Language field does not match folder in {md_file}")
					continue
				psalm_data['lyrics'], psalm_data['text'] = parse_lyrics(post.content.strip(), settings['languages'][language], chords)
				psalm_data['text'] = dedup(normalize(f"{psalm_data['title']} {psalm_data['subtitle']} {psalm_data['text']}"))
				psalm_data['slug'] = md_file.stem
				psalm_data['audio'] = []

				# Add audio sources if audio files exist
				for source in Path(f"audio/{language}/").glob('*.mp3'):
					if psalm_data['slug'] in source.stem:
						key = source.stem.split('_')[-1]
						psalm_data['audio'].append({
							"src": f"https://aleyoscar.com/{source}",
							"name": settings['audio_sources'][key]["name"],
							"order": settings['audio_sources'][key]["order"]
						})
				psalm_data['gtags'] = [f"g-{tag}" for tag in psalm_data['tags']]
				psalms.append(psalm_data)
			check_audio(psalms, language)

	# Add global tags
	for i in range(len(psalms)):
		for p in psalms:
			if psalms[i]['id'] == p['id']:
				for t in p['tags']:
					if f"g-{t}" not in psalms[i]['gtags']:
						psalms[i]['gtags'].append(f"g-{t}")

	return sorted(psalms, key=lambda p: p['title'])

# Check audio files and warn of files without a psalm
def check_audio(psalms, language):
	for source in Path(f"audio/{language}/").glob('*.mp3'):
		psalm_found = False
		for p in psalms:
			if p["slug"] == source.stem.split('_')[0]:
				psalm_found = True
		if not psalm_found:
			print(f"<<WARNING>> No psalm found for {source}")

# Create index.json for search
def load_index(psalms, filename):
	search_index = [
		{
			'id': psalm['id'],
			'lang': psalm['lang'],
			'title': psalm['title'],
			'subtitle': psalm['subtitle'],
			'step': psalm['step'],
			'slug': psalm['slug'],
			'tags': psalm['tags'],
			'gtags': psalm['gtags'],
			'text': psalm['text']
		} for psalm in psalms
	]
	with open(filename, 'w', encoding='utf-8') as f:
		json.dump(search_index, f, ensure_ascii=False, indent=4)

# Convert array of lyrics into html
def arr_to_html(arr):
	html= ""
	for column in arr["columns"]:
		html += "<div class='column'>"
		for section in column["sections"]:
			html += f"<div class='section {section['class']} {section['lang']}'>"
			for line in section["lines"]:
				line = re.sub(r"[*]{1}([^*]+)[*]{1}", r"<strong>\1</strong>", line)
				html += f"<p class='line'>{line}</p>"
			html += "</div>"
		html += "</div>"
	return html

# Parse markdown lyric file and create an array of columns, sections and lines
def parse_lyrics(lyric, language, chords):
	started_chords = False
	chord_line = ""
	html = {"columns": [{"sections": []}]}
	text = ""
	raw_chords = load_raw_chords(chords);
	for line in lyric.splitlines():
		stripped = line.strip()
		if stripped:
			if stripped in language["sections"]: # START SECTION
				html["columns"][-1]["sections"].append({
					"class": language["sections"][stripped],
					"lang": language["name"],
					"lines": []
				})
			elif all(key in raw_chords for key in stripped.split()):
				started_chords = True
				chord_line = line
			elif stripped == "---":
				html["columns"].append({"sections": []})
			else:
				text += f"{stripped} "
				if started_chords:
					started_chords = False
					chord_line = chord_line.rstrip()
					while chord_line:
						i = chord_line.rfind(' ') + 1
						chord_data = get_chord_data(raw_chords[chord_line[i:]], chords)
						stripped = f"{stripped[:i]}{chord_data}{stripped[i:]}"
						chord_line = chord_line[:i].rstrip()
				html["columns"][-1]["sections"][-1]["lines"].append(stripped)
	return arr_to_html(html), re.sub(r'\[.*?\]', '', text)
