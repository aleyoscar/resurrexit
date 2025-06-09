// CONSTANTS ------------------------------------------------------------------

const themeBtns = document.querySelectorAll(".theme-btn");
const psalmList = document.getElementById("psalm-list");
const sortBtn = document.getElementById("sort-btn");
const sortBtnAsc = document.getElementById("sort-btn-asc");
const sortBtnDesc = document.getElementById("sort-btn-desc");
const searchInput = document.getElementById('search-input');
const stepsModal = document.getElementById('steps-modal');
const tagsModal = document.getElementById('tags-modal');
const gtagsModal = document.getElementById('gtags-modal');
const stepsBtn = document.getElementById('steps-btn');
const tagsBtn = document.getElementById('tags-btn');
const gtagsBtn = document.getElementById('gtags-btn');
const clearBtn = document.getElementById('clear-btn');
const tools = document.getElementById('tools');
const contactModal = document.getElementById('contact-modal');
const contactForm = document.getElementById('contact-form');
const contactError = document.getElementById('contact-error');
const contactSuccess = document.getElementById('contact-success');
const contactSubmit = document.getElementById('contact-submit');
const contactClose = document.getElementById('contact-close');
const menu = document.getElementById('menu');
const eplayer = document.getElementById('eplayer');
const eplayerWrapper = document.querySelector('.eplayer-wrapper');
const footer = document.getElementById('footer');
// const eplayerWrapper = document.getElementById('eplayer-wrapper')

// GLOBALS --------------------------------------------------------------------

let psalms = [];
let filterSearch = '';
let toolsOffset = null;
let player = null;

const lang = document.documentElement.lang.toLowerCase();

// EPLAYER --------------------------------------------------------------------

function switchSource(event) {
	player.load(event.currentTarget.dataset.source, 'audio/mp3');
}

if (eplayer) player = new EPlayer();

if (eplayerWrapper) {
	footer.style.paddingBottom = `calc(${eplayerWrapper.offsetHeight}px + var(--pico-spacing))`;
	window.addEventListener('resize', (e) => {
		footer.style.paddingBottom = `calc(${eplayerWrapper.offsetHeight}px + var(--pico-spacing))`;
	});
}

// MENU -----------------------------------------------------------------------

if (menu) menu.addEventListener('click', (event) => {
	if (event.target === menu) toggleMenu();
});

function toggleMenu() {
	menu.classList.toggle('open');
}

// CONTACT --------------------------------------------------------------------

function closeContact() {
	contactSubmit.setAttribute('aria-busy', 'false');
	contactForm.classList.add('hide');
	contactSubmit.classList.add('hide');
	contactClose.textContent = "Close";
	contactForm.reset();
}

contactForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	if (!contactModal.open) return;

	contactError.textContent = '';
	contactError.classList.add('hide');
	contactSuccess.classList.add('hide');

	const formData = new FormData(contactForm);
	contactSubmit.setAttribute('aria-busy', 'true');
	try {
		const response = await fetch(contactForm.action, {
			method: 'POST',
			body: formData,
			headers: { 'Accept': 'application/json' }
		});
		const result = await response.json();
		if (result.status === 'success') {
			closeContact();
			contactSuccess.classList.remove('hide');
		} else {
			closeContact();
			contactError.classList.remove('hide');
			contactError.textContent = result.message;
		}
	} catch (error) {
		closeContact();
		contactError.textContent = error.message;
		contactError.classList.remove('hide');
	}
});

// FILTER ---------------------------------------------------------------------

function findAny(needle, haystack) {
	let found = false;
	for (let i = 0; i < needle.split(' ').length; i++) {
		if (haystack.includes(needle.split(' ')[i])) {
			found = true;
			break;
		}
	}
	return found;
}

function clearFilters() {
	document.querySelectorAll('.filter').forEach(input => {
		input.checked = false;
	});
	filterSearch = '';
	searchInput.value = '';
	filterPsalms();
}

function clearTags(event) {
	if (event.currentTarget && event.currentTarget.dataset.attribute) {
		document.getElementById(event.currentTarget.dataset.attribute + '-modal').
			querySelectorAll('.filter').forEach(input => {
				input.checked = false;
			});
		filterPsalms();
	}
}

