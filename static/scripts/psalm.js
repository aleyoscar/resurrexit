// CONSTANTS ------------------------------------------------------------------

const transposeMenu = document.getElementById('transpose-menu');
const transposeList = document.getElementById('transpose-list');
const transposeBtn = document.getElementById('transpose-btn');
const chordSpans = document.querySelectorAll('.chord');
const currentCapo = document.getElementById('current-capo');
const capoParagraph = document.getElementById('capo-paragraph');
const saveSettingsBtn = document.getElementById('save-psalm-settings');
const slug = window.location.pathname.slice(1, window.location.pathname.length - 1).split('/');

// HELPERS --------------------------------------------------------------------

function getCapo() { return parseInt(currentCapo.textContent); }
function getKey() { return parseInt([...transposeList.querySelectorAll('li')].find(l => l.classList.contains('selected')).dataset.change); }

function checkSave() {
	saveSettingsBtn.classList.toggle('hide', (getKey() == oset.key && getCapo() == oset.capo) || !pb.authStore.isValid);
}

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

let oset = {};

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
		li.dataset.change = change;
		if (c == 0) li.classList.add('selected');
		li.innerHTML = `<a class="text-left" onclick="changeKey('${change}')">
			<span class="width-md inline-block">${baseChords[c][0]}</span>(${changeText})</a>`;
		transposeList.appendChild(li);
	}
	moveCapo(0);
	oset = { capo: getCapo(), key: getKey() };
	checkSave();
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
	transposeList.querySelectorAll('li').forEach(l => l.classList.toggle('selected', parseInt(l.dataset.change) === change));
	checkSave();
}

function setCapo(num) {
	const current = parseInt(currentCapo.textContent ? currentCapo.textContent : 0);
	moveCapo(num - current);
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
	checkSave();
}

// Load current psalms settings if present
async function loadPsalmSettings() {
	if (slug.length < 2) return;
	const uset = await fetchUserSettings();
	if (uset.psalms && uset.psalms[slug[0]] && uset.psalms[slug[0]][slug[1]]) {
		oset = uset.psalms[slug[0]][slug[1]];
		setCapo(oset.capo);
		changeKey(oset.key);
	}
}

// Save psalm settings
async function savePsalmSettings() {
	if (slug.length < 2) return;
	saveSettingsBtn.setAttribute('aria-busy', 'true');
	const uset = await fetchUserSettings();
	if (!uset.psalms) uset.psalms = {};
	if (!uset.psalms[slug[0]]) uset.psalms[slug[0]] = {};
	if (!uset.psalms[slug[0]][slug[1]]) uset.psalms[slug[0]][slug[1]] = { capo: 0, key: 0 };
	uset.psalms[slug[0]][slug[1]].capo = getCapo();
	uset.psalms[slug[0]][slug[1]].key = getKey();
	try {
		const record = await pb.collection('res_users').update(pb.authStore.record.id, { settings: uset} );
		loadPsalmSettings();
	} catch(error) {
		console.error("Unable to save psalm settings", error);
	} finally {
		saveSettingsBtn.setAttribute('aria-busy', 'false');
	}
}

// Fetch psalm settings on authentication change
document.addEventListener('authChange', (event) => {
	if (pb.authStore.isValid) loadPsalmSettings();
	checkSave();
});

if (chordSpans.length > 0) {
	gen_transpositions();
} else {
	transposeMenu.classList.add('hide');
	capoParagraph.classList.add('hide');
}

if (pb.authStore.isValid) loadPsalmSettings();
