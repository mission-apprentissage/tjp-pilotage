/* === SCENARI code block manager ======================================== */
window.scCodeMgr	 = {
	fPathCode : [],
	fCodes : null,
	fCurrItem : null,
	fOverAlpha : .6,
	fDefaultStep : 3 * 1000,
	fMinStep : 1 * 100,
	fMaxStep : 10 * 1000,
	fTypCode : "scCode",
	fLineNumPath : scPaLib.compilePath("des:div.CodeMirror-linenumber"),
	fSourceRoot : null,
	fEnabled : true,
	fLocalize : true
}
/** SCENARI code block manager strings */
scCodeMgr.fStrings = ["num.","Désactiver les numéros de ligne",
/*02*/                "texte","Activer la vue texte brut",
/*04*/                "copie","Sélectionner le texte brut pour le copier",
/*06*/                "Ligne","Désactiver le retour à la ligne automatique",
/*08*/                "CTRL+C pour copier, CTRL+V pour coller","",
/*10*/                "Activer les numéros de ligne","Désactiver la vue texte brut",
/*12*/                "Activer le retour à la ligne automatique",""];
/** scCodeMgr.init. */
scCodeMgr.init = function() {
}
/** scCodeMgr.registerCode.
 * @param pPathCode scPaLib path vers les block de code.
 * @param pOpts options du block de code.
 *           toolbar : 0 = pas de toolbar / 1 = toolbar
 *           clsPre : préfix de classe CSS
 */
scCodeMgr.registerCode = function(pPathCode, pOpts) {
	const vCode = {};
	vCode.fPath = pPathCode;
	vCode.fOpts = (typeof pOpts == "undefined" ? {toolbar:1,pathCode:"chi:div",pathRaw:"chi:pre",clsPre:this.fTypCode} : pOpts);
	vCode.fOpts.toolbar = (typeof vCode.fOpts.toolbar == "undefined" ? 1 : vCode.fOpts.toolbar);
	vCode.fOpts.pathCode = (typeof vCode.fOpts.pathCode == "undefined" ? 1 : vCode.fOpts.pathCode);
	vCode.fOpts.pathRaw = (typeof vCode.fOpts.pathRaw == "undefined" ? 1 : vCode.fOpts.pathRaw);
	vCode.fOpts.clsPre = (typeof vCode.fOpts.clsPre == "undefined" ? this.fTypCode : vCode.fOpts.clsPre);
	this.fPathCode[this.fPathCode.length] = vCode;
}
/** scCodeMgr.setEnabled. */
scCodeMgr.setEnabled = function(pEnable) {
	this.fEnabled = pEnable;
}
/** scCodeMgr.setSourceRoot. */
scCodeMgr.setSourceRoot = function(pRoot) {
	this.fSourceRoot = pRoot;
}
/** scCodeMgr.setLocalize. */
scCodeMgr.setLocalize = function(pLocalize) {
	this.fLocalize = pLocalize;
}

/** scCodeMgr.onLoad - called by the scenari framework, inits the manager. */
scCodeMgr.onLoad = function() {
	
	if (!this.fEnabled) return;

	if (!this.fSourceRoot) this.fSourceRoot = document.body;

	// Load code blocks...
	this.xInitCodes(this.fSourceRoot);
}

/* === Global managers ====================================================== */
/** scCodeMgr.xBtnMgr - centralized button manager */
scCodeMgr.xBtnMgr = function(pBtn) {
	const vObj = pBtn.fObj;
	switch(pBtn.fName){
		case this.fTypCode+"BtnLineNums":
			scCodeMgr.xTgleLineNums(vObj);break;
		case this.fTypCode+"BtnRaw":
			scCodeMgr.xTgleRaw(vObj);break;
		case this.fTypCode+"BtnCopy":
			scCodeMgr.xCopy(vObj);break;
		case this.fTypCode+"BtnWrap":
			scCodeMgr.xTgleWrap(vObj);break;
			
	}
	return false;
}

