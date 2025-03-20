#!/usr/bin/env python3
#
# Chord generation tool
# -----------------------------------------------------------------------------

import json

with open("settings.json") as f:
	settings = json.load(f)

notes = {
	"es-es": {
		"base": ["La", "Si", "Do", "Re", "Mi", "Fa", "Sol"],
		"exts": ['', 'm', '7', 'm7', 'm9', '7aum', 'b', 'b7', '#', '#7', '#m']
	},
	"en-us": {
		"base": ["A", "B", "C", "D", "E", "F", "G"],
		"exts": ['', 'm', '7', 'm7', 'm9', '7aum', 'b', 'b7', '#', '#7', '#m']
	}
}

for lang, obj in notes.items():
	chords = []
	raw = []
	for b in obj["base"]:
		chords.append([])
		for e in obj["exts"]:
			chords[-1].append(b + e)
			raw.append(b + e)
	settings[lang]["chords"] = chords
	settings[lang]["chords_raw"] = raw

with open("settings.json", 'w', encoding='utf8') as f:
	json.dump(settings, f, indent=4, ensure_ascii=False)
