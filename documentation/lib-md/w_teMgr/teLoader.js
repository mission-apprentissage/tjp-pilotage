teLoader = {
	baseUri: document.currentScript.src,
	loaded: [],
	defaultTeScripts: ['mediaelement.min.js', 'teMgr.js', 'teSubControllers.js', 'teSettings.js' ],

	init: async function(media) {
		await this.loadTeScripts(this.defaultTeScripts);
		if ('length' in media) {
			const medias = Array.isArray(media) ? media : Array.from(media);
			await Promise.all(medias.map((m) => this.initMediaElement(m)));
		} else {
			await this.initMediaElement(media);
		}
	},

	docInteractive: new Promise((resolve) => {
		if (document.readyState != 'loading') resolve();
		else document.addEventListener('DOMContentLoaded', () => resolve());
	}),

	loadTeScripts: function(teScripts) {
		if (!teScripts) teScripts = this.defaultTeScripts;
		return Promise.all(teScripts.map((src) => this.loadScript(src)));
	},

	loadScript: function(src) {
		if (!(src in this.loaded)) {
			this.loaded[src] = new Promise((resolve, reject) => {
				const script = document.createElement('script');
				script.src = new URL(src, this.baseUri).href;
				script.addEventListener('load', () => resolve(script));
				script.addEventListener('error', reject);
				document.head.appendChild(script);
			});
		}
		return this.loaded[src];
	},

	initMediaElement: function(media) {
		if (!media) throw new Error("Unable to initialize MediaElement: the media is null");
		if (!('native_scportal' in mejs.Renderers.renderers)) mejs.Renderers.add(teMgr.scPortalRenderer);
		return new Promise((resolve, reject) => {
			new MediaElement(media, {
				fakeNodeName: 'mediaelementwrapper',
				success: (mediaElement) => resolve(mediaElement),
				error: reject
			});
		});
	}
}