// CONSTANTS ------------------------------------------------------------------

const DOM = {
	brotherAddress: document.getElementById('brother-address'),
	brotherAlternate: document.getElementById('brother-alternate'),
	brotherAlternatePhone: document.getElementById('brother-alternate-phone'),
	brotherDelete: document.getElementById('brother-delete'),
	brotherError: document.getElementById('brother-error'),
	brotherFirstName: document.getElementById('brother-first-name'),
	brotherForm: document.getElementById('brother-form'),
	brotherId: document.getElementById('brother-id'),
	brotherJoined: document.getElementById('brother-joined'),
	brotherLastName: document.getElementById('brother-last-name'),
	brotherPhone: document.getElementById('brother-phone'),
	brotherRole: document.getElementById('brother-role'),
	brotherSearchForm: document.getElementById('brother-search-form'),
	brotherSearch: document.getElementById('brother-search'),
	brotherSortFname: document.getElementById('brother-sort-fname'),
	brotherSubmit: document.getElementById('brother-submit'),
	brotherTeam: document.getElementById('team'),
	brotherTitle: document.getElementById('brother-title'),
	brotherWalking: document.getElementById('walking'),
	communityError: document.getElementById('community-error'),
	communityList: document.getElementById('community-list'),
	communityTeams: document.getElementById('community-teams'),
}

// GLOBALS --------------------------------------------------------------------

let brothers = [];
let filterTeam = '';
let sortBy = 'last_name';
let sortDirection = true;

// HELPERS --------------------------------------------------------------------

const getDateString = (date) => {
	const d = new Date(date);
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
};

const getLocaleDateString = (date) => {
	const d = new Date(date);
	const offset = d.getTimezoneOffset() * 60000;
	const newD = new Date(d.valueOf() + offset);
	return newD.toLocaleDateString();
}

const getOptionValue = (select, option) => {
	return [...select.querySelectorAll('option')].find(o => o.value === option).textContent;
}

// RENDER ---------------------------------------------------------------------

// Create brother element
function createBrotherElement(brother) {
	const element = document.createElement('div');
	element.classList.add('brother');
	if (brother.team) element.classList.add(`team-${brother.team}`);
	element.dataset.id = brother.id;
	let name = brother.last_name ? `<h5>${brother.first_name} ${brother.last_name}</h5>` : `<h5>${brother.first_name}</h5>`;
	let role = brother.role ? `<p>${getOptionValue(DOM.brotherRole, brother.role)}</p>` : '';
	let html = `<details><summary class="flex align-center space-between"><hgroup class="mb-0">${name}${role}</hgroup></summary>`;
	if (brother.phone || brother.address) {
		let contact = `<div class="grid">`;
		contact += brother.phone ? `<div class="block"><small>Phone Number</small><p><b>${brother.phone}</b></p></div>` : '';
		contact += brother.address ? `<div class="block"><small>Address</small><p><b>${brother.address}</b></p></div>` : '';
		html += `${contact}</div>`;
	}
	html += brother.alternate ? `<blockquote class="mb-0"><small>Alternate Contact</small><br><b>${brother.alternate}</b>` : '';
	html += brother.alternate && brother.alternate_phone ? `<footer><cite>${brother.alternate_phone}</cite></footer>` : '';
	html += brother.alternate ? '</blockquote>' : '';
	if (brother.joined || brother.walking || brother.team) {
		let walk = `<div class="grid mt-pico">`;
		walk += brother.joined ? `<div class="block"><small>Joined</small><p><b>${getLocaleDateString(brother.joined)}</b></p></div>` : '';
		walk += brother.walking ? `<div class="block"><small>Walking</small><p><b>${getOptionValue(DOM.brotherWalking, brother.walking)}</b></p></div>` : '';
		walk += brother.team ? `<div class="block"><small>Team</small><p><b>${brother.team}</b></p></div>` : '';
		html += `${walk}</div>`;
	}
	html += `<button class="mt-pico outline" data-target="brother-modal" onclick="editBrother('${brother.id}'); toggleModal(event);">Edit</button></details><hr></div>`;
	element.innerHTML = html;
	return element;
}

// Render community list
function renderCommunity() {
	DOM.communityList.innerHTML = '';
	const filteredBrothers = brothers.filter(b => {
		const matchesSearch = filterSearch ? `${normalize(b.first_name)} ${normalize(b.last_name)}`.trim().includes(filterSearch) : true;
		const matchesTeam = filterTeam ? b.team === parseInt(filterTeam) : true;
		return matchesSearch && matchesTeam;
	}).sort((a, b) => a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0);
	filteredBrothers.forEach(b => {
		DOM.communityList.appendChild(createBrotherElement(b));
	});
	clearBtn.classList.toggle('hide', !filterSearch && !filterTeam);
}

// Render teams
function renderTeams() {
	DOM.communityTeams.innerHTML = '';
	let teams = [];
	brothers.forEach(b => {
		if (b.team && b.team > 0 && !teams.includes(b.team)) teams.push(b.team);
	});
	if (teams.length) {
		teams.sort();
		teams.forEach(t => {
			DOM.communityTeams.innerHTML += `<button class="team-btn outline mr-xxs" data-team="${t}" onclick="showTeam('${t}')">Team ${t}</button>`;
		});
	}
}

// FETCH ----------------------------------------------------------------------

// Fetch community list
async function fetchCommunity() {
	DOM.communityError.classList.add('hide');

	try {
		brothers = await pb.collection('res_brothers').getFullList({sort: 'last_name,first_name'});
		renderCommunity();
		renderTeams();
	} catch (error) {
		console.error(error);
		DOM.communityError.textContent = getFullErrorMessage(error);
		DOM.communityError.classList.remove('hide');
	}
}

