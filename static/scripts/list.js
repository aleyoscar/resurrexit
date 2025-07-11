// CONSTANTS ------------------------------------------------------------------

const listForm = document.getElementById('list-form');
const listView = document.querySelectorAll('.list-view');
const listFormName = document.getElementById('list-form-name');
const listFormPublic = document.getElementById('list-form-public');
const listCancel = document.getElementById('list-cancel');
const listEdit = document.getElementById('list-edit');
const listSubmit = document.getElementById('list-submit');
const listDelete = document.getElementById('list-delete');
const listError = document.getElementById('list-error');
const listDeleteError = document.getElementById('list-delete-error');
const listButtons = document.getElementById('list-buttons');
const listDiv = document.getElementById('list');
const listFormAddOptions = document.getElementById('list-form-add-options');
const listFormElements = document.getElementById('list-form-elements');
const listViewElements = document.getElementById('list-view-elements');
const listViewName = document.getElementById('list-view-name');
const listDownloadMd = document.getElementById('download-md');
const listDownloadTxt = document.getElementById('download-txt');
const saveModal = document.getElementById('save-modal');

// GLOBALS --------------------------------------------------------------------

let listCount = { psalm: 0, section: 0 };
let psalmOptions = fetch("/static/index.json")
	.then(response => response.json())
	.then(data => {
		let newData = []
		data.forEach((p) => {
			newData.push(`${p.title}|${p.lang}`);
		});
		return newData;
	})
	.catch(error => {
		console.error('Error fetching index:', error);
		return null;
	});

// HELPERS --------------------------------------------------------------------

// Get URL parameter
function getUrlParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

// Clear adjacent input
function clearInput(event) {
	event.currentTarget.parentNode.querySelector('input').value = '';
}

// LIST ELEMENTS --------------------------------------------------------------

// Create list form input
function createListElement(type, inputs) {
	listCount[type] += 1;
	const element = document.createElement('div');
	element.classList.add('list-element', 'flex', 'stretch', 'gap-xxs', 'py-xs', `list-${type}`);
	element.dataset.type = type;
	const fieldset = document.createElement('fieldset');
	fieldset.classList.add('mb-0');
	const deleteBtn = document.createElement('button');
	deleteBtn.classList.add('secondary');
	deleteBtn.addEventListener('click', removeListElement);
	deleteBtn.innerHTML = `<svg width="1.0em" height="1.0em"><use xlink:href="#icon-trash"/></svg>`;
	const dragBtn = document.createElement('button');
	dragBtn.classList.add('sort-move', 'outline', 'secondary');
	dragBtn.innerHTML = `<svg width="1.0em" height="1.0em"><use xlink:href="#icon-move"/></svg>`;
	dragBtn.addEventListener('click', (event) => { event.preventDefault(); });
	inputs.forEach((i) => {
		const input = document.createElement('input');
		input.id = `list-element-${i.name}-${listCount[type]}`;
		input.name = `list-element-${i.name}-${listCount[type]}`;
		input.classList.add(`list-element-${i.name}`);
		input.type = "text";
		input.value = i.value;
		input.autocomplete = "off";
		input.placeholder = i.placeholder;
		input.required = i.required;
		if (i.name == 'section' || i.name == 'notes') input.classList.add('mb-0');
		if (i.name == 'psalm') {
			input.addEventListener('input', autocomplete);
			input.addEventListener('keydown', autocompleteKeydown);
			const ul = document.createElement('ul');
			ul.classList.add('list-psalm-options', 'hide');
			const label = document.createElement('label');
			label.classList.add('relative');
			const a = document.createElement('a');
			a.innerHTML = `<svg width="1.0em" height="1.0em"><use xlink:href="#icon-x"/></svg>`;
			a.classList.add('clear-input', 'secondary', 'pointer', 'p-xxs');
			a.addEventListener('click', clearInput);
			label.append(input);
			label.append(a);
			label.append(ul);
			fieldset.append(label);
		} else fieldset.append(input);
	});
	element.append(dragBtn);
	element.append(fieldset);
	element.append(deleteBtn);
	return element;
}

// Remove list form input
function removeListElement(e) {
	e.preventDefault();
	listCount[e.currentTarget.parentNode.dataset.type] -= 1;
	e.currentTarget.parentNode.remove();
}

