/**
 * Cache ou rend visible des éléments en fonciton de leur état d'activation
 *
 * @param selector { string } Éléments temporels à traiter
 * @constructor
 */
TEHideIfNotActiveCtrl = function (selector) {
	this.selector = selector;
};

TEHideIfNotActiveCtrl.prototype = {
	handle: function (element) {
		return teMgr.matches(element, this.selector);
	},

	active: function (element) {
		element.hidden = false;
	},

	idle: function (element) {
		this.done(element);
	},

	done: function (element) {
		element.hidden = true;
	},
};


/**
 * Ajoute ou enlève une classe en fonction des éléments actifs
 *
 * @param classesBySelector { object } Map des classes à ajouter
 * @constructor
 */
TEContainerActiveClassCtrl = function (classesBySelector) {
	this.classesBySelector = classesBySelector;
};

TEContainerActiveClassCtrl.prototype = {
	afterUpdateState: function(ctrl) {
		if (Array.isArray(this.classesBySelector)) {
			var activeGroup = false;
			for (var i=0; i<this.classesBySelector.length; i++) {
				var group = this.classesBySelector[i];
				if (activeGroup) {
					for (var selector in group) {
						var klass = group[selector];
						if (ctrl.container.classList.contains(klass)) ctrl.container.classList.remove(klass);
					}
				} else {
					for (var selector in group) {
						if (this.testClass(ctrl, selector, group[selector])) activeGroup = true;
					}
				}
			}
		} else {
			for (var selector in this.classesBySelector) {
				this.testClass(ctrl, selector, this.classesBySelector[selector]);
			}
		}
	},

	testClass: function(ctrl, selector, klass) {
		var hasActive = ctrl.currentActives.some(function(element) { return teMgr.matches(element, selector); });
		if (ctrl.container.classList.contains(klass)) {
			if (!hasActive) ctrl.container.classList.remove(klass);
		} else {
			if (hasActive) ctrl.container.classList.add(klass);
		}
		return hasActive;
	}
};

/**
 * Gère la mise en pause du média lors de l'arrivé sur un point.
 * Les pauses sont décomposés en étapes (les enfants)
 *
 * @param selector { string } Éléments temporels de type point sur lequel appliquer la pause
 * @param hideSteps { boolean? } Permet de placer l'attribut hidden sur les étapes de la pause
 * @constructor
 */
window.TEPauseCtrl = function (selector, hideSteps, exitFullscreen) {
	this.selector = selector;
	this.hideSteps = hideSteps || true;
	this.exitFullscreen = exitFullscreen;
	this.currentStep = null;
};

TEPauseCtrl.prototype = {
	handle: function (element) {
		return teMgr.matches(element, this.selector);
	},

	active: function (element, ctrl) {
		if (!ctrl.media.paused && document.fullscreenElement && this.exitFullscreen) document.exitFullscreen();
		ctrl.media.pause();
		this.currentStep = element.firstElementChild;
		if (this.currentStep) {
			this.currentStep.classList.add('teActive');
			if (this.hideSteps) this.currentStep.hidden = false;
		}
	},

	idle: function (element) {
		this.done(element);
	},

	done: function (element) {
		for (var child = element.firstElementChild; child; child = child.nextElementSibling) {
			child.classList.remove('teActive');
			if (this.hideSteps) child.hidden = true;
		}
		this.currentStep = null;
	},

	nextStep: function () {
		if (this.currentStep) {
			this.currentStep.classList.remove('teActive');
			if (this.hideSteps) this.currentStep.hidden = true;
			var ctrl = teMgr.getController(this.currentStep);
			this.updateOverflow(this.currentStep.parentNode, ctrl);

			var next = this.currentStep.nextElementSibling;
			if (next) {
				next.classList.add('teActive');
				if (this.hideSteps) next.hidden = false;
				this.currentStep = next;
				this.updateOverflow(this.currentStep.parentNode, ctrl);
			}
		}
	},

	previousStep: function () {
		if (this.currentStep) {
			this.currentStep.classList.remove('teActive');
			if (this.hideSteps) this.currentStep.hidden = true;
			var ctrl = teMgr.getController(this.currentStep);
			this.updateOverflow(this.currentStep.parentNode, ctrl);
			var previous = this.currentStep.previousElementSibling;
			if (previous) {
				previous.classList.add('teActive');
				if (this.hideSteps) previous.hidden = false;
				this.currentStep = previous;
				this.updateOverflow(this.currentStep.parentNode, ctrl);
			}
		}
	},

	updateOverflow: function (element, ctrl) {
		for (var i = 0; i < ctrl.subControllers.length; i++) {
			var subCtrl = ctrl.subControllers[i];
			if (subCtrl instanceof TEOverflowCtrl && subCtrl.handle(element)) {
				subCtrl.done(element, ctrl);
				subCtrl.active(element, ctrl);
			}
		}
	},

	resume: function (element) {
		if (this.currentStep) this.currentStep.classList.remove('teActive');
		teMgr.getController(element).media.play();
	}
};

