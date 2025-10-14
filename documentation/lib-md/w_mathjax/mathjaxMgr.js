/* === MathJax manager =============================================== */
window.mathjaxMgr = {
	// See: http://docs.mathjax.org/en/v2.7-latest/options/index.html
	fConfig_MathMenu: '{showLocale:false, showRenderer:false}',
	fConfig_menuSettings: '{zoom:"Double-Click", mpContext:true, mpMouse:true}',
	fConfig_extentions: '["tex2jax.js","mml2jax.js","MathML/content-mathml.js","MathMenu.js","MathZoom.js","fast-preview.js","AssistiveMML.js"]',
	fConfig_SVG: '{}',
	fConfig_TeX: '{extensions:["AMSmath.js","AMSsymbols.js","noErrors.js","noUndefined.js","color.js","extpfeil.js","cancel.js","mhchem.js"]}',
	fConfig_Extras: '',
	fForceSansSerif: false,
	fCallbacks: [],
	fFinished: [],
	fActive: false,
	fReady: false,
	/* mathjaxMgr.register : register a callback function that will be called once MathJax is finished processing the page - MUST be called before init */
	register: function (pCallBack) {
		this.fCallbacks.push(pCallBack);
	},
	init: function (pLoadMathJax) {
		try {
			if (typeof pLoadMathJax == "undefined") pLoadMathJax = true;
			if (pLoadMathJax) {
				this.fActive = true;
				const vScript = document.createElement("script");
				vScript.src = scServices.scLoad.resolveDestUri("/lib-md/w_mathjax/MathJax.js?locale=fr");
				let vConfig = 'MathJax.Hub.Config({';
				vConfig += '  jax: ["input/MathML","input/TeX","output/SVG"],';
				vConfig += '  extensions: ' + this.fConfig_extentions + ',';
				vConfig += '  imageFont: null,';
				vConfig += '  webFont: "TeX",';
				vConfig += '  menuSettings: ' + this.fConfig_menuSettings + ',';
				vConfig += '  MathMenu: ' + this.fConfig_MathMenu + ',';
				vConfig += '  SVG: ' + this.fConfig_SVG + ',';
				vConfig += '  TeX: ' + this.fConfig_TeX + ',';
				vConfig += '  errorSettings: {message:["[Erreur mathématique]"]}';
				vConfig += '});';
				vConfig += 'MathJax.Hub.Register.StartupHook("End",function () {';
				vConfig += '  mathjaxMgr.xReady();';
				vConfig += '});';
				if (this.fForceSansSerif) {
					vConfig += 'MathJax.Hub.Register.StartupHook("SVG Jax Ready",function () {';
					vConfig += '  var VARIANT = MathJax.OutputJax.SVG.FONTDATA.VARIANT;';
					vConfig += '  VARIANT["normal"].fonts.unshift("MathJax_SansSerif");';
					vConfig += '  VARIANT["bold"].fonts.unshift("MathJax_SansSerif-bold");';
					vConfig += '  VARIANT["italic"].fonts.unshift("MathJax_SansSerif-italic");';
					vConfig += '  VARIANT["-tex-mathit"].fonts.unshift("MathJax_SansSerif-italic");';
					vConfig += '});';
				}
				vConfig += this.fConfig_Extras;
				vScript.text = vConfig
				document.getElementsByTagName("head")[0].appendChild(vScript);
			} else this.xReady();
		} catch (e) {
			console.error("ERROR - mathjaxMgr.init : " + e)
		}
	},
	isReady: function () {
		return this.fReady;
	},
	/* mathjaxMgr.typeset : parse an element or the whole page and typeset any unprocessed mathematics */
	typeset: function (pElement) {
		if (!this.fActive) return;
		if (pElement) MathJax.Hub.Queue(["Typeset", MathJax.Hub, pElement]);
		else MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	},
	xReady: function () {
		this.fReady = true;
		for (let i = 0; i < this.fCallbacks.length; i++) {
			try {
				this.fCallbacks[i]();
			} catch (e) {
			}
		}
	}
};