// Add list form inputs
function addListElement(e) {
	e.preventDefault();
	let inputs = null;
	switch(listFormAddOptions.value) {
		case 'section':
			inputs = [{ name: 'section', placeholder: 'Section Title...', required: 'required', value: '' }];
			break;
		case 'psalm':
			inputs = [
				{ name: 'title', placeholder: 'Psalm Title...', required: '', value: '' },
				{ name: 'psalm', placeholder: 'Psalm...', required: 'required', value: '' },
				{ name: 'notes', placeholder: 'Notes...', required: '', value: '' }
			];
			break;
		default:
			console.error('Invalid list add option', listFormAddOption.value);
			return;
	}
	listFormElements.append(createListElement(listFormAddOptions.value, inputs));
	Sortable.create(listFormElements, {
		handle: '.sort-move',
		animation: 150
	});
}

// SHARE ----------------------------------------------------------------------

// Copy text to clipboard
function toClipboard(text) {
	var textArea = document.createElement("textarea");
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;
	textArea.style.width = '2em';
	textArea.style.height = '2em';
	textArea.style.padding = 0;
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';
	textArea.style.background = 'transparent';

	textArea.value = text;

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		var result = document.execCommand('copy');
		if (result) alert('Text copied to clipboard');
		else throw new Error('Unable to copy text');
	} catch (err) {
		alert(err);
	}

	document.body.removeChild(textArea);
}

// RENDER ---------------------------------------------------------------------

// Render list form and list view
function renderList(list) {
	listFormName.value = list.name;
	listViewName.textContent = list.name;
	listFormPublic.checked = list.public;
	listCount.psalm = 0;
	listCount.section = 0;
	listFormElements.innerHTML = '';
	listViewElements.innerHTML = '';
	listButtons.classList.add('hide');
	let inputs = null;
	if (list.content) {
		let mdString = `# ${list.name}\n\n`;
		let txtString = `${list.name}\n${'='.repeat(list.name.length)}\n\n`;
		list.content.list.forEach((e) => {
			const section = document.createElement('section');
			switch(e.type) {
				case 'section':
					inputs = [{ name: 'section', placeholder: 'Section Title...', required: 'required', value: e.main }];
					section.innerHTML = `<h5>${e.main}</h5><hr>`;
					mdString += `### ${e.main}\n\n`;
					txtString += `*${e.main}*\n\n`;
					break;
				case 'psalm':
					inputs = [
						{ name: 'title', placeholder: 'Psalm Title...', required: '', value: e.title },
						{ name: 'psalm', placeholder: 'Psalm...', required: 'required', value: e.main },
						{ name: 'notes', placeholder: 'Notes...', required: '', value: e.notes }
					];
					const blockquote = document.createElement('blockquote');
					if (e.title) {
						blockquote.innerHTML += `<header><h6>${e.title}</h6></header>`;
						mdString += `> **${e.title}**  \n`;
						txtString += `${e.title}\n`;
					}
					blockquote.innerHTML += `<a class="list-psalm-link secondary">${e.main}</a>`;
					mdString += `> ${e.main.split('|')[0]}  \n`;
					txtString += `- ${e.main.split('|')[0]}\n`;
					if (e.notes) {
						blockquote.innerHTML += `<footer><cite>${e.notes}</cite></footer>`;
						mdString += `> *${e.notes}*  \n`;
						txtString += `- ${e.notes}\n`;
					}
					mdString += "\n";
					txtString += "\n";
					section.append(blockquote);
					break;
				default:
					console.error('Invalid list element type', e);
					return;
			}
			listFormElements.append(createListElement(e.type, inputs));
			listViewElements.append(section);
		});
		listDownloadMd.download = `${list.id}.md`;
		listDownloadMd.href = `${URL.createObjectURL(new Blob([mdString]))}`;
		listDownloadTxt.download = `${list.id}.txt`;
		listDownloadTxt.href = `${URL.createObjectURL(new Blob([txtString]))}`;
		const listCopyMd = document.getElementById('copy-md');
		const listCopyTxt = document.getElementById('copy-txt');
		const listCopyLink = document.getElementById('copy-link');
		const newListCopyMd = listCopyMd.cloneNode(true);
		const newListCopyTxt = listCopyTxt.cloneNode(true);
		const newListCopyLink = listCopyLink.cloneNode(true);
		newListCopyMd.addEventListener('click', (e) => { toClipboard(mdString); });
		newListCopyTxt.addEventListener('click', (e) => { toClipboard(txtString); });
		newListCopyLink.addEventListener('click', (e) => { toClipboard(window.location.href); });
		listCopyMd.parentNode.replaceChild(newListCopyMd, listCopyMd);
		listCopyTxt.parentNode.replaceChild(newListCopyTxt, listCopyTxt);
		listCopyLink.parentNode.replaceChild(newListCopyLink, listCopyLink);
		Sortable.create(listFormElements, {
			handle: '.sort-move',
			animation: 150
		});
	}
	if (pb.authStore.record && pb.authStore.record.id === list.user_id) {
		listButtons.classList.remove('hide');
	}
	listDiv.classList.remove('hide');
}

