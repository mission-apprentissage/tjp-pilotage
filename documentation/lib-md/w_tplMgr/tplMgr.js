/* template management */
window.tplMgr = {
	fCbkPath: "des:.cbk-closed",
	fCbkInit: true,
	fNoAjax: false,
	fThemingBtnPath: "ide:footer/des:menu",
	fMenuBtnPath: "ide:header/chi:.titleLayer/chi:menu",
	fPlanBtnPath: "ide:header/chi:.toolLayer/chi:menu",

	fStrings: ["Retour à la page en cours du contenu", "",
		/*02*/      "Cacher le contenu de \'%s\'", "Afficher le contenu de \'%s\'",
		/*04*/      "Ce site utilise un système de mesure d\'audience qui nécessite l\'utilisation de cookies pour comprendre et améliorer l\'expérience du visiteur.", "",
		/*06*/      "Accepter", "Refuser",
		/*08*/      "Cookies", "Gestion des cookies",
		/*10*/      "Le chargement dynamique de ressources est désactivé.\n\nLes restrictions sécuritaires de votre navigateur interdisent l\'utilisation de certaines fonctionnalités telles que la recherche ou l\'exploration du menu.", "thème",
		/*12*/      "Passer au thème sombre", "Passer au thème clair",
		/*14*/      "Plan", "Menu",
		/*16*/      "Ouvrir le menu", "Fermer le menu",
		/*18*/      "Afficher le plan", "Cacher le plan",
	],

	init: function (pParam) {
		try {
			if (!pParam) pParam = {};
			this.fStore = new this.LocalStore();
			const vPageType = sc$("page").getAttribute("data-type");
			this.fIsGuidePage = vPageType === "guide";
			this.fIsToolsPage = vPageType === "tools";
			this.fIsSubPage = vPageType === "sub";
			this.fIsEvalPage = vPageType === "eval";

			if (this.fIsGuidePage) this.fStore.set("guideUrl", document.location.href);

			this.fCurrentUrl = scCoLib.hrefBase();
			this.fPageCurrent = scServices.scLoad.getUrlFromRoot(this.fCurrentUrl);
			this.initDom();

			if (typeof _CookieWarn == "undefined") _CookieWarn = false;
			if (_CookieWarn) {
				const vCookieWarnBar = this.fCookieWarnBar = scDynUiMgr.addElement("div", scPaLib.findNode("bod:"), "cookieWarnBar" + (localStorage.getItem(scServices.scLoad.fRootUrl+"AcknowledgeAnalytics") ? " acknowledged" : ""), scPaLib.findNode("bod:/chi:"));
				const vMsgBox = scDynUiMgr.addElement("span", vCookieWarnBar, "cookieWarnMsg");
				const vMsg = this.fStrings[_CookieWarn === "analytics" ? 4 : 5];
				vMsgBox.innerHTML = vMsg + " ";
				const vBtnOk = scDynUiMgr.addElement("a", vCookieWarnBar, "cookieWarnBtnOk");
				vBtnOk.setAttribute("role", "button");
				vBtnOk.href = "#";
				vBtnOk.innerHTML = '<span>' + this.fStrings[6] + '</span>';
				vBtnOk.onclick = function () {
					const vIsActive = localStorage.getItem(scServices.scLoad.fRootUrl+"ActivateAnalytics");
					localStorage.setItem(scServices.scLoad.fRootUrl+"ActivateAnalytics", true);
					localStorage.setItem(scServices.scLoad.fRootUrl+"AcknowledgeAnalytics", true);
					tplMgr.fCookieWarnBar.classList.add("acknowledged");
					tplMgr.xSwitchClass(scPaLib.findNode("bod:"), "cookieWarnBar_on", "cookieWarnBar_off", true);
					if (!vIsActive) window.location.reload();
					return false;
				}
				const vBtnNok = scDynUiMgr.addElement("a", vCookieWarnBar, "cookieWarnBtnNok");
				vBtnNok.setAttribute("role", "button");
				vBtnNok.href = "#";
				vBtnNok.innerHTML = '<span>' + this.fStrings[7] + '</span>';
				vBtnNok.onclick = function () {
					const vIsActive = localStorage.getItem(scServices.scLoad.fRootUrl+"ActivateAnalytics");
					localStorage.removeItem(scServices.scLoad.fRootUrl+"ActivateAnalytics");
					localStorage.setItem(scServices.scLoad.fRootUrl+"AcknowledgeAnalytics", true);
					tplMgr.fCookieWarnBar.classList.add("acknowledged");
					tplMgr.xSwitchClass(scPaLib.findNode("bod:"), "cookieWarnBar_on", "cookieWarnBar_off", true);
					if (vIsActive) window.location.reload();
					return false;
				}
				const vBtnBar = scDynUiMgr.addElement("a", scPaLib.findNode("ide:footer/des:.btnSc/par:"), "cookieWarnBtnBar", scPaLib.findNode("ide:footer/des:.btnSc"));
				vBtnBar.setAttribute("role", "button");
				vBtnBar.setAttribute("title", this.fStrings[9]);
				vBtnBar.href = "#";
				vBtnBar.innerHTML = '<span>' + this.fStrings[8] + '</span>';
				vBtnBar.onclick = function () {
					localStorage.removeItem(scServices.scLoad.fRootUrl+"AcknowledgeAnalytics");
					tplMgr.fCookieWarnBar.classList.remove("acknowledged");
					tplMgr.xSwitchClass(scPaLib.findNode("bod:"), "cookieWarnBar_off", "cookieWarnBar_on", true);
					return false;
				}
				document.body.classList.add("cookieWarnBar_" + (localStorage.getItem(scServices.scLoad.fRootUrl+"AcknowledgeAnalytics") ? "off" : "on"))
			}

			// Theme button
			let vHasParentMgr = false;
			try {
				if (window.parent !== window && window.parent.tplMgr) vHasParentMgr = true;
			} catch (e){}
			if(pParam.themeMode==="button" && scPaLib.findNode(this.fThemingBtnPath)){
				let vBd = dom.newBd(scPaLib.findNode(this.fThemingBtnPath));
				this.fThemingBtn = vBd.elt("li", "themeBtnParent").elt("button", "themeBtn")
					.prop("fTheme", localStorage.getItem(scServices.scLoad.fRootUrl+"theme-preference") ? localStorage.getItem(scServices.scLoad.fRootUrl+"theme-preference") : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
					.prop("setPreference", function (){
						localStorage.setItem(scServices.scLoad.fRootUrl+"theme-preference", this.fTheme);
						this.reflectPreference();
					})
					.prop("reflectPreference", function (){
						document.documentElement.setAttribute("data-theme", this.fTheme);
						this.setAttribute("title", this.fTheme === "dark" ? tplMgr.fStrings[13] : tplMgr.fStrings[12]);
						localStorage.setItem(scServices.scLoad.fRootUrl+"theme-preference", this.fTheme);
					})
					.listen("click", function(){
						this.fTheme = this.fTheme === "light" ? "dark" : "light";
						this.setPreference();
					})
					.call("reflectPreference")
					.elt("span").text(this.fStrings[11]).up().currentUp();
				window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({matches:isDark}) => {
					tplMgr.fThemingBtn.fTheme = isDark ? "dark" : "light";
					tplMgr.fThemingBtn.setPreference();
				});
			} else if (vHasParentMgr && localStorage.getItem(scServices.scLoad.fRootUrl+"theme-preference")){ //We are in a sub-window set theme from localStorage.
				document.documentElement.setAttribute("data-theme", localStorage.getItem(scServices.scLoad.fRootUrl+"theme-preference"));
			} else if (pParam.themeMode !== "none" && pParam.themeMode !== "button"){ //Direct theme code in themeMode
				document.documentElement.setAttribute("data-theme", pParam.themeMode);
				localStorage.setItem(scServices.scLoad.fRootUrl+"theme-preference", pParam.themeMode);
			} else if (pParam.themeMode === "button") {
				console.warn("WARNING : cannot setup theming on this page.");
			}

			// Burger menu button
			if (pParam.addMenuBtn && scPaLib.findNode(this.fMenuBtnPath)){
				let vBd = dom.newBd(scPaLib.findNode(this.fMenuBtnPath));
				vBd.elt("li", "menuBtnParent").elt("button", "menuBtn")
					.att("title", this.fStrings[16])
					.listen("click", function(){
						this.fOpen = this.fOpen !== true;
						this.setAttribute("title", this.fOpen ? tplMgr.fStrings[17] : tplMgr.fStrings[16]);
						if (this.fOpen) document.body.classList.add("menuOpen");
						else document.body.classList.remove("menuOpen");
					})
					.elt("span").text(this.fStrings[15]).up().up();
			} else if (pParam.addMenuBtn) console.warn("WARINING : cannot add Menu Button.");

			// Plan menu button
			if (pParam.addPlanBtn && scPaLib.findNode(this.fPlanBtnPath) && sc$("outline")){
				let vBd = dom.newBd(scPaLib.findNode(this.fPlanBtnPath));
				vBd.elt("li", "planBtnParent").elt("button", "planBtn")
					.att("title", tplMgr.fStrings[localStorage.getItem(scServices.scLoad.fRootUrl+"planClosed")==="true" ? 18 : 19])
					.prop("fClosed", localStorage.getItem(scServices.scLoad.fRootUrl+"planClosed")==="true")
					.listen("click", function(){
						this.fClosed = !this.fClosed;
						this.setAttribute("title", this.fClosed ? tplMgr.fStrings[19] : tplMgr.fStrings[18]);
						if (this.fClosed) document.body.classList.add("planClosed");
						else document.body.classList.remove("planClosed");
						if(responsive.getColumns() === 2) localStorage.setItem(scServices.scLoad.fRootUrl+"planClosed", this.fClosed);
					})
					.elt("span").text(this.fStrings[14]).up().up();
				responsive.registerListener("layoutChange", function(pNumCols){
					if (pNumCols === 1){
						document.body.classList.remove("planClosed");
					} else {
						if (localStorage.getItem(scServices.scLoad.fRootUrl+"planClosed")==="true"){
							document.body.classList.add("planClosed");
						}
					}
				});
			} else if (pParam.addPlanBtn && sc$("outline")) console.warn("WARINING : cannot add Plan Button.");

			// Callback functions and listeners
			if ("scDynUiMgr" in window) {
				scDynUiMgr.collBlk.addOpenListener(this.sCollBlkOpen);
				scDynUiMgr.collBlk.addCloseListener(this.sCollBlkClose);
			}
			if ("scTooltipMgr" in window) {
				scTooltipMgr.addShowListener(this.sTtShow);
				scTooltipMgr.addHideListener(this.sTtHide);
			}
			window.addEventListener("hashchange", function (pEvt) {
				tplMgr.hashCheck();
			}, false);
			responsive.registerListener("layoutChange", function(pNumCols){
				if (pNumCols === 1){
					document.body.classList.add("oneColumn");
					document.body.classList.remove("twoColumn");
				} else {
					document.body.classList.remove("oneColumn");
					document.body.classList.add("twoColumn");
				}
			});
			window.addEventListener("keydown", function (pEvt) {
				// CTRL+P : only print the current sub-page
				if ((pEvt.ctrlKey || pEvt.metaKey) && pEvt.keyCode == 80){
					pEvt.preventDefault();
					window.print();
				}
			}, false);

			scCoLib.addEventsHandler(this);
		} catch (e) {
			console.error("ERROR - tplMgr.init : " + e)
		}
	},

	initDom: function () {
		let i;
//Section outline
		this.fSecOutCo = scPaLib.findNode("des:div.secOutFra/chi:div.secOutUi");
		if (this.fSecOutCo && !scPaLib.checkNode(".static", this.fSecOutCo)) {
			this.fSecOutBtn = scPaLib.findNode("des:div.secOutFra/chi:div.secOutTi/chi:a");
			if (scPaLib.checkNode(".dynamicCollapsed", this.fSecOutCo) || (scPaLib.checkNode(".dynamicMemorized", this.fSecOutCo) && this.fStore.get("secOutCollapse") === "true") )this.secOutToggle();
		}

		// Close collapsable blocks that are closed by default.
		if (this.fCbkInit) {
			let vHash = window.location.hash;
			if (vHash.length > 0) vHash = vHash.substring(1);
			const vCbks = scPaLib.findNodes(this.fCbkPath);
			for (i = 0; i < vCbks.length; i++) {
				if (!vHash || vHash && vHash !== scPaLib.findNode("chi:", vCbks[i]).id) {
					const vTgl = scPaLib.findNode("des:a", vCbks[i]);
					if (vTgl) vTgl.onclick();
				}
			}
		}
		if (!this.fIsGuidePage) {
			const vRetBtn = scPaLib.findNode("ide:menu/des:a");
			const vRetUrl = this.fStore.get("guideUrl");
			if (vRetBtn && vRetUrl) {
				vRetBtn.setAttribute("href", vRetUrl);
				vRetBtn.title = this.fStrings[0];
			}
			// Map outline
			const vMnuItems = scPaLib.findNodes("ide:content/des:ul.sw_outMap_navList/des:a.mnuSel_no");
			if (vRetUrl && vMnuItems && vMnuItems.length > 0) {
				const vPage = vRetUrl.substring(vRetUrl.lastIndexOf("/") + 1);
				let vFound = false;
				for (i = 0; i < vMnuItems.length; i++) {
					const vMnuItem = vMnuItems[i];
					if (vMnuItem.href.substring(vMnuItem.href.lastIndexOf("/") + 1) === vPage) {
						vMnuItem.className = vMnuItem.className.replace("mnuSel_no", "mnuSel_yes");
						vFound = true;
						break;
					}
				}
				if (!vFound) vMnuItems[0].className = vMnuItems[0].className.replace("mnuSel_no", "mnuSel_yes");
			}
		}
	},

	/** scCoLib OnLoad  */
	onLoad: function () {
		try{
			// Purge empty menus
			const vMenus = scPaLib.findNodes("des:menu");
			for (i = 0; i < vMenus.length; i++) {
				if (vMenus[i].childNodes.length == 0) vMenus[i].parentNode.removeChild(vMenus[i]);
			}
		} catch (e) {
			console.error(`ERROR - tplMgr.onLoad : ${e}`);
		}
	},
	loadSortKey: "AZ",

	makeVisible: function (pNode) {
		// Ouvre bloc collapsable contenant pNode
		const vCollBlks = scPaLib.findNodes("anc:.collBlk_closed", pNode);
		for (let i=0; i<vCollBlks.length; i++){
			vCollBlks[i].fTitle.onclick();
		}
	},

	setExpandAll: function (pExpand) {
		if ("dokielMgr" in window) {
			if (pExpand) dokielMgr.cancelStepMode();
			dokielMgr.setInteractiveScreenMode(!pExpand);
		}
		if ("scSiLib" in window) scSiLib.fireResizedNode(sc$("main"));
	},

	secOutToggle: function () {
		if (!this.fSecOutCo || !this.fSecOutBtn) return false;
		scDynUiMgr.collBlkToggle(this.fSecOutBtn, this.fSecOutCo, "secOut_op", "secOut_cl");
		this.fStore.set("secOutCollapse", this.fSecOutCo.style.display === "none");
		return false;
	},

	hashCheck: function () {
		let vHash = window.location.hash;
		if (vHash.length > 0)  vHash = vHash.substring(1);
		if (vHash === "outline") document.body.classList.toggle("outline", true);
		else document.body.classList.toggle("outline", false);
	},

	loadPage: function (pUrl) {
		if (pUrl && pUrl.length > 0) {
			window.location.href = scServices.scLoad.getPathFromRoot(pUrl);
		}
	},

	scrollTo: function (pId) {
		this.loadPage(this.fPageCurrent + "#" + pId);
	},

	/** isNoAjax */
	isNoAjax: function () {
		return this.fNoAjax;
	},
	/** setNoAjax */
	setNoAjax: function () {
		if (!this.fNoAjaxWarn) alert(this.fStrings[10]);
		this.fNoAjax = true;
		this.fNoAjaxWarn = true;
	},
	/* === Callback functions =================================================== */
	/** Tooltip lib show callback */
	sTtShow: function (pNode) {
		if (!pNode.fOpt.FOCUS && !pNode.onblur) pNode.onblur = function () {
			scTooltipMgr.hideTooltip(true);
		};
	},
	/** Tooltip lib hide callback : this = scTooltipMgr */
	sTtHide: function (pNode) {
		if (pNode) pNode.focus();
	},
	/** Collapable block Callback functions. */
	sCollBlkOpen: function (pCo, pTitle) {
		if (pTitle) pTitle.title = tplMgr.fStrings[2].replace("%s", (pTitle.innerText ? pTitle.innerText : pTitle.textContent));
	},
	sCollBlkClose: function (pCo, pTitle) {
		if (pTitle) pTitle.title = tplMgr.fStrings[3].replace("%s", (pTitle.innerText ? pTitle.innerText : pTitle.textContent));
	},

	/* === Utilities ============================================================ */
	/** tplMgr.xAddBtn : Add a HTML button to a parent node. */
	xAddBtn: function (pParent, pClassName, pCapt, pTitle, pNxtSib) {
		const vBtn = pParent.ownerDocument.createElement("a");
		vBtn.className = pClassName;
		vBtn.fName = pClassName;
		vBtn.href = "#";
		vBtn.target = "_self";
		if (pTitle) vBtn.setAttribute("title", pTitle);
		if (pCapt) vBtn.innerHTML = "<span>" + pCapt + "</span>"
		if (pNxtSib) pParent.insertBefore(vBtn, pNxtSib)
		else pParent.appendChild(vBtn);
		return vBtn;
	},

	/** tplMgr.xSwitchClass - replace a class name. */
	xSwitchClass: function (pNode, pClassOld, pClassNew, pAddIfAbsent, pMatchExact) {
		const vAddIfAbsent = typeof pAddIfAbsent == "undefined" ? false : pAddIfAbsent;
		const vMatchExact = typeof pMatchExact == "undefined" ? true : pMatchExact;
		const vClassName = pNode.className;
		const vReg = new RegExp("\\b" + pClassNew + "\\b");
		if (vMatchExact && vClassName.match(vReg)) return;
		let vClassFound = false;
		if (pClassOld && pClassOld !== "") {
			if (vClassName.indexOf(pClassOld) === -1) {
				if (!vAddIfAbsent) return;
				else if (pClassNew && pClassNew !== '') pNode.className = vClassName + " " + pClassNew;
			} else {
				const vCurrentClasses = vClassName.split(' ');
				const vNewClasses = new Array();
				let i = 0;
				const n = vCurrentClasses.length;
				for (; i < n; i++) {
					const vCurrentClass = vCurrentClasses[i];
					if (vMatchExact && vCurrentClass !== pClassOld || !vMatchExact && vCurrentClass.indexOf(pClassOld) !== 0) {
						vNewClasses.push(vCurrentClasses[i]);
					} else {
						if (pClassNew && pClassNew !== '') vNewClasses.push(pClassNew);
						vClassFound = true;
					}
				}
				pNode.className = vNewClasses.join(' ');
			}
		}
		return vClassFound;
	},

	/** Local Storage API (localStorage/cookie) */
	LocalStore: function (pId) {
		if (pId && !/^[a-z][a-z0-9]+$/.exec(pId)) throw new Error("Invalid store name");
		this.fId = pId || "";
		this.fRootKey = scServices.scLoad.fRootUrl;
		if (typeof localStorage != "undefined") {
			this.get = function (pKey) {
				const vRet = localStorage.getItem(this.fRootKey + this.xKey(pKey));
				return (typeof vRet == "string" ? unescape(vRet) : null)
			};
			this.set = function (pKey, pVal) {
				localStorage.setItem(this.fRootKey + this.xKey(pKey), escape(pVal))
			};
		} else {
			this.get = function (pKey) {
				const vReg = new RegExp(this.xKey(pKey) + "=([^;]*)");
				const vArr = vReg.exec(document.cookie);
				if (vArr && vArr.length === 2) return (unescape(vArr[1])); else return null
			};
			this.set = function (pKey, pVal) {
				document.cookie = this.xKey(pKey) + "=" + escape(pVal)
			};
		}
		this.xKey = function (pKey) {
			return this.fId + this.xEsc(pKey)
		};
		this.xEsc = function (pStr) {
			return "LS" + pStr.replace(/ /g, "_")
		};
	}
};

