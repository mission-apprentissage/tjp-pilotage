/* ========== Search manager ================================================ */
window.searchMgr = {
	fPathRoot: "bod:",
	fPathHighlight: "ide:content",
	fPathSchBoxParent: "ide:header",
	fPathResBoxParent: "ide:header",
	fOpt: {searchType: 'treeResults'},
	fMaxFilterDisplay: 100,
	fOverflowMethod: "",
	fUnifiedNav: false,
	sFilterTgleClosed: scPaLib.compileFilter(".mnu_tgle_c"),
	fStrings: ["Annuler", "Annuler la recherche",
		/*02*/      "Rechercher dans le contenu", "Aucun résultat.",
		/*04*/      "1 page trouvée", "%s pages trouvées",
		/*06*/      "Précisez votre recherche...", "Termes recherchés :",
		/*08*/      "Précédent", "Occurrence précédente",
		/*10*/      "Suivant", "Occurrence suivante",
		/*12*/      "Page précédente", "Page suivante",
		/*14*/      "Liste", "Afficher/cacher la liste des pages trouvées",
		/*16*/      "%s occurrences", "1 occurrence",
		/*18*/      "plus de 8 occurrences", "%s",
		/*20*/      "Pas de résultat de recherche", "Pages orphelines",
		/*22*/      "Rechercher", "Ouvrir le menu",
		/*24*/      "Fermer le menu", "Lancer la recherche"],

	/* ========== Public functions ============================================== */

	declareIndex: function (pIdx) {
		this.fIdxUrl = scCoLib.hrefBase().substring(0, scCoLib.hrefBase().lastIndexOf("/")) + "/" + pIdx;
	},

	setUnifiedNavigation: function (pFlag) {
		this.fUnifiedNav = pFlag;
	},

	init: function (pOpt) {
		try {
			if (typeof pOpt != "undefined") {
				if (typeof pOpt.searchType != "undefined") this.fOpt.searchType = pOpt.searchType;
			}
			this.fRoot = scPaLib.findNode(this.fPathRoot);
			this.initBoxes();

			if (!Function.prototype.bind) {
				Function.prototype.bind = function (oThis) {
					if (typeof this !== "function") throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
					const aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {}, fBound = function () {
						return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
					};
					fNOP.prototype = this.prototype;
					fBound.prototype = new fNOP();
					return fBound;
				};
			}
			scOnLoads[scOnLoads.length] = this;
		} catch (e) {
			console.error("ERROR - searchMgr.init : " + e)
		}
	},

	onLoad: function () {
		try {
			this.initSearchElements();
			this.getLastResults();
			let vCnt = 0;
			for (let i in this.fResult) if (this.fResult[i].url === tplMgr.fPageCurrent) vCnt++;
			if (vCnt === 0) scServices.scSearch.resetLastQuery();
			else {
				this.declareManager();
				this.xUpdateUi();
				if (this.fUnifiedNav && this.fTextHits) {
					if (tplMgr.fStore && tplMgr.fStore.get("gotoLastHit") === "true" && this.fTextHits.length > 1) {
						this.fCurrHit = this.fTextHits.length - 2
						this.sNxtHit();
					} else this.sNxtHit();
					if (tplMgr.fStore && tplMgr.fStore.get("gotoLastHit") === "true") tplMgr.fStore.set("gotoLastHit", false);
				}
			}
		} catch (e) {
			console.error("ERROR - searchMgr.onLoad : " + e)
		}
	},

	initBoxes: function () {
		const vSchBox = scDynUiMgr.addElement("div", scPaLib.findNode(this.fPathSchBoxParent), "searchFra");
		this.fSearchCmds = scDynUiMgr.addElement("div", vSchBox, "schCmds");
		this.fSearchRes = scDynUiMgr.addElement("div", scPaLib.findNode(this.fPathResBoxParent), "searchResults");
	},

	initSearchElements: function () {
		const vSearchForm = scDynUiMgr.addElement("form", this.fSearchCmds, "schForm");
		vSearchForm.setAttribute("role", "search");
		vSearchForm.setAttribute("autocomplete", "off");
		const vSearchLabel = scDynUiMgr.addElement("label", vSearchForm, "schLabel");
		vSearchLabel.innerHTML = this.fStrings[22];
		vSearchLabel.setAttribute("for", this.fStrings[22]);
		this.fSearchInput = scDynUiMgr.addElement("input", vSearchForm, "schInput");
		this.fSearchInput.type = "text";
		this.fSearchInput.id = this.fSearchInput.name = this.fSearchInput.placeholder = this.fStrings[22];
		this.fSearchInput.title = this.fStrings[2];
		this.fSearchInput.onkeyup = this.sKeyUp;
		this.fSearchLaunch = scDynUiMgr.addElement("input", vSearchForm, "schBtnLaunch");
		this.fSearchLaunch.type = "submit";
		this.fSearchLaunch.value = "?";
		this.fSearchLaunch.title = this.fStrings[25];
		this.fSearchLaunch.onclick = this.sFind;
		this.fSearchPropose = scDynUiMgr.addElement("div", this.fSearchCmds, "schPropose schProp_no");

		const vResultFrame = scDynUiMgr.addElement("div", this.fSearchRes, "schResFrame" + (this.fUnifiedNav ? " schUnifiedNav" : ""));
		const vResultList = scDynUiMgr.addElement("div", vResultFrame, "schResList");
		this.fResultScroll = scDynUiMgr.addElement("div", vResultList, "schResListSrl");
		this.fResultTgle = this.xAddBtn(vResultFrame, "schBtnTgle schBtnTgle_cls", this.fStrings[14], this.fStrings[15]);
		this.fResultTgle.onclick = this.sListTgle;
		this.fSearchReset = this.xAddBtn(vResultFrame, "schBtnReset", "X", this.fStrings[1]);
		this.fSearchReset.onclick = this.sReset;

		const vSchHitBox = scDynUiMgr.addElement("div", vResultFrame, "schHitBox");
		this.fHitLbl = scDynUiMgr.addElement("span", vSchHitBox, "schHitLbl");
		this.fBtnPrvHit = this.xAddBtn(vSchHitBox, "schBtnPrvHit", this.fStrings[8], this.fStrings[9]);
		this.fBtnPrvHit.onclick = this.sPrvHit;
		this.fHitCnt = scDynUiMgr.addElement("span", vSchHitBox, "schHitCnt");
		this.fBtnNxtHit = this.xAddBtn(vSchHitBox, "schBtnNxtHit", this.fStrings[10], this.fStrings[11]);
		this.fBtnNxtHit.onclick = this.sNxtHit;

		const vSchPageBox = scDynUiMgr.addElement("div", vResultFrame, "schPageBox");
		this.fSearchLbl = scDynUiMgr.addElement("span", vSchPageBox, "schResLbl");
		this.fSearchCnt = scDynUiMgr.addElement("span", vSchPageBox, "schResCnt");
		if (!this.fUnifiedNav) {
			this.fBtnPrv = this.xAddBtn(vSchPageBox, "schBtnPrv", this.fStrings[8], this.fStrings[12]);
			this.fBtnPrv.onclick = this.sPrv;
			this.fBtnNxt = this.xAddBtn(vSchPageBox, "schBtnNxt", this.fStrings[10], this.fStrings[13]);
			this.fBtnNxt.onclick = this.sNxt;
		}
	},

	focus: function () {
		if (this.fSearchInput) this.fSearchInput.focus();
	},

	propose: function () {
		try {
			const vStr = this.fSearchInput.value;
			const vWds = scServices.scSearch.propose(this.fIdxUrl, vStr, {async: true});
			const vShowProp = !vWds || (vWds && vWds.length === 0 && vStr.length < 3) || vWds && vWds.length > 0;
			this.xSwitchClass(this.fSearchPropose, "schProp_" + (vShowProp ? "no" : "yes"), "schProp_" + (vShowProp ? "yes" : "no"), true);
			this.fSearchPropose.fShown = !!vShowProp;

			let vProp;
			this.fSearchPropose.innerHTML = "";
			if (vWds && vWds.length > 0) {
				for (let i = 0; i < vWds.length; i++) {
					vProp = this.xAddBtn(this.fSearchPropose, "schBtnPropose", vWds[i].wrd);
					vProp.onclick = this.sProp;
					vProp.onkeyup = this.sPropKeyUp;
				}
			} else if (scServices.scSearch.isLoadable(this.fIdxUrl) === false) {
				this.xDisable();
			} else if (!vWds || (vWds && vWds.length === 0 && vStr.length < 3)) {
				scDynUiMgr.addElement("span", this.fSearchPropose, "schProposeExceeded").innerHTML = this.fStrings[6];
			}
		} catch (e) {
			console.error("ERROR - searchMgr.propose : " + e)
		}
	},

	find: function () {
		this.xResetHighlight();
		this.xSwitchClass(this.fSearchPropose, "schProp_yes", "schProp_no", true);
		this.fSearchPropose.fShown = false;
		this.fSearchPropose.innerHTML = "";
		scServices.scSearch.query({id: this.fIdxUrl, str: this.fSearchInput.value});
		this.declareManager();
		this.getLastResults();
		this.xUpdateUi();
		this.xListTgle(true);
	},

	reset: function () {
		if (!this.fSearchDisplay) return;
		scServices.scSearch.resetLastQuery();
		searchMgr.xResetUi();
	},

	declareManager: function () {
		if (!this.fResultMgr) {
			const vOutline = outMgr.xGetOutline();
			const vSrcMenu = {};
			vSrcMenu.children = vOutline.menu;
			// Ajout orphans
			if (vOutline.orphans) vSrcMenu.children = this.fOpt.searchType !== "listResults" ? vSrcMenu.children.concat([{
				"children": vOutline.orphans,
				"label": this.fStrings[21],
				"url": "null"
			}]) : vSrcMenu.children.concat(vOutline.orphans);
			vSrcMenu.url = null;
			this.fResultMgr = this.fOpt.searchType === "listResults" ? new this.ListResultManager(this.fResultScroll, vSrcMenu) : new this.TreeResultManager(this.fResultScroll, vSrcMenu);
		}
	},

	getLastResults: function () {
		const vResultSet = scServices.scSearch.getLastQueryResults();
		if (vResultSet) this.fResult = vResultSet.list;
		else this.fResult = null;
	},

	/* === Callback functions =================================================== */
	sReset: function () {
		searchMgr.reset();
		return false;
	},

	sFind: function () {
		searchMgr.find();
		return false;
	},

	sListTgle: function () {
		searchMgr.xListTgle();
		return false;
	},

	sProp: function () {
		searchMgr.fSearchInput.value = this.firstChild.innerHTML;
		searchMgr.find();
		return false;
	},

	sPropKeyUp: function (pEvt) {
		const vEvt = pEvt || window.event;
		let vNode;
		switch (vEvt.keyCode) {
			case 40:
				vNode = scPaLib.findNode("nsi:a", this);
				break;
			case 38:
				vNode = scPaLib.findNode("psi:a", this);
				if (!vNode) vNode = scPaLib.findNode("anc:.schCmds/chi:.schInput", this);
		}
		if (vNode) vNode.focus();
	},

	sKeyUp: function (pEvt) {
		const vEvt = pEvt || window.event;
		if (this.value.length > 0) searchMgr.xSwitchClass(searchMgr.fSearchCmds, "schCmds_noact", "schCmds_act", true);
		else searchMgr.xSwitchClass(searchMgr.fSearchCmds, "schCmds_act", "schCmds_noact", true);

		if (this.value.length === 0) searchMgr.xResetUi();
		if (this.value.length > 0) searchMgr.propose();
		else {
			searchMgr.xSwitchClass(searchMgr.fSearchPropose, "schProp_yes", "schProp_no", true);
			searchMgr.fSearchPropose.fShown = false;
			searchMgr.fSearchPropose.innerHTML = "";
		}
		if (this.value.length > 2 && vEvt.keyCode === 13) searchMgr.find();
		if (searchMgr.fSearchPropose.fShown && vEvt.keyCode === 40) {
			const vProp = scPaLib.findNode("chi.a", searchMgr.fSearchPropose);
			if (vProp) vProp.focus();
		}
		if (vEvt.stopPropagation) vEvt.stopPropagation();
		else vEvt.cancelBubble = true;
	},

	sPrv: function () {
		if (searchMgr.fResultMgr.hasPreviousPage(tplMgr.fPageCurrent)) {
			if (searchMgr.fUnifiedNav && tplMgr.fStore) tplMgr.fStore.set("gotoLastHit", true);
			tplMgr.loadPage(searchMgr.fResultMgr.getPreviousPage(tplMgr.fPageCurrent));
		}
		return false;
	},

	sNxt: function () {
		if (searchMgr.fResultMgr.hasNextPage(tplMgr.fPageCurrent)) {
		}
		tplMgr.loadPage(searchMgr.fResultMgr.getNextPage(tplMgr.fPageCurrent));
		return false;
	},

	sPrvHit: function () {
		if (searchMgr.fTextHits && searchMgr.fTextHits.length > 0 && searchMgr.fCurrHit > 0) {
			searchMgr.xListTgle(false);
			searchMgr.xSwitchClass(searchMgr.fTextHits[searchMgr.fCurrHit], "schHit_current", "schHit");
			searchMgr.xSwitchClass(searchMgr.fTextHits[--searchMgr.fCurrHit], "schHit", "schHit_current");
			// Si tabBox les onglets sont ouverts
			searchMgr.xIsTabBox();
			tplMgr.scrollTo(searchMgr.fTextHits[searchMgr.fCurrHit].id);
			searchMgr.xUpdateHitUi();
		} else searchMgr.sPrv();
		return false;
	},

	sNxtHit: function () {
		if (searchMgr.fTextHits && searchMgr.fTextHits.length > 0 && searchMgr.fCurrHit < searchMgr.fTextHits.length - 1) {
			searchMgr.xListTgle(false);
			if (searchMgr.fCurrHit >= 0) searchMgr.xSwitchClass(searchMgr.fTextHits[searchMgr.fCurrHit], "schHit_current", "schHit");
			searchMgr.xSwitchClass(searchMgr.fTextHits[++searchMgr.fCurrHit], "schHit", "schHit_current");
			// Si tabBox les onglets sont ouverts
			searchMgr.xIsTabBox();
			tplMgr.scrollTo(searchMgr.fTextHits[searchMgr.fCurrHit].id);
			searchMgr.xUpdateHitUi();
		} else searchMgr.sNxt();
		return false;
	},

	/* ========== Private functions =========================================== */
	xDisable: function () {
		tplMgr.setNoAjax();
		searchMgr.switchClass(this.fSearchPropose, "schProp_yes", "schProp_no", true);
		this.fSearchPropose.fShown = false;
		this.fSearchPropose.innerHTML = "";
		this.fSearchInput.value = "";
		this.fSearchInput.disabled = true;
		this.fSearchLaunch.disabled = true;
	},

	xIsTabBox: function () {
		const vTabBoxCo = scPaLib.findNode("anc:.tabBoxPnl_co", searchMgr.fTextHits[searchMgr.fCurrHit]);
		if (vTabBoxCo) vTabBoxCo.fBtn.click();
	},

	xListTgle: function (pState) {
		if (typeof pState == "undefined") pState = !this.fListOpen;
		if (pState) {
			tplMgr.xSwitchClass(searchMgr.fRoot, "schDisplayList_off", "schDisplayList_on", true);
		} else {
			tplMgr.xSwitchClass(searchMgr.fRoot, "schDisplayList_on", "schDisplayList_off", true);
		}
		this.fListOpen = pState;
	},

	xResetUi: function () {
		if (!this.fSearchDisplay) return;
		this.fSearchDisplay = false;
		searchMgr.xListTgle(false);
		tplMgr.xSwitchClass(this.fRoot, "schDisplay_on", "schDisplay_off", true);
		tplMgr.xSwitchClass(this.fRoot, "schDisplayList_on", "schDisplayist_off", true);
		this.fSearchInput.value = "";
		this.fSearchInput.className = "schInput";
		this.fSearchLbl.innerHTML = "";
		searchMgr.xSwitchClass(searchMgr.fSearchPropose, "schProp_yes schProp_no", "", true);
		this.fSearchPropose.innerHTML = "";
		this.xResetHighlight();
	},

	xUpdateUi: function () {
		if (this.fSearchInput.value.length > 0) searchMgr.xSwitchClass(this.fSearchCmds, "schCmds_noact", "schCmds_act", true);
		else searchMgr.xSwitchClass(this.fSearchCmds, "schCmds_act", "schCmds_noact", true);
		if (!this.fResult) return;

		this.fSearchDisplay = true;
		searchMgr.xSwitchClass(searchMgr.fRoot, "schDisplay_off", "schDisplay_on", true);
		this.fResultScroll.innerHTML = "";

		if (this.fResult && this.fResult.length > 0) {
			this.fResultMgr.buildResult(this.fResult);
			this.fResultMgr.loadPage(tplMgr.fPageCurrent);

			searchMgr.xSwitchClass(searchMgr.fSearchRes, "schDisplay_", "schDisplay_" + (this.fResult.length === 1 ? "one" : "many"), true, false);
			const vRoot = scPaLib.findNode(this.fPathHighlight);
			if (!vRoot) return;
			this.xHighlight(vRoot, scServices.scSearch.getLastSearch(this.fIdxUrl));
			searchMgr.xUpdateResUi();
		} else {
			this.fSearchLbl.innerHTML = this.fStrings[3];
			const vNoResult = scDynUiMgr.addElement("div", this.fResultScroll, "schNoRes");
			vNoResult.innerHTML = this.fStrings[20];
			this.xSwitchClass(this.fSearchRes, "schDisplay_", "schDisplay_none", true, false);
			this.xResetHighlight();
		}

	},

	xUpdateResUi: function () {
		if (!this.fUnifiedNav) {
			if (this.fResultMgr.hasPreviousPage(tplMgr.fPageCurrent)) this.xSwitchClass(this.fBtnPrv, "schBtnAct_no", "schBtnAct_yes", true);
			else this.xSwitchClass(this.fBtnPrv, "schBtnAct_yes", "schBtnAct_no", true);
			if (this.fResultMgr.hasNextPage(tplMgr.fPageCurrent)) this.xSwitchClass(this.fBtnNxt, "schBtnAct_no", "schBtnAct_yes", true);
			else this.xSwitchClass(this.fBtnNxt, "schBtnAct_yes", "schBtnAct_no", true);
		}
		const vPageCount = this.fResultMgr.getPageCount();
		if (vPageCount && vPageCount > 0) {
			if (this.fResultMgr.getPageRank(tplMgr.fPageCurrent)) this.fSearchCnt.innerHTML = this.fResultMgr.getPageRank(tplMgr.fPageCurrent) + "/" + vPageCount;
			this.fSearchLbl.innerHTML = (vPageCount === 1 ? this.fStrings[4] : this.fStrings[5].replace("%s", vPageCount));
			this.xSwitchClass(this.fSearchRes, "schDisplay_", "schDisplay_" + (vPageCount === 1 ? "one" : "many"), true, false);
		} else this.fSearchLbl.innerHTML = this.fStrings[3];
	},

	xUpdateHitUi: function () {
		if (!this.fUnifiedNav) {
			if (this.fTextHits && this.fTextHits.length > 0 && this.fCurrHit > 0) this.xSwitchClass(this.fBtnPrvHit, "schBtnHitAct_no", "schBtnHitAct_yes", true);
			else this.xSwitchClass(this.fBtnPrvHit, "schBtnHitAct_yes", "schBtnHitAct_no", true);
			if (this.fTextHits && this.fTextHits.length > 0 && this.fCurrHit < this.fTextHits.length - 1) this.xSwitchClass(this.fBtnNxtHit, "schBtnHitAct_no", "schBtnHitAct_yes", true);
			else this.xSwitchClass(this.fBtnNxtHit, "schBtnHitAct_yes", "schBtnHitAct_no", true);
		} else {
			if ((this.fTextHits && this.fTextHits.length > 0 && this.fCurrHit > 0) || this.fResultMgr.hasPreviousPage(tplMgr.fPageCurrent)) this.xSwitchClass(this.fBtnPrvHit, "schBtnHitAct_no", "schBtnHitAct_yes", true);
			else this.xSwitchClass(this.fBtnPrvHit, "schBtnHitAct_yes", "schBtnHitAct_no", true);
			if ((this.fTextHits && this.fTextHits.length > 0 && this.fCurrHit < this.fTextHits.length - 1) || this.fResultMgr.hasNextPage(tplMgr.fPageCurrent)) this.xSwitchClass(this.fBtnNxtHit, "schBtnHitAct_no", "schBtnHitAct_yes", true);
			else this.xSwitchClass(this.fBtnNxtHit, "schBtnHitAct_yes", "schBtnHitAct_no", true);
		}
		if (this.fTextHits.length > 0 && this.fCurrHit >= 0) this.fHitCnt.innerHTML = (this.fCurrHit + 1) + "/" + this.fTextHits.length;
		else this.fHitCnt.innerHTML = "";
	},

	xHighlight: function (pRoot, pStr) {
		const vTextNodes = [];
		const vNoIdxFilter = scPaLib.compileFilter(".noIndex|.footNotes|script|noscript|object");
		const textNodeWalker = function (pNde) {
			while (pNde) {
				if (pNde.nodeType === 3) vTextNodes.push(pNde);
				else if (pNde.nodeType === 1 && !scPaLib.checkNode(vNoIdxFilter, pNde)) textNodeWalker(pNde.firstChild);
				pNde = pNde.nextSibling;
			}
		};
		textNodeWalker(pRoot.firstChild);
		let i, j, k, vTxtNode, vTxtVal, vTxtNorm, vTxtMached, vHolder, vToken, vHits, vHit, vReg, vOffset, vIsOldOffset;
		const vTokens = scServices.scSearch.buildTokens(this.fIdxUrl, pStr);
		for (i = 0; i < vTokens.length; i++) vTokens[i].fCount = 0;
		for (i = 0; i < vTextNodes.length; i++) {
			vHits = [];
			vTxtNode = vTextNodes[i];
			vTxtNorm = scServices.scSearch.normalizeString(this.fIdxUrl, vTxtNode.nodeValue);
			for (j = 0; j < vTokens.length; j++) {
				vToken = vTokens[j];
				if (!vToken.neg && vTxtNorm.length >= vToken.wrd.length) {
					if (vToken.exact) vReg = new RegExp("(?:^|\\W)(" + vToken.wrd + ")(?:$|\\W)", "i");
					else if (vToken.start) vReg = new RegExp("(?:^|\\W)(" + vToken.wrd + ")", "i");
					else vReg = new RegExp(vToken.wrd, "i");
					vOffset = vTxtNorm.search(vReg);
					while (vOffset >= 0) {
						vToken.fCount++
						if (vToken.exact && /\W/.test(vTxtNorm.charAt(vOffset))) vOffset++;
						vIsOldOffset = false;
						vHit = {start: vOffset, end: vOffset + vToken.wrd.length};
						for (k = 0; k < vHits.length; k++) {
							if (vHit.start >= vHits[k].start && vHit.start <= vHits[k].end || vHit.end >= vHits[k].start && vHit.end <= vHits[k].end) {
								vHits[k].start = Math.min(vHit.start, vHits[k].start);
								vHits[k].end = Math.max(vHit.end, vHits[k].end);
								vIsOldOffset = true;
							}
						}
						if (!vIsOldOffset) vHits.push(vHit);
						vOffset = vTxtNorm.substring(vHit.end).search(vReg);
						if (vOffset >= 0) vOffset = vHit.end + vOffset;
					}
				}
			}
			if (vHits.length > 0) {
				// On s'assure de la visibilité du hit
				if ("tplMgr" in window) tplMgr.makeVisible(vTxtNode);
				if ("treeMgr" in window) treeMgr.makeVisible(vTxtNode);
				if ("dokielMgr" in window) dokielMgr.makeVisible(vTxtNode);
				vHits.sort(function (a, b) {
					return a.start - b.start
				});
				let vIdx = 0;
				vTxtMached = "";
				vTxtVal = vTxtNode.nodeValue;
				for (j = 0; j < vHits.length; j++) {
					vHit = vHits[j];
					vTxtMached += vTxtVal.substring(vIdx, vHit.start).replace(/</g, "&lt;");
					vTxtMached += "<span class='schHit' id='schId" + i + j + "'>" + vTxtVal.substring(vHit.start, vHit.end).replace(/</g, "&lt;") + "</span>";
					vIdx = vHit.end;
				}
				vTxtMached += vTxtVal.substring(vHits[vHits.length - 1].end).replace(/</g, "&lt;");
				vHolder = scDynUiMgr.addElement("span", vTxtNode.parentNode, null, vTxtNode);
				vTxtNode.parentNode.removeChild(vTxtNode);
				vHolder.innerHTML = vTxtMached;
			}
		}
		this.fTextHits = scPaLib.findNodes("des:span.schHit", pRoot);
		const vDispTokens = [];
		for (i = 0; i < vTokens.length; i++) {
			vToken = vTokens[i];
			if (!vToken.neg) vDispTokens.push((vToken.exact ? '"' : '') + vToken.wrd + (vToken.exact ? '"' : '') + " <em>(" + vToken.fCount + ")</em>");
		}
		this.fHitLbl.innerHTML = this.fStrings[7] + ' <span class="schTerm">' + this.fStrings[19].replace("%s", vDispTokens.join(", ")) + '</span>';
		this.fCurrHit = -1;
		this.xUpdateHitUi();
	},

	xResetHighlight: function () {
		let i;
		if (!this.fTextHits || this.fTextHits.length === 0) return;
		for (i = 0; i < this.fTextHits.length; i++) {
			const vTextHit = this.fTextHits[i];
			const vParent = vTextHit.parentNode;
			const vTextNode = vParent.ownerDocument.createTextNode(String(vTextHit.firstChild.nodeValue));
			vParent.insertBefore(vTextNode, vTextHit);
			vParent.removeChild(vTextHit);
		}
		this.fTextHits = [];
		this.fCurrHit = -1;
		this.fHitLbl.innerHTML = "";
		const vCbks = scPaLib.findNodes(tplMgr.fCbkPath);
		if (vCbks) {
			for (i in vCbks) {
				const vTgl = scPaLib.findNode("des:a", vCbks[i]);
				if (vTgl && vTgl.className.indexOf("open") >= 0) vTgl.onclick();
			}
		}
	},

	/* === Utilities ============================================================ */

	/** searchMgr.xAddBtn : Add a HTML button to a parent node. */
	xAddBtn: tplMgr.xAddBtn,

	/** searchMgr.xSwitchClass - replace a class name. */
	xSwitchClass: tplMgr.xSwitchClass,


	loadSortKey: "ZZsearchMgr"
};

