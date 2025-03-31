ICONS = {
	"play": '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="eplayer-icon eplayer-icon-play" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg>',
	"pause": '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="eplayer-icon eplayer-icon-pause" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/></svg>',
	"rewind": '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="eplayer-icon eplayer-icon-rewind" viewBox="0 0 16 16"><path d="M8.404 7.304a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696z"/><path d="M.404 7.304a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696z"/></svg>',
	"forward": '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="eplayer-icon eplayer-icon-forward" viewBox="0 0 16 16"><path d="M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696z"/><path d="M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696z"/></svg>',
	"ahead": '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="eplayer-icon eplayer-icon-ahead" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/></svg>',
	"back": '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="eplayer-icon eplayer-icon-back" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/></svg>'
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
	#eplayerAhead = document.createElement('div');
	#eplayerAheadNum = document.createElement('div');
	#eplayerIconAhead = document.createElement('div');
	#eplayerBack = document.createElement('div');
	#eplayerBackNum = document.createElement('div');
	#eplayerIconBack = document.createElement('div');
	#eplayerTimeline = document.createElement('div');
	#eplayerTimeCurrent = document.createElement('span');
	#eplayerProgress = document.createElement('input');
	#eplayerTimeDuration = document.createElement('span');
	#eplayerAudio = document.createElement('audio');
	#eplayerMousedown = false;
	#eplayerInterval = null;

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
		this.#eplayerRewind.classList.add('eplayer-skim-btn');
		this.#eplayerRewind.classList.add('eplayer-icon-btn');
		this.#eplayerRewind.dataset.seek = '-1';
		this.#eplayerIconRewind.classList.add('eplayer-icon');
		this.#eplayerIconRewind.innerHTML = ICONS['rewind'];

		// FORWARD BUTTON
		this.#eplayerForward.classList.add('eplayer-forward-btn');
		this.#eplayerForward.classList.add('eplayer-skim-btn');
		this.#eplayerForward.classList.add('eplayer-icon-btn');
		this.#eplayerForward.dataset.seek = '1';
		this.#eplayerIconForward.classList.add('eplayer-icon');
		this.#eplayerIconForward.innerHTML = ICONS['forward'];

		// AHEAD BUTTON
		this.#eplayerAhead.classList.add('eplayer-ahead-btn');
		this.#eplayerAhead.classList.add('eplayer-seek-btn');
		this.#eplayerAhead.classList.add('eplayer-icon-btn');
		this.#eplayerAhead.dataset.seek = '10';
		this.#eplayerIconAhead.classList.add('eplayer-icon');
		this.#eplayerIconAhead.innerHTML = ICONS['ahead'];
		this.#eplayerAheadNum.classList.add('eplayer-ahead-btn-num');
		this.#eplayerAheadNum.classList.add('eplayer-seek-btn-num');
		this.#eplayerAheadNum.textContent = Math.abs(parseInt(this.#eplayerAhead.dataset.seek));

		// BACK BUTTON
		this.#eplayerBack.classList.add('eplayer-back-btn');
		this.#eplayerBack.classList.add('eplayer-seek-btn');
		this.#eplayerBack.classList.add('eplayer-icon-btn');
		this.#eplayerBack.dataset.seek = '-10';
		this.#eplayerIconBack.classList.add('eplayer-icon');
		this.#eplayerIconBack.innerHTML = ICONS['back'];
		this.#eplayerBackNum.classList.add('eplayer-back-btn-num');
		this.#eplayerBackNum.classList.add('eplayer-seek-btn-num');
		this.#eplayerBackNum.textContent = Math.abs(parseInt(this.#eplayerBack.dataset.seek));

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

		this.#eplayerAhead.appendChild(this.#eplayerIconAhead);
		this.#eplayerAhead.appendChild(this.#eplayerAheadNum);
		this.#eplayerBack.appendChild(this.#eplayerIconBack);
		this.#eplayerBack.appendChild(this.#eplayerBackNum);

		this.#eplayerControls.appendChild(this.#eplayerBack);
		this.#eplayerControls.appendChild(this.#eplayerRewind);
		this.#eplayerControls.appendChild(this.#eplayerPlay);
		this.#eplayerControls.appendChild(this.#eplayerForward);
		this.#eplayerControls.appendChild(this.#eplayerAhead);

		let eplayerDiv = document.querySelector("." + eplayerClass);
		eplayerDiv.appendChild(this.#eplayerControls);
		eplayerDiv.appendChild(this.#eplayerTimeline);
		eplayerDiv.appendChild(this.#eplayerAudio);

		if(eplayerDiv.dataset.src && eplayerDiv.dataset.type) {
			this.load(eplayerDiv.dataset.src, eplayerDiv.dataset.type);
		}

		// EVENT LISTENERS
		this.#eplayerPlay.addEventListener("click", this.playPause.bind(this));
		this.#eplayerRewind.addEventListener("mousedown", this.#skim.bind(this));
		this.#eplayerForward.addEventListener("mousedown", this.#skim.bind(this));
		this.#eplayerRewind.addEventListener("mouseup", this.#stopSkim.bind(this));
		this.#eplayerForward.addEventListener("mouseup", this.#stopSkim.bind(this));
		this.#eplayerRewind.addEventListener("mouseleave", this.#stopSkim.bind(this));
		this.#eplayerForward.addEventListener("mouseleave", this.#stopSkim.bind(this));
		this.#eplayerAhead.addEventListener("click", this.seek.bind(this));
		this.#eplayerBack.addEventListener("click", this.seek.bind(this));

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

	#skim(e) {
		let seekSeconds = 0;
		if (e.target) {
			seekSeconds = parseInt(e.target.dataset.seek);
		}
		this.#eplayerInterval = setInterval(() => {
			this.#eplayerAudio.currentTime += seekSeconds;
        }, 100);
	}

	#stopSkim(e) {
		clearInterval(this.#eplayerInterval);
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
