teMgr = {
	controllers: [],

	initControllers: function (elements, subControllers) {
		var self = this;
		if (document.readyState == 'loading') {
			document.addEventListener('DOMContentLoaded', function () {
				self.initControllers(elements, subControllers);
			});
		} else {
			if (elements instanceof Element) elements = [elements];
			else if (!(Array.isArray(elements)) && !(elements instanceof NodeList)) elements = this.queryAll(elements);
			Array.prototype.forEach.call(elements, function (element) {
				self.initController(element, subControllers);
			});
		}
	},

	initController: function (element, subControllers) {
		try {
			var ctrl = new TEController(element, subControllers);
			this.controllers.push(ctrl);
			return ctrl;
		} catch (e) {
			console.error('initController:', e);
		}
	},

	getController: function (element) {
		for (var ctrl, i = 0; i < this.controllers.length, ctrl = this.controllers[i]; i++) {
			if (ctrl.element == element || ctrl.container == element || ctrl.container.contains(element)) return ctrl;
		}
		return null;
	},

	getSubController: function (element, classNames) {
		var ctrl = this.getController(element);
		if (ctrl) return ctrl.getSubController(classNames);
		return null;
	},

	getSubControllers: function (element, classNames) {
		var ctrl = this.getController(element);
		if (ctrl) return ctrl.getSubControllers(classNames);
		return [];
	},

	query: function (classNames, context) {
		var context = context || document;
		return context.querySelector(classNames);
	},

	queryAll: function (classNames, context) {
		var context = context || document;
		return Array.prototype.slice.call(context.querySelectorAll(classNames));
	},

	matches: function (element, classNames) {
		var matches = element.matches || element.msMatchesSelector;
		return matches.call(element, classNames);
	},

	formatTime: function (time) {
		time = Number(time);
		var h = Math.floor(time / 3600);
		var m = Math.floor(time % 3600 / 60);
		var s = Math.floor(time % 3600 % 60);
		return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
	},

	scPortalRenderer: {
		name: 'native_scportal',
		options: {
			prefix: 'native_scportal'
		},
		credentials: "same-origin",

		canPlayType: function (type) {
			return ['video/x-scportal', 'audio/x-scportal'].indexOf(type.toLowerCase()) > -1
		},

		create: function (mediaElement, options, mediaFiles) {
			var hlsRenderer, html5Renderer, subRenderer;

			function showHtml5Renderer() {
				if (!html5Renderer) html5Renderer = mejs.Renderers.renderers['html5'].create(mediaElement, {prefix: 'html5'}, []);
				mediaElement.renderer = html5Renderer;
				mediaElement.renderer.show();
			}

			var renderer = {
				hide: () => {
					if (subRenderer) subRenderer.hide();
				},
				show: () => {
					if (subRenderer) subRenderer.show();
				},
				setSrc: async (src) => {
					function fallback(e) {
						console.error("Unable to initialize the scPortal renderer");
						if (e) console.error(e);
						showHtml5Renderer();
						html5Renderer.setSrc(src);
					}

					try {
						const mediaManifestUrl = new URL(src);
						mediaManifestUrl.pathname +=  "/:api:/v1/media";
						mediaManifestUrl.search = mediaManifestUrl.hash = "";
						const mediaManifestResp = await fetch(mediaManifestUrl.href, {credentials: this.credentials, cache: "no-cache"});
						const mediaManifest = await mediaManifestResp.json();

						var adaptStreamSrc;
						var videoSources = [];
						var audioSources = [];
						for (var i = 0; i < mediaManifest.sources.length; i++) {
							var source = mediaManifest.sources[i];
							if (source.type == "application/vnd.apple.mpegurl") {
								adaptStreamSrc = source;
								break;
							} else {
								if (source.height) videoSources.push(source);
								if (source.type.startsWith("audio/")) audioSources.push(source);
							}
						}

						var adaptStreamSrc = mediaManifest.sources.filter(function (source) {
							return source.type == "application/vnd.apple.mpegurl";
						})[0];
						if (adaptStreamSrc) {
							if (!hlsRenderer) hlsRenderer = mejs.Renderers.renderers['native_hls'].create(mediaElement, {prefix: 'native_hls', hls: {}}, []);
							mediaElement.renderer.hide();
							mediaElement.renderer = hlsRenderer;
							mediaElement.renderer.show();
							mediaElement.renderer.setSrc(src + adaptStreamSrc.path);
						} else if (videoSources.length) {
							videoSources.sort(function (srcA, srcB) {
								return srcB.height - srcA.height
							});

							var defaultSrc = null;
							var qualities = [];
							for (var i = 0; i < videoSources.length; i++) {
								var source = videoSources[i];
								if (!defaultSrc && source.height <= 720) defaultSrc = source;
								if (videoSources.length > 1) qualities.push({label: source.label || (source.height + 'p'), value: source.path, type: source.type});
							}
							if (!defaultSrc) {
								fallback();
								return;
							}

							var quality = defaultSrc.path;
							showHtml5Renderer();

							html5Renderer.getQualities = function () {
								return qualities;
							}

							html5Renderer.getQuality = function () {
								return quality;
							}

							html5Renderer.setQuality = function (qual) {
								quality = qual;
								var playing = !mediaElement.paused;
								var currentTime = mediaElement.currentTime;
								html5Renderer.setSrc(src + qual);
								mediaElement.currentTime = currentTime;
								if (playing) mediaElement.play();
							}

							html5Renderer.setSrc(src + defaultSrc.path);
						} else if (audioSources.length) {
							showHtml5Renderer();
							for (var i = 0; i < audioSources.length; i++) {
								var audioSource = audioSources[i];
								if (html5Renderer.canPlayType(audioSource.type)) {
									html5Renderer.setSrc(src + audioSource.path);
									break;
								}
							}
						} else {
							fallback();
						}
					} catch (e) {
						fallback(e);
					}
				},
				getSrc: () => {
					return subRenderer ? subRenderer.getSrc() : null;
				},
				play: () => {
					if (subRenderer) subRenderer.play();
				},
				pause: () => {
					if (subRenderer) subRenderer.pause();
				}
			};
			renderer.setSrc(mediaFiles[0].src);
			return renderer;
		}
	},

	// Doit être appellé après l'initialisation du controlleur porteur du targetElem ou de l'ancre de la subWindow
	parseVTTTranscript: function (vttUrl, targetElem, anchor) {
		var trackElem = document.createElement('track');
		trackElem.src = vttUrl;
		trackElem.track.mode = "hidden";

		var win = anchor ? anchor.ownerDocument.defaultView : window;
		var ctrl = win.teMgr.getController(anchor || targetElem);
		if (!ctrl) throw new Error("Unable to find the temporal controller");

		var fragment = document.createDocumentFragment();
		return new Promise(function (resolve, reject) {
			trackElem.addEventListener('load', function () {
				var currentVoice = null;
				var currentPara = fragment.appendChild(document.createElement('p'));
				var cues = Array.from(trackElem.track.cues);
				var url = frameElement && frameElement.fWin ? new URL(window.parent.location) : window.location;

				cues.forEach(function (cue) {
					var cueElt = cue.getCueAsHTML();
					while (cueElt.firstChild) {
						var cuePartLinkElt = document.createElement('a');
						if (ctrl.getSubController(win.TEHashCtrl)) {
							url.hash = '#t=' + cue.startTime;
							cuePartLinkElt.href = url.toString();
							if (frameElement && frameElement.fWin) cuePartLinkElt.target = '_parent';
						} else {
							cuePartLinkElt.href = '#';
							cuePartLinkElt.onclick = function (event) {
								ctrl.media.currentTime = cue.startTime;
								event.preventDefault();
							}
						}
						cuePartLinkElt.className = 'txt_tcLink';

						var voice = cueElt.firstChild.localName == 'span' ? cueElt.firstChild.getAttribute('title') : null;
						if (voice != currentVoice) {
							currentPara = fragment.appendChild(document.createElement('p'));
							if (voice) {
								currentPara.appendChild(document.createTextNode(voice));
								currentPara.className = 'voice';
								currentPara = fragment.appendChild(document.createElement('p'));
							}
							currentVoice = voice;
						}
						cuePartLinkElt.appendChild(cueElt.firstChild);
						currentPara.appendChild(cuePartLinkElt);
						currentPara.appendChild(document.createTextNode(' '));
						resolve(fragment);
					}
				});
				targetElem.appendChild(fragment);
			});

			(ctrl.media.originalNode || ctrl.media).appendChild(trackElem);
		});
	}
};