/** searchMgr.ListResultManager. */
searchMgr.ListResultManager = function (pRoot,pOutline) {
	try{
		const vPagesList = this.fPagesList = {};
		this.fRoot = pRoot;
		const iOutlineWalker = function (pItem, pParent) {
			for (let i = 0; i < pItem.children.length; i++) {
				const vItem = pItem.children[i];
				const vUrl = vItem.url;
				vPagesList[vUrl] = {title: vItem.label, source: vItem.source, id: vItem.id, parent: pParent};
				let vParent = {url: vUrl, label: vItem.label};
				const vPagesParent = pParent ? pParent.concat([vParent]) : [vParent];
				if (pItem.children[i].children) iOutlineWalker(pItem.children[i], vPagesParent);
			}
		};
		iOutlineWalker(pOutline);
	} catch(e){console.error("searchMgr.ListResultManager init : "+e);}
}
searchMgr.ListResultManager.prototype = {
	/** ListResultManager.buildResult */
	buildResult : function(pResult) {
		let vParentLabel;
		this.fResult = pResult.sort(function(a, b){return (scCoLib.toInt(b.cat)  - scCoLib.toInt(a.cat))});
		this.fDedupeResults = [];
		const vRoot = scDynUiMgr.addElement("ul", this.fRoot, "mnu_root");
		for (let i = 0; i < this.fResult.length; i++){
			if(i>=searchMgr.fMaxFilterDisplay)return false;
			const vResult = this.fResult[i];
			const vPageUrl = vResult.url;
			const vPageRes = this.fPagesList[vPageUrl];
			// Dédoublone et crée les entrées pour la création des fils d'ariane
			let vCnt = 0;
			if(vPageRes) {
				let j;
				if(!vPageRes.urls) {
					vPageRes.parents = [];
					vPageRes.urls = [];
					vPageRes.fLiParentBk = [];
				}
				for(j in this.fPagesList){
					if(vPageUrl !== j && vPageRes.id === this.fPagesList[j].id) {
						// Regroupement des parents
						vPageRes.parents[0] = vPageRes.parent;
						vPageRes.parents[vCnt+1] = this.fPagesList[j].parent;
						// Regroupement des urls
						vPageRes.urls[0] = vPageUrl;
						vPageRes.urls[vCnt+1] = j;
						// Suppression des doublons et du champ parent inutile
						delete vPageRes.parent;
						delete this.fPagesList[j];
						vCnt++;
					}
				}
				// Création d'un tableau dédoublonné
				this.fDedupeResults.push(vResult);
				// Création du premier lien
				vPageRes.fLbl = scDynUiMgr.addElement("li",vRoot,"schPgeBk mnu_sel_no schPgeRank_"+vResult.cat);
				const vRankText = vResult.cat > 1 ? (vResult.cat >= 9 ? searchMgr.fStrings[18] : searchMgr.fStrings[16].replace("%s", vResult.cat)) : searchMgr.fStrings[17];
				const vPgeBtn = searchMgr.xAddBtn(vPageRes.fLbl, "schPgeBtn schPgeSource_" + vPageRes.source, vPageRes.title, vPageRes.title + " (" + vRankText + ")");
				vPgeBtn.href = scServices.scLoad.getPathFromRoot(vPageUrl);
				scDynUiMgr.addElement("span",vPgeBtn,"schPgeRank").innerHTML = "<span>" + vRankText + "</span>";
				// Affiche un fil d'ariane si doublons (si la variable urls existe)
				if(vPageRes.urls.length > 1) {
					vPageRes.fLbl.className = vPageRes.fLbl.className + " mnu_b"
					const vTglBtn = searchMgr.xAddBtn(vPageRes.fLbl, "schParent_tgle_c", "+", null, vPgeBtn);
					vTglBtn.onclick = this.toggleParentList;
					vTglBtn.fUl = scDynUiMgr.addElement("ul",vRoot,"schParentList schParentList_c");
					const vParentArr = vPageRes.parents;
					for(j = 0; j < vParentArr.length; j++){
						vPageRes.fLiParentBk[j] = scDynUiMgr.addElement("li",vTglBtn.fUl,"mnu_sel_no");
						const vParentLnk = searchMgr.xAddBtn(vPageRes.fLiParentBk[j], "schParentBtn");
						vParentLnk.href = scServices.scLoad.getPathFromRoot(vPageRes.urls[j]);
						if(vParentArr[j] !== undefined){
							for(let k = 0; k < vParentArr[j].length; k++){
								vParentLabel = scDynUiMgr.addElement("span",vParentLnk,"schParentLabel");
								vParentLabel.innerHTML = " > "+vParentArr[j][k].label;
							}
						}
						vParentLabel = scDynUiMgr.addElement("span", vParentLnk, "schParentLabel");
						vParentLabel.innerHTML = " > "+vPageRes.title;
					}
				}
			}
		}
	},
	/** ListResultManager.hasNextPage */
	hasNextPage : function(pUrl){
		return this.getResultCurrId(pUrl) && this.fDedupeResults[scCoLib.toInt(this.getResultCurrId(pUrl))+1] || !this.getResultCurrId(pUrl) ? true : false;
	},

	/** ListResultManager.hasPreviousPage */
	hasPreviousPage : function(pUrl){
		return this.getResultCurrId(pUrl) && this.fDedupeResults[scCoLib.toInt(this.getResultCurrId(pUrl))-1] ? true : false;
	},

	/** ListResultManager.getNextPage : return the URL of next visible item of the given url in the current displayed menu. */
	getNextPage : function(pUrl){
		return this.fDedupeResults[this.getResultCurrId(pUrl)?scCoLib.toInt(this.getResultCurrId(pUrl))+1:0].url;
	},

	/** ListResultManager.getPreviousPage : return the URL of previous visible item of the given url in the current displayed menu. */
	getPreviousPage : function(pUrl){
		return this.fDedupeResults[scCoLib.toInt(this.getResultCurrId(pUrl))-1].url;
	},

	/** ListResultManager.getPageCount : return the visible page cout the current displayed menu. */
	getPageCount : function(){
		return this.fDedupeResults.length;
	},

	/** ListResultManager.getPreviousPage : return the rank of the given url in the current displayed menu. */
	getPageRank : function(pUrl){
		return this.getResultCurrId(pUrl) ? scCoLib.toInt(this.getResultCurrId(pUrl))+1 : null;
	},
	/** ListResultManager.loadPage */
	loadPage : function(pUrl){
		for(let i in this.fPagesList) {
			if(this.fPagesList[i].urls) {
				for(let j = 0; j < this.fPagesList[i].urls.length; j++) {
					if(pUrl === this.fPagesList[i].urls[j]) {
						searchMgr.xSwitchClass(this.fPagesList[i].fLbl, "mnu_sel_no", "mnu_sel_yes");
						searchMgr.xSwitchClass(this.fPagesList[i].fLiParentBk[j], "mnu_sel_no", "mnu_sel_yes");
					}
				}
			}
		}
		for(let i in this.fDedupeResults) {
			if(pUrl === this.fDedupeResults[i].url) searchMgr.xSwitchClass(this.fPagesList[pUrl].fLbl, "mnu_sel_no", "mnu_sel_yes");
		}
	},
	/** ListResultManager.getResultCurrId */
	getResultCurrId: function(pUrl){
		for(let i in this.fDedupeResults) {
			if(pUrl === this.fDedupeResults[i].url) return i;
		}
	},
	/** ListResultManager.toggleParentList */
	toggleParentList : function() {
		try{
			if (!this) return;
			const vStatus = this.className;
			const vUl = this.fUl;
			if (!vUl) return;
			if(vStatus === "schParent_tgle_c") {
				this.className = "schParent_tgle_o";
				this.innerHTML = "<span>-</span>"
				vUl.className = vUl.className.replace("schParentList_c", "schParentList_o");
				vUl.fClosed = false;
			} else {
				this.className = "schParent_tgle_c";
				this.innerHTML = "<span>+</span>"
				vUl.className = vUl.className.replace("schParentList_o", "schParentList_c");
				vUl.fClosed = true;
			}
		} catch(e){console.error("searchMgr.ListResultManager.toggleParentList : "+e);}
		return false;
	}
}

