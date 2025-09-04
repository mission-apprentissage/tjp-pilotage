window.treeMgr = scOnLoads[scOnLoads.length] = {
	fPathTrees: "des:div.treeRoot",
	fPathLnks: "des:a.nodeTi",
	fPathNodes: "des:div.nodeTi/chi:.nodeTi",
	fPathDefaultVisible: "des:div.nodeDefaultVisible",
	fPathNodeRoot: "anc:div.nodeRoot",
	fPathTreeRoot: "des:div.nodeDepth_0",
	fFilterNodeInitDepth: scPaLib.compileFilter("div.nodeDepth_0"),
	fToolbarMinNumNodes: 20,
	fLocalize: true,
	fFocus: true
};
/** SCENARI tree manager strings */
treeMgr.fStrings = ["Ouvrir","Ouvrir tous les nœuds",
/*02*/              "Fermer","Fermer tous les nœuds",
/*04*/              "Chercher","Activer/désactiver la recherche de nœuds",
/*06*/              "Chercher un nœud :","Tapez votre recherche",
/*08*/              "Recherche textuelle dans les titres des nœuds (trois caractères minimum)","Veuillez précisez votre recherche.",
/*10*/              "Veuillez taper votre recherche dans la barre d\'outils.","%s nœud(s) trouvé(s).",
/*12*/              "Prev.","Nœud précedent",
/*14*/              "Suiv.","Nœud suivant",
/*16*/              "Cacher le contenu de \'%s\'","Afficher le contenu de \'%s\'"];