TEController = function (element, subControllers) {
	var self = this;

	this.lastTimeUpdate = NaN;

	this.element = element;
	if (!this.element) throw "Temporal controller not found";
	this.subControllers = subControllers;

	this.queryPrefix = this.element.getAttribute('data-te-prefix') || '.te';

	var container = this.element.parentNode;
	while (container instanceof Element && !teMgr.matches(container, this.element.dataset.teContainer)) {
		container = container.parentNode;
	}
	if (container == document) container = document.body;
	this.container = container;

	var media = this.media = container.querySelector(this.element.dataset.teMedia || this.selector('media'));
	if (!media) throw "Media not found";

	this.updateMediaType();

	var seekInput = this.seekInput = this.query('seek');
	if (seekInput) {
		this.seekDragging = false;
		var seekInputTimeout = null;
		seekInput.addEventListener('input', function () {
			self.seekDragging = true;
			if (!seekInputTimeout) media.currentTime = parseFloat(this.value);
			seekInputTimeout = setTimeout(function () {
				seekInputTimeout = null;
			}, 200);
		}, false);
		seekInput.addEventListener('change', function () {
			self.seekDragging = false;
			media.currentTime = parseFloat(this.value);
		});
	}

	this.playPauseBtn = this.query('playPause');
	if (this.playPauseBtn) this.bindButton(this.playPauseBtn, this.playPause);
	this.bind(this.media, 'click', this.videoPlayPause);

	this.nextTimeBtn = this.query('nextTime');
	if (this.nextTimeBtn) this.bindButton(this.nextTimeBtn, this.nextTime);

	this.previousTimeBtn = this.query('previousTime');
	if (this.previousTimeBtn) this.bindButton(this.previousTimeBtn, this.previousTime);

	this.currentTimeLabel = this.query('currentTime');
	this.durationLabel = this.query('duration');

	this.muteBtn = this.query('mute');
	if (this.muteBtn) {
		this.muteBtn.addEventListener('click', function () {
			if (media.volume == 0) media.volume = 1;
			media.muted = !media.muted;
		});
	}
	this.volumeInput = this.query('volume');
	if (this.volumeInput) {
		function setVolume() {
			media.volume = self.volumeInput.value / 100;
			if (media.volume != 0) media.muted = false;
		}

		this.volumeInput.addEventListener('input', setVolume);
		this.volumeInput.addEventListener('change', setVolume);
	}

	this.bind(media, 'timeupdate', this.updateTime);
	this.bind(media, 'volumechange', this.updateVolume);
	this.bind(media, 'loadedmetadata', this.updateMediaType);
	this.bind(media, 'loadedmetadata', this.updateDuration);
	this.bind(media, 'durationchange', this.updateDuration);
	this.bind(media, 'loadedmetadata', this.updateVolume);
	['loadedmetadata', 'playing', 'pause', 'ended', 'seeking', 'seeked'].forEach(function (event) {
		self.bind(media, event, self.updatePlayingState);
	});

	var segments = teMgr.queryAll(this.element.dataset.teSegments || '[data-te-start],[data-te-segment-target]', this.container);
	this.segmentsData = new Map();
	for (var segment, i = 0; i < segments.length, segment = segments[i]; i++) {
		var target = segment.dataset.teSegmentTarget;
		var targetSegment, start, end;
		if (target) {
			targetSegment = document.getElementById(target);
			start = parseFloat(targetSegment.dataset.teStart);
			end = parseFloat(targetSegment.dataset.teEnd);
		} else {
			start = parseFloat(segment.dataset.teStart);
			end = parseFloat(segment.dataset.teEnd);
		}
		this.segmentsData.set(segment, {start: start, end: end});
	}
	this.segments = segments.sort(function (segment1, segment2) {
		var data1 = self.segmentsData.get(segment1);
		var data2 = self.segmentsData.get(segment2);
		return data1.start - data2.start;
	});

	var points = teMgr.queryAll(this.element.dataset.tePause || '[data-te-position],[data-te-point-target]', this.container);
	this.pointsData = new Map();
	for (var point, i = 0; i < points.length, point = points[i]; i++) {
		var target = point.dataset.tePointTarget;
		var targetPoint, position;
		if (target) {
			targetPoint = document.getElementById(target);
			position = parseFloat(targetPoint.dataset.tePosition);
		} else {
			position = parseFloat(point.dataset.tePosition);
		}
		var interactive = point.localName == 'a' || point.localName == 'button' || point.localName == 'input';
		this.pointsData.set(point, {position: position, interactive: interactive});

		if (interactive) {
			point.addEventListener('click', function (event) {
				media.currentTime = self.pointsData.get(this).position;
				event.preventDefault();
			})
		}
	}
	this.points = points.sort(function (point1, point2) {
		var data1 = self.pointsData.get(point1);
		var data2 = self.pointsData.get(point2);
		return data1.position - data2.position;
	});

	this.timelines = teMgr.queryAll(this.element.dataset.teTimelines || this.selector('timeline'), this.element);
	this.previousTimelineBtn = this.query('previousTimeline');
	this.nextTimelineBtn = this.query('nextTimeline');
	if (this.timelines.length) {
		if (this.previousTimelineBtn) this.bindButton(this.previousTimelineBtn, this.previousTimeline);
		if (this.nextTimelineBtn) this.bindButton(this.nextTimelineBtn, this.nextTimeline);
		this.selectTimeline(this.timelines[0]);
	} else {
		if (this.previousTimelineBtn) this.previousTimelineBtn.hidden = true;
		if (this.nextTimelineBtn) this.nextTimelineBtn.hidden = true;
		if (this.previousTimeBtn) this.previousTimeBtn.hidden = true;
		if (this.nextTimeBtn) this.nextTimeBtn.hidden = true;
	}

	if (this.subControllers) this.subControllers.forEach(function (subCtrl) {
		try {
			if (subCtrl.init) subCtrl.init(self);
		} catch (e) {
			console.error(subCtrl.constructor.name + '.init:', e);
		}
	});

	this.updateTime();
	this.subtitles = {};

	var readyCount = 2 /* dom, metadata */;

	function ready() {
		readyCount--;
		if (readyCount > 0) return;

		container.classList.add('teReady');
		if (self.subControllers) self.subControllers.forEach(function (subCtrl) {
			try {
				if (subCtrl.ready) subCtrl.ready(self);
			} catch (e) {
				console.error(subCtrl.constructor.name + '.ready:', e);
			}
		});

		self.initPressButtons();
	}

	if (media.readyState >= HTMLMediaElement.HAVE_METADATA) ready();
	else {
		function loadedmetadata() {
			media.removeEventListener('loadedmetadata', loadedmetadata);
			ready();
		}

		media.addEventListener('loadedmetadata', loadedmetadata);
	}

	if (document.readyState == 'complete') ready();
	else window.addEventListener('load', ready);
};

