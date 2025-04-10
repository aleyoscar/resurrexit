// const Cookies = require('js-cookie');

const tagBtns = document.querySelectorAll('.tag-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
const dropdownMenus = document.querySelectorAll('.dropdown');
const sortBtns = document.querySelectorAll('.sort-btn');
const eplayer = document.querySelector('.eplayer');
const searchForm = document.querySelector('#search-form');
const sourceBtns = document.querySelectorAll('.audio-source-btn');
const themeBtn = document.querySelector("#theme-btn");

let player = null;

categoryBtns.forEach(item => item.addEventListener('click', filterCategory));
tagBtns.forEach(item => item.addEventListener('click', filterTag));
sortBtns.forEach(item => item.addEventListener('click', toggleSort));
dropdownMenus.forEach(dropdown => dropdown.addEventListener('click', toggleDropdown));
dropdownMenus.forEach(dropdown => dropdown.addEventListener('focusout', closeDropdown));
sourceBtns.forEach(item => item.addEventListener('click', changeSource));
if(eplayer && eplayer.dataset.src != '') {
	player = new EPlayer();
}
if(searchForm) searchForm.addEventListener('submit', filterSearch);
if (themeBtn) themeBtn.addEventListener('click', switchTheme);

var categories = [];
var tags = [];
var searched = [];
// var psalmItems = [];

if("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/sw.js");
}

document.addEventListener('DOMContentLoaded', function() {
	if(document.querySelector('.clear-btn')) countPsalms();
	if(document.querySelector('.aside-btn')) {
		document.querySelector('.aside-btn').addEventListener('click', toggleAside);
		document.querySelectorAll('.close-aside').forEach((i) => i.addEventListener('click', closeAside));
	}
	let theme = window.matchMedia('(prefers-color-scheme:light)').matches;
	if (Cookies.get('theme')) theme = Cookies.get('theme') == 'light' ? true : false;
	setTheme(theme);
});

function filterCategory(e) {
	this.classList.toggle('active');
	if(categories.includes(this.dataset.filter)) categories = categories.filter((c) => c !== this.dataset.filter);
	else categories.push(this.dataset.filter);
	filter();
}

function filterTag(e) {
	this.classList.toggle('active');
	if(tags.includes(this.dataset.filter)) tags = tags.filter((t) => t !== this.dataset.filter);
	else tags.push(this.dataset.filter);
	filter();
}

function filterSearch(e) {
	e.preventDefault();
	const searchUrl = searchForm.getAttribute('action');
	searched = [];
	psalmItems = document.querySelectorAll('.psalm-item');
	const search = document.querySelector('#search');
	let results = false;
	if(search.value.length > 2) {
		const normalized = search.value.normalize('NFKD').replace(/[^\w\s.-_'",!?]/g, '').toLowerCase();
		if(normalized) {
			const found = [];

			(async () => {
				console.log("Searching on page: " + searchUrl);
				try {
					const response = await fetch(searchUrl + "?q=" + normalized, {
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						}
					});
					if (response.status === 200) {
						const found = await response.json();
						console.log(found);
						if (found.count > 0) {
							found.results.forEach((p) => searched.push("p" + p.psalm_id));
							search.placeholder = search.dataset.search;
							filter();
							results = true;
						}
					} else {
						console.log(response.status);
						console.log(response.statusText);
					}
				} catch (error) {
					console.error(error);
				}
			})();
		}
	}
	if(!results) {
		search.value = '';
		search.placeholder = search.dataset.nosearch;
	}
}

function filter() {
	const psalmItems = document.querySelectorAll('.psalm-item');
	const clearBtn = document.querySelector('.clear-btn');
	let f = [];
	if(categories.length) {
		categories.forEach((c) => {
			if(tags.length) tags.forEach((t) => { f.push('.' + c + '.' + t) });
			else f.push('.' + c);
		});
	} else if(tags.length) {
		tags.forEach((t) => f.push('.' + t));
	}

	if(searched.length) {
		newf = []
		searched.forEach((s) => {
			if(f.length) {
				f.forEach((i) => {
					newf.push('#' + s + i);
				});
			} else {
				newf.push('#' + s);
			}
		});
		f = newf;
	}

	if(f.length) {
		psalmItems.forEach((i) => i.classList.add('hide'));
		f.forEach((i) => document.querySelectorAll(i).forEach((p) => p.classList.remove('hide')));
		clearBtn.classList.remove('hide');
	} else {
		psalmItems.forEach((i) => i.classList.remove('hide'));
		clearBtn.classList.add('hide');
	}

	countPsalms();
}

function countPsalms() {
	let count = 0;
	document.querySelectorAll('.psalm-item').forEach((p) => {
		if(!p.classList.contains('hide')) count++;
	});
	// document.querySelector('.psalm-count').textContent = count;
	if(count <= 0) document.querySelector('.no-psalms').classList.remove('hide');
	else document.querySelector('.no-psalms').classList.add('hide');
}

function toggleDropdown(e) {
	this.querySelector(".dropdown-menu").classList.toggle("show");
}

function closeDropdown(e) {
	let related = e.relatedTarget;
	let clickedInside = false;
	if(related) {
		while(related) {
			if(related.nodeName == "BODY") break;
			else if(related.classList.contains('dropdown-item')) {
				clickedInside = true;
				e.stopPropagation();
				break;
			}
			related = related.parentNode;
		}
	}
	if(!clickedInside) this.querySelector(".dropdown-menu").classList.remove("show");
}

function toggleAside(e) {
	document.querySelector('aside').classList.toggle('show');
	document.querySelector('.overlay').classList.toggle('hide');
}

function closeAside(e) {
	document.querySelector('aside').classList.remove('show');
	document.querySelector('.overlay').classList.add('hide');
}

function toggleSort(e) {
	document.querySelector('.psalm-list').classList.toggle('flex-column-reverse');
	sortBtns.forEach((b) => b.classList.toggle('hide'));
}

function changeSource(e) {
	if (player) {
		player.load(e.target.dataset.source, 'audio/mp3');
		sourceBtns.forEach(btn => {
			btn.classList.remove('active');
			if (btn.dataset.source == e.target.dataset.source) btn.classList.add('active');
		});
		closeAside(null);
	}
}

function switchTheme(e) {
	if (document.querySelector('html').dataset.theme == 'light') setTheme(false);
	else setTheme(true);
}

function setTheme(theme) {
	let themeName = theme ? 'light' : 'dark';
	document.querySelector('html').dataset.theme = themeName;
	Cookies.set('theme', themeName);
	if (themeBtn) {
		themeBtn.querySelectorAll('.theme-toggle').forEach((btn) => {
			btn.classList.remove('show');
		});
		themeBtn.querySelector('.theme-' + themeName).classList.add('show')
	}
}