/**
 *
 * Classe de base pour la gestion de l'overflow
 *
 * Expose la détection de l'overflow et la gestion des transitions
 * Attention :
 *  - part du principe que les mutations (microtask) arrivent avant un requestAnimationFrame (macrotask)
 *    (https://stackoverflow.com/a/25933985)
 *  - ne gère que la première transition de la cible :
 *    filtrer par propriété est difficile, les noms diffèrent entre les navigateurs (flex-basis sur Chrome, flex sur Safari)
 *
 * @param selector { string } Éléments temporels sur lequel appliquer l'overflow
 * @param update { object? } Paramètre de gestion des transitions
 * @param update.target { string } Éléments sur lequel observer les changements
 * @param update.transition { boolean } Doit-on calculer les dimensions après les transitions
 * @param update.classes { string[] } Classe sur lesquelles observer les changements
 * @param update.disabledClasses { string[] } Classe sur lesquelles ne plus observer les changements
 * @constructor
 * @abstract
 */
TEOverflowCtrl = function (selector, update) {
	this.selector = selector;
	this.currentActives = new Set();
	this.update = update;
	// Compatibilité ascendante
	if (update && !('transition' in update)) this.update.transition = true;
};

TEOverflowCtrl.prototype = {
	init: function(ctrl) {
		var self = this;

		if (this.update) {
			var iE = navigator.userAgent.match("Trident");
			self.updateDisabled = this.update.disabledClasses && this.update.disabledClasses.some(function(classNames) {
				return ctrl.container.classList.contains(classNames);
			});

			this.prevClassList = Array.prototype.slice.call(ctrl.container.classList);

			if (this.update.classes) this.prevClassList = this.prevClassList.filter(function(classNames) {
				return self.update.classes.indexOf(classNames) != -1;
			});

			this.update.target = document.querySelector(this.update.target);
			this.transitionStarted = false;

			// Ajout d'un mutation observer qui va détecté les changements de classe lié à une transition sur le container
			this.observer = new MutationObserver(function () {
				self.updateDisabled = self.update.disabledClasses && self.update.disabledClasses.some(function(classNames) {
					return ctrl.container.classList.contains(classNames);
				});

				var newClassList = Array.prototype.slice.call(ctrl.container.classList);
				if (self.update.classes) newClassList = newClassList.filter(function(classNames) {
					return self.update.classes.indexOf(classNames) != -1;
				});
				newClassList.sort();
				// Comparaison de l'ancienne liste de classe avec la nouvelle
				var classListDiff = self.prevClassList.length != newClassList.length || newClassList.some(function (classNames, i) {
					return classNames != self.prevClassList[i];
				});

				if (classListDiff && !self.updateDisabled) {
					if (self.update.transition && !iE) {
						// Début d'une transition
						self.transitionStarted = true;
						self.currentActives.forEach(function (active) {
							active.style.visibility = 'hidden';
						});
					} else {
						self.testActivesOverflow();
					}
					self.prevClassList = newClassList;
				}
			});
			this.observer.observe(ctrl.container, {"attributes": true, "attributeFilter": ["class"]});

			if (self.update.transition && !iE) ctrl.container.addEventListener('transitionend', function (event) {
				if (self.transitionStarted && event.target == self.update.target) {
					// Fin d'une transition
					self.transitionStarted = false;
					self.testActivesOverflow(true);
				}
			});
		}

		this.resizeTimeout = null;
		window.addEventListener('resize', function () {
			if (!self.resizeTimeout) {
				self.currentActives.forEach(function (active) {
					active.style.visibility = 'hidden';
				});
			}
			clearTimeout(self.resizeTimeout);
			self.resizeTimeout = setTimeout(function () {
				self.testActivesOverflow(true);
				self.resizeTimeout = null;
			}, 200);
		});
	},

	handle: function (element) {
		return teMgr.matches(element, this.selector);
	},

	active: function (element, ctrl) {
		var self = this;
		this.currentActives.add(element);

		requestAnimationFrame(function() {
			if (!self.transitionStarted) self.testOverflow(element);
		})
	},

	idle: function (element, ctrl) {
		this.done(element, ctrl);
	},

	done: function (element) {
		this.endOverflow(element);
		element.style.visibility = '';
		this.currentActives.delete(element);
	},

	testOverflow: function (element) {
		var self = this;

		var style = getComputedStyle(element);
		// IE11 can return invalid value on clientWidth and clientHeight, the calculated style is used instead
		if (!parseInt(style.width) && !parseInt(style.height)) return;

		element.style.alignSelf = 'center';
		var height = element.scrollHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
		var width = element.scrollWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
		var scale = Math.min(element.parentNode.clientHeight / height, element.parentNode.clientWidth / width);
		if (scale < 1) {
			self.onOverflow(element, scale);
		} else {
			element.style.alignSelf = '';
		}
	},

	testActivesOverflow: function(unhide) {
		var self = this;
		this.currentActives.forEach(function (active) {
			self.endOverflow(active);
			self.testOverflow(active);
			if (unhide) active.style.visibility = '';
		});
	},

	onOverflow: function (element, scale) {
		element.classList.add('teOverflow');
	},
	endOverflow: function (element) {
		element.classList.remove('teOverflow');
	}
};

