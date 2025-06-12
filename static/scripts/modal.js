// Config
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const scrollbarWidthCssVar = "--pico-scrollbar-width";
const animationDuration = 400; // ms
let visibleModal = null;

// Toggle modal
const toggleModal = (event) => {
	event.preventDefault();
	document.querySelectorAll('dialog').forEach((m) => {
		if (m.open) closeModal(m);
	});
	const modal = document.getElementById(event.currentTarget.dataset.target);
	if (!modal) return;
	modal && (modal.open ? closeModal(modal) : openModal(modal));
};

// Open modal
const openModal = (modal) => {
	const { documentElement: html } = document;
	const scrollbarWidth = getScrollbarWidth();
	if (scrollbarWidth) {
		html.style.setProperty(scrollbarWidthCssVar, `${scrollbarWidth}px`);
	}
	html.classList.add(isOpenClass, openingClass);
	setTimeout(() => {
		visibleModal = modal;
		html.classList.remove(openingClass);
	}, animationDuration);
	modal.showModal();
	const modalInput = modal.querySelector('.modal-focus');
	if (modalInput) modalInput.focus();
};

// Close modal
const closeModal = (modal) => {
	visibleModal = null;
	const { documentElement: html } = document;
	html.classList.add(closingClass);
	setTimeout(() => {
		html.classList.remove(closingClass, isOpenClass);
		html.style.removeProperty(scrollbarWidthCssVar);
		modalForm = modal.querySelector('form');
		if (modalForm && modalForm.dataset.reset)
			modalForm.reset();
		modal.close();
	}, animationDuration);
};

// Close with a click outside
document.addEventListener("click", (event) => {
	if (visibleModal === null) return;
	const modalContent = visibleModal.querySelector("article");
	const isClickInside = modalContent.contains(event.target);
	!isClickInside && closeModal(visibleModal);
});

// Close with Esc key
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && visibleModal) {
		closeModal(visibleModal);
	}
});

// Get scrollbar width
const getScrollbarWidth = () => {
	const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
	return scrollbarWidth;
};

// Is scrollbar visible
const isScrollbarVisible = () => {
	return document.body.scrollHeight > screen.height;
};
