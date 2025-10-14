


window.scCoLib = {
	fDebug : false,
	fOnLoadDone:false, 
	fOnUnloadDone:false
}




window.scOnLoads = [];




window.scOnUnloads = [];


function scOnLoad() {
	scOnLoads.sort(function (p1, p2){
			if(!p1.loadSortKey) return p2.loadSortKey ? -1 : 0;
			try{
				return p1.loadSortKey > (p2.loadSortKey||"") ? 1 : p1.loadSortKey === p2.loadSortKey ? 0 : -1;
			}catch(e){
				return p1.loadSortKey.localeCompare(p2.loadSortKey||"");
			}
		}
	);	for (let i=0; i<scOnLoads.length; i++) try{scOnLoads[i].onLoad();}catch(e){}
	scCoLib.fOnLoadDone = true;
	if (scOnUnloads.length>0) {
		console.warn("scOnUnloads is depreciated and contains %s handlers", scOnUnloads.length);
	}
}


function scOnUnload() {
	scOnUnloads.sort(function (p1, p2){
			if(!p1.unloadSortKey) return p2.unloadSortKey ? -1 : 0;
			try{
				return p1.unloadSortKey > (p2.unloadSortKey||"") ? 1 : p1.unloadSortKey === p2.unloadSortKey ? 0 : -1;
			}catch(e){
				return p1.unloadSortKey.localeCompare(p2.unloadSortKey||"");
			}
		}
	);
	for (let i=0; i<scOnUnloads.length; i++) try{scOnUnloads[i].onUnload();}catch(e){}
	scCoLib.fOnUnloadDone = true;
}




window.scOnResizes = [];


function scOnResize(pEvent) {
	const vLen = scOnResizes.length;
	if(vLen > 1 && vLen !== window.onresize.lastLen) {
		scOnResizes.sort(function (p1, p2){
				if(!p1.resizeSortKey) return p2.resizeSortKey ? -1 : 0;
				try{
					return p1.resizeSortKey > p2.resizeSortKey||"" ? 1 : p1.resizeSortKey === p2.resizeSortKey ? 0 : -1;
				}catch(e){
					return p1.resizeSortKey.localeCompare(p2.resizeSortKey||"");
				}
			}
		);
		window.onresize.lastLen = vLen;
	}
	for (let i =0; i < vLen; i++) try{scOnResizes[i].onResize(pEvent);}catch(e){}
}




window.scOnVisibles = [];




window.scOnInvisibles = [];


function scOnVisibilityChange(pEvent) {
	if(document.visibilityState === "visible"){
		const vLen = scOnVisibles.length;
		if(vLen > 1 && vLen !== scCoLib.fOnShowLen) {
			scOnVisibles.sort(function (p1, p2){
					if(!p1.visibleSortKey) return p2.visibleSortKey ? -1 : 0;
					try{
						return p1.visibleSortKey > p2.visibleSortKey||"" ? 1 : p1.visibleSortKey === p2.visibleSortKey ? 0 : -1;
					}catch(e){
						return p1.visibleSortKey.localeCompare(p2.visibleSortKey||"");
					}
				}
			);
			scCoLib.fOnShowLen = vLen;
		}
		for (let i =0; i < vLen; i++) try{scOnVisibles[i].onVisible(pEvent);}catch(e){}
	} else {
		const vLen = scOnInvisibles.length;
		if(vLen > 1 && vLen !== scCoLib.fOnHideLen) {
			scOnInvisibles.sort(function (p1, p2){
					if(!p1.invisibleSortKey) return p2.invisibleSortKey ? -1 : 0;
					try{
						return p1.invisibleSortKey > p2.invisibleSortKey||"" ? 1 : p1.invisibleSortKey === p2.invisibleSortKey ? 0 : -1;
					}catch(e){
						return p1.invisibleSortKey.localeCompare(p2.invisibleSortKey||"");
					}
				}
			);
			scCoLib.fOnHideLen = vLen;
		}
		for (let i =0; i < vLen; i++) try{scOnInvisibles[i].onInvisible(pEvent);}catch(e){}
	}
}




window.scOnPageShows = [];