/** treeMgr.init. */
treeMgr.init = function(){
	try{
		this.fTrees = scPaLib.findNodes(this.fPathTrees);
		for (let i=0; i<this.fTrees.length; i++){
			let j;
			const vTree = this.fTrees[i];
			vTree.fScroll = vTree.firstChild;
			vTree.fRoot = scPaLib.findNode(this.fPathTreeRoot,vTree);
			vTree.fLnks = scPaLib.findNodes(this.fPathLnks,vTree);
			vTree.fNodes = scPaLib.findNodes(this.fPathNodes,vTree);
			const vToolbarAttr = vTree.getAttribute("data-toolbar");
			if (vToolbarAttr == "false") vTree.fHasToolbar = false;
			else if (vToolbarAttr == "true") vTree.fHasToolbar = true;
			else vTree.fHasToolbar = this.fToolbarMinNumNodes<=vTree.fNodes.length;
			vTree.fClass = vTree.className;
			for (j = 0; j<vTree.fNodes.length; j++){
				const vNode = vTree.fNodes[j];
				vNode.fText = vNode.textContent ? vNode.textContent.toLowerCase() : vNode.innerText.toLowerCase();
				const vNodeRoot = vNode.fNodeRoot = scPaLib.findNode(this.fPathNodeRoot, vNode);
				vNodeRoot.fRoot = vTree;
				vNodeRoot.fLabel = vNode.firstChild;
				if (vTree.fHasToolbar) vNodeRoot.className = vNodeRoot.className + " treeSearch_nomach treeSearch_nocur";
			}
			if (document.visibilityState === 'visible'){
				vTree.fScroll.style.width="3000px";
				vTree.fRoot.style.width = vTree.fRoot.clientWidth+1+"px";
				vTree.fScroll.style.width="";
			}
			for (j = 0; j<vTree.fLnks.length; j++){
				const vLnk = vTree.fLnks[j];
				vLnk.onclick = this.sToggle;
				vLnk.title = this.fStrings[16].replace("%s", (vLnk.innerText ? vLnk.innerText: vLnk.textContent));
				if (!scPaLib.checkNode(this.fFilterNodeInitDepth,vLnk.fNodeRoot)) this.toggle(vLnk);
			}
			const vDefaultVisibleNodes = scPaLib.findNodes(this.fPathDefaultVisible, vTree);
			for (j = 0; j<vDefaultVisibleNodes.length; j++) this.makeVisible(vDefaultVisibleNodes[j]);
		}
		if (document.visibilityState === 'visible') this.fHasInitTrees = true;
		let vHash = window.location.hash;
		if (vHash.length>0); vHash = vHash.substring(1);
		if (vHash && sc$(vHash)){
			if (scPaLib.checkNode("div.nodeLbl", sc$(vHash))) this.makeVisible(sc$(vHash));
		}
		if (this.fTrees.length>0){
			document.addEventListener("visibilitychange", function() {
				if (document.visibilityState === 'visible' && !treeMgr.fHasInitTrees) {
					for (let i=0; i<treeMgr.fTrees.length; i++) {
						const vTree = treeMgr.fTrees[i];
						vTree.fScroll.style.width="3000px";
						vTree.fRoot.style.width = vTree.fRoot.clientWidth+1+"px";
						vTree.fScroll.style.width="";
					}
				}
				treeMgr.fHasInitTrees = true;
			});
		}
	}catch(e){scCoLib.log("ERROR - treeMgr.init : "+e)}
}
/** treeMgr.onLoad. */
treeMgr.onLoad = function(){
	for (let i=0; i<this.fTrees.length; i++){
		const vTree = this.fTrees[i];
		if (vTree.fHasToolbar){
			vTree.fScroll.style.position = "relative";
			vTree.className = vTree.fClass + " treeHasToolbar treeSearch_off treeSearch_noact";
			let vBd = dom.newBd(vTree);
			vTree.fStatusbar = vBd.elt("div", "treeStatusbar").text(this.xGetStr(10)).currentUp();
			vTree.fToolbar = vBd.elt("div", "treeToolbar", vTree.fScroll).current();
			vBd.elt("form", "treeSearchForm").listen("submit", function (pEvt) {pEvt.preventDefault();});
			vBd.elt("span", "treeSearchLabel").text(this.xGetStr(6)).up();
			vTree.fSearch = vBd.elt("input", "treeSearchInput").att("type", "text").att("placeholder", this.xGetStr(7)).att("title", this.xGetStr(8)).prop("fObj", vTree).currentUp();
			vTree.fSearch.onkeyup = this.sKeyUp;
			vBd.elt("span", "treeSep").text(" | ").up();
			this.xAddBtn(vBd, vTree, "treeBtnPrv", this.xGetStr(12), this.xGetStr(13));
			vBd.elt("span", "treeSep").text(" | ").up();
			this.xAddBtn(vBd, vTree, "treeBtnNxt", this.xGetStr(14), this.xGetStr(15));
			vBd.elt("span", "treeSep").text(" | ").up();
			vTree.fResultLabel = vBd.elt("span", "treeSearchResultLabel").currentUp();
			vBd.up();
			vBd.elt("span", "treeSep").text(" | ").up();
			this.xAddBtn(vBd, vTree, "treeBtnSearch", this.xGetStr(4), this.xGetStr(5));
			vBd.elt("span", "treeSep").text(" | ").up();
			this.xAddBtn(vBd, vTree, "treeBtnOpenAll", this.xGetStr(0), this.xGetStr(1));
			vBd.elt("span", "treeSep").text(" | ").up();
			this.xAddBtn(vBd, vTree, "treeBtnCloseAll", this.xGetStr(2), this.xGetStr(3));
		}
	}
}
/** treeMgr.makeVisible. */
treeMgr.makeVisible = function(pNode){
	const vTreeNodes = scPaLib.findNodes("anc:.nodeChildren_hide", scPaLib.findNode("can:.nodeRoot", pNode));
	for (let i=0; i<vTreeNodes.length; i++){
		this.toggle(scPaLib.findNode("chi:.nodeLblFra/des:a.nodeTi",vTreeNodes[i]));
	}
}
/** treeMgr.toggleSearch. */
treeMgr.toggleSearch = function(pTree){
	pTree.fSearchEnabled = !pTree.fSearchEnabled;
	if (pTree.fSearchEnabled) {
		treeMgr.xSwitchClass(pTree, "treeSearch_off", "treeSearch_on");
		this.xFocus(pTree.fSearch);
		const vAvailHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		if (pTree.fScroll.clientHeight+50 > vAvailHeight) pTree.fScroll.style.height = (vAvailHeight-50)+"px";
	} else {
		treeMgr.xSwitchClass(pTree, "treeSearch_on", "treeSearch_off");
		pTree.fScroll.style.height = "";
		this.xResetSearch(pTree);
	}
	if("scSiLib" in window) scSiLib.fireResizedNode(pTree);
}
/** treeMgr.toggle. */
treeMgr.toggle = function(pBtn,pDeep){
	if (typeof pDeep == "undefined") pDeep = false;
	pBtn.fClosed = !pBtn.fClosed;
	pBtn.title = this.fStrings[(pBtn.fClosed? 17 : 16)].replace("%s", (pBtn.innerText ? pBtn.innerText: pBtn.textContent));
	const vNodeRoot = pBtn.fNodeRoot;
	vNodeRoot.className = vNodeRoot.className.replace(/nodeChildren_[a-zA-Z]*/gi,"nodeChildren_"+(pBtn.fClosed ? "hide" : "show"));
	if (pDeep){
		const vTreeNodes = scPaLib.findNodes("des:.nodeChildren_" + (pBtn.fClosed ? "show" : "hide"), vNodeRoot);
		for (let i=0; i<vTreeNodes.length; i++){
			this.toggle(scPaLib.findNode("chi:.nodeLblFra/des:a.nodeTi",vTreeNodes[i]));
		}
	}
	if("scSiLib" in window) scSiLib.fireResizedNode(pBtn);
	return false;
}
/** treeMgr.next. */
treeMgr.next = function(pTree){
	if (pTree.fResults.length==0) return;
	if (pTree.fResultIdx>-1) this.xSwitchClass(pTree.fResults[pTree.fResultIdx].fNodeRoot, "treeSearch_cur", "treeSearch_nocur");
	if (pTree.fResultIdx < pTree.fResults.length-1){
		const vNode = pTree.fResults[++pTree.fResultIdx];
		this.xSwitchClass(vNode.fNodeRoot, "treeSearch_nocur", "treeSearch_cur");
		this.xUpdateResults(pTree, vNode);
	} else if (pTree.fResults.length>1){
		pTree.fResultIdx = -1;
		this.next(pTree);
	}
}
/** treeMgr.previous. */
treeMgr.previous = function(pTree){
	if (pTree.fResults.length==0) return;
	this.xSwitchClass(pTree.fResults[pTree.fResultIdx].fNodeRoot, "treeSearch_cur", "treeSearch_nocur");
	if (pTree.fResultIdx>0){
		const vNode = pTree.fResults[--pTree.fResultIdx];
		this.xSwitchClass(vNode.fNodeRoot, "treeSearch_nocur", "treeSearch_cur");
		this.xUpdateResults(pTree, vNode);
	} else if (pTree.fResults.length>1){
		pTree.fResultIdx = pTree.fResults.length - 2;
		this.next(pTree);
	}
}