// Render psalm links
async function renderPsalmLinks() {
	const psalmLinks = document.querySelectorAll('.list-psalm-link');
	fetch("/static/index.json")
		.then(response => response.json())
		.then(data => {
			psalmLinks.forEach((l) => {
				for (let i = 0; i < data.length; i++) {
					if (data[i].title == l.textContent.split("|")[0] && data[i].lang == l.textContent.split("|")[1]) {
						l.textContent = data[i].title;
						l.href = `/${data[i].lang}/${data[i].slug}/`;
						l.target = '_blank';
						l.classList.remove('secondary');
						break;
					}
				}
			})
		})
		.catch(error => {
			console.error('Error fetching psalm links:', error)
		});
}

// FETCH ----------------------------------------------------------------------

// Fetch list
async function fetchList() {
	listError.classList.add('hide');
	listDiv.classList.add('hide');
	listButtons.classList.add('hide');

	try {
		const list = await pb.collection('res_lists').getOne(getUrlParam('id'));
		// renderPsalmOptions();
		renderList(list);
		renderPsalmLinks();
	} catch (error) {
		console.error(error);
		document.querySelectorAll('.list-clear').forEach((e) => e.innerHTML = '');
		listError.classList.remove('hide');
	}
}

// LIST FORM ------------------------------------------------------------------

// Open the edit list form
function openListEdit() {
	listView.forEach((e) => e.classList.add('hide'));
	listForm.classList.remove('hide');
	listCancel.classList.remove('hide');
	listEdit.classList.add('hide');
	listSubmit.classList.remove('hide');
	listDelete.classList.remove('hide');
}

// Close the edit list form
function closeListEdit() {
	listView.forEach((e) => e.classList.remove('hide'));
	listForm.classList.add('hide');
	listCancel.classList.add('hide');
	listEdit.classList.remove('hide');
	listSubmit.classList.add('hide');
	listDelete.classList.add('hide');
}

// List Form
listForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	listError.classList.add('hide');
	listSubmit.setAttribute('aria-busy', 'true');
	let psalmData = await psalmOptions;

	try {
		if (!isBetween(listFormName.value, 100))
			throw new Error('List title must be between 1 and 100 characters');
		let content = {list:[]};
		let orderCount = 1;
		const listElements = listForm.querySelectorAll('.list-element');
		listElements.forEach((ele) => {
			let elementType = ele.dataset.type;
			let elementMain = ele.querySelector(`.list-element-${ele.dataset.type}`).value;
			let elementTitle = '';
			let elementNotes = '';
			if (!isBetween(elementMain, 100)) {
				console.error('Text out of range', ele, elementMain, ele.querySelector(`.list-element-${ele.dataset.type}`));
				throw new Error(`${ele.dataset.type} must be between 1 and 100 characters`);
			}
			if (ele.dataset.type == 'psalm') {
				if (!psalmData.includes(elementMain)) throw new Error(`Invalid psalm '${elementMain}'. Please use the dropdown to select the psalm.`);
				elementTitle = ele.querySelector('.list-element-title').value;
				elementNotes = ele.querySelector('.list-element-notes').value;
			}
			content.list.push({
				type: elementType,
				main: elementMain,
				title: elementTitle,
				notes: elementNotes,
				order: orderCount
			});
			orderCount += 1;
		});
		const result = await pb.collection('res_lists').update(getUrlParam('id'), {
			user_id: pb.authStore.record.id,
			name: listFormName.value,
			public: listFormPublic.checked,
			content: content
		});
		listSubmit.setAttribute('aria-busy', 'false');
		openModal(saveModal);
		closeListEdit();
		fetchList();
	} catch (error) {
		listError.textContent = getFullErrorMessage(error);
		listSubmit.setAttribute('aria-busy', 'false');
		listError.classList.remove('hide');
		window.scrollTo(0, 0);
	}
});