window.scOnPageHides = [];


function scOnPageShow() {
	scOnPageShows.sort(function (p1, p2){
			if(!p1.pageShowSortKey) return p2.pageShowSortKey ? -1 : 0;
			try{
				return p1.pageShowSortKey > (p2.pageShowSortKey||"") ? 1 : p1.pageShowSortKey === p2.pageShowSortKey ? 0 : -1;
			}catch(e){
				return p1.pageShowSortKey.localeCompare(p2.pageShowSortKey||"");
			}
		}
	);	for (let i=0; i<scOnPageShows.length; i++) try{scOnPageShows[i].onPageShow();}catch(e){}
}


function scOnPageHide() {
	scOnPageHides.sort(function (p1, p2){
			if(!p1.pageHideSortKey) return p2.pageHideSortKey ? -1 : 0;
			try{
				return p1.pageHideSortKey > (p2.pageHideSortKey||"") ? 1 : p1.pageHideSortKey === p2.pageHideSortKey ? 0 : -1;
			}catch(e){
				return p1.pageHideSortKey.localeCompare(p2.pageHideSortKey||"");
			}
		}
	);
	for (let i=0; i<scOnPageHides.length; i++) try{scOnPageHides[i].onPageHide();}catch(e){}
}


window.onload = scOnLoad;
window.onunload = scOnUnload;
window.onresize = scOnResize;
document.addEventListener("visibilitychange", scOnVisibilityChange);
window.addEventListener("pageshow", scOnPageShow);
window.addEventListener("pagehide", scOnPageHide);


function sc$(pId) {return document.getElementById(pId);}
function $(pId) {return sc$(pId);}


scCoLib.addOnLoadHandler = function(pHanlder){
	if(scCoLib.fOnLoadDone) try{pHanlder.onLoad();}catch(e){}
	else scOnLoads.push(pHanlder);
}


scCoLib.addOnUnloadHandler = function(pHanlder){
	console.warn("The onunload is depreciated.");
	if(scCoLib.fOnUnloadDone) try{pHanlder.onUnload();}catch(e){}
	else scOnUnloads.push(pHanlder);
}


scCoLib.addEventsHandler = function(pHanlder){
	if (pHanlder.onLoad) scCoLib.addOnLoadHandler(pHanlder);
	if (pHanlder.onUnload) scCoLib.addOnUnloadHandler(pHanlder);
	if (pHanlder.onResize) scOnResizes.push(pHanlder);
	if (pHanlder.onVisible) scOnVisibles.push(pHanlder);
	if (pHanlder.onInvisible) scOnInvisibles.push(pHanlder);
	if (pHanlder.onPageShow) scOnPageShows.push(pHanlder);
	if (pHanlder.onPageHide) scOnPageHides.push(pHanlder);
}


scCoLib.userAgent = navigator.userAgent.toLowerCase();
scCoLib.isIE = scCoLib.userAgent.indexOf("msie")!==-1;


scCoLib.toInt = function(pX){
	let vY;
	return isNaN(vY = parseInt(pX))? 0 : vY;
}

scCoLib.hrefBase = function(pHref){
	let vHref = pHref || window.location.href;
	if (vHref.indexOf("?")>-1) vHref = vHref.substring(0,vHref.indexOf("?"));
	if (vHref.indexOf("#")>-1) vHref = vHref.substring(0,vHref.indexOf("#"));
	return vHref;
}

scCoLib.log = function(pMsg) {
	if (!scCoLib.fDebug) return;
	window.console.log(pMsg);
}