/**
 * Gère l'overflow en redimensionnement par transformation l'élément actif
 *
 * Remarques : suppose que l'élément soit en flex
 * @param selector { string } Éléments temporels sur lequel appliquer l'overflow
 * @param transition { object? } Paramètre de gestion des transitions
 * @param transition.target { string } Éléments sur lequel observer les transitions
 * @constructor
 * @extends TEOverflowCtrl
 */
TEOverflowTransformCtrl = function (selector, scrollThreshold, transition) {
	TEOverflowCtrl.call(this, selector, transition);
	this.scrollThreshold = scrollThreshold;
};
TEOverflowTransformCtrl.prototype = Object.create(TEOverflowCtrl.prototype);

TEOverflowTransformCtrl.prototype.onOverflow = function (element, scale) {
	if (scale <= this.scrollThreshold) TEOverflowScrollCtrl.prototype.onOverflow.call(this, element, scale);
	else {
		element.classList.add('teOverflowTransform');
		element.style.transform = 'scale(' + scale + ')';
		element.style.transformOrigin = '50% 0';
		element.style.alignSelf = 'flex-start';
		element.style.overflow = 'visible';
	}
};

TEOverflowTransformCtrl.prototype.endOverflow = function (element) {
	element.classList.remove('teOverflowTransform');
	TEOverflowScrollCtrl.prototype.endOverflow.call(this, element);
	element.style.transform = element.style.transformOrigin = element.style.overflow = element.style.alignSelf = '';
};

/**
 * Gère l'overflow par la mise en scroll de l'élément actif
 *
 * Remarques : suppose que l'élément soit en flex
 *
 * Remarques : suppose que l'élément soit en flex
 * @param selector { string } Éléments temporels sur lequel appliquer l'overflow
 * @param transition { object? } Paramètre de gestion des transitions
 * @param transition.target { string } Éléments sur lequel observer les transitions
 * @constructor
 * @extends TEOverflowCtrl
 */
TEOverflowScrollCtrl = function (selector, transition) {
	TEOverflowCtrl.call(this, selector, transition);
};
TEOverflowScrollCtrl.prototype = Object.create(TEOverflowCtrl.prototype);