/* === Internal ============================================================== */
/** treeMgr.sToggle. */
treeMgr.sToggle = function(pEvt){
	var pEvt = pEvt || window.event;
	return treeMgr.toggle(this,pEvt.ctrlKey);
}
/** treeMgr.sKeyUp. */
treeMgr.sKeyUp = function(pEvt){
	var pEvt = pEvt || window.event;
	const vTree = this.fObj;
	treeMgr.xResetSearchResults(vTree);
	if (this.value.length>2) treeMgr.xSearch(vTree, this.value);
	else vTree.fStatusbar.innerHTML = treeMgr.xGetStr(this.value.length==0?10:9);
}
/** treeMgr.xUpdateResults. */
treeMgr.xUpdateResults = function(pTree, pNode) {
	this.xScrollToNode(pTree, pNode);
	pTree.fResultLabel.innerHTML = pTree.fResultIdx+1 + "/" + pTree.fResults.length;
	let vContext = "";
	const vAncNodes = scPaLib.findNodes(this.fPathNodeRoot, pNode);
	for (let i=vAncNodes.length-1; i>=0; i--){
		vContext += vAncNodes[i].fLabel.innerHTML+ (i>0 ? " > " : "");
	}
	pTree.fStatusbar.innerHTML = vContext;
}
/** treeMgr.xScrollToNode. */
treeMgr.xScrollToNode = function(pTree, pNode) {
	pTree.fScroll.scrollTop = pNode.fNodeRoot.offsetTop - .3 * pTree.fScroll.clientHeight;
}
/** treeMgr.xReset. */
treeMgr.xResetSearch = function(pTree) {
	this.xResetSearchResults(pTree);
	pTree.fSearch.value = "";
	pTree.fResults = [];
	pTree.fStatusbar.innerHTML = this.xGetStr(10);
}
/** treeMgr.xReset. */
treeMgr.xResetSearchResults = function(pTree) {
	for (let i=0; i<pTree.fNodes.length; i++){
		const vNode = pTree.fNodes[i];
		this.xSwitchClass(vNode.fNodeRoot, "treeSearch_mach", "treeSearch_nomach");
		this.xSwitchClass(vNode.fNodeRoot, "treeSearch_cur", "treeSearch_nocur");
	}
	treeMgr.xSwitchClass(pTree, "treeSearch_act", "treeSearch_noact");
	pTree.fResultLabel.innerHTML = "";
}
/** treeMgr.xSearch. */
treeMgr.xSearch = function(pTree, pVal) {
	if (!pVal) return;
	let vCount = 0;
	pTree.fResultIdx = -1;
	pTree.fResults = [];
	pVal = pVal.toLowerCase();
	for (let i=0; i<pTree.fNodes.length; i++){
		const vNode = pTree.fNodes[i];
		if (vNode.fText.indexOf(pVal)>=0){
			this.xSwitchClass(vNode.fNodeRoot, "treeSearch_nomach", "treeSearch_mach");
			this.makeVisible(vNode);
			pTree.fResults.push(vNode);
			vCount++;
		} else {
			this.xSwitchClass(vNode.fNodeRoot, "treeSearch_mach", "treeSearch_nomach");
		}
	}
	pTree.fStatusbar.innerHTML = this.xGetStr(11).replace("%s", vCount);
	if (vCount>0) {
		this.xSwitchClass(pTree, "treeSearch_noact", "treeSearch_act");
		this.xScrollToNode(pTree, pTree.fResults[0]);
	}
	else this.xSwitchClass(pTree, "treeSearch_act", "treeSearch_noact");
	return vCount;
}
/** treeMgr.xBtnMgr - centralized button manager */
treeMgr.xBtnMgr = function(pBtn) {
	const vObj = pBtn.fObj;
	switch(pBtn.fName){
		case "treeBtnOpenAll":
			vObj.fLnks[0].fClosed = true;
			treeMgr.toggle(vObj.fLnks[0], true);break;
		case "treeBtnCloseAll":
			vObj.fLnks[0].fClosed = false;
			treeMgr.toggle(vObj.fLnks[0], true);
			treeMgr.toggle(vObj.fLnks[0]); break;
		case "treeBtnSearch":
			treeMgr.toggleSearch(vObj);break;
		case "treeBtnPrv":
			treeMgr.previous(vObj);break;
		case "treeBtnNxt":
			treeMgr.next(vObj);break;
	}
	return false;
}