/* === Code block manager ==================================================== */
scCodeMgr.xInitCodes = function(pCo) {
	for(let i=0; i<this.fPathCode.length; i++) {
		const vCodes = scPaLib.findNodes(this.fPathCode[i].fPath, pCo);
		for(let j=0; j<vCodes.length; j++) this.xInitCode(vCodes[j],this.fPathCode[i].fOpts);
	}
}
scCodeMgr.xInitCode = function(pCode,pOpts) {
	try {
		pCode.fCode = scPaLib.findNode(pOpts.pathCode, pCode);
		if (!pCode.fCode) return;
		pCode.fClass = pCode.className;
		pCode.fCode.className = pCode.fClass + " " + pOpts.clsPre + "Code";
		pCode.fOpts = pOpts;
		pCode.fLang = pCode.fCode.firstChild.getAttribute("data-lang");
		pCode.fIsPlain = pCode.fLang === "text/plain";
		pCode.fRaw = scPaLib.findNode(pOpts.pathRaw, pCode);
		if (pCode.fRaw) {
			pCode.fRaw.className = pCode.fRaw.className + " " + pOpts.clsPre + "Raw";
			pCode.fRawInvisible = true;
		}
		if (pOpts.toolbar > 0) {
			pCode.fCtrl = scDynUiMgr.addElement("div", pCode, pOpts.clsPre + "Ctrl noIndex", pCode.firstChild);
			var vNumLines = scPaLib.findNodes(this.fLineNumPath, pCode.fCode).length;
			if (vNumLines && !pCode.fIsPlain) {
				pCode.fBtnLineNums = this.xAddBtn(pCode.fCtrl, pCode, this.fTypCode, "BtnLineNums", this.xGetStr(0), this.xGetStr(1));
				scCodeMgr.xAddSep(pCode.fCtrl, pCode);
			}
			pCode.fBtnWrap = this.xAddBtn(pCode.fCtrl, pCode, this.fTypCode, "BtnWrap", this.xGetStr(6), this.xGetStr(7));
			scCodeMgr.xAddSep(pCode.fCtrl, pCode);
			pCode.fWrapOn = false;
			if (pCode.fRaw) {
				pCode.fBtnRaw = this.xAddBtn(pCode.fCtrl, pCode, this.fTypCode, "BtnRaw", this.xGetStr(pCode.fIsPlain ? 0 : 2), this.xGetStr(pCode.fIsPlain ? 1 : 3));
				scCodeMgr.xAddSep(pCode.fCtrl, pCode);
				pCode.fBtnCopy = this.xAddBtn(pCode.fCtrl, pCode, this.fTypCode, "BtnCopy", this.xGetStr(4), this.xGetStr(5));
				scCodeMgr.xAddSep(pCode.fCtrl, pCode);
				pCode.fCopyMsg = scDynUiMgr.addElement("div", pCode, pOpts.clsPre + "CopyMsg " + pOpts.clsPre + "Hidden noIndex", pCode.fCtrl.nextSibling);
				pCode.fCopyMsg.innerHTML = "<span>" + this.xGetStr(8) + "</span>";
			}
		}
		pCode.className = pCode.fClass + " " + pOpts.clsPre + "Raw-invisible " + pOpts.clsPre + "Wrap-off " + pOpts.clsPre + "Active" + (vNumLines ? " " + pOpts.clsPre + "LineNums-visible" : "") + (pCode.fIsPlain ? " " + pOpts.clsPre + "Plain" : "");
		if (pCode.fRaw) pCode.fRaw.style.display = "";
	} catch(e){
		console.error("scCodeMgr.xInitCode::Error" + e);
	}
}
/** scCodeMgr.xTgleLineNums : . */
scCodeMgr.xTgleLineNums = function(pObj){
	if (pObj.fLinesInvisible) this.xSwitchClass(pObj, pObj.fOpts.clsPre+"LineNums-invisible", pObj.fOpts.clsPre+"LineNums-visible");
	else this.xSwitchClass(pObj, pObj.fOpts.clsPre+"LineNums-visible", pObj.fOpts.clsPre+"LineNums-invisible");
	pObj.fLinesInvisible = !pObj.fLinesInvisible;
	pObj.fBtnLineNums.setAttribute("title", this.xGetStr(pObj.fLinesInvisible ? 10 : 1));
	if("scSiLib" in window) scSiLib.fireResizedNode(pObj);
}
/** scCodeMgr.xTgleRaw : . */
scCodeMgr.xTgleRaw = function(pObj, pForce){
	if (pForce) pObj.fRawInvisible = true;
	if (pObj.fRawInvisible) this.xSwitchClass(pObj, pObj.fOpts.clsPre+"Raw-invisible", pObj.fOpts.clsPre+"Raw-visible");
	else this.xSwitchClass(pObj, pObj.fOpts.clsPre+"Raw-visible", pObj.fOpts.clsPre+"Raw-invisible");
	pObj.fRawInvisible = !pObj.fRawInvisible;
	pObj.fBtnRaw.setAttribute("aria-checked", !pObj.fRawInvisible);
	pObj.fBtnRaw.setAttribute("title", this.xGetStr(pObj.fRawInvisible ? 5 : 11));
	if("scSiLib" in window) scSiLib.fireResizedNode(pObj);
}
/** scCodeMgr.xTgleWrap : . */
scCodeMgr.xTgleWrap = function(pObj){
	if (pObj.fWrapOn) this.xSwitchClass(pObj, pObj.fOpts.clsPre+"Wrap-on", pObj.fOpts.clsPre+"Wrap-off");
	else this.xSwitchClass(pObj, pObj.fOpts.clsPre+"Wrap-off", pObj.fOpts.clsPre+"Wrap-on");
	pObj.fWrapOn = !pObj.fWrapOn;
	pObj.fBtnWrap.setAttribute("aria-checked", pObj.fWrapOn);
	pObj.fBtnWrap.setAttribute("title", this.xGetStr(pObj.fWrapOn ? 7 : 12));
	if("scSiLib" in window) scSiLib.fireResizedNode(pObj);
}
/** scCodeMgr.xCopy : . */
scCodeMgr.xCopy = function(pObj){
	this.xTgleRaw(pObj, true);
	let vRange, vSelection;
	if (document.body.createTextRange) {
		vRange = document.body.createTextRange();
		vRange.moveToElementText(pObj.fRaw);
		vRange.select();
	} else if (window.getSelection) {
		vSelection = window.getSelection();
		vRange = document.createRange();
		vRange.selectNodeContents(pObj.fRaw);
		vSelection.removeAllRanges();
		vSelection.addRange(vRange);
	}
	this.xSwitchClass(pObj.fCopyMsg, pObj.fOpts.clsPre+"Hidden", pObj.fOpts.clsPre+"Visible");
	window.setTimeout(function(){
		scCodeMgr.xSwitchClass(pObj.fCopyMsg, pObj.fOpts.clsPre+"Visible", pObj.fOpts.clsPre+"Hidden");
	}, 4000);
	if("scSiLib" in window) scSiLib.fireResizedNode(pObj);
}

