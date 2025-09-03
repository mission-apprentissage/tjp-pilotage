
 
var scDynUiMgr = {


	collBlkToggle: function(pTitle, pCo, pClassOpen, pClassClosed) {
		if (pTitle.nodeType != 1 || pCo.nodeType != 1){
			scCoLib.log("scDynUiMgr.collBlkToggle error : pTitle or pCo not an element.");
			return null;
		}
		if (typeof pCo.fCollapsed == "undefined") {
			pCo.fClassName = pCo.className;
			pCo.fTitle = pTitle;
			if (this.collBlk.fMode == 1) pCo.fCollapsed = false;
			else pCo.fCollapsed = pCo.style.display == "none";
		}
		pTitle.className = pCo.fCollapsed ? pClassOpen : pClassClosed;
		pCo.className = pCo.fClassName + " " + this.collBlk.fClassPrefix + (pCo.fCollapsed ? "open" : "closed");
		if (this.collBlk.fMode == 0) pCo.style.display = pCo.fCollapsed ? "" : "none";
		if (pTitle.getAttribute("role")) pTitle.setAttribute("aria-expanded", pCo.fCollapsed);
		if (pCo.fCollapsed) for (var i=0; i<this.collBlk.fOpenListeners.length; i++) try{this.collBlk.fOpenListeners[i](pCo,pTitle);}catch(e){}
		else for (var i=0; i<this.collBlk.fCloseListeners.length; i++) try{this.collBlk.fCloseListeners[i](pCo,pTitle);}catch(e){}
		if (scCoLib.isIE) {
			var vTags = pCo.getElementsByTagName("IFRAME");
			if (pCo.fCollapsed) {
				for(var i=0; i<vTags.length; i++) vTags[i].src = vTags[i].bkpSrc ? vTags[i].bkpSrc : vTags[i].src;
			} else {
				for(var i=0; i<vTags.length; i++) {
					vTags[i].bkpSrc = vTags[i].src;
					vTags[i].src = "";
				}
			}
		}
		if("scSiLib" in window) scSiLib.fireResizedNode(pCo);
		pCo.fCollapsed = !pCo.fCollapsed;
		return !pCo.fCollapsed;
	},
	

	displaySubWindow: function(pAnc,pUrl,pName,pOpt) {
		scCoLib.log("scDynUiMgr.displaySubWindow("+pUrl+","+pName+","+pOpt+")");
		var vOpt = (this.subWindow.fOpt.OVERRIDE ? this.subWindow.fOpt : pOpt || this.subWindow.fOpt);

		try{if (!vOpt.IMBR && window.frameElement && window.frameElement.scSubWin) {
			window.location = pUrl;
			return;
		}}catch(e){}
		if (typeof pAnc.fSwId == "undefined") this.subWindow.xInitSw(pAnc, pName, vOpt);
		this.subWindow.xShow(pAnc.fSwId,pUrl);
		for (var i=0; i<this.subWindow.fOpenListeners.length; i++) try{this.subWindow.fOpenListeners[i](pAnc.fSwId);}catch(e){}
	},

	hideSubWindow: function(pId) {
		scCoLib.log("scDynUiMgr.hideSubWindow("+pId+")");
		this.subWindow.xHide(pId);
		for (var i=0; i<this.subWindow.fCloseListeners.length; i++) try{this.subWindow.fCloseListeners[i](pId);}catch(e){}
	},
	

	handleBtnKeyUp: function(pEvent) {
		pEvent = pEvent || window.pEvent;
		if (pEvent.keyCode === 32) pEvent.target.click();
	},
	handleBtnKeyDwn: function(pEvent) {
		pEvent = pEvent || window.pEvent;
		if (pEvent.keyCode === 32) pEvent.preventDefault();
	},
	

	addElement : function(pName, pParent, pClassName, pNxtSib, pStyle){
		var vElt;
		if(scCoLib.isIE && pName.toLowerCase() == "iframe") {
			var vFrmHolder = this.getDocument(pParent).createElement("div");
			pParent.appendChild(vFrmHolder);
			vFrmHolder.innerHTML = '<iframe allowtransparency="true" allowfullscreen="true" title=""></iframe>';
			vElt = vFrmHolder.firstChild;
			if (pNxtSib) pParent.insertBefore(vElt,pNxtSib)
			else pParent.appendChild(vElt);
			pParent.removeChild(vFrmHolder);
		} else {
			vElt = this.getDocument(pParent).createElement(pName);
			if(pName.toLowerCase() == "iframe") {
				vElt.setAttribute("allowfullscreen","true");
				vElt.setAttribute("style","border:0;");
			}
			if (pNxtSib) pParent.insertBefore(vElt,pNxtSib)
			else pParent.appendChild(vElt);
		}
		if (pClassName) vElt.className = pClassName;
		if (pStyle) {
			for (var vSelect in pStyle) vElt.style[vSelect] = pStyle[vSelect]
		}
		return vElt;
	},
	

	readStyle : function(pElt, pProp) {
		try {
			if (pElt.nodeType!=1) return null;
			var vVal = null;
			if (pElt.style && pElt.style[pProp]) {
				vVal = pElt.style[pProp];
			} else if (pElt.currentStyle) {
				vVal = pElt.currentStyle[pProp];
			} else {
				var vDefaultView = pElt.ownerDocument.defaultView;
				if (vDefaultView && vDefaultView.getComputedStyle) {
					var vStyle = vDefaultView.getComputedStyle(pElt, null);
					var vProp = pProp.replace(/([A-Z])/g,"-$1").toLowerCase();
					if (vStyle[vProp]) return vStyle[vProp];
					else vVal = vStyle.getPropertyValue(vProp);
				}
			}
			return vVal.replace(/\"/g,""); //Opera returns certain values quoted (literal colors).
		} catch (e) {
			return null;
		}
	},

	getDocument: function(pElt) {
		if(pElt.ownerDocument) return pElt.ownerDocument;
		else if (pElt.document) return pElt.document;
		else return document;
	}
}

scDynUiMgr.collBlk = {
	fMode : 0, // 0=collapse by style (default), 1=collapse by class
	fClassPrefix : "collBlk_",
	fOpenListeners : new Array(),
	fCloseListeners : new Array(),
	addOpenListener: function(pFunc) {this.fOpenListeners.push(pFunc)},
	addCloseListener: function(pFunc) {this.fCloseListeners.push(pFunc)}
}


scDynUiMgr.subWindow = {
	fMode : 0, // 0=collapse by style (default), 1=collapse by class
	fClassPrefix : "subWin_",
	fZIndex : 1000,
	fOpt : {},
	fSubWins : [],
	fOpenListeners : new Array(),
	fCloseListeners : new Array(),
	fOnLoadListeners : new Array(),
	addOpenListener: function(pFunc) {this.fOpenListeners.push(pFunc)},
	addCloseListener: function(pFunc) {this.fCloseListeners.push(pFunc)},
	addOnLoadListener: function(pFunc) {this.fOnLoadListeners.push(pFunc)},
	xInitSw: function(pAnc,pName,pOpt) {
		var vSubWinTi = pOpt.SUBWINTI || "";
		var vCloseBtnCo = pOpt.CLOSEBTNCO || "X";
		var vCloseBtnTi = pOpt.CLOSEBTNTI || "";
		var vBody = scDynUiMgr.getDocument(pAnc).body;
		var vCont = pOpt.ANCHORPATH ? scPaLib.findNode(pOpt.ANCHORPATH, (pOpt.ANCHORCTX ? pOpt.ANCHORCTX : pAnc)) || vBody : vBody;
		var vId = scDynUiMgr.subWindow.fSubWins.length;
		var vWin = scDynUiMgr.addElement("div",vCont,this.xBuildCls(pName,"win"),null,{position:"absolute"});
		vWin.setAttribute("role", "dialog");
		vWin.fClassName = vWin.className
		vWin.fAnc = pAnc;
		vWin.fOpt = pOpt;
		vWin.fOver = scDynUiMgr.addElement("div",vCont,this.xBuildCls(pName,"over"),vWin,{position:"absolute"});
		vWin.fOver.fClassName = vWin.fOver.className
		if (!pOpt.NOSUBWINTI) {
			var vTi = scDynUiMgr.addElement("div",vWin,this.xBuildCls(pName,"ti"));
			var vBtnCls = scDynUiMgr.addElement("a",vTi,this.xBuildCls(pName,"x"));
			if (vCloseBtnTi) vBtnCls.title = vCloseBtnTi;
			vBtnCls.href = "#";
			vBtnCls.onclick = function() {
				scDynUiMgr.hideSubWindow(vId);
				return false;
			}
			var vBtnClsCo = scDynUiMgr.addElement("span",vBtnCls);
			vBtnClsCo.innerHTML = vCloseBtnCo;
			vWin.fTi = scDynUiMgr.addElement("span",vTi);
			vWin.fTi.innerHTML = vSubWinTi;
		}
		var vCo = scDynUiMgr.addElement("div",vWin,this.xBuildCls(pName,"co"));
		vWin.fFra = scDynUiMgr.addElement("iframe",vCo,this.xBuildCls(pName,"fra"));
		vWin.fFra.scSubWin = true;
		vWin.fFra.fWin = vWin;
		vWin.fFra.title = vSubWinTi;
		vWin.fFra.setSubWindowTitle = function(pTitle){
			var vSubWin = scDynUiMgr.subWindow.fSubWins[vId];
			if(vSubWin.fTi) vSubWin.fTi.innerHTML = pTitle;
			vSubWin.fFra.title = pTitle;
			vSubWin.setAttribute("aria-label", pTitle);
		}
		vWin.fFra.hideSubWindow = function(){
			scDynUiMgr.hideSubWindow(vId);
		}
		if(scCoLib.isIE) vWin.fFra.onreadystatechange = scDynUiMgr.subWindow.sOnLoad;
		else vWin.fFra.onload = scDynUiMgr.subWindow.sOnLoad;
		this.fSubWins[vId] = vWin;
		pAnc.fSwId = vId;
	},
	xShow: function(pId,pUrl) {
		var vCurrSw = this.fSubWins[pId];
		if (vCurrSw){
			vCurrSw.fFra.src = pUrl;
			vCurrSw.fOver.style.zIndex = this.fZIndex++;
			vCurrSw.style.zIndex = this.fZIndex++;
			if (this.fMode == 1){
				vCurrSw.fOver.className = vCurrSw.fOver.fClassName + " " + this.fClassPrefix + "show";
				vCurrSw.className = vCurrSw.fClassName + " " + this.fClassPrefix + "show";
			} else {
				vCurrSw.fOver.style.display = "";
				vCurrSw.style.display = "";
			}
		}
	},
	xHide: function(pId) {
		var vCurrSw = this.fSubWins[pId];
		if (vCurrSw){
			if (this.fMode == 1){
				vCurrSw.fOver.className = vCurrSw.fOver.fClassName + " " + this.fClassPrefix + "hide";
				vCurrSw.className = vCurrSw.fClassName + " " + this.fClassPrefix + "hide";
			} else {
				vCurrSw.fOver.style.display = "none";
				vCurrSw.style.display = "none";
			}
			vCurrSw.fFra.src = "";
			vCurrSw.fAnc.focus();
		}
	},
	xBuildCls: function(pCls, pSufx) {
		var vCls = pCls.split(" ");
		var vRetCls = "";
		for(var i=0; i<vCls.length; i++) vRetCls += vCls[i]+(pSufx ? ("_"+pSufx) : "")+" ";
		return(vRetCls);
	},
	sOnLoad: function() {
		if(scCoLib.isIE && this.readyState != "complete") return;
		for (var i=0; i<scDynUiMgr.subWindow.fOnLoadListeners.length; i++) try{scDynUiMgr.subWindow.fOnLoadListeners[i](this);}catch(e){}
	}
}


var dom = {

	/** Clone le contenu d'un noeud (dans le cas d'un template, la propriété content est utilisée) */
	cloneContents: function (pNode) {
		if (pNode.content) return pNode.content.cloneNode(true);
		else {
			var vRange = document.createRange();
			vRange.selectNodeContents(pNode);
			return vRange.cloneContents();
		}
	},

	/** Retourne le premier ancêtre correspondant a un sélecteur CSS */
	selectAncestor: function (pNode, pSelector) {
		if (pNode.closest){
			return pNode.closest(pSelector);
		} else {
			var vMatches = pNode.matches || pNode.webkitMatchesSelector || pNode.mozMatchesSelector || pNode.msMatchesSelector || pNode.oMatchesSelector,
				vParent = pNode.parentNode;
			while (vParent && vParent.nodeType != Node.DOCUMENT_NODE) {
				if (vMatches.call(vParent, pSelector)) return vParent;
				vParent = vParent.parentNode;
			}
		}
		return null;
	},

	createAndDispatchEvent: function (pElement, pType, pDetail) {
		var vEvent = document.createEvent('CustomEvent');
		vEvent.initCustomEvent(pType, true, true, pDetail);
		return pElement.dispatchEvent(vEvent);
	}
};

dom.newBd = function (pNode) {
	return new dom.DomBuilder(pNode);
}

dom.DomBuilder = function (pNode) {
	if (pNode) this.setCurrent(pNode);
}
dom.DomBuilder.prototype = {
	setCurrent: function (pNode) {
		this.fDoc = pNode.nodeType == 9 ? pNode : pNode.ownerDocument;
		this.fNode = pNode;
		return this;
	},
	elt: function (pName, pClass, pNxtSib) {
		var vNode = this.fDoc.createElement(pName);
		if (pClass) vNode.setAttribute("class", pClass);
		if (this.fOutRoot === this.fNode) this.fOut.push(vNode);
		else if (pNxtSib) this.fNode.insertBefore(vNode, pNxtSib);
		else this.fNode.appendChild(vNode);
		this.fNode = vNode;
		return this;
	},
	/** Si pValue==null l'attribut n'est pas ajouté. */
	att: function (pName, pValue) {
		if (pValue != null) this.fNode.setAttribute(pName, pValue);
		return this;
	},
	prop: function (pProp, pValue) {
		this.fNode[pProp] = pValue;
		return this;
	},
	style: function (pProp, pValue) {
		if (typeof pProp == "string") this.fNode.style[pProp] = pValue;
		else for (var i in pProp) this.fNode.style[i] = pProp[i];
		return this;
	},
	call: function (pMethodName, pArgs) {
		if (Array.isArray(pArgs)) this.fNode[pMethodName].apply(this.fNode, pArgs);
		else this.fNode[pMethodName].call(this.fNode, pArgs);
		return this;
	},
	listen: function (pEventName, pListener, pUseCapture) {
		this.fNode.addEventListener(pEventName, pListener, pUseCapture || false);
		return this;
	},
	text: function (pText) {
		if (pText != null) this.fNode.appendChild(this.fDoc.createTextNode(pText));
		return this;
	},
	up: function () {
		if (this.fNode === this.fOutRoot) this.inTree();
		this.fNode = this.fNode.parentNode;
		if (this.fNode == null) this.fNode = this.fOutRoot;
		return this;
	},
	outTree: function () {
		if (this.fOut) return this;
		this.fOut = [];
		this.fOutRoot = this.fNode;
		return this;
	},
	inTree: function () {
		if (this.fOut) {
			for (var i = 0; i < this.fOut.length; i++) this.fOutRoot.appendChild(this.fOut[i]);
			delete this.fOut;
			delete this.fOutRoot;
		}
		return this;
	},
	clear: function () {
		this.fNode.innerHTML = "";
		return this;
	},
	current: function () {
		return this.fNode;
	},
	currentUp: function () {
		var vCurr = this.fNode;
		this.up();
		return vCurr;
	}
}


var io = {
	/** Retourne un objet xmlHttpRequest */
	createHttpRequest: function () {
		if (window.XMLHttpRequest && ( !window.location.protocol == "file:" || !window.ActiveXObject)) {
			return new XMLHttpRequest();
		} else {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	},

	/**
	 * Retourne une XmlHttpRequest asynchrone qui peut être complétée (headers + listeners) avant d'appeler la méthode send().
	 */
	openHttpRequest: function (pUrl, pMethod) {
		var vReq = io.createHttpRequest();
		vReq.open(pMethod || "GET", pUrl, true);
		return vReq;
	},

	/** Retourne un objet contenant les key/value des paramètres d'une QueryString de la forme "?aa=bb&cc=dd"  */
	parseQueryString: function (pQueryString) {
		var vMap = {};
		pQueryString.replace(/[?&]+([^=&]+)=?([^&]*)/gi, function (pMatch, pKey, pValue) {
			var vKey = decodeURIComponent(pKey);
			var vValue = pValue ? decodeURIComponent(pValue) : true;
			vMap[vKey] ? vMap[vKey] instanceof Array ? vMap[vKey].push(vValue) : vMap[vKey] = [vMap[vKey], vValue] : vMap[vKey] = vValue;
		});
		return vMap;
	},

	/** Ajoute des params à une url. Attention, pValue est échappé, mais pas pKey.*/
	appendParamsToUrl: function (pUrl /*[, pKey, pValue]...*/) {
		var vUrl = [pUrl];
		var vSep = pUrl.indexOf('?') >= 0 ? '&' : '?';
		for (var i = 1; i < arguments.length;) {
			vUrl.push(vSep);
			vSep = '&';
			vUrl.push(arguments[i++]);
			var vVal = arguments[i++];
			if (vVal != null) {
				vUrl.push('=');
				vUrl.push(encodeURIComponent(vVal));
			}
		}
		return vUrl.join("");
	},

	/** Retourne un objet contenant les key/value des cookies d'un document. */
	parseCookies: function (pDocument) {
		var vMap = {};
		var vC = pDocument.cookie;
		if (!vC) return vMap;
		var vEntries = vC.split(";");
		for (var i = 0; i < vEntries.length; i++) {
			var vEntry = vEntries[i];
			var vIdx = vEntry.indexOf("=");
			vMap[vEntry.substring(0, vIdx).trim()] = decodeURIComponent(vEntry.substring(vIdx + 1));
		}
		return vMap;
	},

	/**
	 * Retourne une callback pour une requete XHR retournant un json avec un code retour normal 200.
	 * @param pCb function(pJson, pError)
	 */
	jsonXhrCb: function (pCb, pCbThis) {
		return function (pEvt) {
			try {
				if (pEvt.target.status == 200) {
					pCb.call(pCbThis, JSON.parse(pEvt.target.responseText));
				} else {
					pCb.call(pCbThis, null, pEvt.target.status);
				}
			} catch (e) {
				pCb.call(pCbThis, null, e);
			}
		}
	}
}
