// CONSTANTS ------------------------------------------------------------------

const transposeMenu = document.getElementById('transpose-menu');
const transposeList = document.getElementById('transpose-list');
const transposeBtn = document.getElementById('transpose-btn');
const chordSpans = document.querySelectorAll('.chord');
const currentCapo = document.getElementById('current-capo');
const capoParagraph = document.getElementById('capo-paragraph');

// PSALM CHORDS ---------------------------------------------------------------

let settingsData = fetch("/static/settings.json")
	.then(response => response.json())
	.then(data => { return data; })
	.catch(error => {
		console.error('Error fetching settings:', error);
	});

let chordData = fetch("/static/chords.json")
	.then(response => response.json())
	.then(data => { return data; })
	.catch(error => {
		console.error('Error fetching chords:', error);
		return null;
	});

async function gen_transpositions() {
	transposeMenu.classList.remove('hide');
	const settings = await settingsData;
	const chords =  await chordData;
	const psalmLang = document.querySelector('.psalm').dataset.lang;
	const baseChords = chords[settings["languages"][psalmLang]["chords"]]["chords"];
	const rootChord = chordSpans[0].dataset.root;
	const rootKey = parseInt(chordSpans[0].dataset.key);
	transposeList.innerHTML = '';
	for (let i = 0; i < baseChords.length; i++) {
		const change = i - 5;
		const changeText = change <= 0 ? `${change}` : `+${change}`;
		let c = rootKey + change
		if (c < 0) c += baseChords.length;
		else if (c >= baseChords.length) c -= baseChords.length;
		const li = document.createElement('li');
		li.classList.add('pointer');
		li.innerHTML = `<a class="text-left" onclick="changeKey('${change}')">
			<span class="width-md inline-block">${baseChords[c][0]}</span>(${changeText})</a>`;
		transposeList.appendChild(li);
	}
}

async function changeKey(key) {
	const change = parseInt(key);
	const changeText = change > 0 ? `+${change}` : `${change}`;
	const settings = await settingsData;
	const chords = await chordData;
	const psalmLang = document.querySelector('.psalm').dataset.lang;
	const baseChords = chords[settings["languages"][psalmLang]["chords"]]["chords"];
	if (change != 0) transposeBtn.textContent = `(${changeText})`;
	else transposeBtn.textContent = '';
	chordSpans.forEach((chord) => {
		let i = parseInt(chord.dataset.key) + change;
		if (i < 0) i += baseChords.length;
		else if (i >= baseChords.length) i -= baseChords.length;
		chord.textContent = `${baseChords[i][0]}${chord.dataset.quality}`;
	});
}

function moveCapo(move) {
	const current = parseInt(currentCapo.textContent ? currentCapo.textContent : 0);
	let newCapo = current + move;
	if (newCapo < 0) newCapo = 0;
	if (newCapo > 11) newCapo = 11;
	if (newCapo == currentCapo.dataset.capo) {
		currentCapo.classList.remove('primary');
		capoParagraph.classList.add('secondary');
		currentCapo.textContent = newCapo;
	} else {
		currentCapo.classList.add('primary');
		capoParagraph.classList.remove('secondary');
		currentCapo.textContent = ` ${newCapo}`;
	}
}

if (chordSpans.length > 0) {
	gen_transpositions();
	moveCapo(0);
} else {
	transposeMenu.classList.add('hide');
	capoParagraph.classList.add('hide');
}
