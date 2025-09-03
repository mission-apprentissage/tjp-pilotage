

var scTooltipMgr = {

	cIsRtl : document.documentElement.getAttribute("dir") === "rtl",
	cTtAbove : false, // tooltip above mousepointer?
	cTtDelay : 500, // time span until tooltip shows up [milliseconds]
	cTtLeft : false, // tooltip on the left of the mouse?
	cTtOffsetX : 12, // horizontal offset of left-top corner from mousepointer
	cTtOffsetY : 15, // vertical offset
	cTtStatic : false, // tooltip NOT move with the mouse?
	cTtSticky : false, // do NOT hide tooltip on mouseout?
	cTtFocus : false, // do NOT focus tooltip on show?
	cTtTemp : 0, // time span after which the tooltip disappears, 0 (zero) means "infinite timespan"
	cTtMaxWidth : 400, // Max width of tooltips
	cTtMaxHeight : 250, // Max height of tooltips (a scrollbar is added)
	cTtFixType : "win", // type of fixed positionning (win,node,id)
	cTtHPos : document.documentElement.getAttribute("dir") === "rtl" ? "rightAlign" : "leftAlign",
	cTtVPos : "topAlign",


	fCurrTt : null, // current tooltip
	fCurrTtId : null, // current tooltip ID
	fCurrTtW : 0, fCurrTtH : 0, // width and height of fCurrTt
	fCurrTtX : 0, fCurrTtY : 0,
	fOffX : 0, fOffY : 0,
	fXlim : 0, fYlim : 0, // right and bottom borders of visible client area
	fSup : false, // true if Opt.ABOVE
	fSticky : false, // fCurrTt sticky?
	fFocus : false, // fCurrTt focus?
	fAct : false, // tooltip visibility flag
	fSub : false, // true while tooltip below mousepointer
	fMmovEvt : null, // stores previous mousemove evthandler
	fWsizEvt : null, // stores previous window.onresize evthandler
	fMupEvt : null, // stores previous mouseup evthandler
	fDb : null, // Document body
	fFix : false,
	fFixId : null,
	fFixType : "win",
	fTtHPos : null,
	fTtVPos : null,
	fTtParent : null,
	fMakeListeners : new Array(),
	fShowListeners : new Array(),
	fHideListeners : new Array(),
	fHideBasket : true,
	fRegCls : "scTtRegistered",


	fNavie:null, fNavie8:null,


	xInitMgr: function() {
		if (this.fDb == null) {
			this.fDb = (document.compatMode && document.compatMode != "BackCompat")? document.documentElement : document.body? document.body : null;
			var vNuav = navigator.appVersion;
			this.fNavie = scCoLib.isIE && document.all && this.fDb;
			this.fNavie8 = this.fNavie && parseFloat(vNuav.substring(vNuav.indexOf("MSIE")+5)) < 9;
		}
	},
	xBuildCls: function(pCls, pSufx) {
		var vCls = pCls.split(" ");
		var vRetCls = "";
		for(var i=0; i<vCls.length; i++) vRetCls += vCls[i]+(pSufx ? ('_'+pSufx) : '')+' ';
		return(vRetCls);
	},
	xMakeTt: function(pNode, pCo, pTi, pCls, pClsRoot) {
		var vCo = typeof pCo == "string" ? pCo : "";
		var vTi = typeof pTi == "string" ? pTi : "";
		pCls = pCls + (pNode.fOpt.CLASS ? " "+pNode.fOpt.CLASS : "");
		pNode.ttId = this.xGenId("scTooltip"); //generate a new tooltip ID
		pNode.setAttribute("aria-describedby", pNode.ttId);
		pNode.fTtShownCls = this.xBuildCls(pCls,"act").split(' ');
		if (typeof pNode.fOpt.PARENT == "string") pNode.fOpt.PARENT = scPaLib.findNode(pNode.fOpt.PARENT, pNode);
		var vHtml = '<div id="'+pNode.ttId+'" role="dialog"'+(pTi? ' aria-labelledby="'+pNode.ttId+'ti"' : '')+(pNode.fOpt.FOCUS? ' tabindex="-1"' : '')+' class="'+this.xBuildCls(pCls,"fra")+(pClsRoot!=''?' '+pClsRoot:'')+'"'+(pNode.fOpt.FIXTYPE!='free' ? ' style="position:absolute;z-index:1010;left:0px;top:0px;visibility:hidden;text-align:initial;"' : '')+'>';
		vHtml += '<div style="position:absolute;" class="'+this.xBuildCls(pCls,"")+'">';
		if(pTi) vHtml += '<div id="'+pNode.ttId+'ti" class="'+this.xBuildCls(pCls,"ti")+'"><span>'+vTi+'</span></div>';
		vHtml += '<div id="'+pNode.ttId+'Scrol" class="'+this.xBuildCls(pCls,"srl")+'"><div id="'+pNode.ttId+'co" class="'+this.xBuildCls(pCls,"co")+'">'+vCo+'</div></div>';
		if (pNode.fOpt.CLSBTN) vHtml += '<a href="#" onclick="return scTooltipMgr.hideTooltip(true);" class="'+this.xBuildCls(pCls,"x")+'" title="'+pNode.fOpt.CLSBTNTI+'"><span>'+pNode.fOpt.CLSBTNCAP+'</span></a>';
		if (pNode.fOpt.FOCUS) vHtml += '<a href="#" onclick="return false;" onfocus="scTooltipMgr.fCurrTt.focus();" style="position:absolute;" aria-hidden="true"></a>';
		vHtml += '</div></div>'
		var vTmpDiv=(pNode.fOpt.PARENT.ownerDocument?pNode.fOpt.PARENT.ownerDocument:pNode.fOpt.PARENT).createElement("DIV"); // Temp div to hold the created tooltip HTML
		vTmpDiv.innerHTML = vHtml;
		var vTtDiv = vTmpDiv.firstChild;
		while(vTtDiv && vTtDiv.nodeType != 1) vTtDiv = vTtDiv.nextSibling;
		pNode.fOpt.PARENT.appendChild(vTtDiv); //Append the created tooltip to the required parent
		if (typeof pCo == "object") {
			var vTtCo = sc$(pNode.ttId+"co");
			var vCoElt = pCo.firstChild;
			while(vCoElt){
				vTtCo.appendChild(vCoElt.cloneNode(true));
				vCoElt = vCoElt.nextSibling;
			}
		}
		if (typeof pTi == "object") {
			var vTtTi = sc$(pNode.ttId+"ti");
			var vTiElt = pTi.firstChild;
			while(vTiElt){
				vTtTi.appendChild(vTiElt.cloneNode(true));
				vTiElt = vTiElt.nextSibling;
			}
		}
		vTtDiv.fNode = pNode; //Keep pointer to owner node on the tooltip
		var vTt = vTtDiv.firstChild;
		while(vTt && vTt.nodeType != 1) vTt = vTt.nextSibling;
		vTtDiv.style.top = -2*this.xGetEltH(vTt) + "px";
		vTtDiv.style.left = -2*this.xGetEltW(vTt) + "px";


		if (pNode.fOpt.FORCESTICKY) pNode.ttFSticky = true;
		pNode.fOpt.STICKY = pNode.fOpt.STICKY || (pNode.ttFSticky || false);
		if(!pNode.fOpt.STICKY) pNode.onmouseout = this.hideTooltip;

		for(var i=0; i<this.fMakeListeners.length; i++) try{this.fMakeListeners[i](pNode);}catch(e){};
		return(pNode.ttId);
	},
	xShow: function(pEvt, pId, pOpt) {
		if(this.fCurrTt) this.hideTooltip(true);
		this.fMmovEvt = document.onmousemove || null;
		this.fWsizEvt = window.onresize || null;
		if(window.dd && (window.DRAG && this.fMmovEvt == DRAG || window.RESIZE && this.fMmovEvt == RESIZE)) return;
		this.fCurrTt = sc$(pId);
		this.fCurrTtId = pId;
		if(this.fCurrTt) {
			this.xSetTtSize(pId, this.fCurrTt.fNode.fOpt);
			pEvt = pEvt || window.event;
			if(this.fCurrTt.fNode.alt) {
				this.fCurrTt.fNode.ttAlt = this.fCurrTt.fNode.alt;
				this.fCurrTt.fNode.alt = "";
			}
			if(this.fCurrTt.fNode.title) {
				this.fCurrTt.fNode.ttTitle  = this.fCurrTt.fNode.title;
				this.fCurrTt.fNode.removeAttribute("title");
			}
			for(var i=0; i<this.fCurrTt.fNode.fTtShownCls.length; i++) this.xAddClass(this.fCurrTt.fNode, this.fCurrTt.fNode.fTtShownCls[i])
			this.fSub = !(this.fSup = pOpt.ABOVE);
			this.fSticky = pOpt.STICKY;
			this.fFocus = pOpt.FOCUS;
			this.fCurrTtW = this.xGetEltW(this.fCurrTt);
			this.fCurrTtH = this.xGetEltH(this.fCurrTt);
			this.fOffX = pOpt.LEFT ? -(this.fCurrTtW+pOpt.OFFSETX) : pOpt.OFFSETX;
			this.fOffY = pOpt.OFFSETY;
			this.fFix = pOpt.FIX;
			this.fFixId = pOpt.FIXID;
			this.fFixType = pOpt.FIXTYPE;
			this.fFixForce = pOpt.FIXFORCE;
			this.fTtHPos = pOpt.HPOS;
			this.fTtVPos = pOpt.VPOS;
			this.fTtParent = pOpt.PARENT;
			this.fXlim = scCoLib.toInt((this.fDb && this.fDb.clientWidth)? this.fDb.clientWidth : window.innerWidth)+scCoLib.toInt(window.pageXOffset || (this.fDb? this.fDb.scrollLeft : 0) || 0)-this.fCurrTtW;
			this.fYlim = scCoLib.toInt(window.innerHeight || this.fDb.clientHeight)+scCoLib.toInt(window.pageYOffset || (this.fDb? this.fDb.scrollTop : 0) || 0)-this.fCurrTtH-this.fOffY;
			this.xSetDivZ();
			if(pOpt.FIXTYPE != 'free'){
				if(pOpt.FIX) this.xSetDivPosFix(pOpt.FIXTYPE, pOpt.FIX[0], pOpt.FIX[1], pOpt.FIXID, pOpt.HPOS, pOpt.VPOS, pOpt.FIXFORCE);
				else this.xSetDivPos(this.xEvX(pEvt) - (this.cIsRtl ? this.fCurrTtW : 0), this.xEvY(pEvt));
			}
			var vTimeOutTxt = 'scTooltipMgr.showDiv(\'true\');';
			if(pOpt.STICKY) vTimeOutTxt += '{scTooltipMgr.releaseMov();scTooltipMgr.releaseSize();scTooltipMgr.fMupEvt = document.onmouseup || null;document.onmouseup = scTooltipMgr.hideTooltip;}';
			else if(pOpt.STATIC) vTimeOutTxt += 'scTooltipMgr.releaseMov();scTooltipMgr.releaseSize();';
			if(pOpt.FOCUS) vTimeOutTxt += 'scTooltipMgr.fCurrTt.focus();';
			if(pOpt.TEMP > 0) vTimeOutTxt += 'window.tt_rtm = window.setTimeout(\'scTooltipMgr.fSticky = false; scTooltipMgr.hideTooltip();\','+pOpt.TEMP+');';
			window.tt_rdl = window.setTimeout(vTimeOutTxt, pOpt.DELAY);
			if(!pOpt.FIX && (!pOpt.STICKY || (pOpt.STICKY && this.fCurrTt.fNode.onmouseover))) {
				document.onmousemove = this.moveTooltip;
			} else if (pOpt.FIX && pOpt.FIXID) {
				window.onresize = this.reposTooltip;
			}
		}
	},
	xEvX: function(pEvt){
		var vX = scCoLib.toInt(pEvt.pageX || pEvt.clientX || 0)+scCoLib.toInt(this.fNavie8? this.fDb.scrollLeft : 0)+this.fOffX;
		if(vX > this.fXlim) vX = this.fXlim;
		var vScr = scCoLib.toInt(window.pageXOffset || (this.fDb? this.fDb.scrollLeft : 0) || 0);
		if(vX < vScr) vX = vScr;
		return vX;
	},
	xEvY: function(pEvt) {
		var vY = scCoLib.toInt(pEvt.pageY || pEvt.clientY || 0)+scCoLib.toInt(this.fNavie8? this.fDb.scrollTop : 0);
		if(this.fSup) vY -= (this.fCurrTtH + this.fOffY - 15);
		else if(vY > this.fYlim || !this.fSub && vY > this.fYlim-24) {
			vY -= (this.fCurrTtH + 5);
			this.fSub = false;
		} else {
			vY += this.fOffY;
			this.fSub = true;
		}
		return (vY<0? 0 : vY);
	},
	xGetEltW: function(pElt) {
		return(scCoLib.toInt(pElt.offsetWidth)+(this.fNavie? (scCoLib.toInt(pElt.currentStyle.borderRightWidth)+scCoLib.toInt(pElt.currentStyle.borderLeftWidth)):0));
	},
	xGetEltH: function(pElt) {
		return(scCoLib.toInt(pElt.offsetHeight)+(this.fNavie? (scCoLib.toInt(pElt.currentStyle.borderTopWidth)+scCoLib.toInt(pElt.currentStyle.borderBottomWidth)):0));
	},
	xGetEltL: function(pElt) {
		if (!pElt) return 0;
		var vX = scCoLib.toInt(pElt.offsetLeft);
		if (pElt.offsetParent && pElt.offsetParent.tagName.toLowerCase() != 'body' && pElt.offsetParent.tagName.toLowerCase() != 'html') {
			vX -= pElt.offsetParent.scrollLeft;
			vX += this.xGetEltL(pElt.offsetParent);
		}
		return vX;
	},
	xGetEltT: function(pElt) {
		if (!pElt) return 0;
		var vY = scCoLib.toInt(pElt.offsetTop);
		if (pElt.offsetParent && pElt.offsetParent.tagName.toLowerCase() != 'body' && pElt.offsetParent.tagName.toLowerCase() != 'html') {
			vY -= pElt.offsetParent.scrollTop;
			vY += this.xGetEltT(pElt.offsetParent);
		}
		return vY;
	},
	xSetEltW: function(pElt, pW) {
		pElt.style.width = pW+'px';
	},
	xSetEltH: function(pElt, pH) {
		pElt.style.height = pH+'px';
	},
	xSetEltT: function(pElt, pT) {
		pElt.style.top = pT+'px';
	},
	xSetEltL: function(pElt, pL) {
		pElt.style.left = pL+'px';
	},

	xSetDivZ: function() {
		var vTtsh = this.fCurrTt.style || this.fCurrTt;
		if(vTtsh) {
			if(window.dd && dd.z) vTtsh.zIndex = Math.max(dd.z+1, vTtsh.zIndex);
		}
	},
	xSetDivPosFix: function(pType, pX, pY, pRelId, pHPos, pVPos, pForce) {
		var vX;
		var vY;
		if (pType == 'free') return;
		else if (pType == "win"){
			switch(pHPos){
				case "center":
					vX = this.fXlim / 2 + pX;
					break
				case "rightAlign":
					vX = this.fXlim + pX;
					break
				default :
					vX = pX;
			}
			switch(pVPos){
				case "center":
					vY = this.fYlim / 2 + pY;
					break
				case "bottomAlign":
					vY = this.fYlim + pY;
					break
				default :
					vY = pY;
			}
		} else {
			var vRelBase = null;
			switch(pType){
				case "id":
					vRelBase = sc$(pRelId);
					break;
				case "dom":
					vRelBase = pRelId;
					break;
				default :
					vRelBase = this.fCurrTt.fNode;
			}
			switch(pHPos){
				case "center":
					vX = this.xGetEltL(vRelBase) + (this.xGetEltW(vRelBase) - this.fCurrTtW)/2 + pX;
					break
				case "rightAlign":
					vX = this.xGetEltL(vRelBase) + this.xGetEltW(vRelBase) - this.fCurrTtW + pX;
					break
				case "leftOfElement":
					vX = this.xGetEltL(vRelBase) - this.fCurrTtW + pX;
					if (!pForce && !this.xIsInWinH(vX)) vX = this.xGetEltL(vRelBase) + this.xGetEltW(vRelBase) - pX;
					break
				case "rightOfElement":
					vX = this.xGetEltL(vRelBase) + this.xGetEltW(vRelBase) + pX;
					if (!pForce && !this.xIsInWinH(vX)) vX = this.xGetEltL(vRelBase) - this.fCurrTtW - pX;
					break
				default :
					vX = this.xGetEltL(vRelBase) + pX;
			}
			switch(pVPos){
				case "center":
					vY = this.xGetEltT(vRelBase) + (this.xGetEltH(vRelBase) - this.fCurrTtH)/2 + pY;
					break
				case "bottomAlign":
					vY = this.xGetEltT(vRelBase) + this.xGetEltH(vRelBase) - this.fCurrTtH + pY;
					break
				case "aboveElement":
					vY = this.xGetEltT(vRelBase) - this.fCurrTtH + pY;
					if (!pForce && !this.xIsInWinV(vY)) vY = this.xGetEltT(vRelBase) + this.xGetEltH(vRelBase) - pY;
					break
				case "belowElement":
					vY = this.xGetEltT(vRelBase) + this.xGetEltH(vRelBase) + pY;
					if (!pForce && !this.xIsInWinV(vY)) vY = this.xGetEltT(vRelBase) - this.fCurrTtH - pY;
					break
				default :
					vY = this.xGetEltT(vRelBase) + pY;
			}
		}
		if (!pForce){
			if(vX > this.fXlim) vX = this.fXlim;
			var vScrX = scCoLib.toInt(window.pageXOffset || (this.fDb? this.fDb.scrollLeft : 0) || 0);
			if(vX < vScrX) vX = vScrX;
			if(vY > this.fYlim) vY = this.fYlim;
			var vScrY = scCoLib.toInt(window.pageYOffset || (this.fDb? this.fDb.scrollTop : 0) || 0);
			if(vY < vScrY) vY = vScrY;
		}
		this.xSetDivPos(vX, vY);
	},
	xIsInWinH: function(pX) {
		if(pX > this.fXlim) return(false);
		var vScr = scCoLib.toInt(window.pageXOffset || (this.fDb? this.fDb.scrollLeft : 0) || 0);
		if(pX < vScr) return(false);
		return(true);
	},
	xIsInWinV: function(pY) {
		if(pY > this.fYlim) return(false);
		var vScr = scCoLib.toInt(window.pageYOffset || (this.fDb? this.fDb.scrollTop : 0) || 0);
		if(pY < vScr) return(false);
		return(true);
	},
	xSetDivPos: function(pX, pY) {
		if (this.fCurrTt.fNode.fOpt.FIXTYPE == 'free') return;
		var vTtsh = this.fCurrTt.style || this.fCurrTt;
		this.fCurrTtX = pX -this.xGetEltL(this.fCurrTt.offsetParent);
		this.fCurrTtY = pY -this.xGetEltT(this.fCurrTt.offsetParent);
		vTtsh.left = this.fCurrTtX+'px';
		vTtsh.top = this.fCurrTtY+'px';
	},
	xSetEltSizePos: function(pElt, pT, pL, pW, pH) {
		this.xSetEltL(pElt, pL);
		this.xSetEltT(pElt, pT);
		this.xSetEltW(pElt, pW);
		this.xSetEltH(pElt, pH);
	},
	xSetTtSize: function(pId, pOpt) {
		if (pOpt.FIXTYPE == 'free') return;
		var vCont = sc$(pId);
		if (vCont) {
			var vMaxX = scCoLib.toInt((this.fDb && this.fDb.clientWidth)? this.fDb.clientWidth : window.innerWidth)+scCoLib.toInt(window.pageXOffset || (this.fDb? this.fDb.scrollLeft : 0) || 0);
			var vTt = vCont.firstChild;
			while(vTt && vTt.nodeType != 1) vTt = vTt.nextSibling;
			vTt.style.width = '';
			vCont.style.width = vMaxX ? vMaxX + 'px' : '';
			vCont.style.height = '';
			vCont.style.top = '';
			vCont.style.left = '';
			var vMaxW = pOpt.MAXWIDTH;
			var vMaxH = pOpt.MAXHEIGHT;
			var vTtScrol = sc$(pId+'Scrol');
			var vTtW = this.xGetEltW(vTt);
			if (vTtW > vMaxW) { //Fix max width if needed
				this.xSetEltW(vTt, vMaxW);
				vTtW = this.xGetEltW(vTt);
			}
			var vTtH = this.xGetEltH(vTt);
			if (vTtH > vMaxH) { //Fix max height & add scroll if needed
				vTtH = vMaxH;
				var vTtScrolH = vTtH;
				var vTtTi = sc$(pId+'ti');
				if (vTtTi) vTtScrolH -= this.xGetEltH(vTtTi);
				if (typeof vTtScrol.style.overflowY != "undefined") vTtScrol.style.overflowY = 'auto';
				else vTtScrol.style.overflow = 'auto';
				this.xSetEltH(vTtScrol, vTtScrolH);
				vTtH = this.xGetEltH(vTt);
				pOpt.FORCESTICKY = true; //Set force sticky flag if scroll
			}
			var vContW = vTtW;
			var vContH = vTtH;
			this.xSetEltSizePos(vCont,-2*vContH,-2*vContW,vContW,vContH);
		}
	},
	xEltInContId: function(pElt, pId) {
		var vElt = pElt;
		var vFound = false;
		if (vElt) {
			vFound = vElt.id == pId;
			while (vElt.parentNode && !vFound) {
				vElt = vElt.parentNode
				vFound = vElt.id == pId;
			}
		}
		return(vFound);
	},
	xEltInContTtId: function(pElt, pTtId) {
		var vElt = pElt;
		var vFound = false;
		if (vElt) {
			vFound = vElt.ttId == pTtId;
			while (vElt.parentNode && !vFound) {
				vElt = vElt.parentNode
				vFound = vElt.ttId == pTtId;
			}
		}
		return(vFound);
	},
	xGetTargetElt: function(pEvt) {
		var vEvt = pEvt || window.event;
		var vTargetElt = null
		if(vEvt && vEvt.target) vTargetElt = vEvt.target;
		if(!vTargetElt && vEvt && vEvt.srcElement) vTargetElt = vEvt.srcElement;
		return(vTargetElt);
	},
	xGenId: function(pPrefix) {
		var vIndex = 0;
		while((sc$(pPrefix+vIndex) || sc$(pPrefix+vIndex+'co') || sc$(pPrefix+vIndex+'ti') || sc$(pPrefix+vIndex+'SdwB') || sc$(pPrefix+vIndex+'Scrol')) && vIndex < 10000) vIndex++;
		if (vIndex == 10000) {
			alert("Tooltip creation Error");
			return("");
		} else return (pPrefix + vIndex);
	},
	xInitOpts: function(pOpt) {
		var vOpt = (typeof pOpt != "undefined")? pOpt : {}; //Retreave  display Opts if any...
		vOpt.CLASS = (typeof vOpt.CLASS != "undefined")? vOpt.CLASS : "",
			vOpt.ABOVE = (typeof vOpt.ABOVE != "undefined")? vOpt.ABOVE : this.cTtAbove,
			vOpt.DELAY = (typeof vOpt.DELAY != "undefined")? vOpt.DELAY : this.cTtDelay,
			vOpt.FIX = (typeof vOpt.FIX != "undefined")? vOpt.FIX : "",
			vOpt.FIXID = (typeof vOpt.FIXID != "undefined")? vOpt.FIXID : "",
			vOpt.FIXTYPE = (typeof vOpt.FIXTYPE != "undefined")? vOpt.FIXTYPE : ((vOpt.FIXID == "")? this.cTtFixType : "id"),
			vOpt.FIXFORCE = (typeof vOpt.FIXFORCE != "undefined")? vOpt.FIXFORCE : false,
			vOpt.LEFT = (typeof vOpt.LEFT != "undefined")? vOpt.LEFT : this.cTtLeft,
			vOpt.MAXWIDTH = (typeof vOpt.MAXWIDTH != "undefined")? vOpt.MAXWIDTH : this.cTtMaxWidth;
		vOpt.MAXHEIGHT = (typeof vOpt.MAXHEIGHT != "undefined")? vOpt.MAXHEIGHT : this.cTtMaxHeight;
		vOpt.VPOS = (typeof vOpt.VPOS != "undefined")? vOpt.VPOS : this.cTtVPos,
			vOpt.HPOS = (typeof vOpt.HPOS != "undefined")? vOpt.HPOS : this.cTtHPos,
			vOpt.OFFSETX = (typeof vOpt.OFFSETX != "undefined")? vOpt.OFFSETX : this.cTtOffsetX,
			vOpt.OFFSETY = (typeof vOpt.OFFSETY != "undefined")? vOpt.OFFSETY : this.cTtOffsetY,
			vOpt.STATIC = (typeof vOpt.STATIC != "undefined")? vOpt.STATIC : this.cTtStatic,
			vOpt.STICKY = (typeof vOpt.STICKY != "undefined")? vOpt.STICKY : this.cTtSticky,
			vOpt.FOCUS = (typeof vOpt.FOCUS != "undefined")? vOpt.FOCUS : this.cTtFocus,
			vOpt.TEMP = (typeof vOpt.TEMP != "undefined")? vOpt.TEMP : this.cTtTemp;
		vOpt.CLSBTN = (typeof vOpt.CLSBTN != "undefined")? vOpt.CLSBTN : false;
		vOpt.PARENT = (typeof vOpt.PARENT != "undefined")? vOpt.PARENT : document.body;
		if (vOpt.CLSBTN) {
			vOpt.CLSBTNCAP = (typeof vOpt.CLSBTNCAP != "undefined")? vOpt.CLSBTNCAP : "&#160;";
			vOpt.CLSBTNTI = (typeof vOpt.CLSBTNTI != "undefined")? vOpt.CLSBTNTI : "";
		}
		return vOpt;
	},
	xAddClass : function(pNode, pClass) {
		if (pClass != '') {
			if (pNode.classList) {
				for (var i = 1, n = arguments.length; i < n; i++) {
					if (!pNode.classList.contains(arguments[i])) pNode.classList.add(arguments[i]);
				}
			}
			else {
				var vNewClassStr = pNode.className;
				for (var i = 1, n = arguments.length; i < n; i++) vNewClassStr += ' '+arguments[i];
				pNode.className = vNewClassStr;
			}
		}
	},
	xDelClass : function(pNode, pClass) {
		if (pClass != '') {
			if (pNode.classList) {
				for (var i = 1, n = arguments.length; i < n; i++) {
					if (pNode.classList.contains(arguments[i])) pNode.classList.remove(arguments[i]);
				}
			} else {
				var vCurrentClasses = pNode.className.split(' ');
				var vNewClasses = new Array();
				for (var i = 0, n = vCurrentClasses.length; i < n; i++) {
					var vClassFound = false;
					for (var j = 1, m = arguments.length; j < m; j++) {
						if (vCurrentClasses[i] == arguments[j]) vClassFound = true;
					}
					if (!vClassFound) vNewClasses.push(vCurrentClasses[i]);
				}
				pNode.className = vNewClasses.join(' ');
			}
		}
	},
	xHasAttr : function(pTag, pAttrName) {
		return pTag.hasAttribute ? pTag.hasAttribute(pAttrName) : typeof pTag[pAttrName] !== "undefined";
	},



	moveTooltip: function(pEvt) {
		if(!scTooltipMgr.fCurrTt) return;
		var vEvt = pEvt || window.event;
		scTooltipMgr.xSetDivPos(scTooltipMgr.xEvX(vEvt), scTooltipMgr.xEvY(vEvt));
		if(scTooltipMgr.fCurrTt.fNode.onmouseover &&  !scTooltipMgr.xEltInContTtId(scTooltipMgr.xGetTargetElt(vEvt), scTooltipMgr.fCurrTtId)) scTooltipMgr.hideTooltip();
	},
	releaseMov: function() {
		if(document.onmousemove == this.moveTooltip) {
			document.onmousemove = this.fMmovEvt;
		}
	},
	releaseSize: function() {
		if(window.onresize == this.reposTooltip) {
			window.onresize = this.fWsizEvt;
		}
	},
	showDiv: function(pFlag) {
		this.fCurrTt.style.visibility = pFlag? 'visible' : 'hidden';
		this.fAct = pFlag;
	},
	hideTooltip: function(pPara) {
		var vForce = (typeof pPara == "boolean")? pPara : false;
		if(scTooltipMgr.fCurrTt) {
			if(window.tt_rdl) window.clearTimeout(tt_rdl);
			if(!scTooltipMgr.fSticky || !scTooltipMgr.fAct || (scTooltipMgr.fSticky && !scTooltipMgr.xEltInContId(scTooltipMgr.xGetTargetElt(pPara),scTooltipMgr.fCurrTtId)) || vForce) {
				if(window.tt_rtm) window.clearTimeout(tt_rtm);
				scTooltipMgr.showDiv(false);
				scTooltipMgr.xSetDivPos(-2*scTooltipMgr.fCurrTtW, -2*scTooltipMgr.fCurrTtH);
				if (scTooltipMgr.fCurrTt.fNode.ttTitle) scTooltipMgr.fCurrTt.fNode.setAttribute("title", scTooltipMgr.fCurrTt.fNode.ttTitle);
				if (scTooltipMgr.fCurrTt.fNode.ttAlt) scTooltipMgr.fCurrTt.fNode.alt = scTooltipMgr.fCurrTt.fNode.ttAlt;
				for(var i=0; i<scTooltipMgr.fCurrTt.fNode.fTtShownCls.length; i++) scTooltipMgr.xDelClass(scTooltipMgr.fCurrTt.fNode, scTooltipMgr.fCurrTt.fNode.fTtShownCls[i]);
				for(var i=0; i<scTooltipMgr.fHideListeners.length; i++) try{scTooltipMgr.fHideListeners[i](scTooltipMgr.fCurrTt.fNode);}catch(e){};
				scTooltipMgr.fCurrTt.fNode.focus();
				scTooltipMgr.fCurrTt = null;
				if(typeof scTooltipMgr.fMupEvt != "undefined") document.onmouseup = scTooltipMgr.fMupEvt;
			}
			scTooltipMgr.releaseMov();
			scTooltipMgr.releaseSize();
		}
		return false;
	},
	reposTooltip: function() {
		scTooltipMgr.xSetDivPosFix(scTooltipMgr.fFixType, scTooltipMgr.fFix[0], scTooltipMgr.fFix[1], scTooltipMgr.fFixId, scTooltipMgr.fTtHPos, scTooltipMgr.fTtVPos, scTooltipMgr.fFixForce);
	},



	registerTooltips: function(pRoot) {
		try{
			this.fDb = null;
			var vRoot = pRoot || document;
			var vAncs = vRoot.querySelectorAll("*[data-sctooltip]");
			for (var i=0; i < vAncs.length; i++){
				var vAnc = vAncs[i];
				var vOpts = JSON.parse(vAnc.getAttribute("data-sctooltip"));
				this.registerTooltip(vAnc.id, vOpts.ttId, vOpts.trigger, vOpts.class, vOpts.classRoot, vOpts.options);
			}
		} catch(e){
			scCoLib.log("scTooltipMgr.registerTooltips - error : "+e);
		}
	},
	registerTooltip: function(pIdAnc, pIdTt, pTrig, pCls, pClsRoot, pOpt) {
		try{
			this.xInitMgr(); // Initialize tooltipMgr if needed
			var vAncNode = sc$(pIdAnc);
			var vTtSrc = sc$(pIdTt);
			vTtSrc.ttIds = [];
			vAncNode.fOpt = scTooltipMgr.xInitOpts(pOpt);
			var vTi = vTtSrc.firstChild;
			while(vTi && vTi.nodeType != 1) vTi = vTi.nextSibling;
			var vCo = vTi.nextSibling;
			while(vCo && vCo.nodeType != 1) vCo = vCo.nextSibling;
			vTtSrc.ttIds.push(this.xMakeTt(vAncNode, vCo, vTi, pCls, pClsRoot)); //build the tooltip HTML
			vAncNode[pTrig] = function (pEvt) {return scTooltipMgr.showTooltip(this,pEvt);}
			if (pTrig != "onclick" && vAncNode.href && vAncNode.href.split("#")[0] == window.location.href) vAncNode.onclick = vAncNode[pTrig] // Force onclick for accessibility


			if (!pOpt.NOREF){
				var vRef = vAncNode.nextSibling;
				while(vRef && vRef.nodeType != 1) vRef = vRef.nextSibling;
				if(vRef && this.fHideBasket) vRef.style.display = "none";
				else if(vRef && this.fRegCls) vRef.className = vRef.className + " " + this.fRegCls;
			}

			if (this.fHideBasket) vTtSrc.style.display = "none";
			else if(this.fRegCls) vTtSrc.className = vTtSrc.className + " " + this.fRegCls;

			if (this.fHideBasket || this.fRegCls){
				var vBskt = vTtSrc.parentNode;
				var vBsktElts = vBskt.childNodes;
				if (this.xHasAttr(vBskt, "data-titled-basket")) vBskt = vBskt.parentNode;
				var vEmpty = true;
				for(var i = 0; i < vBsktElts.length; i++) if (vBsktElts[i].nodeType==1 && !vBsktElts[i].ttIds) {vEmpty = false; break;}
				if (vEmpty){
					if (this.fHideBasket) vBskt.style.display = "none";
					else vBskt.className = vBskt.className + " " + this.fRegCls;
				}
			}
		} catch(e){
			scCoLib.log("scTooltipMgr.registerTooltip - error : "+e);
		}
	},
	addMakeListener: function(pFunc) {this.fMakeListeners.push(pFunc)},
	addShowListener: function(pFunc) {this.fShowListeners.push(pFunc)},
	addHideListener: function(pFunc) {this.fHideListeners.push(pFunc)},
	showTooltip: function(pNode, pEvt, pCo, pTi, pCls, pClsRoot, pOpt) {
		if(document.scDragMgrDragGroup) return; // no tooltips while draging
		this.xInitMgr(); // Initialize tooltipMgr  if needed
		var vTtId = pNode.ttId || null; //Retreave the tooltip ID if it has already been created
		if (this.fCurrTt != null && this.fCurrTt == sc$(vTtId)) return; // If the tooltip is already shown, exit (safari bug & moz call of multiple onmouseover)


		if (vTtId == null) {
			pNode.fOpt = this.xInitOpts(pOpt);
			vTtId = this.xMakeTt(pNode, pCo, pTi, pCls, pClsRoot); //build the tooltip HTML
			if (!pNode.onclick && pNode.href && pNode.href.split("#")[0] == window.location.href) pNode.onclick = function() {return false;};
		}
		pNode.fOpt.STICKY = pNode.fOpt.STICKY || (pNode.ttFSticky || false);


		this.xShow(pEvt, vTtId, pNode.fOpt);


		for(var i=0; i<this.fShowListeners.length; i++) try{this.fShowListeners[i](pNode);}catch(e){};
		return false;
	}
};