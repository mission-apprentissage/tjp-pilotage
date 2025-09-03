/* template management */
window.tplMgr = {
	fCbkPath: "des:.cbkClosed",
	fCbkInit: true,
	fNoAjax: false,

	fStrings: ["Retour à la page en cours du contenu", "",
		/*02*/      "Cacher le contenu de \'%s\'", "Afficher le contenu de \'%s\'",
		/*04*/      "Ce site utilise un système de mesure d\'audience qui nécessite l\'utilisation de cookies pour comprendre et améliorer l\'expérience du visiteur.", "",
		/*06*/      "Accepter", "Refuser",
		/*08*/      "Cookies", "Gestion des cookies",
		/*10*/      "Le chargement dynamique de ressources est désactivé.\n\nLes restrictions sécuritaires de votre navigateur interdisent l\'utilisation de certaines fonctionnalités telles que la recherche ou l\'exploration du menu.", ""],

	init: function () {
		try {
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
				const vCookieWarnBar = this.fCookieWarnBar = scDynUiMgr.addElement("div", scPaLib.findNode("bod:"), "cookieWarnBar" + (localStorage.getItem("AcknowledgeAnalytics") ? " acknowledged" : ""), scPaLib.findNode("bod:/chi:"));
				const vMsgBox = scDynUiMgr.addElement("span", vCookieWarnBar, "cookieWarnMsg");
				const vMsg = this.fStrings[_CookieWarn === "analytics" ? 4 : 5];
				vMsgBox.innerHTML = vMsg + " ";
				const vBtnOk = scDynUiMgr.addElement("a", vCookieWarnBar, "cookieWarnBtnOk");
				vBtnOk.setAttribute("role", "button");
				vBtnOk.href = "#";
				vBtnOk.innerHTML = '<span>' + this.fStrings[6] + '</span>';
				vBtnOk.onclick = function () {
					const vIsActive = localStorage.getItem("ActivateAnalytics");
					localStorage.setItem("ActivateAnalytics", true);
					localStorage.setItem("AcknowledgeAnalytics", true);
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
					const vIsActive = localStorage.getItem("ActivateAnalytics");
					localStorage.removeItem("ActivateAnalytics");
					localStorage.setItem("AcknowledgeAnalytics", true);
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
					localStorage.removeItem("AcknowledgeAnalytics");
					tplMgr.fCookieWarnBar.classList.remove("acknowledged");
					tplMgr.xSwitchClass(scPaLib.findNode("bod:"), "cookieWarnBar_off", "cookieWarnBar_on", true);
					return false;
				}
				document.body.classList.add("cookieWarnBar_" + (localStorage.getItem("AcknowledgeAnalytics") ? "off" : "on"))
			}

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

	/** Local Storage API (localStorage/userData/cookie) */
	LocalStore: function (pId) {
		if (pId && !/^[a-z][a-z0-9]+$/.exec(pId)) throw new Error("Invalid store name");
		this.fId = pId || "";
		this.fRootKey = document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/")) + "/";
		if (typeof localStorage != "undefined") {
			this.get = function (pKey) {
				const vRet = localStorage.getItem(this.fRootKey + this.xKey(pKey));
				return (typeof vRet == "string" ? unescape(vRet) : null)
			};
			this.set = function (pKey, pVal) {
				localStorage.setItem(this.fRootKey + this.xKey(pKey), escape(pVal))
			};
		} else if (window.ActiveXObject) {
			this.get = function (pKey) {
				this.xLoad();
				return this.fIE.getAttribute(this.xEsc(pKey))
			};
			this.set = function (pKey, pVal) {
				this.fIE.setAttribute(this.xEsc(pKey), pVal);
				this.xSave()
			};
			this.xLoad = function () {
				this.fIE.load(this.fRootKey + this.fId)
			};
			this.xSave = function () {
				this.fIE.save(this.fRootKey + this.fId)
			};
			this.fIE = document.createElement('div');
			this.fIE.style.display = 'none';
			this.fIE.addBehavior('#default#userData');
			document.body.appendChild(this.fIE);
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
	fMaxWidth: 800,
	fColNum: null,
	fListeners: {layoutChange: [], scrollChange: []},
	fPrevScrollpos: window.scrollY,
	init: function () {
		try {
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