/** searchMgr.TreeResultManager. */
searchMgr.TreeResultManager = function (pRoot,pOutline) {
	try{
		this.fRoot = pRoot;
		this.fMenu = new searchMgr.MenuManager(pRoot, pOutline,{buildItemCallback:this.setupItem.bind(this)});
	} catch(e){console.error("searchMgr.TreeResultManager init : "+e);}
}
searchMgr.TreeResultManager.prototype = {
	/** TreeResultManager.buildResult */
	buildResult : function(pResult) {
		const vRes = pResult;
		this.fPageList = {ctrl:{},list:[]};
		if (vRes && vRes.length > 0){
			for (let i = 0; i < vRes.length; i++){
				const vPageUrl = vRes[i].url;
				this.fPageList.ctrl[vPageUrl] = vRes[i].cat;
				this.fPageList.list.push(vPageUrl);
			}
			this.fMenu.applyFilter(this.fPageList.list);
		}
	},

	/** TreeResultManager.setupItem */
	setupItem : function(pItem){
		if (!pItem.act) return;
		const vLbl = pItem.fLbl;
		const vLnk = pItem.fLnk;
		const vCat = this.fPageList.ctrl[pItem.url];
		const vCatText = vCat > 1 ? (vCat >= 9 ? searchMgr.fStrings[18] : searchMgr.fStrings[16].replace("%s", vCat)) : searchMgr.fStrings[17];
		if (!vLbl.fClass) vLbl.fClass = vLbl.className;
		if (!vLnk.fContent) vLnk.fContent = vLnk.innerHTML;
		vLbl.className = vLbl.fClass + " schPgeBk schPgeRank_"+vCat;
		vLnk.title = vLnk.title = pItem.label+" ("+vCatText+")";
		vLnk.innerHTML = vLnk.fContent+'<span class="schPgeRank"><span>'+vCatText+'</span></span>';
	},

	/** TreeResultManager.hasNextPage */
	hasNextPage : function(pUrl){
		return (this.fMenu.getNextPageUrl(pUrl, true) ? true : false);
	},

	/** TreeResultManager.hasPreviousPage */
	hasPreviousPage : function(pUrl){
		return (this.fMenu.getPreviousPageUrl(pUrl, true) ? true : false);
	},

	/** TreeResultManager.getNextPage : return the URL of next visible item of the given url in the current displayed menu. */
	getNextPage : function(pUrl){
		return this.fMenu.getNextPageUrl(pUrl);
	},

	/** TreeResultManager.getPreviousPage : return the URL of previous visible item of the given url in the current displayed menu. */
	getPreviousPage : function(pUrl){
		return this.fMenu.getPreviousPageUrl(pUrl);
	},

	/** TreeResultManager.getPageCount : return the visible page cout the current displayed menu. */
	getPageCount : function(){
		return this.fMenu.getPageCount();
	},

	/** TreeResultManager.getPreviousPage : return the rank of the given url in the current displayed menu. */
	getPageRank : function(pUrl){
		return this.fMenu.getPageRank(pUrl);
	},
	/** TreeResultManager.loadPage */
	loadPage : function(pUrl){
		this.fMenu.loadPage(pUrl);
	}
}

