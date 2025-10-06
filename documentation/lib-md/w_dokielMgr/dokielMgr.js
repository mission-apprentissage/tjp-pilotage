window.dokielMgr = scOnLoads[scOnLoads.length] = {

	fPathPlayer: [".stepListPlayer"],
	fPathSteps: "chi:ol/chi:.step",
	fPathOp: "anc:.stepList",
	fClsPreSlp: "slp",
	fPathFocusables: "des:a|input|button",
	fPlayerCtrlModeCss: true,
	fPlayerExclusiveStepMode: false, // if true only one player can be in step mode at once
	fPlayerComplexityLevel: 3, // StepList complexity threshold : 0 = always in step mode | 1000 = almost always in list mode

	fScreens: null,
	fPathScreen: [".screenFra"],
	fPathZones: "chi:ol.screenZones/chi:.screenZone",
	fPathZoneList: "chi:ol.screenZones",
	fPathZoneLnks: "chi:div.caption/des:a.screenZoneLnk",
	fPathTitleFra: "chi:div.caption/des:div.screenTitles",
	fPathZoneTitles: "chi:div.caption/des:div.screenTitles/des:li",
	fPathZoneTitleLnks: "chi:div.caption/des:a.screenTitleLnk",
	fClsPreScr: "scr",
	fScreenDefaultInteractiveMode: true,

	fStepScreens: [],
	fPathStepScreen: [".stepScreen"],
	fClsPreSsp: "ssp",

	fStrings : ["Mode pas à pas","Afficher les étapes une à une",
/*02*/                "Mode liste","Afficher les étapes en liste",
/*04*/                "précédent","étape précédente",
/*06*/                "suivant","étape suivante",
/*08*/                "Étape : ","",
/*10*/                "Mode liste","Afficher les zones en liste",
/*12*/                "Mode interactif","Afficher les zones en mode interactif",
		"",""],

	/** dokielMgr.init */
	init: function (pParam) {
		try {
			let i;
			let j;
			if (!pParam) pParam = {};
			if (typeof pParam.playerComplexityLevel != "undefined") this.fPlayerComplexityLevel = pParam.playerComplexityLevel;
			if (typeof pParam.screenDefaultInteractiveMode != "undefined") this.fScreenDefaultInteractiveMode = pParam.screenDefaultInteractiveMode;
			// Init players...
			this.fScreens = [];
			for(i = 0; i<this.fPathScreen.length; i++) {
				const vScreens = scPaLib.findNodes("des:" + this.fPathScreen[i]);
				for(j = 0; j<vScreens.length; j++) {
					const vScreen = vScreens[j];
					vScreen.fZones = scPaLib.findNodes(this.fPathZones,vScreen);
					for(let k=0; k<vScreen.fZones.length; k++) {
						const vZone = vScreen.fZones[k];
						vZone.style.visibility = "hidden";
						vZone.style.position = "absolute";
						vZone.style.left = "-20000px";
						vZone.style.top = "-20000px";
					}
					this.fScreens.push(vScreen);
				}
			}
			for(i = 0; i<this.fPathStepScreen.length; i++) {
				const vStepScreens = this.fStepScreens = scPaLib.findNodes("des:" + this.fPathStepScreen[i]);
				for(j = 0; j<vStepScreens.length; j++) {
					this.xSwitchClass(vStepScreens[j], "showSteps_", "showSteps_false", true, false);
				}
			}
		}catch(e){console.error("ERROR - dokielMgr.init : "+e)}
	},
	/** dokielMgr.onLoad */
	onLoad : function() {
		this.xIniPlayers();
		this.xIniScreens();
		this.xIniStepScreens();
	},
	/** dokielMgr.registerPlayer */
	registerPlayer : function(pPath) {
		this.fPathPlayer[this.fPathPlayer.length] = pPath;
	},
	/** dokielMgr.registerScreen */
	registerScreen : function(pPath) {
		this.fPathScreen[this.fPathScreen.length] = pPath;
	},
	/** dokielMgr.registerStepScreen */
	registerStepScreen : function(pPath) {
		this.fPathStepScreen[this.fPathStepScreen.length] = pPath;
	},
	/** dokielMgr.cancelStepMode */
	cancelStepMode : function() {
		if (this.fActiveStepPlayer) this.xSlpLstMode(this.fActiveStepPlayer);
	},
	/** dokielMgr.makeVisible */
	makeVisible : function (pNode) {
		for(let i in this.fPathPlayer) {
			const vPlayers = scPaLib.findNodes("anc:" + this.fPathPlayer[i] + "." + this.fClsPreSlp + "FraAct", pNode);
			for (let j in vPlayers) dokielMgr.xSlpLstMode(vPlayers[j]);
		}
		for(i = 0; i<this.fPathScreen.length; i++) {
			const vScreens = scPaLib.findNodes("anc:" + this.fPathScreen[i] + "." + this.fClsPreScr + "FraInt", pNode);
			for (let j in vScreens) dokielMgr.xScrLstMode(vScreens[j]);
		}
	},
	/** dokielMgr.setInteractiveScreenMode */
	setInteractiveScreenMode : function(pEnabled) {
		for(let i=0; i<this.fScreens.length; i++) {
			const vScreen = this.fScreens[i];
			if (!pEnabled){
				if (vScreen.fIntMode) {
					this.xScrLstMode(vScreen);
					vScreen.fLstModeForced = true;
				}
				vScreen.fToolbar.style.display = "none";
			} else {
				if (vScreen.fLstModeForced) {
					this.xScrIntMode(vScreen);
					vScreen.fLstModeForced = false;
				}
				vScreen.fToolbar.style.display = "";
			}
		}
	},
	/** dokielMgr.xBtnMgr - centralized button manager */
	xBtnMgr : function(pBtn) {
		const vFra = pBtn.fFra;
		switch(pBtn.fName){
			case this.fClsPreSlp + "BtnStp":
				dokielMgr.xSlpStpMode(vFra);
				dokielMgr.xToggleFocusables(vFra.parentNode);
				vFra.fBtnNxt.focus();
				break;
			case this.fClsPreSlp + "BtnLst":
				dokielMgr.xSlpLstMode(vFra);
				dokielMgr.xToggleFocusables(vFra.parentNode);
				vFra.fBtnStep.focus();
				break;
			case this.fClsPreSlp + "BtnPrv":
				dokielMgr.xSlpPrv(vFra);break;
			case this.fClsPreSlp + "BtnNxt":
				dokielMgr.xSlpNxt(vFra);break;

			case this.fClsPreScr + "BtnLst":
				dokielMgr.xScrLstMode(vFra);break;
			case this.fClsPreScr + "BtnAct":
				dokielMgr.xScrIntMode(vFra);break;

			case this.fClsPreSsp + "BtnPrv":
				dokielMgr.xSspPrv(vFra);break;
			case this.fClsPreSsp + "BtnNxt":
				dokielMgr.xSspNxt(vFra);break;
		}
		return false;
	},

	/* == Screen =============================================================== */
	/** dokielMgr.xIniScreens */
	xIniScreens : function() {
		try{
			let vSelectedZone = null;
			let vHash = window.location.hash;
			if (vHash.length>0) vHash = vHash.substring(1);
			else vHash = null;

			for(let i=0; i<this.fScreens.length; i++) {
				let k;
				const vScreen = this.fScreens[i];
				vScreen.fZoneLnks = scPaLib.findNodes(this.fPathZoneLnks,vScreen);
				vScreen.fTitleFra = scPaLib.findNode(this.fPathTitleFra,vScreen);
				vScreen.fZoneTitles = scPaLib.findNodes(this.fPathZoneTitles,vScreen);
				vScreen.fZoneTitleLnks = scPaLib.findNodes(this.fPathZoneTitleLnks,vScreen);
				vScreen.fZoneList = scPaLib.findNode(this.fPathZoneList,vScreen);
				for(k = 0; k<vScreen.fZoneLnks.length; k++) {
					const vZoneLnk = vScreen.fZoneLnks[k];
					vZoneLnk.fClass = vZoneLnk.className;
					vZoneLnk.fZone = vScreen.fZones[k];
					vZoneLnk.fScreen = vScreen;
					vZoneLnk.fImg = scDynUiMgr.addElement("span", vZoneLnk, this.fClsPreScr + "ZneImg", null, {display:"none",position:"absolute",top:"0",bottom:"0",left:"0",right:"0",backgroundImage:'url("'+vZoneLnk.fZone.getAttribute("data-zone-preview")+'")'});
					if (vScreen.fTitleFra){
						vZoneLnk.fTitle = vScreen.fZoneTitles[k];
						vZoneLnk.fTitle.fClass = vZoneLnk.fTitle.className;
						vZoneLnk.fTitleLink = scPaLib.findNode("des:a", vZoneLnk.fTitle);
						vZoneLnk.fTitleLink.fZne = vZoneLnk;
						vZoneLnk.fTitleLink.onclick = function(){ return this.fZne.onclick()};
						vZoneLnk.fTitleLink.fPrevTab = vScreen.fZoneTitleLnks[k>0 ? k-1 : vScreen.fZoneLnks.length-1];
						vZoneLnk.fTitleLink.fNextTab = vScreen.fZoneTitleLnks[k<vScreen.fZoneLnks.length-1 ? k+1 : 0];
					}
					vZoneLnk.onclick = this.sScrLnkClick;
					if (vZoneLnk.fZone.id === vHash) vSelectedZone = vZoneLnk;
				}
				vScreen.className = vScreen.className + " " + this.fClsPreScr + "Fra";
				vScreen.fClass = vScreen.className;

				vScreen.fToolbar = scDynUiMgr.addElement("div", vScreen, this.fClsPreScr + "Tools", vScreen.firstChild);
				vScreen.fBtnList = this.xAddBtn(vScreen.fToolbar, vScreen, this.fClsPreScr + "BtnLst", this.xGetStr(10), this.xGetStr(11));
				vScreen.fBtnAct = this.xAddBtn(vScreen.fToolbar, vScreen, this.fClsPreScr + "BtnAct", this.xGetStr(12), this.xGetStr(13));
				if (this.fScreenDefaultInteractiveMode) this.xScrIntMode(vScreen);
				else this.xScrLstMode(vScreen);

				for(k = 0; k<vScreen.fZones.length; k++) {
					const vZone = vScreen.fZones[k];
					vZone.style.visibility = "";
					vZone.style.position = "";
					vZone.style.left = "";
					vZone.style.top = "";
				}
			}
			if (vSelectedZone) vSelectedZone.onclick();
		} catch(e){console.error("dokielMgr.xIniScreens::Error : "+e)}
	},
	/** dokielMgr.xScrLstMode */
	xScrLstMode : function(pScreen){
		pScreen.fIntMode = false;
		pScreen.className = pScreen.fClass;
		if (pScreen.fTitleFra){
			pScreen.fTitleFra.removeAttribute("role");
			pScreen.fTitleFra.removeAttribute("aria-orientation");
		}
		for(let i=0; i<pScreen.fZones.length; i++) {
			pScreen.fZones[i].classList.remove(dokielMgr.fClsPreScr + "ZneHide");
			pScreen.fZoneLnks[i].fImg.style.display = "none";
			pScreen.fZoneLnks[i].fAct = false;
			pScreen.fZoneLnks[i].className = pScreen.fZoneLnks[i].fClass;
			if("scImageMgr" in window) scImageMgr.sCollBlkOpen(pScreen.fZones[i]);
			if (pScreen.fTitleFra) {
				pScreen.fZones[i].removeAttribute("role");
				pScreen.fZones[i].removeAttribute("tabindex");
				pScreen.fZones[i].removeAttribute("aria-labelledby");
				pScreen.fZoneTitles[i].removeAttribute("role");
				pScreen.fZoneTitleLnks[i].removeAttribute("aria-controls");
				pScreen.fZoneTitleLnks[i].removeAttribute("aria-selected");
				pScreen.fZoneTitleLnks[i].onkeyup=function(pEvent){}
				pScreen.fZoneTitleLnks[i].onkeydown=function(pEvent){}
				pScreen.fZoneTitles[i].className = pScreen.fZoneTitles[i].fClass;
			}
		}
		pScreen.fBtnList.setAttribute("aria-selected", "true");
		pScreen.fBtnAct.setAttribute("aria-selected", "false");
		if("scSiLib" in window) scSiLib.fireResizedNode(pScreen);
	},
	/** dokielMgr.xScrIntMode */
	xScrIntMode : function(pScreen){
		pScreen.fIntMode = true;
		pScreen.className = pScreen.fClass + " " + this.fClsPreScr + "FraInt";
		if (pScreen.fTitleFra){
			pScreen.fTitleFra.setAttribute("role", "tablist");
			pScreen.fTitleFra.setAttribute("aria-orientation", "vertical");
		}
		for(let i=0; i<pScreen.fZones.length; i++) {
			pScreen.fZones[i].classList.add(dokielMgr.fClsPreScr + "ZneHide");
			if (pScreen.fTitleFra) {
				pScreen.fZones[i].setAttribute("role", "tabpanel");
				pScreen.fZones[i].setAttribute("tabindex", "0");
				pScreen.fZones[i].setAttribute("aria-labelledby", pScreen.fZoneTitleLnks[i].id);
				pScreen.fZoneTitles[i].setAttribute("role", "tab");
				pScreen.fZoneTitleLnks[i].setAttribute("aria-controls", pScreen.fZones[i].id);
				pScreen.fZoneTitleLnks[i].onkeyup=function(pEvent){scDynUiMgr.handleBtnKeyUp(pEvent);}
				pScreen.fZoneTitleLnks[i].onkeydown=function(pEvent){dokielMgr.sHandleTabKeyDwn(pEvent);}
			}
		}
		pScreen.fBtnList.setAttribute("aria-selected", "false");
		pScreen.fBtnAct.setAttribute("aria-selected", "true");
		if("scSiLib" in window) scSiLib.fireResizedNode(pScreen);
	},
	/** dokielMgr.sHandleTabKeyDwn */
	sHandleTabKeyDwn : function(pEvt){
		const vTgt = pEvt.currentTarget;
		let vFlag = false;
		switch (pEvt.key) {
			case 'ArrowUp':
				vTgt.fPrevTab.focus();
				vFlag = true;
				break;

			case 'ArrowDown':
				vTgt.fNextTab.focus();
				vFlag = true;
				break;

			default:
				break;
		}
		if (vFlag) {
			pEvt.stopPropagation();
			pEvt.preventDefault();
		}
	},
	/** dokielMgr.sScrLnkClick */
	sScrLnkClick : function(pEvt){
		if (this.fScreen.fIntMode){
			if (!this.fScreen.fhasBeenClicked) {
				this.fScreen.scrollIntoView();
				this.fScreen.fhasBeenClicked = true;
			}
			const vAct = this.fAct;
			for(let i=0; i<this.fScreen.fZones.length; i++) {
				this.fScreen.fZones[i].classList.add(dokielMgr.fClsPreScr + "ZneHide");
				this.fScreen.fZoneLnks[i].fImg.style.display = "none";
				this.fScreen.fZoneLnks[i].fAct = false;
				this.fScreen.fZoneLnks[i].className = this.fScreen.fZoneLnks[i].fClass;
				if (this.fScreen.fTitleFra) {
					this.fScreen.fZoneTitles[i].className = this.fScreen.fZoneTitles[i].fClass;
					this.fScreen.fZoneTitleLnks[i].setAttribute("aria-selected", "false");
					this.fScreen.fZoneTitleLnks[i].setAttribute("tabindex", "-1");
				}
			}
			if (vAct){
				this.fAct = false;
				this.className = this.fClass;
				this.fScreen.className = this.fScreen.fClass + " " + dokielMgr.fClsPreScr + "FraInt";
			} else {
				this.fAct = true;
				this.className = this.fClass + " " + dokielMgr.fClsPreScr + "LnkAct";
				this.fZone.classList.remove(dokielMgr.fClsPreScr + "ZneHide");
				this.fImg.style.display = "";
				this.fScreen.className = this.fScreen.fClass + " " + dokielMgr.fClsPreScr + "FraAct";
				if (this.fTitle) {
					this.fTitle.className = this.fTitle.fClass + " " + dokielMgr.fClsPreScr + "TiAct";
					this.fTitleLink.setAttribute("aria-selected", "true");
					this.fTitleLink.removeAttribute("tabindex");
					if (this.fTitle.offsetTop < this.fScreen.fTitleFra.scrollTop) this.fScreen.fTitleFra.scrollTop = this.fTitle.offsetTop;
					else if (this.fTitle.offsetTop+this.fTitle.offsetHeight > this.fScreen.fTitleFra.scrollTop + this.fScreen.fTitleFra.clientHeight) this.fScreen.fTitleFra.scrollTop = this.fTitle.offsetTop + this.fTitle.offsetHeight - this.fScreen.fTitleFra.clientHeight;
				}
			}
			if("scImageMgr" in window) scImageMgr.sCollBlkOpen(this.fZone);
			if("scSiLib" in window) scSiLib.fireResizedNode(this.fScreen);
			return false;
		} else {
			return true;
		}
	},

	/* == Screen procedure ===================================================== */
	/** dokielMgr.xIniStepScreens */
	xIniStepScreens : function() {
		try{
			let vSelectedZone = null;
			let vHash = window.location.hash;
			if (vHash.length>0) vHash = vHash.substring(1);
			else vHash = null;

			for(let i=0; i<this.fStepScreens.length; i++) {
				const vStepScreen = this.fStepScreens[i];
				vStepScreen.parentNode.setAttribute("aria-roledescription", "carousel");
				const vSteps = vStepScreen.fSteps = scPaLib.findNodes("chi:ol.steps/chi:li.step", vStepScreen);
				const vStepTitles = vStepScreen.fTitles = scPaLib.findNodes("des:div.stepScreenTitles/des:li.screenStep", vStepScreen);
				const vStepZones = vStepScreen.fZones = scPaLib.findNodes("des:div.screenImage/des:a.screenStepLnk", vStepScreen);
				vStepScreen.fTitleParent = scPaLib.findNode("des:div.stepScreenTitles/des:ol", vStepScreen);
				vStepScreen.fTitleParent.setAttribute("role", "tablist");
				vStepScreen.fTitleParent.setAttribute("aria-orientation", "vertical");
				const vToolbar = scDynUiMgr.addElement("div", scPaLib.findNode("des:div.stepScreenTitles", vStepScreen), "stepScreenTools");
				vStepScreen.fBtnPrv = this.xAddBtn(vToolbar, vStepScreen, this.fClsPreSsp + "BtnPrv", this.xGetStr(4), this.xGetStr(5));
				this.xAddSep(vToolbar);
				vStepScreen.fCount = scDynUiMgr.addElement("span", vToolbar, "stepScreenCounter");
				this.xAddSep(vToolbar);
				vStepScreen.fBtnNxt = this.xAddBtn(vToolbar, vStepScreen, this.fClsPreSsp + "BtnNxt", this.xGetStr(6), this.xGetStr(7));
				vStepScreen.fIdx = -1;
				for (let j = 0; j<vStepZones.length; j++){
					const vStepZone = vStepZones[j];
					vStepZone.fIdx = j;
					vStepZone.fStepScreen = vStepScreen;
					vStepTitles[j].setAttribute("role", "tab");
					const vStepTitle = scPaLib.findNode("des:a", vStepTitles[j]);
					vStepTitle.fIdx = j;
					vStepTitle.fStepScreen = vStepScreen;
					vStepTitle.setAttribute("id", vSteps[j].id+"tab");
					vStepTitle.setAttribute("aria-controls", vSteps[j].id);
					vSteps[j].setAttribute("aria-labelledby", vSteps[j].id+"tab");
					vStepZone.onclick = vStepTitle.onclick = function () {
						if (!this.fStepScreen.fhasBeenClicked) {
							this.fStepScreen.scrollIntoView();
							this.fStepScreen.fhasBeenClicked = true;
						}
						this.fStepScreen.fIdx = (this.fStepScreen.fIdx === this.fIdx ? -1 : this.fIdx);
						dokielMgr.xSspUpdate(this.fStepScreen);
						return false;
					}
					vStepTitle.fPrevTab = scPaLib.findNode("des:a", vStepTitles[j>0 ? j-1 : vStepTitles.length-1]);
					vStepTitle.fNextTab = scPaLib.findNode("des:a", vStepTitles[j<vStepTitles.length-1 ? j+1 : 0]);
					vStepTitle.onkeyup=function(pEvent){scDynUiMgr.handleBtnKeyUp(pEvent);}
					vStepTitle.onkeydown=function(pEvent){dokielMgr.sHandleTabKeyDwn(pEvent);}
					if (vSteps[j].id === vHash) vSelectedZone = vStepZone;
				}
			}
			if (vSelectedZone) vSelectedZone.onclick();
		} catch(e){console.error("dokielMgr.xIniStepScreens::Error : "+e)}
	},
	/** dokielMgr.xSlpPrv */
	xSspPrv : function(pStepScreen){
		if (pStepScreen.fIdx <= 0) return;
		pStepScreen.fIdx--;
		this.xSspUpdate(pStepScreen);
	},
	/** dokielMgr.xSlpNxt */
	xSspNxt : function(pStepScreen){
		if (pStepScreen.fIdx >= pStepScreen.fSteps.length-1) return;
		pStepScreen.fIdx++;
		this.xSspUpdate(pStepScreen);
	},
	/** dokielMgr.xSspGotoStep */
	xSspUpdate : function(pStepScreen){
		for (let i = 0; i<pStepScreen.fSteps.length; i++){
			this.xSwitchClass(pStepScreen.fSteps[i], "active_", "active_"+(pStepScreen.fIdx == i), true, false);
			this.xSwitchClass(pStepScreen.fTitles[i], "active_", "active_"+(pStepScreen.fIdx < 0 || pStepScreen.fIdx == i), true, false);
			this.xSwitchClass(pStepScreen.fZones[i], "active_", "active_"+(pStepScreen.fIdx < 0 || pStepScreen.fIdx == i), true, false);
			const vStepTitle = scPaLib.findNode("des:a", pStepScreen.fTitles[i]);
			vStepTitle.setAttribute("aria-selected", "false");
			if (pStepScreen.fIdx>=0) vStepTitle.setAttribute("tabindex", "-1");
			else vStepTitle.removeAttribute("tabindex");
		}
		this.xSwitchClass(pStepScreen, "active_", "active_"+(pStepScreen.fIdx >= 0), true, false);
		this.xSwitchClass(pStepScreen, "showSteps_", "showSteps_"+(pStepScreen.fIdx >= 0), true, false);

		this.xSwitchClass(pStepScreen.fBtnPrv, "disabled_", "disabled_"+(pStepScreen.fIdx <= 0), true, false);
		pStepScreen.fBtnPrv.setAttribute("aria-disabled", (pStepScreen.fIdx <= 0 ? "true" : "false"));
		this.xSwitchClass(pStepScreen.fBtnNxt, "disabled_", "disabled_"+(pStepScreen.fIdx >= pStepScreen.fSteps.length-1), true, false);
		pStepScreen.fBtnNxt.setAttribute("aria-disabled", (pStepScreen.fIdx >= pStepScreen.fSteps.length-1 ? "true" : "false"));
		pStepScreen.fCount.innerHTML = pStepScreen.fIdx<0 ? "" : "<span>"+(pStepScreen.fIdx+1)+"/"+pStepScreen.fSteps.length+"</span>";

		if (pStepScreen.fIdx>=0){
			const vTitle = pStepScreen.fTitles[pStepScreen.fIdx];
			const vStepTitle = scPaLib.findNode("des:a", vTitle);
			vStepTitle.setAttribute("aria-selected", "true");
			vStepTitle.removeAttribute("tabindex");
			const vScrollParent = pStepScreen.fTitleParent;
			if (vTitle.offsetTop < vScrollParent.scrollTop) vScrollParent.scrollTop = vTitle.offsetTop;
			else if (vTitle.offsetTop+vTitle.offsetHeight > vScrollParent.scrollTop + vScrollParent.clientHeight) vScrollParent.scrollTop = vTitle.offsetTop + vTitle.offsetHeight - vScrollParent.clientHeight;
		}
		if("scSiLib" in window) scSiLib.fireResizedNode(pStepScreen);
	},

	/* == StepList player ====================================================== */
	/** dokielMgr.xIniPlayers */
	xIniPlayers : function() {
		try{
			let vHash = window.location.hash;
			if (vHash.length>0) vHash = vHash.substring(1);
			else vHash = null;

			for(let i in this.fPathPlayer) {
				const vPlayers = scPaLib.findNodes("des:" + this.fPathPlayer[i]);
				for(let j in vPlayers) {
					const vPlayer = vPlayers[j];
					vPlayer.fOp = scPaLib.findNode(this.fPathOp,vPlayer);
					vPlayer.fOp.fClass = vPlayer.fOp.className;
					vPlayer.fOver = scDynUiMgr.addElement("div", vPlayer.fOp.parentNode, this.fClsPreSlp + "Over", vPlayer.fOp);
					vPlayer.fOver.style.display = "none";
					vPlayer.fSteps = scPaLib.findNodes(this.fPathSteps,vPlayer);
					const vSteps= [];
					for(let k in vPlayer.fSteps) {
						if(this.xIsVisible(vPlayer.fSteps[k])) vSteps.push(vPlayer.fSteps[k]) ;
					}
					vPlayer.fSteps = vSteps;
					vPlayer.className = vPlayer.className + " " + this.fClsPreSlp + "Fra";
					vPlayer.fClass = vPlayer.className;
					const vToolbar = scDynUiMgr.addElement("div", vPlayer.parentNode, this.fClsPreSlp + "Tools", vPlayer);
					vPlayer.fBtnStep = this.xAddBtn(vToolbar, vPlayer, this.fClsPreSlp + "BtnStp", this.xGetStr(0), this.xGetStr(1));
					vPlayer.fBtnList = this.xAddBtn(vToolbar, vPlayer, this.fClsPreSlp + "BtnLst", this.xGetStr(2), this.xGetStr(3));
					this.xAddSep(vToolbar);
					vPlayer.fNavBtns = scDynUiMgr.addElement("span", vToolbar, this.fClsPreSlp + "NavBtns");
					vPlayer.fBtnPrv = this.xAddBtn(vPlayer.fNavBtns, vPlayer, this.fClsPreSlp + "BtnPrv", this.xGetStr(4), this.xGetStr(5));
					this.xAddSep(vPlayer.fNavBtns);
					vPlayer.fBtnNxt = this.xAddBtn(vPlayer.fNavBtns, vPlayer, this.fClsPreSlp + "BtnNxt", this.xGetStr(6), this.xGetStr(7));
					this.xAddSep(vPlayer.fNavBtns);
					const vLblCount = scDynUiMgr.addElement("span", vPlayer.fNavBtns, this.fClsPreSlp + "CountLbl");
					vLblCount.innerHTML = "<span>"+this.xGetStr(8)+"</span>"
					vPlayer.fCount = scDynUiMgr.addElement("span", vPlayer.fNavBtns, this.fClsPreSlp + "CountTxt");
					const vComplexIndex = scPaLib.findNodes("chi:ol/chi:.step/des:p|figure" , vPlayer).length / vPlayer.fSteps.length;
					if (!this.fPlayerExclusiveStepMode && vComplexIndex>this.fPlayerComplexityLevel && (!vHash || (vHash && !this.xIsEltContainedByNode(sc$(vHash), vPlayer)))) this.xSlpStpMode(vPlayer);
					else this.xSlpLstMode(vPlayer);
				}
			}
		} catch(e){console.error("dokielMgr.xIniPLayers::Error : "+e)}
	},
	/** dokielMgr.xSlpStpMode */
	xSlpStpMode : function(pPlayer){
		if (this.fPlayerExclusiveStepMode && this.fActiveStepPlayer) this.xSlpLstMode(this.fActiveStepPlayer);
		if (this.fPlayerCtrlModeCss){
			this.xSwitchClass(pPlayer.fBtnStep, "disabled_", "disabled_true", true, false);
			pPlayer.fBtnStep.setAttribute("aria-disabled", "true");
			this.xSwitchClass(pPlayer.fBtnList, "disabled_", "disabled_false", true, false);
			pPlayer.fBtnList.setAttribute("aria-disabled", "false");
			this.xSwitchClass(pPlayer.fNavBtns, "disabled_", "disabled_false", true, false);
			pPlayer.fNavBtns.setAttribute("aria-disabled", "false");
		} else{
			pPlayer.fBtnStep.style.display = "none";
			pPlayer.fBtnList.style.display = "";
			pPlayer.fNavBtns.style.display = "";
		}
		pPlayer.parentNode.setAttribute("aria-roledescription", "carousel");
		pPlayer.fIdx = -1;
		for(let i in pPlayer.fSteps) {
			const vStep = pPlayer.fSteps[i];
			vStep.setAttribute("aria-roledescription", "slide");
			vStep.style.position = "absolute";
			vStep.style.visibility = "hidden";
			vStep.style.left = "-20000px";
			vStep.style.top = "-20000px";
		}
		pPlayer.fOp.className = pPlayer.fOp.fClass + " " + this.fClsPreSlp + "OpAct";
		pPlayer.className = pPlayer.fClass + " " + this.fClsPreSlp + "FraAct";
		pPlayer.fOver.style.display = "";
		this.fActiveStepPlayer = pPlayer;
		if("scSiLib" in window) scSiLib.fireResizedNode(pPlayer);
		this.xSlpNxt(pPlayer);
	},
	/** dokielMgr.xSlpLstMode */
	xSlpLstMode : function(pPlayer){
		if (this.fPlayerCtrlModeCss){
			this.xSwitchClass(pPlayer.fBtnStep, "disabled_", "disabled_false", true, false);
			pPlayer.fBtnStep.setAttribute("aria-disabled", "false");
			this.xSwitchClass(pPlayer.fBtnList, "disabled_", "disabled_true", true, false);
			pPlayer.fBtnList.setAttribute("aria-disabled", "true");
			this.xSwitchClass(pPlayer.fNavBtns, "disabled_", "disabled_true", true, false);
			pPlayer.fNavBtns.setAttribute("aria-disabled", "true");
		} else{
			pPlayer.fBtnStep.style.display = "";
			pPlayer.fBtnList.style.display = "none";
			pPlayer.fNavBtns.style.display = "none";
		}
		pPlayer.parentNode.removeAttribute("aria-roledescription");
		for(let i in pPlayer.fSteps) {
			const vStep = pPlayer.fSteps[i];
			vStep.removeAttribute("aria-roledescription");
			vStep.style.position = "";
			vStep.style.visibility = "";
			vStep.style.left = "";
			vStep.style.top = "";
		}
		pPlayer.fOp.className = pPlayer.fOp.fClass;
		pPlayer.className = pPlayer.fClass;
		pPlayer.fOver.style.display = "none";
		this.fActiveStepPlayer = null;
		if("scSiLib" in window) scSiLib.fireResizedNode(pPlayer);
	},
	/** dokielMgr.xSlpPrv */
	xSlpPrv : function(pPlayer){
		if (pPlayer.fIdx <= 0) return;
		this.xSlpGotoStep(pPlayer,--pPlayer.fIdx);
	},
	/** dokielMgr.xSlpNxt */
	xSlpNxt : function(pPlayer){
		if (pPlayer.fIdx >= pPlayer.fSteps.length-1) return;
		this.xSlpGotoStep(pPlayer,++pPlayer.fIdx);
	},
	/** dokielMgr.xSlpGotoStep */
	xSlpGotoStep : function(pPlayer, pIdx){
		for(let i in pPlayer.fSteps) {
			const vStep = pPlayer.fSteps[i];
			vStep.style.position = (pIdx == i ? "" : "absolute");
			vStep.style.visibility = (pIdx == i ? "" : "hidden");
			vStep.setAttribute("aria-disabled", (pIdx == i ? "false" : "true"));
			vStep.style.left = (pIdx == i ? "" : "-20000px");
			vStep.style.top = (pIdx == i ? "" : "-20000px");
		}
		pPlayer.fBtnPrv.style.visibility = (pPlayer.fIdx <= 0 ? "hidden" : "");
		pPlayer.fBtnPrv.setAttribute("aria-disabled", (pPlayer.fIdx <= 0 ? "true" : "false"));
		pPlayer.fBtnNxt.style.visibility = (pPlayer.fIdx >= pPlayer.fSteps.length-1 ? "hidden" : "");
		pPlayer.fBtnNxt.setAttribute("aria-disabled", (pPlayer.fIdx >= pPlayer.fSteps.length-1 ? "true" : "false"));
		pPlayer.fCount.innerHTML = "<span>"+(pPlayer.fIdx+1)+"/"+pPlayer.fSteps.length+"</span>";
		if (pPlayer.fIdx >= pPlayer.fSteps.length-1) pPlayer.fBtnList.focus();
		if("scSiLib" in window) scSiLib.fireResizedNode(pPlayer);
	},

	/* == Utils ================================================================ */
	/** dokielMgr.xAddSep : Add a simple textual separator : " | ". */
	xAddSep : function(pParent){
		const vSep = document.createElement("span");
		vSep.className = this.fClsPreSlp + "Sep";
		vSep.innerHTML = " | "
		pParent.appendChild(vSep);
	},
	/** dokielMgr.xAddBtn : Add a HTML button to a parent node. */
	xAddBtn : function(pParent,pFra,pClass,pCapt,pTitle,pNoCmd){
		const vBtn = document.createElement("a");
		vBtn.className = pClass;
		vBtn.fName = pClass;
		vBtn.href = "#";
		vBtn.target = "_self";
		vBtn.setAttribute("role", "button");
		if (!pNoCmd) {
			vBtn.onclick=function(){return dokielMgr.xBtnMgr(this);}
			vBtn.onkeyup=function(pEvent){scDynUiMgr.handleBtnKeyUp(pEvent);}
			vBtn.onkeydown=function(pEvent){scDynUiMgr.handleBtnKeyDwn(pEvent);}
		}
		vBtn.setAttribute("title",pTitle);
		vBtn.innerHTML="<span>"+pCapt+"</span>";
		vBtn.fFra = pFra;
		pParent.appendChild(vBtn);
		return vBtn;
	},
	/** dokielMgr.xTogglePageFocus : */
	xToggleFocusables : function(pExludedNode) {
		let i;
		if (this.fFocusablesDisabled && this.fFocusables){
			for (i = 0; i<this.fFocusables.length; i++){
				this.fFocusables[i].setAttribute("tabindex", "");
			}
			this.fFocusablesDisabled = false;
		} else {
			this.fFocusables = scPaLib.findNodes(this.fPathFocusables);
			for (i = 0; i<this.fFocusables.length; i++){
				const vElt = this.fFocusables[i];
				if (!this.xIsEltContainedByNode(vElt, pExludedNode)) this.fFocusables[i].setAttribute("tabindex", "-1");
			}
			this.fFocusablesDisabled = true;
		}
	},
	/** dokielMgr.xIsEltContainedByNode : */
	xIsEltContainedByNode : function(pElt, pContainer) {
		let vElt = pElt;
		let vFound = false;
		if (vElt) {
			while (vElt.parentNode && !vFound) {
				vElt = vElt.parentNode;
				vFound = vElt === pContainer;
			}
		}
		return(vFound);
	},
	/** dokielMgr.xIsVisible : Retourne 'true' par défaut : cette fonction peut être surchargée pas le contexte du générateur */
	xIsVisible : function(pNode){
		return true;
	},
	/** dokielMgr.xSwitchClass : Replace a CSS class. */
	xSwitchClass : function(pNode, pClassOld, pClassNew, pAddIfAbsent, pMatchExact) {
		const vAddIfAbsent = typeof pAddIfAbsent == "undefined" ? false : pAddIfAbsent;
		const vMatchExact = typeof pMatchExact == "undefined" ? true : pMatchExact;
		const vClassName = pNode.className;
		const vReg = new RegExp("\\b" + pClassNew + "\\b");
		if (vMatchExact && vClassName.match(vReg)) return;
		let vClassFound = false;
		if (pClassOld && pClassOld !== "") {
			if (vClassName.indexOf(pClassOld)===-1){
				if (!vAddIfAbsent) return;
				else if (pClassNew && pClassNew !== '') pNode.className = vClassName + " " + pClassNew;
			} else {
				const vCurrentClasses = vClassName.split(' ');
				const vNewClasses = [];
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
	/** dokielMgr.xGetStr : Reteive a string. */
	xGetStr : function(pStrId) {
		return this.fStrings[pStrId];
	},
	loadSortKey : "ZZ"
}
