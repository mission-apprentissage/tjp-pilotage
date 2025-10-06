teLoader = {
	baseUri: document.currentScript.src,
	loaded: [],
	defaultTeScripts: ['mediaelement.min.js', 'teMgr.js', 'teSubControllers.js', 'teSettings.js' ],

	init: async function(media, options) {
		await this.loadTeScripts(this.defaultTeScripts);
		if ('length' in media) {
			const medias = Array.isArray(media) ? media : Array.from(media);
			await Promise.all(medias.map((m) => this.initMediaElement(m, options)));
		} else {
			await this.initMediaElement(media, options);
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

	initMediaElement: function(media, options) {
		if (!media) throw new Error("Unable to initialize MediaElement: the media is null");
		const rendererOptions = {};
		if (!('native_scportal' in mejs.Renderers.renderers)) mejs.Renderers.add(teMgr.scPortalRenderer);
		if (options && options.credentials) {
			rendererOptions.scportal = {
				credentials: options.credentials
			};
			rendererOptions.hls = {
				xhrSetup: function(xhr, url) {
					xhr.withCredentials = options.credentials == "include";
				},
				fetchSetup: function(context, initParams) {
					initParams.credentials = options.credentials;
					return new Request(context.url,initParams);
				}
			};

		}
		return new Promise((resolve, reject) => {
			new MediaElement(media, Object.assign({
				fakeNodeName: 'mediaelementwrapper',
				success: (mediaElement) => resolve(mediaElement),
				error: reject
			}, rendererOptions));
		});
	}
}