/** searchMgr.MenuManager - Menu manager class. */
searchMgr.MenuManager = function (pRoot, pOutline, pOpt) {
	try{
		this.fOpt = {target:"_self",addScroller:false,addTitleAttributes:false,contextRoot:null,neverFilter:false,buildItemCallback:function(pItem){}};
		if (typeof pOpt != "undefined"){
			if (typeof pOpt.target != "undefined") this.fOpt.target = pOpt.target;
			if (typeof pOpt.addScroller != "undefined") this.fOpt.addScroller = pOpt.addScroller;
			if (typeof pOpt.addTitleAttributes != "undefined") this.fOpt.addTitleAttributes = pOpt.addTitleAttributes;
			if (typeof pOpt.contextRoot != "undefined") this.fOpt.contextRoot = pOpt.contextRoot;
			if (typeof pOpt.neverFilter != "undefined") this.fOpt.neverFilter = pOpt.neverFilter;
			if (typeof pOpt.buildItemCallback != "undefined") this.fOpt.buildItemCallback = pOpt.buildItemCallback;
		}
		this.fRoot = pRoot;
		this.fOutline = pOutline;
		this.fRoot.fSrc = pOutline;
		this.fFilter = false;
		let vFirstItem = null;
		const vItemIndex = this.fItemIndex = {};
		const iOutlineInit = function (pItem) {
			if (pItem.url) {
				if (!vItemIndex[pItem.url]) vItemIndex[pItem.url] = [];
				if (!vFirstItem) vFirstItem = pItem;
				vItemIndex[pItem.url].push(pItem);
			}
			if (pItem.children) {
				for (let i = 0; i < pItem.children.length; i++) {
					const vChi = pItem.children[i];
					vChi.par = pItem;
					if (i < pItem.children.length - 1) vChi.ctxNxt = pItem.children[i + 1];
					if (i > 0) vChi.ctxPrv = pItem.children[i - 1];
					vChi.idx = i;
					iOutlineInit(vChi);
				}
			}
		};
		iOutlineInit(this.fOutline);
		const iOutlineWalker = function (pItem) {
			if (pItem.children) pItem.nxt = pItem.children[0];
			else if (pItem.ctxNxt) pItem.nxt = pItem.ctxNxt;
			else if (pItem.par) {
				let vPar = pItem.par;
				while (vPar && !vPar.ctxNxt) vPar = vPar.par;
				if (vPar && vPar.ctxNxt) pItem.nxt = vPar.ctxNxt;
			}
			if (typeof pItem.idx != "undefined" && pItem.idx === 0) pItem.prv = pItem.par;
			else {
				let vPrv = pItem.ctxPrv;
				while (vPrv && typeof vPrv.children != "undefined") vPrv = vPrv.children[vPrv.children.length - 1];
				if (vPrv) pItem.prv = vPrv;
			}
			if (pItem.children) {
				for (let i = 0; i < pItem.children.length; i++) {
					iOutlineWalker(pItem.children[i]);
				}
			}
		};
		iOutlineWalker(this.fOutline);
		this.fFirstItem = vFirstItem;
		this.fFirstFilteredItem = null;

		if (this.fOpt.addScroller) this.buildMenuScroller();
		if (this.fOpt.contextRoot) this.fContext = scDynUiMgr.addElement("span",this.fOpt.contextRoot,"ctx_root");

	} catch(e){console.error("searchMgr.MenuManager init : "+e);}
}
searchMgr.MenuManager.prototype = {
	/** MenuManager.buildMenuScroller - build a menu scroller infrastructre. */
	buildMenuScroller : function() {
		// Init Scroll
		this.fRoot.fMgr = this;
		this.fScrollerEnabled = true;
		this.fRoot.style.overflow = searchMgr.fOverflowMethod;
		const vFra = this.fRoot.parentNode;

		// Init Scroll up button
		this.fSrlUp = scDynUiMgr.addElement("div", vFra, "mnuSrlUpFra", this.fRoot);
		this.fSrlUp.fMgr = this;
		this.fSrlUp.onclick = function(){
			this.fMgr.fSpeed -= 2;
		}
		this.fSrlUp.onmouseover = function(){
			if(this.fMgr.fSpeed >= 0) {
				this.fMgr.fSpeed = -2;
				scTiLib.addTaskNow(this.fMgr);
			}
		}
		this.fSrlUp.onmouseout = function(){
			this.fMgr.fSpeed = 0;
		}
		this.fSrlUpBtn = searchMgr.xAddBtn(this.fSrlUp, "mnuSrlUpBtn", searchMgr.fStrings[0], searchMgr.fStrings[1]);
		this.fSrlUpBtn.fMgr = this;
		this.fSrlUpBtn.onclick = function(){
			this.fMgr.setScrollStep(-20);
			return false;
		}
		// Init Scroll down button
		this.fSrlDwn = scDynUiMgr.addElement("div", vFra, "mnuSrlDwnFra");
		this.fSrlDwn.fMgr = this;
		this.fSrlDwn.onclick = function(){
			this.fMgr.fSpeed += 2;
		}
		this.fSrlDwn.onmouseover = function(){
			if(this.fMgr.fSpeed <= 0) {
				this.fMgr.fSpeed = 2;
				scTiLib.addTaskNow(this.fMgr);
			}
		}
		this.fSrlDwn.onmouseout = function(){
			this.fMgr.fSpeed = 0;
		}
		this.fSrlDwnBtn = searchMgr.xAddBtn(this.fSrlDwn, "mnuSrlDwnBtn", searchMgr.fStrings[2], searchMgr.fStrings[3]);
		this.fSrlDwnBtn.fMgr = this;
		this.fSrlDwnBtn.onclick = function(){
			this.fMgr.setScrollStep(20);
			return false;
		}
		// Init scroll manager
		this.checkScrollBtns();
		this.ensureVisible();
		scSiLib.addRule(this.fRoot, this);
		this.fRoot.onscroll = function(){this.fMgr.checkScrollBtns()};
		this.fRoot.onmousewheel = function(){this.fMgr.setScrollStep(Math.round(-event.wheelDelta/(scCoLib.isIE ? 60 : 40)))}; //IE, Safari, Chrome, Opera.
		if(this.fRoot.addEventListener) this.fRoot.addEventListener('DOMMouseScroll', function(pEvent){this.fMgr.setScrollStep(pEvent.detail)}, false);

	},
	/** MenuManager.buildSubMenu - build the sub menu of a given root dom node. */
	buildSubMenu : function (pRoot, pHidden) {
		let i, vChi, vUl, vBtn, vTyp;
		for (i=0; i< pRoot.fSrc.children.length; i++){
			vChi = pRoot.fSrc.children[i];
			if (!this.fFilter && !vChi.prn || this.fFilter && vChi.vis){
				vTyp = vChi.children ? "b" : "l";
				this.buildMenuEntry(pRoot, vChi, pHidden);
				if (vTyp === "b"){
					vBtn = searchMgr.xAddBtn(vChi.fLbl,"mnu_tgle_c",">",searchMgr.fStrings[23]);
					vBtn.onclick = this.sToggleMnuItem;
					vUl = scDynUiMgr.addElement("ul",vChi.fLi,"mnu_sub mnu_sub_c",null,{"display":"none"});
					vChi.fLbl.fTglBtn = vBtn;
					vChi.fLnk.fTglBtn = vBtn;
					vUl.fTglBtn = vBtn;
					vUl.fSrc = vChi;
					vUl.fMgr = this;
					vBtn.fLbl = vChi.fLbl;
					vBtn.fUl = vUl
					vChi.fUl = vUl;
				}
			}
		}
		pRoot.fBuilt = true;
		if (this.fOpt.addScroller) this.checkScrollBtns();
	},
	/** MenuManager.buildMenuEntry - build the menu entry of a given source node. */
	buildMenuEntry : function(pParent, pSrc, pHidden) {
		let vLi, vDiv, vLnk, vTyp, vCls;
		vTyp = pSrc.children ? "b" : "l";
		vCls = "mnu_sel_no mnu_"+vTyp+" mnu_src_"+pSrc.source+" mnu_dpt_"+(scPaLib.findNodes("anc:ul.mnu_sub", pParent).length + 1)+" "+pSrc.className+" mnu_sch_"+(this.fFilter && pSrc.act ? "yes" : "no");
		vLi = scDynUiMgr.addElement("li",pParent,vCls);//pHidden ??
		vDiv = scDynUiMgr.addElement("div",vLi, "mnuLbl "+vCls);
		vLnk = scDynUiMgr.addElement("a",vDiv,"mnu_i mnu_lnk");
		if (pSrc.url) {
			vLnk.href = scServices.scLoad.getPathFromRoot(pSrc.url);
			vLnk.target = this.fOpt.target;
		} else {
			vLnk.href = "#";
			vLnk.onclick = function(){try{if(this.fTglBtn && this.fTglBtn.className.indexOf("mnu_tgle_c")>=0) searchMgr.xToggleMnuItem(this.fTglBtn)} catch(e){} return false;};
		}
		vLnk.fSrc = pSrc;
		vLnk.fMgr = this;
		if (this.fFilter && !pSrc.act) vLnk.onclick = function(){return false};
		else vLnk.onclick = function(){try{
			this.fMgr.fRequestedItem = this.fSrc;
		}catch(e){}};
		vLnk.innerHTML = '<span class="mnu_sch"><span class="capt">'+pSrc.label+'</span></span>';
		if (this.fOpt.addTitleAttributes) vLnk.title = pSrc.label;
		pSrc.fLbl = vDiv;
		pSrc.fLi = vLi;
		pSrc.fLnk = vLnk;
		this.fOpt.buildItemCallback(pSrc);
	},
	/** MenuManager.buildAncestorMenus - garantee that all ancestors of the given item are present. */
	buildAncestorMenus : function(pItem, pHidden) {
		const vAncs = [];
		let vItem = pItem;
		while(vItem.par && !vItem.fLbl){
			vAncs.push(vItem.par);
			vItem = vItem.par;
		}
		for (let i=vAncs.length-1; i>=0; i--){
			this.buildSubMenu(vAncs[i].fUl, pHidden);
		}
	},
	/** MenuManager.buildContextMenu - build a context menu of the given item. */
	buildContextMenu : function(pItem) {
		const vAncs = [];
		const vCtx = [];
		let vItem = pItem.par;
		while(vItem && vItem.url){
			vAncs.push(vItem);
			vItem = vItem.par;
		}
		for (let i=vAncs.length-1; i>=0; i--){
			const vAnc = vAncs[i];
			// vCtx.push('<a href="'+scServices.scLoad.getPathFromRoot(vAnc.url)+'" target="'+this.fOpt.target+'" class="ctx_lnk"><span>'+vAnc.label+'</span></a>');
			// Modif pour sc3.7 et sans frame
			vCtx.push('<a href="'+vAnc.url+'" target="'+this.fOpt.target+'" class="ctx_lnk"><span>'+vAnc.label+'</span></a>');
		}
		return vCtx.join('<span> > </span>')+(vCtx.length>0 ? '<span> > </span>' : '');
	},
	/** MenuManager.resetMenu - reset all filtering info in the menu: . */
	resetMenu : function() {
		const iResetMenu = function (pItem) {
			pItem.act = false;
			pItem.vis = false;
			pItem.cnt = null;
			if (pItem.children) for (let i = 0; i < pItem.children.length; i++) iResetMenu(pItem.children[i]);
		};
		iResetMenu(this.fOutline);
		this.fOutline.cntAct = 0;
	},
	/** MenuManager.rebuildMenu - Rebuild the menu from scrach. */
	rebuildMenu : function() {
		const vMgr = this;
		const iResetMenu = function (pItem) {
			pItem.fLbl = null;
			pItem.fUl = null;
			pItem.fLi = null;
			if (!vMgr.fFilter) {
				pItem.act = false;
				pItem.vis = false;
				pItem.cnt = null;
			}
			if (pItem.children) for (let i = 0; i < pItem.children.length; i++) iResetMenu(pItem.children[i]);
		};
		iResetMenu(this.fOutline);
		if (!this.fFilter) this.fOutline.cntAct=0;
		this.fRoot.innerHTML = "";
		const vRootUl = scDynUiMgr.addElement("ul", this.fRoot, "mnu_root mnu_sub mnu_sch_no");
		vRootUl.fSrc = this.fOutline;
		this.buildSubMenu(vRootUl);
	},
	/** MenuManager.getFirstPageUrl - return the URL of the first visible page. */
	getFirstPageUrl : function(){
		this.fRequestedItem = (this.fFilter ? this.fFirstFilteredItem : this.fFirstItem);
		return (this.fRequestedItem ? this.fRequestedItem.url : null);
	},
	/** MenuManager.getNextPageUrl - return the URL of the next visible page of the given url. */
	getNextPageUrl : function(pUrl, pNoRequest){
		let vCurrItem = null;
		if (this.fCurrItem && this.fCurrItem.url === pUrl) vCurrItem = this.fCurrItem;
		if (!vCurrItem){
			const vItems = this.fItemIndex[pUrl];
			if (!vItems) return null;
			vCurrItem = vItems[0];
		}
		let vNxtItem = vCurrItem.nxt;
		if (this.fFilter){
			while (vNxtItem && !vNxtItem.act) vNxtItem = vNxtItem.nxt;
		}
		if (pNoRequest) return (vNxtItem ? vNxtItem.url : null);
		this.fRequestedItem = vNxtItem;
		return (this.fRequestedItem ? this.fRequestedItem.url : null);
	},
	/** MenuManager.getPreviousPageUrl - return the URL of the previous visible page of the given url. */
	getPreviousPageUrl : function(pUrl, pNoRequest){
		let vCurrItem = null;
		if (this.fCurrItem && this.fCurrItem.url === pUrl) vCurrItem = this.fCurrItem;
		if (!vCurrItem){
			const vItems = this.fItemIndex[pUrl];
			if (!vItems) return null;
			vCurrItem = vItems[0];
		}
		let vPrvItem = vCurrItem.prv;
		if (this.fFilter){
			while (vPrvItem && !vPrvItem.act) vPrvItem = vPrvItem.prv;
		}
		if (pNoRequest) return (vPrvItem ? vPrvItem.url : null);
		this.fRequestedItem = vPrvItem;
		return (this.fRequestedItem ? this.fRequestedItem.url : null);
	},
	/** MenuManager.getPageCount - return filtered page cout. */
	getPageCount : function(){
		return this.fOutline.cntAct;
	},
	/** MenuManager.getPageCount - return the page rank of the given url. */
	getPageRank : function(pUrl){
		let vCurrItem = null;
		if (this.fCurrItem && this.fCurrItem.url === pUrl) vCurrItem = this.fCurrItem;
		if (!vCurrItem){
			const vItems = this.fItemIndex[pUrl];
			if (!vItems) return null;
			vCurrItem = vItems[0];
		}
		return (vCurrItem ? vCurrItem.cnt : null);
	},
	/** MenuManager.applyFilter - apply a filter on the menu based on the given array of vidible pages. */
	applyFilter : function(pPageList, pCallBack) {
		let i;
		if (this.fOpt.neverFilter) return;
		this.resetMenu();
		this.fFilter = true;
		for (i = 0; i<pPageList.length; i++){
			const vItems = this.fItemIndex[pPageList[i]];
			if (vItems){
				for (let j=0; j<vItems.length; j++){
					let vItem = vItems[j];
					vItem.vis = true;
					vItem.act = true;
					if (pCallBack) pCallBack(vItem);
					this.fOutline.cntAct++;
					while (vItem.par && !vItem.par.vis){
						vItem = vItem.par;
						vItem.vis = true;
					}
				}
			}
		}
		let vCnt = 0;
		const iSetRank = function (pItem) {
			if (pItem.act) pItem.cnt = ++vCnt;
			if (pItem.children) {
				for (let i = 0; i < pItem.children.length; i++) iSetRank(pItem.children[i]);
			}
		};
		iSetRank(this.fOutline);
		this.rebuildMenu();
		const iFindFirstItems = function (pItem, pArray) {
			if (pItem.act) pArray.push(pItem);
			if (pArray.length >= searchMgr.fMaxFilterDisplay) return true;
			if (pItem.children) {
				for (let i = 0; i < pItem.children.length; i++) if (iFindFirstItems(pItem.children[i], pArray)) return true;
			} else return false;
		};
		const vFirstItems = [];
		iFindFirstItems(this.fOutline, vFirstItems);
		for (i = 0; i<vFirstItems.length; i++){
			this.buildAncestorMenus(vFirstItems[i],false);
			this.openAncestors(vFirstItems[i]);
		}
		if (vFirstItems.length>0) this.fFirstFilteredItem = vFirstItems[0];
		searchMgr.xSwitchClass(this.fRoot, "mnu_sch_no", "mnu_sch_yes");
	},
	/** MenuManager.resetFilter - resert the current filter and rebuild the menu. */
	resetFilter : function(pPageList) {
		this.fFilter = false;
		this.rebuildMenu();
		this.fFirstFilteredItem = null;
		searchMgr.xSwitchClass(this.fRoot, "mnu_sch_yes", "mnu_sch_no");
		if (this.fCurrItem) this.loadPage(this.fCurrItem.url);
	},
	/** MenuManager.loadPage - set the given url as the 'active' page. */
	loadPage : function(pUri) {
		let i;
		let vItems;
		if (this.fCurrItem) {
			vItems = this.fItemIndex[this.fCurrItem.url];
			for (i = 0; i<vItems.length; i++) if (vItems[i].fLbl) searchMgr.xSwitchClass(vItems[i].fLbl, "mnu_sel_yes", "mnu_sel_no");
		}
		vItems = this.fItemIndex[pUri];
		if (!vItems) {
			if (this.fContext) this.fContext.innerHTML = "";
			this.fCurrItem = null;
			return;
		}
		let vItemPresent = false;
		for (i = 0; i<vItems.length; i++){
			const vItem = vItems[i];
			if (!this.fFilter || vItem.act){
				if (!vItem.fLbl) this.buildAncestorMenus(vItem);
				this.openAncestors(vItem);
				if (vItem.fLbl.fTglBtn && scPaLib.checkNode(searchMgr.sFilterTgleClosed,vItem.fLbl.fTglBtn)) this.toggleMnuItem(vItem.fLbl.fTglBtn);
				searchMgr.xSwitchClass(vItem.fLbl, "mnu_sel_no", "mnu_sel_yes");
				vItemPresent = true;
			}
		}
		if (!vItemPresent) {
			if (this.fContext) this.fContext.innerHTML = "";
			this.fCurrItem = null;
			return;
		}
		if (this.fRequestedItem && this.fRequestedItem.url === pUri) this.fCurrItem = this.fRequestedItem;
		else this.fCurrItem = vItems[0];
		if (this.fScrollerEnabled) this.ensureVisible();
		if (this.fContext) this.fContext.innerHTML = this.buildContextMenu(this.fCurrItem);
	},
	/** MenuManager.openAncestors - open all closed ancestors of the given item. */
	openAncestors : function(pItem) {
		// Make shure this label is visible (open all ancestors)
		const vClosedSubMnus = scPaLib.findNodes("anc:ul.mnu_sub_c", pItem.fLbl);
		for (let i=0; i < vClosedSubMnus.length; i++){
			this.toggleMnuItem(vClosedSubMnus[i].fTglBtn);
		}
	},
	/** MenuManager.sToggleMnuItem - sub-menu toggle button callback function. */
	sToggleMnuItem : function() {
		try{
			this.fUl.fMgr.toggleMnuItem(this);
		} catch(e){}
		return false;
	},
	/** MenuManager.toggleMnuItem - toggle the sub-menu of the given toggle button. */
	toggleMnuItem : function(pBtn) {
		if (!pBtn) return;
		const vStatus = pBtn.className;
		const vUl = pBtn.fUl;
		if (!vUl) return;
		if (!vUl.fBuilt) this.buildSubMenu(vUl);
		if(vStatus === "mnu_tgle_c") {
			pBtn.className = "mnu_tgle_o";
			pBtn.innerHTML = "<span>v</span>";
			pBtn.title = searchMgr.fStrings[24];
			vUl.className = vUl.className.replace("mnu_sub_c", "mnu_sub_o");
			if (scCoLib.isIE) this.fRoot.style.visibility = "hidden"; // controunement bug ie7
			vUl.style.display = "";
			if (scCoLib.isIE) this.fRoot.style.visibility = "";
			vUl.fClosed = false;
		} else {
			pBtn.className = "mnu_tgle_c";
			pBtn.innerHTML = "<span>></span>";
			pBtn.title = searchMgr.fStrings[23];
			vUl.className = vUl.className.replace("mnu_sub_o", "mnu_sub_c");
			vUl.style.display = "none";
			vUl.fClosed = true;
			const vOpendSubMnus = scPaLib.findNodes("chi:li/chi:ul.mnu_sub_o", vUl);
			for (let i=0; i < vOpendSubMnus.length; i++) this.toggleMnuItem(vOpendSubMnus[i].fTglBtn);
		}
		if (this.fOpt.addScroller) this.checkScrollBtns();
	},
	/** MenuManager scroll timer & size task */
	fClassOffUp : "btnOff",
	fClassOffDown : "btnOff",
	fSpeed : 0,
	execTask : function(){
		try {
			if(this.fSpeed === 0) return false;
			this.fRoot.scrollTop += this.fSpeed;
			return true;
		}catch(e){
			this.fSpeed = 0;
			return false;
		}
	},
	setScrollStep: function(pPx) {
		try {this.fRoot.scrollTop += pPx;}catch(e){}
	},
	ensureVisible: function(){
		if (!this.fCurrItem) return;
		let vParent = this.fCurrItem.fLbl.offsetParent;
		if( !vParent) return;
		let vOffset = this.fCurrItem.fLbl.offsetTop;
		while(vParent !== this.fRoot) {
			const vNewParent = vParent.offsetParent;
			vOffset += vParent.offsetTop;
			vParent = vNewParent;
		}
		if (vOffset < this.fRoot.scrollTop) this.fRoot.scrollTop = vOffset;
		else if (vOffset + this.fCurrItem.fLbl.offsetHeight > this.fRoot.scrollTop + this.fRoot.clientHeight) this.fRoot.scrollTop = vOffset - this.fRoot.clientHeight + this.fCurrItem.fLbl.offsetHeight;
	},
	checkScrollBtns: function(){
		const vScrollTop = this.fRoot.scrollTop;
		const vBtnUpOff = this.fSrlUp.className.indexOf(this.fClassOffUp);
		if(vScrollTop <= 0) {
			if(vBtnUpOff < 0) this.fSrlUp.className+= " "+this.fClassOffUp;
		} else {
			if(vBtnUpOff >= 0) this.fSrlUp.className = this.fSrlUp.className.substring(0, vBtnUpOff);
		}
		const vContentH = scSiLib.getContentHeight(this.fRoot);
		const vBtnDownOff = this.fSrlDwn.className.indexOf(this.fClassOffDown);
		if( vContentH - vScrollTop <= this.fRoot.offsetHeight){
			if(vBtnDownOff < 0) this.fSrlDwn.className+= " "+this.fClassOffDown;
		} else {
			if(vBtnDownOff >=0) this.fSrlDwn.className = this.fSrlDwn.className.substring(0, vBtnDownOff);
		}
	},
	onResizedAnc:function(pOwnerNode, pEvent){
		if(pEvent.phase===1 || pEvent.resizedNode === pOwnerNode) return;
		this.ensureVisible();
		this.checkScrollBtns();
	},
	onResizedDes:function(pOwnerNode, pEvent){
		if(pEvent.phase===1) return;
		this.ensureVisible();
	},
	ruleSortKey : "checkScrollBtns"

}