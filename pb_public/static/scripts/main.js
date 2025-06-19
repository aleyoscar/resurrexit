// CONSTANTS ------------------------------------------------------------------

const themeBtns = document.querySelectorAll(".theme-btn");
const psalmList = document.getElementById("psalm-list");
const sortBtn = document.getElementById("sort-btn");
const sortBtnAsc = document.getElementById("sort-btn-asc");
const sortBtnDesc = document.getElementById("sort-btn-desc");
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
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
const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const resetModal = document.getElementById('reset-modal');
const loggedIn = document.querySelectorAll('.logged-in');
const loggedOut = document.querySelectorAll('.logged-out');
const logoutModal = document.getElementById('logout-modal');
const menu = document.getElementById('menu');
const eplayer = document.getElementById('eplayer');
const eplayerWrapper = document.querySelector('.eplayer-wrapper');
const footer = document.getElementById('footer');
const pb = new PocketBase();
// const eplayerWrapper = document.getElementById('eplayer-wrapper')

const authOptions = {
	login: {
		title: "Login",
		error: "There was an error logging in.",
		success: "Logged in successfully!",
		fields: ["email", "password"],
		links: ["register", "reset"],
		submit: "Login"
	},
	register: {
		title: "Register",
		error: "There was an error registering your account.",
		success: "Registered successfully! You will get a confirmation email shortly to verify your account.",
		fields: ["email", "new", "confirm"],
		links: ["login", "reset"],
		submit: "Register"
	},
	resend: {
		title: "Resend Verification Link",
		error: "There was an error resending your verification email.",
		success: "Verification email sent. Please verify your email address before logging in.",
		fields: ["email"],
		links: ["login", "register"],
		submit: "Submit"
	},
	reset: {
		title: "Reset Password",
		error: "There was an error resetting your password.",
		success: "A reset password link has been sent to your email address.",
		fields: ["email"],
		links: ["login", "register"],
		submit: "Submit"
	},
	resetLogged: {
		title: "Reset Password",
		error: "There was an error resetting your password.",
		success: "Password changed successfully.",
		fields: ["old", "new", "confirm"],
		links: [],
		submit: "Submit"
	}
}

// GLOBALS --------------------------------------------------------------------

let psalms = [];
let filterSearch = '';
let toolsOffset = null;
let player = null;
let authenticated = false;

const lang = document.documentElement.lang.toLowerCase();

// STATE ----------------------------------------------------------------------

const authEvent = new CustomEvent('authChange', {
	detail: { newAuth: null }
});

function changeAuth(value) {
	console.log("Changing auth", value);
	authenticated = value;
    // Update the event detail with the new state
	authEvent.detail.newAuth = authenticated;
    // Dispatch the event
	// In main.js or another script
	document.dispatchEvent(authEvent);
}

// VALIDATION -----------------------------------------------------------------

const isRequired = value => value ? true : false;
const isBetween = (value, max, min=0) => value.length > min && value.length <= max ? true : false;
const isValidEmail = value => /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(value);
const isValidPassword = value => /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{7,})\S$/.test(value);

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
		if (formData.get('contact-subject')) throw new Error('Bot detected');
		await pb.collection('res_contact').create({
			name: formData.get('contact-name'),
			email: formData.get('contact-email'),
			subject: formData.get('contact-subject'),
			message: formData.get('contact-message')
		});
		setTimeout(() => {
			closeContact();
			contactSuccess.classList.remove('hide');
		}, 2000);
	} catch (error) {
		closeContact();
		contactError.textContent = error.message;
		contactError.classList.remove('hide');
	}
});

// FILTER ---------------------------------------------------------------------

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
			filterSearch.split(' ').every(e => psalm.text.includes(e)) : true;
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
	searchInput.addEventListener('input', search);
	searchForm.addEventListener('submit', search);
}

function search(event) {
	event.preventDefault();
	const query = searchInput.value.trim().toLowerCase().normalize("NFD")
		.replace(/\p{Diacritic}/gu, '');
	if (query.length < 2) filterSearch = '';
	else filterSearch = query;
	filterPsalms();
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
	Cookies.set('theme', themeName);
	if (themeBtns) {
		themeBtns.forEach((themeBtn) => {
			themeBtn.querySelectorAll('.theme-toggle').forEach((btn) => {
				btn.classList.add('hide');
			});
			themeBtn.querySelector('.theme-' + themeName).classList.remove('hide')
		})
	}
}

// AUTHENTICATION -------------------------------------------------------------