TEOverflowScrollCtrl.prototype.onOverflow = function (element, scale) {
	element.classList.add('teOverflowScroll');
	element.style.overflow = 'auto';
	element.style.alignSelf = 'stretch';
};

TEOverflowScrollCtrl.prototype.endOverflow = function (element) {
	element.classList.remove('teOverflowScroll');
	element.style.overflow = element.style.alignSelf = '';
};

/**
 * Gère la navigation par fragment
 *
 * @param selector { string } Éléments temporels cible ou à l'origine d'un changement de fragment
 * @constructor
 */
TEHashCtrl = function (selector) {
	this.selector = selector;
	this.selfHashChanged = false;
};

TEHashCtrl.prototype = {
	handle: function (element) {
		return teMgr.matches(element, this.selector);
	},

	init: function (ctrl) {
		var self = this;
		window.addEventListener('hashchange', function (event) {
			if (!self.selfHashChange) self.hashChanged(ctrl);
		}, true);

		var target = window.location.hash.substr(1);
		this.init = true;
		if (target) {
			this.init = false;
			if (ctrl.media.readyState) this.hashChanged(ctrl);
			else ctrl.media.addEventListener('loadedmetadata', function (event) {
				self.hashChanged(ctrl)
			}, false);
		}
	},

	active: function (element) {
		if (!this.init) return;
		var self = this;
		this.selfHashChange = true;
		window.location.hash = '#' + element.id;
		window.setTimeout(function () {
			self.selfHashChange = false;
		}, 200)
	},

	hashChanged: function (ctrl) {
		var target = window.location.hash.substr(1);
		this.init = true;
		if (target) {
			var targetParts = target.split(',');
			var state = null;
			var time = null;
			targetParts.forEach(function (targetPart) {
				if (targetPart.indexOf('=') > 0) {
					var param = targetPart.split('=');
					if (param[0] == 'state') {
						state = param[1];
					} else if (param[0] == 't') {
						var timeParts = param[1].split(':');
						time = parseFloat(timeParts[timeParts.length - 1]);
						if (timeParts.length > 1) {
							time += parseInt(timeParts[timeParts.length - 2]) * 60;
							if (targetParts.length > 2) {
								time += parseInt(timeParts[0]) * 3600;
							}
						}
					}
				} else {
					var targetElt = document.getElementById(targetPart);
					ctrl.points.some(function (point) {
						if (point == targetElt || point.contains(targetElt)) {
							time = ctrl.pointsData.get(point).position;
							return true;
						}
					});

					if (time === null) ctrl.segments.some(function (segment) {
						if (segment == targetElt || segment.contains(targetElt)) {
							time = ctrl.segmentsData.get(segment).start;
							return true;
						}
					});
				}
			});

			if (time !== null && time != ctrl.media.currentTime) ctrl.media.currentTime = time;

			if (state == 'play') ctrl.media.play();
			else if (state == 'pause') ctrl.media.pause();
		}
	}
};

/**
 * Ajoute temporairement une classe au conteneur ou à un de ses éléments si la souris
 * est active (survol ou clic)
 *
 * @param delay { number } Délai au bout duquel l'état d'activation est enlevé
 * @param rootSelector { string? } Élément sur lequel appliqué l'état, peut servir à filtrer l'activation
 * @constructor
 */