function ScLoad(pScLoadParams) {
	if (pScLoadParams) {
		this.fPathToRoot = pScLoadParams.pathToRoot;
		const vHrefBase = scCoLib.hrefBase();
		this.fRootUrl = vHrefBase.substring(0, vHrefBase.length - (vHrefBase.lastIndexOf(pScLoadParams.destUri) === vHrefBase.length - pScLoadParams.destUri.length ?  pScLoadParams.destUri.length : 1));
		this.fFrameId = pScLoadParams.frameId;
		const vSkinLoc = pScLoadParams.skinLoc;
		if (vSkinLoc && vSkinLoc !== "/skin") {
			if (vSkinLoc.lastIndexOf("url:", 0) === 0) this.fSkinAbsLoc = vSkinLoc.substring(4);
			else this.fSkinRelLoc = vSkinLoc;
		}
		const vLibScLoc = pScLoadParams.libScLoc;
		if (vLibScLoc && vLibScLoc !== "/lib-sc") {
			if (vLibScLoc.lastIndexOf("url:", 0) === 0) this.fLibScAbsLoc = vLibScLoc.substring(4);
			else this.fLibScRelLoc = vLibScLoc;
		}
		const vLibMdLoc = pScLoadParams.libMdLoc;
		if (vLibMdLoc && vLibMdLoc !== "/lib-md") {
			if (vLibMdLoc.lastIndexOf("url:", 0) === 0) this.fLibMdAbsLoc = vLibMdLoc.substring(4);
			else this.fLibMdRelLoc = vLibMdLoc;
		}
	} else {
		this.fPathToRoot = "";
		this.fRootUrl = scCoLib.hrefBase().substring(0, scCoLib.hrefBase().lastIndexOf("/"));
	}
	this.fRootOffset = this.fRootUrl.length + 1;
}
ScLoad.prototype = {
 /** 
  * Charge un document dans la frame cible à partir d'une url relative à la racine du site publié. 
  * Utilisable uniquement pour pointer une ressource dynamique du site publié (co, res).
  */
 loadFromRoot : function(pUrlFromRoot){
  if(this.fFrameId) sc$(this.fFrameId).src = this.fRootUrl + "/" + pUrlFromRoot;
  else window.location.href = this.fRootUrl + "/" + pUrlFromRoot;
 },
 
 /** 
  * Retourne une url relative à la racine du site publié.
  * Utilisable uniquement pour pointer une ressource dynamique du site publié (co, res).
  */
 getUrlFromRoot : function(pHref){return pHref.substring(this.fRootOffset)},
 
 /** 
  * Retourne une url complète à partir d'une url relative à la racine du site publié.
  * Utilisable uniquement pour pointer une ressource dynamique du site publié (co, res).
  */
 getPathFromRoot : function(pUrlFromRoot){return this.fPathToRoot + pUrlFromRoot},
 
 /** 
  * Retourne l'URL absolue racine du site publié.
  */
 getRootUrl : function(){return this.fRootUrl},
 
 /** 
  * Retourne une url vers une ressource quelconque (skin, site, lib-sc, lib-md, res, ou co).
  */
 resolveDestUri : function(pDestUri){
   if(pDestUri.lastIndexOf("/skin/", 0)===0) {
      if(this.fSkinRelLoc) return this.fRootUrl + this.fSkinRelLoc + pDestUri.substring(5);
      if(this.fSkinAbsLoc) return this.fSkinAbsLoc + pDestUri.substring(5);
   }
   if(pDestUri.lastIndexOf("/lib-sc/", 0)===0) {
      if(this.fLibScRelLoc) return this.fRootUrl + this.fLibScRelLoc + pDestUri.substring(7);
      if(this.fLibScAbsLoc) return this.fLibScAbsLoc + pDestUri.substring(7);
   }
   if(pDestUri.lastIndexOf("/lib-md/", 0)===0) {
      if(this.fLibMdRelLoc) return this.fRootUrl + this.fLibMdRelLoc + pDestUri.substring(7);
      if(this.fLibMdAbsLoc) return this.fLibMdAbsLoc + pDestUri.substring(7);
   }
   return this.fRootUrl + pDestUri;
 }
}
if (!scServices.scLoad) scServices.scLoad = new ScLoad(scLoadParams);


scCoLib.util = {
	logError : function(pPre, pEx) {
		const vMsg = pPre + ((pEx != null) ? " - " + ((typeof pEx.message != "undefined") ? pEx.message : pEx) : "");
		scCoLib.log("scCoLib.util.logError() DEPRECEATED - "+vMsg);
	},
	log : function(pMsg) {
		scCoLib.log("scCoLib.util.log() DEPRECEATED - "+pMsg);
	}
}