function filterPsalms() {
	// RESET
	let filterSteps = [];
	let filterTags = [];
	let filterGTags = [];
	psalmList.querySelectorAll('.psalm').forEach(
		p => p.classList.add('hide')
	);
	stepsBtn.classList.add('outline');
	tagsBtn.classList.add('outline');
	gtagsBtn.classList.add('outline');

	stepsModal.querySelectorAll('.filter').forEach(input => {
		if (input.checked) {
			filterSteps.push(input.name);
			stepsBtn.classList.remove('outline');
		}
	});
	tagsModal.querySelectorAll('.filter').forEach(input => {
		if (input.checked) {
			filterTags.push(input.name);
			tagsBtn.classList.remove('outline');
		}
	});
	gtagsModal.querySelectorAll('.filter').forEach(input => {
		if (input.checked) {
			filterGTags.push(input.name);
			gtagsBtn.classList.remove('outline');
		}
	});

	stepsBtn.querySelector('span').textContent =
		filterSteps.length ? `(${filterSteps.length}) ` : '';
	tagsBtn.querySelector('span').textContent =
		filterTags.length ? `(${filterTags.length}) ` : '';
	gtagsBtn.querySelector('span').textContent =
		filterGTags.length ? `(${filterGTags.length}) ` : '';

	const results = psalms.filter(psalm => {
		const matchesSearch = filterSearch ?
			findAny(filterSearch, psalm.text) : true;
		const matchesSteps = filterSteps.length > 0 ?
			filterSteps.includes(psalm.step) : true;
		const matchesTags = filterTags.length > 0 ?
			filterTags.some(t => psalm.tags.includes(t)) : true;
		const matchesGTags = filterGTags.length > 0 ?
			filterGTags.some(t => psalm.gtags.includes(t)) : true;
		return matchesSearch && matchesSteps && matchesTags && matchesGTags;
	});

	if (results.length > 0) {
		results.forEach(
			(r) => psalmList.querySelector(`#p-${r.id}`).classList.remove('hide')
		);
	}
	if (filterSteps.length || filterTags.length || filterGTags.length || filterSearch) {
		clearBtn.classList.remove('hide');
	} else {
		clearBtn.classList.add('hide');
		psalmList.querySelectorAll('.psalm').forEach(
			p => p.classList.remove('hide')
		);
	}

	if (visibleModal) closeModal(visibleModal);
}

// SEARCH ---------------------------------------------------------------------

if (searchInput) {
	// Fetch the search index
	fetch('/static/index.json')
		.then(response => response.json())
		.then(data => {
			psalms = data.filter(psalm => psalm.lang == lang);
		})
		.catch(error => console.error('Error loading search index:', error));

	// Handle search input
	searchInput.addEventListener('input', () => {
		const query = searchInput.value.trim().toLowerCase().normalize("NFD")
			.replace(/\p{Diacritic}/gu, '');
		if (query.length < 2) filterSearch = '';
		else filterSearch = query;
		filterPsalms();
	});
}

// SORT -----------------------------------------------------------------------

function sortList(event) {
	psalmList.classList.toggle("flex-column-reverse");
	sortBtn.classList.toggle("outline");
	sortBtnAsc.classList.toggle("hide");
	sortBtnDesc.classList.toggle("hide");
}

// THEME ----------------------------------------------------------------------

function switchTheme(event) {
	if (document.querySelector('html').dataset.theme == 'light') setTheme(false);
	else setTheme(true);
}

function setTheme(theme) {
	let themeName = theme ? 'light' : 'dark';
	document.querySelector('html').dataset.theme = themeName;
	// Cookies.set('theme', themeName);
	if (themeBtns) {
		themeBtns.forEach((themeBtn) => {
			themeBtn.querySelectorAll('.theme-toggle').forEach((btn) => {
				btn.classList.add('hide');
			});
			themeBtn.querySelector('.theme-' + themeName).classList.remove('hide')
		})
	}
}

// MAIN -----------------------------------------------------------------------

window.addEventListener('scroll', (e) => {
	if (tools) {
		if (window.pageYOffset > toolsOffset) tools.classList.add('stuck');
		else tools.classList.remove('stuck');
	}
});

let theme = window.matchMedia('(prefers-color-scheme:light)').matches;
// if (Cookies.get('theme')) theme = Cookies.get('theme') == 'light' ? true : false;
setTheme(theme);
if (psalmList) filterPsalms();
if (tools) toolsOffset = tools.offsetTop;

// Register service worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/static/sw.js')
			.then(reg => console.log('Service Worker registered'))
			.catch(err => console.error('Service Worker registration failed:', err));
	});
}
