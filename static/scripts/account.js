const accountError = document.getElementById('account-error');
const accountEmails = document.querySelectorAll('.account-email');
const accountSettings = document.getElementById('account-settings');
const accountLists = document.getElementById('account-lists');
const listModal = document.getElementById('list-modal');
const listForm = document.getElementById('list-form');
const listSubmit = document.getElementById('list-submit');
const listSuccess = document.getElementById('list-success');
const listError = document.getElementById('list-error');
const listClose = document.getElementById('list-close');

async function accountLogin() {
	accountError.classList.add('hide');
	accountSettings.classList.add('hide');
	try {
		const record = await pb.collection('res_users').getOne(pb.authStore.record.id);
		accountEmails.forEach((e) => e.textContent = record.email);
		accountSettings.classList.remove('hide');
		fetchLists();
	} catch (error) {
		accountError.textContent = getFullErrorMessage(error);
		accountError.classList.remove('hide');
	}
}

async function fetchLists() {
	accountLists.innerHTML = '';
	try {
		const lists = await pb.collection('res_lists').getFullList({ sort: 'name' });
		lists.forEach((l) => {
			const li = document.createElement('li');
			li.classList.add('mb-pico');
			li.innerHTML = `<a href="/list/?id=${l.id}">${l.name}</a>`;
			accountLists.append(li);
		});
	} catch (error) {
		console.error(error);
	}
}

function accountLogout() {
	clearLogouts = document.querySelectorAll('.clear-logout').forEach((e) => {
		e.innerHTML = '';
	});
}

function resetListForm() {
	listForm.reset();
	listForm.classList.remove('hide');
	listError.classList.add('hide');
	listSuccess.classList.add('hide');
	listSubmit.classList.remove('hide');
	listSubmit.setAttribute('aria-busy', 'false');
	listClose.textContent = "Cancel";
}

// List Form
listForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	if (!listModal.open) return;

	listError.classList.add('hide');
	listSuccess.classList.add('hide');

	const formData = new FormData(listForm);
	listSubmit.setAttribute('aria-busy', 'true');
	try {
		if (!isBetween(formData.get('list-name'), 100, 2)) throw new Error("Name must be between 3 and 100 characters long");
		const result = await pb.collection('res_lists').create({
			user_id: pb.authStore.record.id,
			name: formData.get('list-name')
		});
		listSuccess.classList.remove('hide');
		listForm.classList.add('hide');
		listForm.reset();
		listSubmit.classList.add('hide');
		listSubmit.setAttribute('aria-busy', 'false');
		listClose.textContent = "Close";
		fetchLists();
	} catch (error) {
		listError.textContent = getFullErrorMessage(error);
		listSubmit.setAttribute('aria-busy', 'false');
		listError.classList.remove('hide');
	}
});

document.addEventListener('authChange', (event) => {
	if (event.detail.newAuth) {
		accountLogin();
	} else {
		accountLogout();
	}
});

if (pb.authStore.isValid) {
	accountLogin();
} else {
	accountLogout();
}
