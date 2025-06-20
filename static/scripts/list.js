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
const listPsalms = document.getElementById('list-psalms');
const listDownloadMd = document.getElementById('download-md');
const listDownloadTxt = document.getElementById('download-txt');
const saveModal = document.getElementById('save-modal');

function createListElement(type, inputs) {
	listCount[type] += 1;
	const element = document.createElement('div');
	element.classList.add('list-element', 'flex', 'align-center', 'gap-xxs', 'py-xs', `list-${type}`);
	element.dataset.type = type;
	const fieldset = document.createElement('fieldset');
	fieldset.classList.add('mb-0');
	const deleteBtn = document.createElement('button');
	deleteBtn.classList.add('secondary');
	deleteBtn.addEventListener('click', removeListElement);
	deleteBtn.innerHTML = `<svg width="1.0em" height="1.0em"><use xlink:href="#icon-trash"/></svg>`;
	const dragBtn = document.createElement('button');
	dragBtn.classList.add('sort-move', 'outline', 'secondary', 'height-100');
	dragBtn.innerHTML = `<svg width="1.0em" height="1.0em"><use xlink:href="#icon-move"/></svg>`;
	inputs.forEach((i) => {
		fieldset.innerHTML += `
			<input id="list-element-${i.name}-${listCount[type]}"
				name="list-element-${i.name}-${listCount[type]}"
				class="list-element-${i.name} last-child-mb-0"
				list="${i.list}"
				type="text"
				value="${i.value}"
				autocomplete="off"
				placeholder="${i.placeholder}" ${i.required}/>`;
	});
	element.append(dragBtn);
	element.append(fieldset);
	element.append(deleteBtn);
	return element;
}

let listCount = { psalm: 0, section: 0 };

function getUrlParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

function removeListElement(e) {
	e.preventDefault();
	listCount[e.currentTarget.parentNode.dataset.type] -= 1;
	e.currentTarget.parentNode.remove();
}

function addListElement(e) {
	e.preventDefault();
	let inputs = null;
	switch(listFormAddOptions.value) {
		case 'section':
			inputs = [{ name: 'section', placeholder: 'Section Title...', required: 'required', value: '', list: '' }];
			break;
		case 'psalm':
			inputs = [
				{ name: 'title', placeholder: 'Psalm Title...', required: '', value: '', list: '' },
				{ name: 'psalm', placeholder: 'Psalm...', required: 'required', value: '', list: 'list-psalms' },
				{ name: 'notes', placeholder: 'Notes...', required: '', value: '', list: '' }
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
					inputs = [{ name: 'section', placeholder: 'Section Title...', required: 'required', value: e.main, list: '' }];
					section.innerHTML = `<h5>${e.main}</h5><hr>`;
					mdString += `### ${e.main}\n\n`;
					txtString += `*${e.main}*\n\n`;
					break;
				case 'psalm':
					inputs = [
						{ name: 'title', placeholder: 'Psalm Title...', required: '', value: e.title, list: '' },
						{ name: 'psalm', placeholder: 'Psalm...', required: 'required', value: e.main, list: 'list-psalms' },
						{ name: 'notes', placeholder: 'Notes...', required: '', value: e.notes, list: '' }
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
		const newListCopyMd = listCopyMd.cloneNode(true);
		const newListCopyTxt = listCopyTxt.cloneNode(true);
		newListCopyMd.addEventListener('click', (e) => { toClipboard(mdString); });
		newListCopyTxt.addEventListener('click', (e) => { toClipboard(txtString); });
		listCopyMd.parentNode.replaceChild(newListCopyMd, listCopyMd);
		listCopyTxt.parentNode.replaceChild(newListCopyTxt, listCopyTxt);
	}
	if (pb.authStore.record && pb.authStore.record.id === list.user_id) {
		listButtons.classList.remove('hide');
	}
	listDiv.classList.remove('hide');
}

async function renderPsalmOptions() {
	listPsalms.innerHTML = '';
	fetch("/static/index.json")
		.then(response => response.json())
		.then(data => {
			data.forEach((p) => {
				const option = document.createElement('option');
				option.value = `${p.title}|${p.lang}`;
				listPsalms.append(option);
			})
		})
		.catch(error => {
			console.error('Error loading search index:', error)
		});
}

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

async function fetchList() {
	listError.classList.add('hide');
	listDiv.classList.add('hide');
	listButtons.classList.add('hide');

	try {
		const list = await pb.collection('res_lists').getOne(getUrlParam('id'));
		renderPsalmOptions();
		renderList(list);
		renderPsalmLinks();
	} catch (error) {
		console.error(error);
		document.querySelectorAll('.list-clear').forEach((e) => e.innerHTML = '');
		listError.classList.remove('hide');
	}
}

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
				let psalmFound = false;
				listPsalms.querySelectorAll('option').forEach((o) => {
					if (o.value == elementMain) {
						psalmFound = true;
					}
				});
				if (!psalmFound) throw new Error(`Invalid psalm ${elementMain}. Please use the dropdown to select the psalm.`);
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

async function deleteList() {
	listDelete.setAttribute('aria-busy', 'true');
	try {
		await pb.collection('res_lists').delete(getUrlParam('id'));
		setTimeout(() => {
			window.location.replace("/account/");
		}, 1000);
	} catch(error) {
		listDelete.setAttribute('aria-busy', 'false');
		listDeleteError.textContent = getFullErrorMessage(error);
		listDeleteError.classList.remove('hide');
	}
}

document.addEventListener('authChange', (event) => {
	fetchList();
});

fetchList();