TEController.prototype = {
	getSubController: function (classNames) {
		for (var subCtrl, i = 0; i < this.subControllers.length, subCtrl = this.subControllers[i]; i++) {
			if (subCtrl instanceof classNames) return subCtrl;
		}
		return null;
	},

	getSubControllers: function (classNames) {
		var subCtrls = [];
		for (var subCtrl, i = 0; i < this.subControllers.length, subCtrl = this.subControllers[i]; i++) {
			if (subCtrl instanceof classNames) subCtrls.push(subCtrl);
		}
		return subCtrls;
	},

	selector: function (className) {
		return this.queryPrefix + className[0].toUpperCase() + className.substr(1);
	},

	query: function (className) {
		return teMgr.query(this.selector(className), this.element);
	},

	queryAll: function (className) {
		return teMgr.queryAll(this.selector(className), this.element);
	},

	bind: function (element, event, method) {
		var binded = method.bind(this);
		element.addEventListener(event, binded);
		return binded;
	},

	bindButton: function (button, method) {
		var binded = method.bind(this);
		button.addEventListener('click', binded);
		return binded;
	},

	dispatch: function (eventName, element) {
		if (this.subControllers) {
			for (var i = 0; i < this.subControllers.length; i++) {
				var subCtrl = this.subControllers[i];
				try {
					if (subCtrl[eventName]) {
						if (!element) subCtrl[eventName](this);
						else if (!subCtrl.handle || subCtrl.handle(element)) subCtrl[eventName](element, this);
					}
				} catch (e) {
					console.error(subCtrl.constructor.name + '.' + eventName + ':', e);
				}
			}
		}
	},

	updateTime: function () {
		var currentTime = this.media.currentTime;
		var formattedTime = teMgr.formatTime(currentTime);

		// Mise à jour du temps courant et du curseur de lecture
		if (this.currentTimeLabel) {
			this.currentTimeLabel.textContent = formattedTime;
		}
		if (this.seekInput && !this.seekDragging) {
			this.seekInput.value = currentTime;
			this.seekInput.setAttribute('value', currentTime);
			this.seekInput.setAttribute("aria-valuenow", currentTime);
			this.seekInput.setAttribute("aria-valuetext", formattedTime);
			this.seekInput.style.setProperty("--value", currentTime * 100 / this.media.duration + '%');

		}

		if (this.currentTimeline) {
			if (this.previousTimeBtn) this.previousTimeBtn.disabled = !this.currentTimes.length || currentTime <= this.currentTimes[0];
			if (this.nextTimeBtn) this.nextTimeBtn.disabled = !this.currentTimes.length || currentTime >= this.currentTimes[this.currentTimes.length - 1];
		}

		if (this.points.length || this.segments.length) this.updateStates();

		this.lastTimeUpdate = currentTime;
	},

	updateDuration: function () {
		var self = this;
		var duration = this.media.duration;
		if (duration == 0 || duration == Infinity) return;
		if (this.durationLabel) this.durationLabel.textContent = teMgr.formatTime(duration);
		if (this.seekInput) {
			this.seekInput.max = duration;
			this.seekInput.setAttribute("aria-valuemax", duration);
		}
		this.segments.forEach(function (segment) {
			var styles = segment.dataset.teStyles;
			if (styles) {
				styles = styles.split(' ');
				styles.forEach(function (style) {
					var data = self.segmentsData.get(segment);
					if (style == 'width') {
						segment.style.width = ((data.end - data.start) * 100 / duration) + '%';
					} else if (style == 'left' || style == 'margin-left') {
						segment.style[style] = (data.start * 100 / duration) + '%';
					}
				});
			}
		});
		this.points.forEach(function (point) {
			var styles = point.dataset.teStyles;
			if (styles) {
				styles = styles.split(' ');
				styles.forEach(function (style) {
					var data = self.pointsData.get(point);
					if (style == 'width') point.style.width = 0;
					else if (style == 'left' || style == 'margin-left') {
						point.style[style] = (data.position * 100 / duration) + '%';
					}
				});
			}
		});
	},

	updateMediaType: function () {
		var media = this.media.originalNode || this.media;
		var isNative = !this.media.renderer || /html5|native/i.test(this.media.rendererName);
		if (!isNative || media.videoWidth || media.poster) {
			this.container.classList.remove('teAudioType');
			this.container.classList.add('teVideoType');
		} else {
			this.container.classList.remove('teVideoType');
			this.container.classList.add('teAudioType');
		}
		if (media.videoHeight) {
			media.style.aspectRatio = media.videoWidth / media.videoHeight;
			this.container.classList.toggle("tePortrait", media.videoHeight > media.videoWidth);
		} else {
			media.style.aspectRatio = '';
			this.container.classList.remove("tePortrait");
		}
		if (!isNative) {
			this.media.classList.add('teNotNative');
		} else {
			this.media.classList.remove('teNotNative');
		}
	},

	updateVolume: function () {
		if (this.fadeInterval) return;
		if (this.muteBtn) {
			if (this.media.muted || this.media.volume == 0) {
				this.muteBtn.setAttribute('aria-pressed', true);
			} else {
				this.muteBtn.setAttribute('aria-pressed', false);
			}
		}
		if (this.volumeInput) {
			var volume = this.media.muted ? 0 : this.media.volume * 100;
			this.volumeInput.value = volume;
			this.volumeInput.setAttribute('value', volume);
			this.volumeInput.setAttribute("aria-valuenow", volume);
			this.volumeInput.setAttribute("aria-valuetext", volume + "%");
			this.volumeInput.style.setProperty("--value", volume + '%');
		}
	},

	updateStates: function () {
		this.dispatch('beforeUpdateState');
		var currentTime = this.media.currentTime;

		var toActivates = [];

		this.currentActives = [];
		for (var point, i = 0; i < this.points.length, point = this.points[i]; i++) {
			var data = this.pointsData.get(point);

			if (currentTime < data.position - 0.25) {
				if (!point.classList.contains('teIdle')) {
					point.classList.remove('teActive');
					point.classList.remove('teDone');
					point.classList.add('teIdle');
					this.dispatch('idle', point);
				}
			} else if (currentTime >= data.position + 0.25) {
				if (!point.classList.contains('teDone')) {
					point.classList.remove('teActive');
					point.classList.remove('teIdle');
					point.classList.add('teDone');
					this.dispatch('done', point);
				}
			} else if (this.currentPause != point &&
				((currentTime >= data.position - 0.25 && currentTime < data.position + 0.25) ||
					(this.lastTimeUpdate < data.position && currentTime > data.position))) {
				if (!point.classList.contains('teActive')) {
					toActivates.push(point);
				}
				this.currentActives.push(point);
			}
		}

		for (var segment, i = 0; i < this.segments.length, segment = this.segments[i]; i++) {
			var data = this.segmentsData.get(segment);

			if (currentTime < data.start) {
				if (!segment.classList.contains('teIdle')) {
					segment.classList.remove('teActive');
					segment.classList.remove('teDone');
					segment.classList.add('teIdle');
					this.dispatch('idle', segment);
				}
			} else if (currentTime >= data.end) {
				if (!segment.classList.contains('teDone')) {
					segment.classList.remove('teActive');
					segment.classList.remove('teIdle');
					segment.classList.add('teDone');
					this.dispatch('done', segment);
				}
			} else {
				if (!segment.classList.contains('teActive')) {
					toActivates.push(segment);
				}
				this.currentActives.push(segment);
			}
		}

		for (var toActivate, i = 0; i < toActivates.length, toActivate = toActivates[i]; i++) {
			toActivate.classList.remove('teIdle');
			toActivate.classList.remove('teDone');
			toActivate.classList.add('teActive');
			this.dispatch('active', toActivate);
		}

		this.dispatch('afterUpdateState');
	},

	updatePlayingState: function () {
		var self = this;
		if (this.media.seeking) {
			if (!this.seekTimeout) {
				this.container.classList.remove('tePaused');
				this.container.classList.remove('tePlaying');
				this.seekTimeout = setTimeout(function () {
					self.container.classList.add('teSeeking');
					if (self.previousTimeBtn) self.previousTimeBtn.disabled = true;
					if (self.nextTimeBtn) self.nextTimeBtn.disabled = true;
				}, 500);
			}
		} else {
			clearTimeout(this.seekTimeout);
			this.seekTimeout = null;
			if (this.media.paused || this.media.ended) {
				this.container.classList.remove('teSeeking');
				this.container.classList.remove('tePlaying');
				this.container.classList.add('tePaused');
				this.playPauseBtn.setAttribute('aria-pressed', false);
			} else {
				this.container.classList.remove('teSeeking');
				this.container.classList.remove('tePaused');
				this.container.classList.add('tePlaying');
				this.container.classList.add('tePlayed');
				this.playPauseBtn.setAttribute('aria-pressed', true);
			}
		}
		this.dispatch('updatePlayingState');
	},

	playPause: function () {
		var self = this;

		var fadeDuration = this.playPauseBtn.dataset.teFadeDuration;
		if (this.media.currentTime && fadeDuration) {
			var volume = this.media.volume;
			var initialVolume;
			if (this.fadeInterval) {
				clearInterval(this.fadeInterval);
				self.fadeInterval = null;
				this.media.volume = volume = initialVolume = this.fadeInitialVolume;
			} else {
				initialVolume = this.fadeInitialVolume = volume;
			}
			var toPause = !this.media.paused && !this.media.end;
			if (!toPause) {
				this.media.volume = volume = 0;
				this.media.play();
			}
			var delta = 1 / (fadeDuration / 25);
			this.fadeInterval = setInterval(function () {
				if (toPause && volume > 0) {
					volume -= Math.min(delta, volume);
					self.media.volume = volume;
				} else if (!toPause && volume < initialVolume) {
					volume += Math.min(delta, initialVolume - volume);
					self.media.volume = volume;
				} else {
					if (toPause) self.media.pause();
					clearInterval(self.fadeInterval);
					self.fadeInterval = null;
					self.updateVolume();
					self.media.volume = initialVolume;
				}
			}, 25)
		} else {
			if (this.media.paused || this.media.ended) this.media.play();
			else this.media.pause();
		}
	},

	videoPlayPause: function (event) {
		if (event.target !== this.media) return;

		// Pas sur le double clic
		if (event && event.detail > 1) {
			clearTimeout(this.videoPlayPauseTimeout);
			return;
		}

		var self = this;
		var fadeDuration = this.playPauseBtn.dataset.teFadeDuration;
		if (fadeDuration) {
			if (this.media.paused || this.media.ended) {
				this.container.classList.remove('tePaused');
				this.container.classList.add('teVideoPlay');
				setTimeout(function () {
					self.container.classList.remove('teVideoPlay');
				}, fadeDuration);
			} else {
				this.container.classList.remove('tePlaying');
				this.container.classList.add('tePlayed');
				this.container.classList.add('teVideoPause');
				setTimeout(function () {
					self.container.classList.remove('teVideoPause');
				}, fadeDuration);
			}
		}

		this.videoPlayPauseTimeout = setTimeout(function () {
			self.playPauseBtn.click();
			self.playPauseBtn.focus();
		}, 300);
	},

	previousTime: function () {
		var currentTime = this.media.currentTime;
		for (var i = this.currentTimes.length - 1; i >= 0; i--) {
			var time = this.currentTimes[i];
			if (time + 0.25 <= currentTime) {
				this.media.currentTime = time;
				return;
			}
		}
	},

	nextTime: function () {
		var currentTime = this.media.currentTime;
		for (var i = 0; i < this.currentTimes.length; i++) {
			var time = this.currentTimes[i];
			if (time - 0.25 >= currentTime) {
				this.media.currentTime = time;
				return;
			}
		}
	},

	previousTimeline: function () {
		var index = this.timelines.indexOf(this.currentTimeline);
		if (index-- > 0) this.selectTimeline(this.timelines[index]);
	},

	nextTimeline: function () {
		var index = this.timelines.indexOf(this.currentTimeline);
		if (index++ < this.timelines.length) this.selectTimeline(this.timelines[index]);
	},

	selectTimeline: function (timeline) {
		if (this.currentTimeline) this.currentTimeline.classList.remove('teCurrent');
		this.currentTimeline = timeline;
		this.currentTimeline.classList.add('teCurrent');
		this.currentTimes = [];
		for (var point, i = 0; i < this.points.length, point = this.points[i]; i++) {
			if (this.currentTimeline.contains(point)) {
				this.currentTimes.push(this.pointsData.get(point).position);
			}
		}

		var index = this.timelines.indexOf(timeline);
		if (this.previousTimelineBtn) {
			if (index > 0) {
				this.previousTimelineBtn.disabled = false;
				this.previousTimelineBtn.title = this.timelines[index - 1].title;
			} else {
				this.previousTimelineBtn.disabled = true;
				this.previousTimelineBtn.title = '';
			}
		}
		if (this.nextTimelineBtn) {
			if (index < this.timelines.length - 1) {
				this.nextTimelineBtn.disabled = false;
				this.nextTimelineBtn.title = this.timelines[index + 1].title;
			} else {
				this.nextTimelineBtn.disabled = true;
				this.nextTimelineBtn.title = '';
			}
		}

		if (this.previousTimeBtn) this.previousTimeBtn.title = timeline.dataset.tePreviousTitle;
		if (this.nextTimeBtn) this.nextTimeBtn.title = timeline.dataset.teNextTitle;
	},

	showSubtitle: async function (trackElem, destElt) {
		var self = this;
		if (!(destElt instanceof Element)) destElt = this.container.querySelector(destElt);

		destElt.hidden = !trackElem;

		if (this.currentSubtitle) {
			while (destElt.lastChild) destElt.removeChild(destElt.lastChild);
			this.media.removeEventListener('timeupdate', this.currentSubtitle.listener);
			this.currentSubtitle = null;
		}

		if (!trackElem) return;

		function setSubtitle() {
			self.currentSubtitle = subTitle;
			self.media.addEventListener('timeupdate', subTitle.listener);
			subTitle.listener();
		}

		var subTitle = this.subtitles[trackElem.src];
		if (subTitle) setSubtitle();
		else {
			const track = trackElem.track;
			trackElem.addEventListener('load', function () {
				subTitle = self.subtitles[trackElem.src] = {cues: Array.from(track.cues)};

				subTitle.listener = function () {
					var currentCues = subTitle.cues.filter(function (cue) {
						return cue.startTime <= self.media.currentTime && cue.endTime > self.media.currentTime;
					});
					if (!self.currentSubCues || self.currentSubCues.length != currentCues.length || currentCues.some(function (cue, i) {
						return self.currentSubCues[i] != cue;
					})) {
						while (destElt.lastChild) destElt.lastChild.remove();

						currentCues.forEach(function (cue) {
							var div = destElt.appendChild(document.createElement('div'));
							div.appendChild(cue.getCueAsHTML());
						});
						self.currentSubCues = currentCues;
					}
				};

				setSubtitle();
			});
			track.mode = "hidden";
		}
	},

	addAudio: function (src) {
		var self = this;
		if (!this.addAudios) this.addAudios = {};
		var audio = this.addAudios[src] = document.createElement('audio');
		audio.addEventListener('loadedmetadata', function () {
			audio.currentTime = self.media.currentTime;
			if (!self.media.paused) audio.play();
			audio.volume = self.media.volume;
			audio.muted = self.media.muted;
		});
		self.media.addEventListener('pause', function () {
			audio.pause();
		});
		self.media.addEventListener('play', function () {
			audio.currentTime = self.media.currentTime;
			audio.play();
		});
		self.media.addEventListener('volumechange', function () {
			audio.volume = self.media.volume;
			audio.muted = self.media.muted;
		});
		self.media.addEventListener('seeked', function () {
			audio.currentTime = self.media.currentTime;
		});
		audio.src = src;
		this.container.appendChild(audio);
	},

	removeAudio: function (src) {
		if (this.addAudios[src]) this.addAudios[src].remove();
	},

	switchMedia: function (src, type) {
		var self = this;
		this.originalSrc = this.media.src;
		var currentTime = this.media.currentTime;
		// MediaElement
		if (this.media.setSrc && type) this.media.setSrc({src: src, type: type});
		else this.media.src = src;

		this.media.addEventListener('loadedmetadata', function () {
			self.media.currentTime = currentTime;
		});
	},

	restoreMedia: function () {
		var self = this;
		var currentTime = this.media.currentTime;
		this.media.src = this.originalSrc;
		this.media.addEventListener('loadedmetadata', function () {
			self.media.currentTime = currentTime;
		});
	},

	pressedObserver: new MutationObserver(function (records) {
		records.forEach(function (record) {
			var btn = record.target;
			if (record.attributeName == 'aria-pressed') {
				var pressed = btn.getAttribute('aria-pressed');
				if (record.oldValue == pressed) return;
				if (pressed == 'true') {
					if (btn.dataset.pressedTitle) {
						if (!btn.dataset.title) btn.dataset.title = btn.title;
						btn.title = btn.dataset.pressedTitle;
					}
				} else {
					if (btn.dataset.title) btn.title = btn.dataset.title;
				}
				var event = document.createEvent('Events');
				event.initEvent('change', false, false);
				btn.dispatchEvent(event);
			} else if (record.attributeName == 'checked') {
				if (btn.checked) {
					btn.title = btn.dataset.checkedTitle;
				} else {
					btn.title = btn.dataset.title;
				}
			}
		});
	}),

	initPressButtons: function () {
		var self = this;
		var buttons = this.element.querySelectorAll('[aria-pressed]');
		Array.prototype.forEach.call(buttons, function (btn) {
			self.initPressButton(btn);
		});
	},

	initPressButton: function (btn) {
		var self = this;
		btn.addEventListener('click', function () {
			var pressed = this.getAttribute('aria-pressed');
			if (pressed == 'true') {
				this.setAttribute('aria-pressed', 'false');
			} else {
				this.setAttribute('aria-pressed', 'true');
			}
		});
		self.pressedObserver.observe(btn, {attributes: true, attributeFilter: ['aria-pressed'], attributeOldValue: true});
	},


};
