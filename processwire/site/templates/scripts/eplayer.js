ICONS = {
	"play": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eplayer-icon eplayer-icon-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
	"pause": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eplayer-icon eplayer-icon-pause"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
	"rewind": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eplayer-icon eplayer-icon-rewind"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>',
	"forward": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eplayer-icon eplayer-icon-forward"><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg>'
}

class EPlayer {

	#eplayerControls = document.createElement('div');
	#eplayerPlay = document.createElement('button');
	#eplayerIconPlay = document.createElement('div');
	#eplayerIconPause = document.createElement('div');
	#eplayerRewind = document.createElement('div');
	#eplayerIconRewind = document.createElement('div');
	#eplayerForward = document.createElement('div');
	#eplayerIconForward = document.createElement('div');
	#eplayerTimeline = document.createElement('div');
	#eplayerTimeCurrent = document.createElement('span');
	#eplayerProgress = document.createElement('input');
	#eplayerTimeDuration = document.createElement('span');
	#eplayerAudio = document.createElement('audio');
	#eplayerMousedown = false;

	constructor(eplayerClass='eplayer') {

		// PLAYER CONTROLS WRAPPER
		this.#eplayerControls.classList.add('eplayer-controls');

		// PLAY BUTTON
		this.#eplayerPlay.classList.add('eplayer-play-btn');
		this.#eplayerPlay.classList.add('eplayer-icon-btn');
		this.#eplayerPlay.role = 'button';
		this.#eplayerPlay.dataset.playing = 'false';

		// PLAY ICON
		this.#eplayerIconPlay.classList.add('eplayer-icon-play');
		this.#eplayerIconPlay.classList.add('eplayer-icon');
		this.#eplayerIconPlay.innerHTML = ICONS['play'];

		// PAUSE ICON
		this.#eplayerIconPause.classList.add('eplayer-icon-pause');
		this.#eplayerIconPause.classList.add('eplayer-icon');
		this.#eplayerIconPause.classList.add('eplayer-hidden');
		this.#eplayerIconPause.innerHTML = ICONS['pause'];

		// REWIND BUTTON
		this.#eplayerRewind.classList.add('eplayer-rewind-btn');
		this.#eplayerRewind.classList.add('eplayer-seek-btn');
		this.#eplayerRewind.classList.add('eplayer-icon-btn');
		this.#eplayerRewind.dataset.seek = '-10';
		this.#eplayerIconRewind.classList.add('eplayer-icon');
		this.#eplayerIconRewind.innerHTML = ICONS['rewind'];

		// FORWARD BUTTON
		this.#eplayerForward.classList.add('eplayer-forward-btn');
		this.#eplayerForward.classList.add('eplayer-seek-btn');
		this.#eplayerForward.classList.add('eplayer-icon-btn');
		this.#eplayerForward.dataset.seek = '10';
		this.#eplayerIconForward.classList.add('eplayer-icon');
		this.#eplayerIconForward.innerHTML = ICONS['forward'];

		// TIMELINE
		this.#eplayerTimeline.classList.add('eplayer-timeline');

		// CURRENT TIME
		this.#eplayerTimeCurrent.classList.add('eplayer-time');
		this.#eplayerTimeCurrent.classList.add('eplayer-time-current');
		this.#eplayerTimeCurrent.textContent = '00:00';

		// PLAYER PROGRESS
		this.#eplayerProgress.classList.add('eplayer-progress');
		this.#eplayerProgress.type = 'range';
		this.#eplayerProgress.id = 'progress';
		this.#eplayerProgress.min = '0';
		this.#eplayerProgress.max = '100';
		this.#eplayerProgress.step = '1';
		this.#eplayerProgress.value = '0';
		this.#eplayerProgress.style.setProperty('--value', this.#eplayerProgress.value);
		this.#eplayerProgress.style.setProperty('--min', this.#eplayerProgress.min);
		this.#eplayerProgress.style.setProperty('--max', this.#eplayerProgress.max);

		// DURATION
		this.#eplayerTimeDuration.classList.add('eplayer-time');
		this.#eplayerTimeDuration.classList.add('eplayer-time-duration');
		this.#eplayerTimeDuration.textContent = '00:00';

		this.#eplayerTimeline.appendChild(this.#eplayerTimeCurrent);
		this.#eplayerTimeline.appendChild(this.#eplayerProgress);
		this.#eplayerTimeline.appendChild(this.#eplayerTimeDuration);

		this.#eplayerPlay.appendChild(this.#eplayerIconPlay);
		this.#eplayerPlay.appendChild(this.#eplayerIconPause);

		this.#eplayerRewind.appendChild(this.#eplayerIconRewind);
		this.#eplayerForward.appendChild(this.#eplayerIconForward);

		this.#eplayerControls.appendChild(this.#eplayerRewind);
		this.#eplayerControls.appendChild(this.#eplayerPlay);
		this.#eplayerControls.appendChild(this.#eplayerForward);

		let eplayerDiv = document.querySelector("." + eplayerClass);
		eplayerDiv.appendChild(this.#eplayerControls);
		eplayerDiv.appendChild(this.#eplayerTimeline);
		eplayerDiv.appendChild(this.#eplayerAudio);

		if(eplayerDiv.dataset.src && eplayerDiv.dataset.type) {
			this.load(eplayerDiv.dataset.src, eplayerDiv.dataset.type);
		}

		// EVENT LISTENERS
		this.#eplayerPlay.addEventListener("click", this.playPause.bind(this));
		this.#eplayerRewind.addEventListener("click", this.seek.bind(this));
		this.#eplayerForward.addEventListener("click", this.seek.bind(this));

		this.#eplayerAudio.addEventListener("timeupdate", (e) => {
			if(!this.#eplayerMousedown) {
				this.#progressUpdate();
				this.#setTimes();
			}
		});

		this.#eplayerProgress.addEventListener("change", this.#scrub.bind(this));
		this.#eplayerProgress.addEventListener("mousedown", () => (this.#eplayerMousedown = true));
		this.#eplayerProgress.addEventListener("mouseup", () => (this.#eplayerMousedown = false));
		this.#eplayerProgress.addEventListener('input', (e) => this.#eplayerProgress.style.setProperty('--value', e.target.value));
	}

	playPause() {
		if(this.#eplayerPlay.dataset.playing === "false") {
			this.#eplayerAudio.play();
			this.#eplayerPlay.dataset.playing = "true";
			this.#eplayerIconPlay.classList.add("eplayer-hidden");
			this.#eplayerIconPause.classList.remove("eplayer-hidden");
		} else if(this.#eplayerPlay.dataset.playing === "true") {
			this.#eplayerAudio.pause();
			this.#eplayerPlay.dataset.playing = "false";
			this.#eplayerIconPause.classList.add("eplayer-hidden");
			this.#eplayerIconPlay.classList.remove("eplayer-hidden");
		}
	}

	play() {
		this.#eplayerAudio.play();
		this.#eplayerPlay.dataset.playing = "true";
		this.#eplayerIconPlay.classList.add("eplayer-hidden");
		this.#eplayerIconPause.classList.remove("eplayer-hidden");
	}

	pause() {
		this.#eplayerAudio.pause();
		this.#eplayerPlay.dataset.playing = "false";
		this.#eplayerIconPause.classList.add("eplayer-hidden");
		this.#eplayerIconPlay.classList.remove("eplayer-hidden");
	}

	stop() {
		this.#eplayerAudio.pause();
		this.#eplayerPlay.dataset.playing = "false";
		this.#eplayerIconPause.classList.add("eplayer-hidden");
		this.#eplayerIconPlay.classList.remove("eplayer-hidden");
		this.#eplayerProgress.value = '0';
		this.#eplayerAudio.currentTime = 0;
	}

	load(file, type) {
		this.stop();
		this.#eplayerAudio.textContent = '';
		const playerSource = document.createElement('source');
		playerSource.src = file;
		playerSource.type = type;
		this.#eplayerAudio.replaceChildren(playerSource);
		this.#eplayerAudio.load();
		this.#eplayerProgress.value = '0';
		this.#progressUpdate();
		this.#setTimes();
	}

	seek(e) {
		let seekSeconds = 0;
		if(e.target) {
			seekSeconds = parseInt(e.target.dataset.seek);
		}
		else {
			seekSeconds = e;
		}
		this.#eplayerAudio.currentTime += seekSeconds;
	}

	#progressUpdate() {
		const percent = (this.#eplayerAudio.currentTime / this.#eplayerAudio.duration) * 100;
		this.#eplayerProgress.value = percent ? percent : '0';
		this.#eplayerProgress.style.setProperty('--value', this.#eplayerProgress.value);
		if (percent > 99.9) this.stop();
	}

	#setTimes() {
		if(this.#eplayerAudio.duration) {
			this.#eplayerTimeCurrent.textContent = new Date(this.#eplayerAudio.currentTime * 1000).toISOString().substr(14, 5);
			this.#eplayerTimeDuration.textContent = new Date(this.#eplayerAudio.duration * 1000).toISOString().substr(14, 5);
		} else {
			this.#eplayerTimeCurrent.textContent = "00:00";
			this.#eplayerTimeDuration.textContent = "00:00";
		}
	}

	#scrub(e) {
		const scrubTime = e.target.value / 100;
		this.#eplayerAudio.currentTime = (this.#eplayerAudio.duration || 0) * scrubTime;
	}
}