/* === Toolbox ============================================================== */
/** scCodeMgr.xAddSep : Add a simple textual separator : " | ". */
scCodeMgr.xAddSep = function(pParent, pObj){
	const vSep = document.createElement("span");
	vSep.className = pObj.fOpts.clsPre+"Hidden";
	vSep.innerHTML = " | "
	pParent.appendChild(vSep);
}
/** scCodeMgr.xAddBtn : Add a HTML button to a parent node. */
scCodeMgr.xAddBtn = function(pParent,pObj,pType,pName,pCapt,pTitle){
	const vBtn = scDynUiMgr.addElement("a", pParent, pObj.fOpts.clsPre + pName);
	vBtn.fName = pType+pName;
	vBtn.href = "#";
	vBtn.target = "_self";
	vBtn.setAttribute("role", "button");
	vBtn.onclick=function(){return scCodeMgr.xBtnMgr(this);}
	vBtn.onkeydown=function(pEvent){scDynUiMgr.handleBtnKeyDwn(pEvent);}
	vBtn.onkeyup=function(pEvent){scDynUiMgr.handleBtnKeyUp(pEvent);}
	if (pTitle) vBtn.setAttribute("title", pTitle);
	if (pCapt) vBtn.innerHTML = "<span>" + pCapt + "</span>"
	vBtn.fObj = pObj;
	return vBtn;
}
/** scCodeMgr.xFocus : */
scCodeMgr.xFocus = function(pNode) {
	if (this.fFocus) try{pNode.focus();}catch(e){}
}
/** scCodeMgr.xIsVisible : */
scCodeMgr.xIsVisible = function(pNode) {
	const vAncs = scPaLib.findNodes("anc:", pNode);
	for(let i=0; i<vAncs.length; i++) if (vAncs[i].nodeType === 1 && scDynUiMgr.readStyle(vAncs[i],"display") === "none") return false;
	return true;
}
/** scCodeMgr.xGetStr : Reteive a string. */
scCodeMgr.xGetStr = function(pStrId) {
	return (this.fLocalize ? this.fStrings[pStrId] : "");
}
/** scCodeMgr.xSwitchClass : Replace a CSS class. */
scCodeMgr.xSwitchClass = function(pNode, pClassOld, pClassNew) {
	if (pClassOld && pClassOld !== '') {
		const vCurrentClasses = pNode.className.split(' ');
		const vNewClasses = [];
		let vClassFound = false;
		let i = 0;
		const n = vCurrentClasses.length;
		for(; i<n; i++) {
			if (vCurrentClasses[i] !== pClassOld) {
				vNewClasses.push(vCurrentClasses[i]);
			} else {
				if (pClassNew && pClassNew !== '') vNewClasses.push(pClassNew);
				vClassFound = true;
			}
		}
		pNode.className = vNewClasses.join(' ');
	}
}
scCodeMgr.loadSortKey = "ZZZ";
scOnLoads[scOnLoads.length] = scCodeMgr;