from flask import Flask, render_template
from tools import load_psalms, load_settings, load_index

app = Flask(__name__)

settings = load_settings('static/settings.json')
psalms = load_psalms(settings)
load_index(psalms, 'static/index.json')

@app.route('/')
def index():
	return render_template('index.html', settings=settings)

@app.route('/<lang>/')
def psalm_list(lang):
	if lang not in settings['languages']:
		return "Language not found", 404
	psalms_lang = [p for p in psalms if p['lang'] == lang]
	btags = {}
	for p in psalms_lang:
		for t in p['tags']:
			btags[t] = settings["languages"][lang]["tags"][t]
	return render_template(
		'psalms.html',
		psalms=psalms_lang,
		lang=lang,
		settings=settings,
		btags=btags
	)

@app.route('/<lang>/<slug>/')
def psalm(lang, slug):
	if lang not in settings['languages']:
		return "Language not found", 404
	psalm = next((p for p in psalms if p['slug'] == slug and p['lang'] == lang), None)
	if not psalm:
		return "Psalm not found", 404
	return render_template('psalm.html', psalm=psalm, settings=settings, lang=lang)

if __name__ == '__main__':
    app.run(debug=True)