// ADD/EDIT -------------------------------------------------------------------

// Open the edit brother form
function editBrother(id) {
	const brother = brothers.find(b => b.id == id);
	if (!brother) return;
	DOM.brotherForm.reset();
	DOM.brotherTitle = `Edit ${brother.first_name}`;
	DOM.brotherId.value = brother.id;
	DOM.brotherFirstName.value = brother.first_name;
	DOM.brotherLastName.value = brother.last_name;
	DOM.brotherRole.value = brother.role;
	DOM.brotherPhone.value = brother.phone;
	DOM.brotherAlternate.value = brother.alternate;
	DOM.brotherAlternatePhone.value = brother.alternate_phone;
	DOM.brotherAddress.value = brother.address;
	DOM.brotherJoined.value = getDateString(brother.joined);
	DOM.brotherWalking.value = brother.walking;
	DOM.brotherTeam.value = brother.team;
	DOM.brotherDelete.classList.remove('hide');
}

// Open the add brother form
function addBrother() {
	DOM.brotherForm.reset();
	DOM.brotherTitle.textContent = 'Add Brother/Sister';
	DOM.brotherId.value = '';
	DOM.brotherDelete.classList.add('hide');
}

// Brother Form
DOM.brotherForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	DOM.brotherError.classList.add('hide');
	DOM.brotherSubmit.setAttribute('aria-busy', 'true');

	try {
		const formData = new FormData(DOM.brotherForm);
		const data = {
			user_id: pb.authStore.record.id,
			first_name: formData.get('brother-first-name'),
			last_name: formData.get('brother-last-name'),
			role: formData.get('brother-role'),
			phone: formData.get('brother-phone'),
			alternate: formData.get('brother-alternate'),
			alternate_phone: formData.get('brother-alternate-phone'),
			address: formData.get('brother-address'),
			joined: formData.get('brother-joined'),
			walking: formData.get('walking'),
			team: formData.get('team')
		}
		if (formData.get('brother-id')) {
			const result = await pb.collection('res_brothers').update(formData.get('brother-id'), data);
		} else {
			const record = await pb.collection('res_brothers').create(data);
		}
		DOM.brotherSubmit.setAttribute('aria-busy', 'false');
		fetchCommunity();
		if (visibleModal) closeModal(visibleModal);
	} catch (error) {
		DOM.brotherError.textContent = getFullErrorMessage(error);
		DOM.brotherSubmit.setAttribute('aria-busy', 'false');
		DOM.brotherError.classList.remove('hide');
	}
});

// Delete brother
async function deleteBrother(event) {
	const brother = brothers.find(b => b.id == DOM.brotherId.value);
	if (!brother) return;
	if (!confirm(`Are you sure you want to delete ${brother.first_name}?`)) return;
	DOM.brotherDelete.setAttribute('aria-busy', 'true');
	try {
		await pb.collection('res_brothers').delete(brother.id);
		fetchCommunity();
		DOM.brotherDelete.setAttribute('aria-busy', 'false');
		if (visibleModal) closeModal(visibleModal);
	} catch(error) {
		DOM.brotherDelete.setAttribute('aria-busy', 'false');
		DOM.brotherError.textContent = getFullErrorMessage(error);
		DOM.brotherError.classList.remove('hide');
	}
}

// SEARCH ---------------------------------------------------------------------

DOM.brotherSearch.addEventListener('input', search);
DOM.brotherSearchForm.addEventListener('submit', search);

function search(event) {
	event.preventDefault();
	const query = normalize(DOM.brotherSearch.value);
	if (query.length < 2) filterSearch = '';
	else filterSearch = query;
	renderCommunity();
}

// FILTER/SORT -----------------------------------------------------------------------

function showTeam(team) {
	filterTeam = team;
	document.querySelectorAll('.team-btn').forEach(b => {
		b.classList.toggle('outline', filterTeam != b.dataset.team);
	});
	renderCommunity();
}

function sortBrothers(event) {
	if (event.currentTarget.dataset.direction) sortDirection = event.currentTarget.dataset.direction === 'asc';
	else sortDirection = sortBy === event.currentTarget.dataset.sort ? !sortDirection : true;
	sortBy = event.currentTarget.dataset.sort;
	document.querySelectorAll('.brother-sort').forEach(s => {
		s.classList.toggle('outline', sortBy != s.dataset.sort);
		s.querySelector('.sort-asc').classList.toggle('hide', !sortDirection);
		s.querySelector('.sort-desc').classList.toggle('hide', sortDirection);
	});
	document.querySelector('.brother-sort-md summary svg.sort-asc').classList.toggle('hide', !sortDirection);
	document.querySelector('.brother-sort-md summary svg.sort-desc').classList.toggle('hide', sortDirection);
	document.querySelectorAll('.brother-sort-md a').forEach(a => {
		if (a.dataset.sort === sortBy && (sortDirection === (a.dataset.direction === 'asc')))
			a.querySelector('svg').classList.remove('hide');
		else a.querySelector('svg').classList.add('hide');
	});
	DOM.communityList.classList.toggle('flex-column', sortDirection);
	DOM.communityList.classList.toggle('flex-column-reverse', !sortDirection);
	renderCommunity();
}

function clearBrotherFilters() {
	DOM.brotherSearch.value = '';
	filterSearch = '';
	showTeam('');
}

// MAIN -----------------------------------------------------------------------

// Fetch list on authentication change
document.addEventListener('authChange', (event) => {
	fetchCommunity();
});

fetchCommunity();