/* === Toolbox ============================================================== */
/** treeMgr.xAddBtn : Add a HTML button to a parent node. */
treeMgr.xAddBtn = function(pBd,pObj,pName,pCapt,pTitle,pNoCmd){
	pBd.elt("a", pName).prop("fName", pName).prop("fObj", pObj).att("href", "#").att("target", "_self").att("role", "button").att("title", pTitle);
	if (!pNoCmd) {
		pBd.listen("click", function(pEvt){pEvt.preventDefault(); return treeMgr.xBtnMgr(this);});
		pBd.listen("keyup", function(pEvt){scDynUiMgr.handleBtnKeyUp(pEvt);});
	}
	return pBd.elt("span").text(pCapt).up().currentUp();
}
/** treeMgr.xFocus. */
treeMgr.xFocus = function(pNode) {
	if (this.fFocus) try{pNode.focus();}catch(e){};
}
/** treeMgr.xGetStr : Reteive a string. */
treeMgr.xGetStr = function(pStrId) {
	return (this.fLocalize ? this.fStrings[pStrId] : "");
}
/** treeMgr.xSwitchClass : Replace a CSS class. */
treeMgr.xSwitchClass = function(pNode, pClassOld, pClassNew) {
	if (pClassOld && pClassOld != '') {
		const vCurrentClasses = pNode.className.split(' ');
		const vNewClasses = new Array();
		let vClassFound = false;
		let i = 0;
		const n = vCurrentClasses.length;
		for(; i<n; i++) {
			if (vCurrentClasses[i] != pClassOld) {
				vNewClasses.push(vCurrentClasses[i]);
			} else {
				if (pClassNew && pClassNew != '') vNewClasses.push(pClassNew);
				vClassFound = true;
			}
		}
		pNode.className = vNewClasses.join(' ');
	}
}