/* responsive management */
window.responsive = {
	fMaxWidth: null,
	fColNum: null,
	fListeners: {layoutChange: [], scrollChange: []},
	fPrevScrollpos: window.scrollY,
	init: function (pParam) {
		if (!pParam) pParam = {responsiveWidth:900};
		try {
			this.fMaxWidth = pParam.responsiveWidth;
			const vOneCol = window.matchMedia("(max-width: " + this.fMaxWidth + "px)");
			vOneCol.addListener(function (pMatch) {
				if (pMatch.matches) responsive.setColumns(1);
				else responsive.setColumns(2);
			});
			if (vOneCol.matches) this.setColumns(1);
			else this.setColumns(2);
			window.onscroll = function () {
				/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
				const vCurrentScrollPos = window.scrollY;
				if (responsive.fPrevScrollpos < vCurrentScrollPos) document.body.classList.add("nav_stuck_yes");
				else document.body.classList.remove("nav_stuck_yes");
				responsive.fPrevScrollpos = vCurrentScrollPos;
				responsive.fireEvent("scrollChange", vCurrentScrollPos);
			};
		} catch (e) {
			console.error("ERROR - responsive.init : " + e)
		}
	},
	registerListener: function (pListener, pFunc) {
		if (this.fListeners[pListener]) this.fListeners[pListener].push(pFunc);
	},
	fireEvent: function (pListener, pParam) {
		if (this.fListeners[pListener]) {
			for (let i = 0; i < this.fListeners[pListener].length; i++) {
				try {
					this.fListeners[pListener][i](pParam);
				} catch (e) {
				}
			}
		}
	},
	getColumns: function () {
		return this.fColNum;
	},
	setColumns: function (pNum) {
		this.fColNum = pNum;
		this.fireEvent("layoutChange", pNum);
	}
};