// Delete list
async function deleteList() {
	listDelete.setAttribute('aria-busy', 'true');
	try {
		await pb.collection('res_lists').delete(getUrlParam('id'));
		setTimeout(() => {
			window.location.replace("/account/lists/");
		}, 1000);
	} catch(error) {
		listDelete.setAttribute('aria-busy', 'false');
		listDeleteError.textContent = getFullErrorMessage(error);
		listDeleteError.classList.remove('hide');
	}
}

// AUTCOMPLETE ----------------------------------------------------------------

// Autocomplete psalm inputs
async function autocomplete(e) {
	const inputPsalmOptions = e.currentTarget.parentNode.querySelector('.list-psalm-options');
	const query = e.currentTarget.value.toLowerCase().trim();
	if (query) {
		const data = await psalmOptions;
		const filteredPsalms = data.filter(psalm =>
			psalm.toLowerCase().includes(query)
		);
		if (filteredPsalms.length) {
			inputPsalmOptions.innerHTML = '';
			filteredPsalms.sort()
			filteredPsalms.forEach(psalm => {
				const li = document.createElement('li');
				li.textContent = psalm;
				li.addEventListener('click', selectPsalmOption);
				li.addEventListener('mouseover', selectPsalmMouseover);
				inputPsalmOptions.appendChild(li);
			});
			inputPsalmOptions.classList.remove('hide');
		} else inputPsalmOptions.classList.add('hide');
	} else inputPsalmOptions.classList.add('hide');
}

// Select a psalm option
function selectPsalmOption(e) {
	const target = e.currentTarget ? e.currentTarget : e;
	target.parentNode.parentNode.querySelector('input').value = target.textContent;
	target.parentNode.classList.add('hide');
	target.parentNode.innerHTML = '';
}

// Key events for psalm option selection
function autocompleteKeydown(e) {
	const items = e.currentTarget.parentNode.querySelector('ul').querySelectorAll('li');
	if (items.length === 0) return;
	let index = Array.from(items).findIndex(item => item.classList.contains('selected'));
	if (e.key === 'ArrowDown') {
		e.preventDefault();
		if (index < items.length - 1) {
			items[index]?.classList.remove('selected');
			items[index + 1].classList.add('selected');
			items[index + 1].scrollIntoView({ block: 'nearest' });
		}
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();
		if (index > 0) {
			items[index].classList.remove('selected');
			items[index - 1].classList.add('selected');
			items[index - 1].scrollIntoView({ block: 'nearest' });
		}
	} else if (e.key === 'Escape') {
		e.preventDefault();
		e.currentTarget.parentNode.querySelector('ul').classList.add('hide');
	} else if ((e.key === 'Enter' || e.key === 'Tab') && index >= 0) {
		e.preventDefault();
		selectPsalmOption(items[index]);
	}
}

// Select psalm option on mouseover
function selectPsalmMouseover(e) {
	e.currentTarget.parentNode.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
	e.currentTarget.classList.add('selected');
}

// Close autocomplete psalm options when clicked outside
document.addEventListener('click', (e) => {
	listForm.querySelectorAll('.list-element-psalm').forEach((input) => {
		if (input.contains(e.target)) return;
	});
	listForm.querySelectorAll('.list-psalm-options').forEach((ul) => {
		if (ul.contains(e.target)) return;
	});
	listForm.querySelectorAll('.list-psalm-options').forEach((ul) => {
		ul.classList.add('hide');
	});
});

// MAIN -----------------------------------------------------------------------

// Fetch list on authentication change
document.addEventListener('authChange', (event) => {
	fetchList();
});

fetchList();
