
const main = document.querySelector('.psalm');
const urlParams = new URLSearchParams(window.location.search);
const language = currentLanguage(languages);
const languageItems = document.querySelectorAll('.language-item');
const eplayer = document.querySelector('.eplayer');

var foundPsalm = false;

if(urlParams.has('id') && language) {
	const psalmId = urlParams.get('id');
	const arrId = getPsalm(language['code'], psalmId);
	if(arrId >= 0) {
		foundPsalm = true;
		renderPsalm(language, arrId);
	}
}

if(!foundPsalm) {
	main.innerHTML = "<p>No Psalm Found</p>";
}

function renderPsalm(language, id) {
	main.innerHTML = psalms[id]['lyrics'];

	main.classList.add(psalms[id]['category']);

	const capo = main.querySelector('.capo');
	if(psalms[id]['capo'] > 0) capo.textContent = language['site_capo'] + ' ' + psalms[id]['capo'];
	else capo.classList.add('hide');

	languageItems.forEach((item) => {
		if(item.dataset.lang == language['code']) item.classList.add('active');
		let pid = getPsalm(item.dataset.lang, psalms[id]['psalm_id']);
		if(pid >= 0) {
			item.href = "/" + item.dataset.lang + "/psalmus/?id=" + psalms[pid]['psalm_id'];
		} else {
			item.classList.add('hide');
		}
	});

	if(psalms[id]['audio']) {
		eplayer.dataset.src = "/static/" + psalms[id]['audio'];
		eplayer.dataset.type = "audio/mp3";
		const player = new EPlayer();
	} else {
		eplayer.innerHTML = "<p class='no-audio text-center color-secondary'>" + language['site_no_audio'] + "</p>";
	}
}

function getPsalm(lang, id) {
	for(let i = 0; i < psalms.length; i++) {
		if(psalms[i].psalm_id == id && psalms[i].lang == lang) return i;
	}
	return -1;
}

function currentLanguage(langs) {
	var path = window.location.pathname.split('/');
	var len = path.length, i;
	for(i = 0; i < len; i++) path[i] && path.push(path[i]);
	path.splice(0, len);
	const lang = path[0];
	for(i = 0; i < langs.length; i++) {
		if(langs[i].code == lang) return langs[i];
	}
	return null;
}