TEActiveMouse = function (delay, rootSelector) {
	this.delay = delay;
	this.rootSelector = rootSelector;
};
TEActiveMouse.prototype = {
	init: function (ctrl) {
		var root = null;
		if (this.rootSelector) {
			if (teMgr.matches(ctrl.container, this.rootSelector)) root = ctrl.container;
			else root = ctrl.container.querySelector(this.rootSelector);
		} else {
			root = ctrl.container;
		}
		if (!root) return;
		this.root = root;
		var self = this;

		var timeout = 0;

		function inactive() {
			clearTimeout(timeout);
			if (root.classList.contains('teActiveMouse')) root.classList.remove('teActiveMouse');
		}
		function active(event) {
			clearTimeout(timeout);
			if (validTarget(event) && !root.classList.contains('teActiveMouse')) root.classList.add('teActiveMouse');
			timeout = setTimeout(inactive, self.delay);
		}
		function validTarget(event) {
			if (event.type == "focus") return true;
			var targetName = event.target.localName;
			if (targetName == 'a' || targetName == 'button' || targetName == 'input') return false;
			return true;
		}

		root.addEventListener('mousemove', active, false);
		root.addEventListener('mousedown', active, false);
		root.addEventListener('focus', active, true);
		root.addEventListener('keydown', active, true);

		// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
		var supportsPassive = false;
		try {
			var opts = Object.defineProperty({}, 'passive', {
				get: function() {
					supportsPassive = true;
				}
			});
			window.addEventListener("test", null, opts);
		} catch (e) {}

		var touchStart;
		root.addEventListener('touchstart', function(event) {
			touchStart = event.changedTouches[0];
			touchStart.time = Date.now();
		}, supportsPassive ? { passive: true } : false);
		root.addEventListener('touchend', function(event) {
			var touchEnd = event.changedTouches[0],
				distanceX = touchEnd.pageX - touchStart.pageX,
				distanceY = touchEnd.pageY - touchStart.pageY,
				targetName = event.target.localName;

			if (Math.abs(distanceX) < 50 && Math.abs(distanceY) < 50) active(event);
		});
	}
};


/**
 * Gère le déplacement dans les segments par swipe sur mobile
 *
 */
TESwipeCtrl = function(selector) {
	this.selector = selector;
};

TESwipeCtrl.prototype = {
	init: function(ctrl) {
		var swipeArea = this.selector ? ctrl.container.querySelector(this.selector) : ctrl.container;
		var touchStart;
		swipeArea.addEventListener('touchstart', function(event) {
			touchStart = event.changedTouches[0];
			touchStart.time = Date.now();
		}, false);

		swipeArea.addEventListener('touchend', function(event) {
			var touchEnd = event.changedTouches[0],
				distanceX = touchEnd.pageX - touchStart.pageX,
				distanceY = touchEnd.pageY - touchStart.pageY,
				elapsedTime = Date.now() - touchStart.time;
			if (Math.abs(distanceX) >= 150 && elapsedTime <= 500 && Math.abs(distanceY) <= 100) {
				// Swipe
				if (distanceX > 0) ctrl.previousTime();
				else ctrl.nextTime();
			}
		}, false);
	}
};

/**
 * Permet de restreindre la lecture à un seul controller à la fois.
 *
 * Fonctionne avec les iframes en stockant le controller courant dans window.top
 *
 * TODO vérifier le comportement sur une iframe avec sécurité restreinte
 *
 */
TEOnlyOnePlayingCtrl = function() { };
TEOnlyOnePlayingCtrl.prototype = {
	init: function (ctrl) {
		ctrl.media.addEventListener('play', function() {
			if (top.teCurrentCtrl && top.teCurrentCtrl != ctrl && !top.teCurrentCtrl.media.paused) {
				top.teCurrentCtrl.playPause();
			}
			top.teCurrentCtrl = ctrl;
		});
	}
};

TEFullscreenCtrl = function(options) {
	if (typeof options == "string") this.options = { buttons: options }
	else this.options = options;
};

