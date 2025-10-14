const tePlayerMgr = {
	subControllers : [],

	init: async function (options) {
		await teLoader.docInteractive;
		const playerElems = document.querySelectorAll('.tePlayer');
		if (playerElems.length) {
			await teLoader.loadTeScripts(teLoader.teScripts);
			for (const playerElem of playerElems) {
				await teLoader.initMediaElement(playerElem.querySelector('audio,video'), options);
				const ctrl = this.initController(playerElem.querySelector('.tepController'));
				if (ctrl) ctrl.media.addEventListener('loadedmetadata', () => {
					if (playerElem.classList.contains('teAudioType')) playerElem.ariaLabel = playerElem.dataset.audioLabel;
					else playerElem.ariaLabel = playerElem.dataset.videoLabel;
				});
			}
		}
	},

	initController: function(ctrlElt) {
		return teMgr.initController(ctrlElt, this.subControllers.concat([
			new TEActiveMouse(1500),
			new TEFullscreenCtrl('.tepFullscreen'),
			new TEOnlyOnePlayingCtrl(),
			new TESettingsFromTracks('tep', '.tepFullscreen'),
			new TEErrorHandler(),
			new TESessionCurrentSubtitle('.tepSubtitlesList')
		]));
	}
};