// Change auth modal form
function changeAuthModal(option) {
	// Reset/hide values
	authForm.classList.remove('hide');
	authModal.querySelectorAll("p.message").forEach((m) => m.classList.add('hide'));
	authModal.querySelectorAll("label").forEach((l) => l.classList.add('hide'));
	authModal.querySelectorAll("input").forEach((i) => {
		i.required = false;
		i.setAttribute('aria-required', 'false');
	});
	authModal.querySelectorAll("#auth-links a").forEach((a) => a.classList.add('hide'));
	authModal.querySelector("#auth-close").textContent = "Cancel";
	authModal.querySelector("#auth-submit").classList.remove('hide');

	// Show option
	const authOption = authOptions[option];
	authModal.querySelector("#auth-title").textContent = authOption.title;
	authModal.querySelector("#auth-error").textContent = authOption.error;
	authModal.querySelector("#auth-success").textContent = authOption.success;
	authOption.fields.forEach((f) => {
		const label = authModal.querySelector(`#auth-label-${f}`);
		label.classList.remove('hide');
		label.querySelector('input').required = true;
		label.querySelector('input').setAttribute('aria-required', 'true');
	});
	authModal.querySelector("#auth-option").value = option;
	authOption.links.forEach((l) => {
		authModal.querySelector(`#auth-link-${l}`).classList.remove('hide');
	});
	authModal.querySelector("#auth-submit").textContent = authOption.submit;
	authModal.querySelector("#auth-submit").setAttribute('aria-busy', 'false');
}

function showAuthSuccess(option) {
	authForm.classList.add('hide');
	authForm.reset();
	authModal.querySelector("#auth-submit").setAttribute('aria-busy', 'false');
	authModal.querySelector("#auth-submit").classList.add('hide');
	authModal.querySelector("#auth-success").classList.remove('hide');
	authModal.querySelector("#auth-close").textContent = "Close";
}

function getFullErrorMessage(error) {
	let details = '';
	if (error.data && error.data.data)
		for (const key in error.data.data)
			if (error.data.data[key].message)
				details += ' ' + error.data.data[key].message;
	return error.message + details;
}

function showAuthError(option, error) {
	authModal.querySelector("#auth-submit").setAttribute('aria-busy', 'false');
	authModal.querySelector("#auth-error").textContent = getFullErrorMessage(error);
	authModal.querySelector("#auth-error").classList.remove('hide');
}

// Auth form
authForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	if (!authModal.open) return;

	authModal.querySelector("#auth-error").classList.add('hide');
	authModal.querySelector("#auth-success").classList.add('hide');

	const formData = new FormData(authForm);
	authModal.querySelector("#auth-submit").setAttribute('aria-busy', 'true');
	try {
		switch(formData.get('auth-option')) {
			case 'login':
				const result = await pb.collection('res_users').authWithPassword(
					formData.get('auth-email'),
					formData.get('auth-password')
				);
				if (!result.record.verified) {
					logout();
					throw new Error('Account not verified. Please check your email.');
				}
				login();
				break;
			case 'register':
				if (!isValidEmail(formData.get('auth-email'))) throw new Error("Invalid email address.");
				if (!isValidPassword(formData.get('auth-new'))) throw new Error("Password is too weak.");
				if (formData.get('auth-new') !== formData.get('auth-confirm')) throw new Error("Passwords do not match.");
				await pb.collection('res_users').create({
					email: formData.get('auth-email'),
					password: formData.get('auth-new'),
					passwordConfirm: formData.get('auth-confirm'),
				});
				await pb.collection('res_users').requestVerification(formData.get('auth-email'));
				break;
			case 'resend':
				await pb.collection('res_users').requestVerification(formData.get('auth-email'));
				break;
			case 'reset':
				await pb.collection('res_users').requestPasswordReset(formData.get('auth-email'));
				break;
			case 'resetLogged':
				if (!isValidPassword(formData.get('auth-new'))) throw new Error("Password is too weak.");
				if (formData.get('auth-new') !== formData.get('auth-confirm')) throw new Error("Passwords do not match.");
				await pb.collection('res_users').update(pb.authStore.record.id, {
					oldPassword: formData.get('auth-old'),
					password: formData.get('auth-new'),
					passwordConfirm: formData.get('auth-confirm')
				});
				break;
			default:
				throw new Error(`Invalid authentication option ${formData.get('auth-option')}`);
		}
		setTimeout(() => {
			showAuthSuccess(formData.get('auth-option'));
		}, 1000);
	} catch (error) {
		showAuthError(formData.get('auth-option'), error);
	}
});

// Logout
function logout() {
	changeAuth(false);
	console.log('Logging out');
	pb.authStore.clear();
	loggedOut.forEach((b) => b.classList.remove('hide'));
	loggedIn.forEach((b) => b.classList.add('hide'));
}

// Login
function login() {
	changeAuth(true);
	console.log('Logging in');
	loggedOut.forEach((b) => b.classList.add('hide'));
	loggedIn.forEach((b) => b.classList.remove('hide'));
}

// MAIN -----------------------------------------------------------------------

window.addEventListener('scroll', (e) => {
	if (tools) {
		if (window.pageYOffset > toolsOffset) tools.classList.add('stuck');
		else tools.classList.remove('stuck');
	}
});

let theme = window.matchMedia('(prefers-color-scheme:light)').matches;
if (Cookies.get('theme')) theme = Cookies.get('theme') == 'light' ? true : false;
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

// Check if logged in
if (pb.authStore.isValid) {
	login();
} else {
	logout();
}