TEFullscreenCtrl.prototype = {
	init: function (ctrl) {
		var self = this;
		this.container = ctrl.container;
		this.media = ctrl.media;

		const buttons = ctrl.container.querySelectorAll(this.options.buttons || '.teFullscreen');

		if (!document.fullscreenEnabled) {
			Array.prototype.forEach.call(buttons, function(btn) {
				btn.hidden = true;
			});
			return;
		}

		ctrl.media.addEventListener('dblclick', function(event) {
			if (document.fullscreenElement) self.exit();
			else self.enter();
			event.stopPropagation();
			event.preventDefault();
		}, true);

		Array.prototype.forEach.call(buttons, function(btn) {
			btn.addEventListener('click', function(event) {
				var fullscreen = document.fullscreenElement != null;
				if (!fullscreen) self.enter();
				else self.exit(ctrl.container);
				event.stopPropagation();
			});
		});

		const exits = ctrl.container.querySelectorAll(this.options.exits);
		Array.prototype.forEach.call(exits, function(exit) {
			exit.addEventListener('click', function(event) {
				if (document.fullscreenElement != null) {
					self.exit();
					event.stopPropagation();
					event.preventDefault();
				}
			}, true)
		});

		document.addEventListener('fullscreenchange', function() {
			var fullscreen = document.fullscreenElement != null;
			Array.prototype.forEach.call(buttons, function(btn) {
				if (btn.localName == 'input') btn.checked = fullscreen;
				else btn.setAttribute('aria-pressed', fullscreen ? 'true' : 'false');
			});

			if (fullscreen) {
				document.body.classList.add('teFullscreen');
				var activeMouseCtrl = ctrl.getSubController(TEActiveMouse);
				var activeMouseRoot = activeMouseCtrl && activeMouseCtrl.root;
				if (activeMouseRoot && activeMouseRoot.classList.contains('teActiveMouse')) activeMouseRoot.classList.remove('teActiveMouse');
			} else {
				document.body.classList.remove('teFullscreen');
			}
		});

		if (this.options.keyEventTarget) {
			var target = document.querySelector(this.options.keyEventTarget)
			target.addEventListener('keydown', function (event) {
				if (event.keyCode == 70) {
					var fullscreen = document.fullscreenElement != null;
					if (!fullscreen) self.enter();
					else self.exit();
				}
			});
		}

	},

	enter: function () {
		if (this.options.onMedia) this.media.requestFullscreen();
		else this.container.requestFullscreen();
	},

	exit: function () {
		document.exitFullscreen();
	}
};

/**
 * Gestionnaire de message d'erreur
 *
 * S'attend à ce qu'un élément teErrorArea soit présent contenant optionnelement teErrorSrc et teErrorReload
 * qui seront défini respectivement à un lien vers le vidéo et à l'action de le recharger
 *
 * @constructor
 */
TEErrorHandler = function () {
};

TEErrorHandler.prototype = {
	init: function(ctrl) {
		var errorArea = ctrl.container.querySelector(ctrl.selector('errorArea'));
		var errorSrc = errorArea.querySelector(ctrl.selector('errorSrc'));
		var errorReload = errorArea.querySelector(ctrl.selector('errorReload'));

		ctrl.media.addEventListener('error', function () {
			ctrl.container.classList.remove('teAudioType', 'teVideoType');
			ctrl.container.classList.add('teError');
			var originalSrc = ctrl.media.originalNode ? ctrl.media.originalNode.src : ctrl.media.src;
			if (errorSrc) {
				errorSrc.href = originalSrc;
				errorSrc.textContent = originalSrc;
			}
			if (errorReload) {
				errorReload.onclick = function(event) {
					errorArea.hidden = true;
					ctrl.container.classList.remove('teError');
					ctrl.media.load();
					event.preventDefault();
				}
			}

			errorArea.hidden = false;

		});

		ctrl.media.addEventListener('loadedmetadata', function() {
			errorArea.hidden = true;
			ctrl.container.classList.remove('teError');
		})
	}
};

/**
 * Restore le sous-titre courant sur le chargement de la page
 */
TESessionCurrentSubtitle = function(inputsRoot) {
	this.inputsRoot = inputsRoot;
};
TESessionCurrentSubtitle.prototype = {
	ready: function (ctrl) {
		var inputsRoot = ctrl.container.querySelector(this.inputsRoot);
		if (!inputsRoot) return;
		var inputs = inputsRoot.querySelectorAll('input');

		var vSrc = ctrl.media.originalNode ? ctrl.media.originalNode.src : ctrl.media.src;
		var currentSubtitles = sessionStorage.getItem('teCurrentSubtitles');
		currentSubtitles = currentSubtitles ? JSON.parse(currentSubtitles) : {};

		var currentSubtitle = currentSubtitles[vSrc] || "";
		for (var i=0; i<inputs.length; i++) {
			var input = inputs.item(i);
			if (input.value == currentSubtitle) {
				input.click();
			}
			input.addEventListener('change', function() {
				currentSubtitle = currentSubtitles[vSrc] = this.value;
				sessionStorage.setItem('teCurrentSubtitles', JSON.stringify(currentSubtitles));
			});
		}
	}
};
