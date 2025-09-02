/**
 * LICENCE[[
 * Version: MPL 2.0/GPL 3.0/LGPL 3.0/CeCILL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is kelis.fr code.
 *
 * The Initial Developer of the Original Code is
 * samuel.monsarrat@kelis.fr
 *
 * Portions created by the Initial Developer are Copyright (C) 2009-2020
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): nicolas.boyer@kelis.fr
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 3.0 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 3.0 or later (the "LGPL"),
 * or the CeCILL Licence Version 2.1 (http://www.cecill.info),
 * in which case the provisions of the GPL, the LGPL or the CeCILL are applicable
 * instead of those above. If you wish to allow use of your version of this file
 * only under the terms of either the GPL, the LGPL or the CeCILL, and not to allow
 * others to use your version of this file under the terms of the MPL, indicate
 * your decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL, the LGPL or the CeCILL. If you do not
 * delete the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL, the LGPL or the CeCILL.
 * ]]LICENCE
 */

/* === SCENARI Dynamic image manager ======================================== */
var scImageMgr = {
	fPathAnim : [],
	fPathGal : [],
	fPathSeq : [],
	fPathSlider : [],
	fPathZoom : [],
	fPathImg : [],
	fPathSvg : [],
	fAnims : null,
	fGals : null,
	fZooms : null,
	fPathPgeFra : "des:div",
	fPathFocusables : "des:a|input|button",
	fCurrItem : null,
	fOverAlpha : .6,
	fDefaultStep : 3 * 1000,
	fMinStep : 1 * 100,
	fMaxStep : 10 * 1000,
	fDeltaGalleryLeft : 125,
	fDeltaGalleryTop : 50,
	fTypAnm : "scImgAnm",
	fTypZm : "scImgZm",
	fTypGal : "scImgGal",
	fTypSeq : "scImgSeq",
	fTypSlider : "scImgSlider",
	fFocus : true,
	fSourceRoot : null,
	fDisplayRoot : null,
	fLocalize : true,
	fMarginStart : "marginLeft",
	fMarginEnd : "marginRight",
	fNavie8 : parseFloat(scCoLib.userAgent.substring(scCoLib.userAgent.indexOf("msie")+5)) < 9,
	fMaxDeviceWidth : Math.min(window.screen.width, window.screen.height),
	fListeners : {"onOverlayOpen":[],"onOverlayClose":[],"onAnimationOpen":[],"onAnimationClose":[],"onZoomOpen":[],"onZoomClose":[]}
}

/** SCENARI Dynamic image manager strings */
scImageMgr.fStrings = ["précédent","image précédente (flèche de gauche)",
/*02*/               "suivant","image suivante (flèche de droite)",
/*04*/               "fermer","fermer le diaporama (Echap)",
/*06*/               "lancer","lancer le diaporama (p)",
/*08*/               "arrêter","arrêter le diaporama (p)",
/*10*/               "Cette page est en cours de chargement. Veuillez patienter.","",
/*12*/               "précédent","image précédente",
/*14*/               "suivant","image suivante",
/*16*/               "lancer","lancer l\'animation",
/*18*/               "arrêter","arrêter l\'animation",
/*20*/               "début","aller au début de l\'animation",
/*22*/               "fin","aller à la fin de l\'animation",
/*24*/               "vitesse","changer la vitesse de l\'animation",
/*26*/               "image","Consulter le diaporama à partir de :",
/*28*/               "boucle","jouer en boucle continue",
/*30*/               "fermer","fermer le zoom (Echap)",
/*32*/               "zoomer sur cette image",""];
/** scImageMgr.init. */
scImageMgr.init = function() {
	// Init image animations...
	try{
		if (!("scDynUiMgr" in window)) throw "Library scDynUiMgr not found.";
		if(this.xReadStyle(document.body.parentNode, "direction") == "rtl") {
			this.fMarginStart = "marginRight";
			this.fMarginEnd = "marginLeft";
		}
		for(var i=0; i<this.fPathAnim.length; i++) {
			var vAnims = scPaLib.findNodes(this.fPathAnim[i].fPath);
			for(var j=0; j<vAnims.length; j++) {
				var vAnim = vAnims[j];
				try {
					var vImgs = scPaLib.findNodes("chi:",vAnim);
					for(var k=0; k<vImgs.length; k++) {
						if (k>0) {
							vImgs[k].style.visibility = "hidden";
							vImgs[k].style.position = "absolute";
							vImgs[k].style.left = "-2000px";
							vImgs[k].style.top = "-2000px";
						}
					}
				} catch(e){
					scCoLib.log("scImageMgr.init::Anim init Error"+e);
				}
			}
		}
		// Mend svgs ...
		this.xInitSvgs(this.fSourceRoot);
		//Register listeners...
		scDynUiMgr.collBlk.addOpenListener(this.sCollBlkOpen);
		scDynUiMgr.collBlk.addCloseListener(this.sCollBlkClose);
		scOnLoads[scOnLoads.length] = this;
	} catch(e){scCoLib.log("ERROR - scImageMgr.init : "+e)}
}
/** scImageMgr.registerAnimation.
 * @param pPathAnim scPaLib path vers les animations.
 * @param pOpts options de l'animation.
 *           toolbar : 0 = pas de toolbar / 1 = toolbar flotant / 2 toolbar permanent
 *           auto : true = démarrage auto
 *           loop : true = lecture en boucle
 *           lpBtn : true = bouton ctrl lecture en boucle
 *           speed : vitesse de défilement en ms
 *           spdBtns : true = boutons de contrôle de la vitesse
 *           counter : true = compteur d'image
 *           soft : true = fondu entre images
 *           extBtns : true = boutons supplémentaires
 *           clsPre : préfix de classe CSS
 */
scImageMgr.registerAnimation = function(pPathAnim, pOpts) {
	var vAnim = new Object;
	vAnim.fPath = pPathAnim;
	vAnim.fOpts = (typeof pOpts == "undefined" ? {toolbar:1,auto:true,loop:true,lpBtn:false,speed:this.fDefaultStep,spdBtns:false,counter:false,soft:true,extBtns:false,clsPre:this.fTypAnm} : pOpts);
	vAnim.fOpts.toolbar = (typeof vAnim.fOpts.toolbar == "undefined" ? 1 : vAnim.fOpts.toolbar);
	vAnim.fOpts.auto = (typeof vAnim.fOpts.auto == "undefined" ? true : vAnim.fOpts.auto);
	vAnim.fOpts.loop = (typeof vAnim.fOpts.loop == "undefined" ? true : vAnim.fOpts.loop);
	vAnim.fOpts.lpBtn = (typeof vAnim.fOpts.lpBtn == "undefined" ? false : vAnim.fOpts.lpBtn);
	vAnim.fOpts.speed = (typeof vAnim.fOpts.speed == "undefined" ? this.fDefaultStep : vAnim.fOpts.speed);
	vAnim.fOpts.spdBtns = (typeof vAnim.fOpts.spdBtns == "undefined" ? false : vAnim.fOpts.spdBtns);
	vAnim.fOpts.counter = (typeof vAnim.fOpts.counter == "undefined" ? false : vAnim.fOpts.counter);
	vAnim.fOpts.soft = (typeof vAnim.fOpts.soft == "undefined" ? true : vAnim.fOpts.soft);
	vAnim.fOpts.extBtns = (typeof vAnim.fOpts.extBtns == "undefined" ? false : vAnim.fOpts.extBtns);
	vAnim.fOpts.clsPre = (typeof vAnim.fOpts.clsPre == "undefined" ? this.fTypAnm : vAnim.fOpts.clsPre);
	this.fPathAnim[this.fPathAnim.length] = vAnim;
}
/** scImageMgr.registerGallery.
 * @param pPathGal scPaLib path vers les zooms.
 * @param pOpts options de la gallerie.
 *           clsPre : préfix de classe CSS
 *           maxWidth : largeur max des images
 *           maxHeight : hauteur max des images
 */
scImageMgr.registerGallery = function(pPathGal, pOpts) {
	var vGal = new Object;
	vGal.fPath = pPathGal;
	vGal.fOpts = (typeof pOpts == "undefined" ? {clsPre:this.fTypGal,maxWidth:700,maxHeight:500} : pOpts);
	vGal.fOpts.clsPre = (typeof vGal.fOpts.clsPre == "undefined" ? this.fTypGal : vGal.fOpts.clsPre);
	vGal.fOpts.maxWidth = (typeof vGal.fOpts.maxWidth == "undefined" ? 700 : vGal.fOpts.maxWidth);
	vGal.fOpts.maxHeight = (typeof vGal.fOpts.maxHeight == "undefined" ? 500 : vGal.fOpts.maxHeight);
	this.fPathGal[this.fPathGal.length] = vGal;
}
/** scImageMgr.registerSequence.
 * @param fPathSeq scPaLib path vers les zooms.
 * @param pOpts options de la gallerie.
 *           clsPre : préfix de classe CSS
 */
scImageMgr.registerSequence = function(pPathSeq, pOpts) {
	var vSeq = new Object;
	vSeq.fPath = pPathSeq;
	vSeq.fOpts = (typeof pOpts == "undefined" ? {clsPre:this.fTypSeq} : pOpts);
	vSeq.fOpts.clsPre = (typeof vSeq.fOpts.clsPre == "undefined" ? this.fTypSeq : vSeq.fOpts.clsPre);
	this.fPathSeq[this.fPathSeq.length] = vSeq;
}
/** scImageMgr.registerZoom.
 * @param pPathZoom scPaLib path vers les zooms.
 * @param pOpts options du zoom.
 *           toolbar : 0 = pas de toolbar / 1 = toolbar
 *           type : img = zoom d'image / svg = zoom de svg / iframe = zoom chargé dans une iframe
 *           mag : 0 = pas de loupe /  1 = ajouter une loupe si besoin
 *           magScale : relative size of the zoom area compared to the visible image
 *           magMax : 0 = pas de mode max /  1 = mode max sur click
 *           magPan : 0 = pas de pan en mode max /  1 = pan en mode max
 *           svgMax : 0 = svg affiché à sa taille standard / 1 = toujours maximiser les svg pour ateindre la taille du viewport
 *           titlePath : scPaLib path to a title relative to the anchor.
 *           clsPre : préfix de classe CSS
 */
scImageMgr.registerZoom = function(pPathZoom, pOpts) {
	var vZm = new Object;
	vZm.fPath = pPathZoom;
	vZm.fOpts = (typeof pOpts == "undefined" ? {toolbar:0,type:"img",clsPre:this.fTypZm} : pOpts);
	vZm.fOpts.type = (typeof vZm.fOpts.type == "undefined" ? "img" : vZm.fOpts.type);
	vZm.fOpts.toolbar = (typeof vZm.fOpts.toolbar == "undefined" ? 1 : vZm.fOpts.toolbar);
	vZm.fOpts.mag = (typeof vZm.fOpts.mag == "undefined" ? 0 : vZm.fOpts.mag);
	vZm.fOpts.magScale = (typeof vZm.fOpts.magScale == "undefined" ? 0.33 : vZm.fOpts.magScale);
	vZm.fOpts.magMax = (typeof vZm.fOpts.magMax == "undefined" ? 1 : vZm.fOpts.magMax);
	vZm.fOpts.magPan = (typeof vZm.fOpts.magPan == "undefined" ? 1 : vZm.fOpts.magPan);
	vZm.fOpts.svgMax = (typeof vZm.fOpts.svgMax == "undefined" ? 0 : vZm.fOpts.svgMax);
	vZm.fOpts.clsPre = (typeof vZm.fOpts.clsPre == "undefined" ? this.fTypZm : vZm.fOpts.clsPre);
	vZm.fOpts.titlePath = (typeof vZm.fOpts.titlePath == "undefined" ? null : vZm.fOpts.titlePath);
	if ((vZm.fOpts.mag > 0 || vZm.fOpts.titlePath) && vZm.fOpts.toolbar == 0) vZm.fOpts.toolbar = 1;
	this.fPathZoom[this.fPathZoom.length] = vZm;
}
/** scImageMgr.registerSlider.
 * @param pPathSlider scPaLib path vers les zooms.
 * @param pOpts options de la gallerie.
 *           clsPre : préfix de classe CSS
 *           speed : vitesse de défilement en ms
 */
scImageMgr.registerSlider = function(pPathSlider, pOpts) {
	var vSlider = new Object;
	vSlider.fPath = pPathSlider;
	vSlider.fOpts = (typeof pOpts == "undefined" ? {clsPre:this.fTypSlider,speed:this.fDefaultStep} : pOpts);
	vSlider.fOpts.clsPre = (typeof vSlider.fOpts.clsPre == "undefined" ? this.fTypSlider : vSlider.fOpts.clsPre);
	vSlider.fOpts.speed = (typeof vSlider.fOpts.speed == "undefined" ? this.fDefaultStep : vSlider.fOpts.speed);
	this.fPathSlider[this.fPathSlider.length] = vSlider;
}
/** scImageMgr.registerAdaptedImage.
 * @param pPathImage scPaLib path vers les images.
 */
scImageMgr.registerAdaptedImage = function(pPathImage) {
	var vImg = new Object;
	vImg.fPath = pPathImage;
	this.fPathImg[this.fPathImg.length] = vImg;
}

/** scImageMgr.registerSvg.
 * @param pPathSvg scPaLib path vers les svgs.
 */
scImageMgr.registerSvg = function(pPathSvg) {
	var vSvg = new Object;
	vSvg.fPath = pPathSvg;
	this.fPathSvg[this.fPathSvg.length] = vSvg;
}

/** register a listener. */
scImageMgr.registerListener = function(pType, pFunc) {
	this.fListeners[pType].push(pFunc);
}
/** scImageMgr.setSourceRoot. */
scImageMgr.setSourceRoot = function(pRoot) {
	this.fSourceRoot = pRoot;
}
/** scImageMgr.setDisplayRoot. */
scImageMgr.setDisplayRoot = function(pRoot) {
	this.fDisplayRoot = pRoot;
}
/** scImageMgr.setPathPgeFra. */
scImageMgr.setPathPgeFra = function(pPathPgeFra) {
	this.fPathPgeFra = pPathPgeFra;
}
/** scImageMgr.setFocus. */
scImageMgr.setFocus = function(pFocus) {
	this.fFocus = pFocus;
}
/** scImageMgr.setLocalize. */
scImageMgr.setLocalize = function(pLocalize) {
	this.fLocalize = pLocalize;
}

/** scImageMgr.onLoad - called by the scenari framework, inits the manager. */
scImageMgr.onLoad = function() {
	this.fPgeFra = scPaLib.findNode(scImageMgr.fPathPgeFra, this.fDisplayRoot);
	if (!this.fSourceRoot) this.fSourceRoot = document.body;
	if (!this.fDisplayRoot) this.fDisplayRoot = document.body;
	if (this.xMobileCheck()) document.body.classList.add("isMobile_true");

	// Load adapted images ...
	this.xInitImgs(this.fSourceRoot);
	// Load image galleries...
	this.xInitSss(this.fSourceRoot);
	// Load image zooms...
	this.xInitZms(this.fSourceRoot);
	// Load image animations...
	this.xInitAnims(this.fSourceRoot);
	// Load image Sliders...
	this.xInitSliders(this.fSourceRoot);
	// Load image Sequences...
	this.xInitSqs(this.fSourceRoot);
}

/** scImageMgr.loading. */
scImageMgr.loading = function() {
	alert(scImageMgr.xGetStr(10));
}
/** scImageMgr.sCollBlkOpen - scDynUiMgr collapsable block callback function */
scImageMgr.sCollBlkOpen = function(pCo) {
	// Reinit image animations...
	if (!pCo.fAnimInitDone){
		scImageMgr.xInitAnims(pCo);
		pCo.fAnimInitDone = true;
	}
}
/** scImageMgr.sCollBlkClose - scDynUiMgr collapsable block callback function */
scImageMgr.sCollBlkClose = function(pCo) {
}

/* === Global managers ====================================================== */
/** scImageMgr.xBtnMgr - centralized button manager */
scImageMgr.xBtnMgr = function(pBtn) {
	var vObj = pBtn.fObj;
	switch(pBtn.fName){
		case this.fTypZm+"Zm":
		case this.fTypSeq+"Zm":
			scImageMgr.xOpenZm(pBtn);break;
		case this.fTypZm+"BtnCls":
		case this.fTypZm+"BtnImgCls":
			scImageMgr.xClsZm(vObj);break;

		case this.fTypGal+"Pv":
			scImageMgr.xOpenSs(vObj,pBtn);break;
		case this.fTypGal+"BtnPrv":
			if (scImageMgr.fCurrItem.fSsAutoPly) scImageMgr.xPseSs(vObj);
			scImageMgr.xPrvSs(vObj);break;
		case this.fTypGal+"BtnNxt":
			if (scImageMgr.fCurrItem.fSsAutoPly) scImageMgr.xPseSs(vObj);
			scImageMgr.xNxtSs(vObj);break;
		case this.fTypGal+"BtnCls":
			scImageMgr.xClsSs(vObj);break;
		case this.fTypGal+"BtnPly":
			scImageMgr.xPlySs(vObj);break;
		case this.fTypGal+"BtnPse":
			scImageMgr.xPseSs(vObj);break;

		case this.fTypAnm+"BtnPrv":
			scImageMgr.xAnimCtrlOn(vObj);
			if (vObj.fAutoPly) scImageMgr.xPseAnm(vObj);
			scImageMgr.xPrvAnm(vObj);break;
		case this.fTypAnm+"BtnNxt":
			scImageMgr.xAnimCtrlOn(vObj);
			if (vObj.fAutoPly) scImageMgr.xPseAnm(vObj);
			scImageMgr.xNxtAnm(vObj);break;
		case this.fTypAnm+"BtnSrt":
			scImageMgr.xAnimCtrlOn(vObj);
			if (vObj.fAutoPly) scImageMgr.xPseAnm(vObj);
			scImageMgr.xSrtAnm(vObj);break;
		case this.fTypAnm+"BtnEnd":
			scImageMgr.xAnimCtrlOn(vObj);
			if (vObj.fAutoPly) scImageMgr.xPseAnm(vObj);
			scImageMgr.xEndAnm(vObj);break;
		case this.fTypAnm+"BtnPly":
		case this.fTypAnm+"BtnInitPly":
			scImageMgr.xAnimCtrlOn(vObj);
			scImageMgr.xPlyAnm(vObj);break;
		case this.fTypAnm+"BtnPse":
			scImageMgr.xAnimCtrlOn(vObj);
			scImageMgr.xPseAnm(vObj);break;
		case this.fTypAnm+"BtnSpdDwn":
			scImageMgr.xAnimCtrlOn(vObj);
			scImageMgr.xSetAnmSpd(vObj,+200);break;
		case this.fTypAnm+"BtnSpdUp":
			scImageMgr.xAnimCtrlOn(vObj);
			scImageMgr.xSetAnmSpd(vObj,-200);break;
		case this.fTypAnm+"BtnLp":
			scImageMgr.xAnimCtrlOn(vObj);
			scImageMgr.xSetAnmLp(vObj,pBtn.checked);return true;
		case this.fTypSlider+"BtnPause":
			scImageMgr.xPauseSlider(vObj);break;
		case this.fTypSlider+"BtnPlay":
			scImageMgr.xPlaySlider(vObj);break;
		case this.fTypSlider+"BtnPrv":
			scImageMgr.xSliderPrv(vObj);break;
		case this.fTypSlider+"BtnNxt":
			scImageMgr.xSliderNxt(vObj);break;
		case this.fTypSeq+"BtnPause":
			scImageMgr.xPauseSeq(vObj);break;
		case this.fTypSeq+"BtnPlay":
			scImageMgr.xPlaySeq(vObj);break;
		case this.fTypSeq+"BtnPrv":
			scImageMgr.xSeqPrv(vObj);break;
		case this.fTypSeq+"BtnNxt":
			scImageMgr.xSeqNxt(vObj);break;
	}
	return false;
}
/** scImageMgr.xKeyMgr - centralized keyboard manager */
scImageMgr.xKeyMgr = function(pEvent){
	var vEvent = pEvent || window.event;
	var vCharCode = vEvent.which || vEvent.keyCode;
	if (!scImageMgr.fCurrItem) return;
	switch(vCharCode){
		case 34://pg_dwn
		case 39://left
			if (scImageMgr.fCurrItem.fName == "gal") {
				if (scImageMgr.fCurrItem.fSsAutoPly) scImageMgr.xPseSs(scImageMgr.fCurrItem);
				scImageMgr.xNxtSs(scImageMgr.fCurrItem);
			}
			return false;
		case 8://bksp
		case 33://pg_up
		case 37://right
			if (scImageMgr.fCurrItem.fName == "gal") {
				if (scImageMgr.fCurrItem.fSsAutoPly) scImageMgr.xPseSs(scImageMgr.fCurrItem);
				scImageMgr.xPrvSs(scImageMgr.fCurrItem);
			}
			return false;
		case 27://escape
			if (scImageMgr.fCurrItem.fName == "gal") {
				scImageMgr.xClsSs(scImageMgr.fCurrItem);
			} else {
				scImageMgr.xClsZm(scImageMgr.fCurrItem);
			}
			return false;
		case 80:// p
			if (scImageMgr.fCurrItem.fName == "gal") {
				if(scImageMgr.fCurrItem.fSsAutoPly) scImageMgr.xPseSs(scImageMgr.fCurrItem);
				else scImageMgr.xPlySs(scImageMgr.fCurrItem);
			}
			return false;
	}
}
/* === Image size manager =================================================== */
scImageMgr.xInitImgs = function(pCo) {
	for(var i=0; i<this.fPathImg.length; i++) {
		var vImgs = scPaLib.findNodes(this.fPathImg[i].fPath, pCo);
		for(var j=0; j<vImgs.length; j++) this.xInitImg(vImgs[j]);
	}
}
scImageMgr.xInitImg = function(pImg) {
	pImg.fWidth = pImg.width;
	pImg.style.maxWidth = "100%";
	pImg.style.height = "auto";
	pImg.fIsAdapted = true;

/*	if (pImg.width>this.fMaxDeviceWidth){
		pImg.fIsAdapted = true;
	}*/
}
/* === SVG manager ========================================================== */
scImageMgr.xInitSvgs = function(pCo) {
	for(var i=0; i<this.fPathSvg.length; i++) {
		var vSvgs = scPaLib.findNodes(this.fPathSvg[i].fPath, pCo);
		for(var j=0; j<vSvgs.length; j++) this.xInitSvg(vSvgs[j]);
	}
}
scImageMgr.xInitSvg = function(pSvg) {
	if (!pSvg.getAttribute("viewBox")) pSvg.setAttribute("viewBox", "0 0 " + pSvg.width.baseVal.value + " " + pSvg.height.baseVal.value);
}
/* === Animation manager ==================================================== */
scImageMgr.xInitAnims = function(pCo) {
	for(var i=0; i<this.fPathAnim.length; i++) {
		var vAnims = scPaLib.findNodes(this.fPathAnim[i].fPath, pCo);
		for(var j=0; j<vAnims.length; j++) this.xInitAnim(vAnims[j],this.fPathAnim[i].fOpts,this.fTypAnm+i+j);
	}
}
scImageMgr.xInitAnim = function(pAnim,pOpts,pId) {
	try {
		if (this.xIsVisible(pAnim)){
			pAnim.fImgs = scPaLib.findNodes("chi:",pAnim);
			pAnim.fOpts = pOpts;
			var vMaxHeight = 0;
			var vMaxWidth = 0;
			for(var i=0; i<pAnim.fImgs.length; i++) {
				var vImg = pAnim.fImgs[i];
				vImg.style.position = "absolute";
				vImg.fHeight = vImg.clientHeight;
				vImg.fWidth = scPaLib.findNode("des:img",vImg).width;
				vMaxHeight = Math.max(vMaxHeight,vImg.fHeight);
				vMaxWidth = Math.max(vMaxWidth,vImg.fWidth);
				vImg.style.visibility = "hidden";
				vImg.style.top = "0";
				vImg.style.left = "0";
				vImg.style.width = "100%";
			}
			pAnim.style.height = vMaxHeight+0.01*vMaxHeight + "px";
			pAnim.style.width = vMaxWidth+0.01*vMaxWidth + "px";
			for(var i=0; i<pAnim.fImgs.length; i++) {
				var vImg = pAnim.fImgs[i];
				vImg.style.marginTop = (vMaxHeight - vImg.fHeight)/2 + "px";
			}
			if (!pOpts.auto && pOpts.toolbar<2) {
				pAnim.fBtnInitPly = scImageMgr.xAddBtn(pAnim,pAnim,this.fTypAnm,"BtnInitPly",scImageMgr.xGetStr(16),scImageMgr.xGetStr(17));
			}
			if (pOpts.toolbar > 0){
				if(pOpts.toolbar == 1) pAnim.fCtrl = scDynUiMgr.addElement("div",pAnim,pOpts.clsPre + "Ctrl");
				else pAnim.fCtrl = scDynUiMgr.addElement("div",pAnim.parentNode,pOpts.clsPre + "Ctrl",pAnim.nextSibling);
				if (pOpts.extBtns) {
					pAnim.fBtnSrt = scImageMgr.xAddBtn(pAnim.fCtrl,pAnim,this.fTypAnm,"BtnSrt",scImageMgr.xGetStr(20),scImageMgr.xGetStr(21));
					scImageMgr.xAddSep(pAnim.fCtrl);
				}
				pAnim.fBtnPrv = scImageMgr.xAddBtn(pAnim.fCtrl,pAnim,this.fTypAnm,"BtnPrv",scImageMgr.xGetStr(12),scImageMgr.xGetStr(13));
				scImageMgr.xAddSep(pAnim.fCtrl);
				pAnim.fBtnPly = scImageMgr.xAddBtn(pAnim.fCtrl,pAnim,this.fTypAnm,"BtnPly",scImageMgr.xGetStr(16),scImageMgr.xGetStr(17));
				pAnim.fBtnPly.style.display = (pOpts.auto ? "none" : "");
				pAnim.fBtnPse = scImageMgr.xAddBtn(pAnim.fCtrl,pAnim,this.fTypAnm,"BtnPse",scImageMgr.xGetStr(18),scImageMgr.xGetStr(19));
				pAnim.fBtnPse.style.display = (pOpts.auto ? "" : "none");
				scImageMgr.xAddSep(pAnim.fCtrl);
				pAnim.fBtnNxt = scImageMgr.xAddBtn(pAnim.fCtrl,pAnim,this.fTypAnm,"BtnNxt",scImageMgr.xGetStr(14),scImageMgr.xGetStr(15));
				if (pOpts.extBtns) {
					scImageMgr.xAddSep(pAnim.fCtrl);
					pAnim.fBtnEnd = scImageMgr.xAddBtn(pAnim.fCtrl,pAnim,this.fTypAnm,"BtnEnd",scImageMgr.xGetStr(22),scImageMgr.xGetStr(23));
				}
				if (pOpts.spdBtns) {
					scImageMgr.xAddSep(pAnim.fCtrl);
					pAnim.fBtnSpdDwn = scImageMgr.xAddBtn(pAnim.fCtrl,pAnim,this.fTypAnm,"BtnSpdDwn","-",scImageMgr.xGetStr(25));
					scDynUiMgr.addElement("span",pAnim.fCtrl,pOpts.clsPre + "Spd").innerHTML = " "+scImageMgr.xGetStr(24)+" ";
					pAnim.fBtnSpdUp = scImageMgr.xAddBtn(pAnim.fCtrl,pAnim,this.fTypAnm,"BtnSpdUp","+",scImageMgr.xGetStr(25));
				}
				if (pOpts.lpBtn) {
					scImageMgr.xAddSep(pAnim.fCtrl);
					pAnim.fBtnLp = scDynUiMgr.addElement("input",pAnim.fCtrl,pOpts.clsPre + "BtnLp");
					pAnim.fBtnLp.setAttribute("type","checkbox");
					pAnim.fBtnLp.fName = this.fTypAnm + "BtnLp";
					pAnim.fBtnLp.setAttribute("id",pId);
					pAnim.fBtnLp.setAttribute("title",scImageMgr.xGetStr(29));
					if (pOpts.loop){
						var vAttChk = document.createAttribute("checked"); // For IE the attr checked must be created
						vAttChk.nodeValue = "true";
						pAnim.fBtnLp.setAttributeNode(vAttChk);
					}
					pAnim.fBtnLp.fObj = pAnim;
					pAnim.fBtnLp.onclick = function(){return scImageMgr.xBtnMgr(this);}
					var vLblLp = scDynUiMgr.addElement("label",pAnim.fCtrl,pOpts.clsPre + "LpLbl");
					vLblLp.innerHTML = scImageMgr.xGetStr(28);
					vLblLp.setAttribute("for",pId);
					vLblLp.setAttribute("title",scImageMgr.xGetStr(29));
				}
				if (pOpts.counter) {
					scImageMgr.xAddSep(pAnim.fCtrl);
					scDynUiMgr.addElement("span",pAnim.fCtrl,pOpts.clsPre + "CtrLbl").innerHTML = scImageMgr.xGetStr(26) + " ";
					pAnim.fCtrIdx = scDynUiMgr.addElement("span",pAnim.fCtrl,pOpts.clsPre + "CtrIdx");
					pAnim.fCtrIdx.innerHTML = "1";
					scDynUiMgr.addElement("span",pAnim.fCtrl,pOpts.clsPre + "CtrSep").innerHTML = "/";
					scDynUiMgr.addElement("span",pAnim.fCtrl,pOpts.clsPre + "CtrCnt").innerHTML = pAnim.fImgs.length;
				}
				if (pOpts.toolbar == 1) {
					pAnim.onmouseover = function () {scImageMgr.xAnimCtrlOn(pAnim);}
					pAnim.fCtrl.style.visibility = "hidden";
					pAnim.fCtrl.fOn = false;
				}
			}
			pAnim.fImgs[0].style.visibility = "";
			pAnim.fCurrImgIdx = 0;
			pAnim.fStep = pOpts.speed;
			pAnim.fAutoPly = pOpts.auto;
			pAnim.fSoft = pOpts.soft;
			pAnim.fLoop = pOpts.loop;
			if (pAnim.fAutoPly && pAnim.fImgs.length > 1) pAnim.fNxtImgProc = window.setTimeout(function(){scImageMgr.xAutoAnim(pAnim)}, pAnim.fStep);
			//Reinit zooms under pAnim
			this.xInitZms(pAnim);
		}
	} catch(e){
		scCoLib.log("scImageMgr.xInitAnim::Error : "+e);
	}
}
scImageMgr.xAutoAnim = function(pAnim) {
	if (pAnim && pAnim.fAutoPly){
		if (!pAnim.fLoop && pAnim.fCurrImgIdx == pAnim.fImgs.length - 1) {
			scImageMgr.xPseAnm(pAnim);
		} else {
			scImageMgr.xNxtAnm(pAnim);
			pAnim.fNxtImgProc = window.setTimeout(function(){scImageMgr.xAutoAnim(pAnim)}, pAnim.fStep);
		}
	}
}
scImageMgr.xAnimCtrlOn = function(pAnim) {
	if (!pAnim.fCtrl || typeof pAnim.fCtrl.fOn == "undefined") return;
	if (pAnim.fOffProc) window.clearTimeout(pAnim.fOffProc);
	if (!pAnim.fCtrl.fOn){
		new scImageMgr.FadeEltTask(pAnim.fCtrl, 1);
		pAnim.fCtrl.fOn = true;
	}
	pAnim.fOffProc = window.setTimeout(function(){scImageMgr.xAnimCtrlOff(pAnim)}, 3000);
}
scImageMgr.xAnimCtrlOff = function(pAnim) {
	if (pAnim.fCtrl.fOn){
		new scImageMgr.FadeEltTask(pAnim.fCtrl, 0);
		pAnim.fCtrl.fOn = false;
		pAnim.fOffProc = null;
	}
}
scImageMgr.xSrtAnm = function(pAnim) {
	new scImageMgr.switchAnimTask(pAnim, 0);
}
scImageMgr.xEndAnm = function(pAnim) {
	new scImageMgr.switchAnimTask(pAnim, pAnim.fImgs.length - 1);
}
scImageMgr.xPrvAnm = function(pAnim) {
	new scImageMgr.switchAnimTask(pAnim, pAnim.fCurrImgIdx == 0 ? pAnim.fImgs.length - 1 : pAnim.fCurrImgIdx - 1);
}
scImageMgr.xNxtAnm = function(pAnim) {
	new scImageMgr.switchAnimTask(pAnim, pAnim.fCurrImgIdx < pAnim.fImgs.length - 1 ? pAnim.fCurrImgIdx + 1 : 0);
}
scImageMgr.xPlyAnm = function(pAnim) {
	pAnim.fAutoPly = true;
	pAnim.fBtnPly.style.display="none";
	pAnim.fBtnPse.style.display="";
	scImageMgr.xNxtAnm(pAnim);
	pAnim.fNxtImgProc = window.setTimeout(function(){scImageMgr.xAutoAnim(pAnim)}, pAnim.fStep);
}
scImageMgr.xPseAnm = function(pAnim) {
	pAnim.fAutoPly = false;
	pAnim.fBtnPly.style.display="";
	pAnim.fBtnPse.style.display="none";
	window.clearTimeout(pAnim.fNxtImgProc);
}
scImageMgr.xSetAnmSpd = function(pAnim,pDelta) {
	pAnim.fStep += pDelta;
	pAnim.fStep = Math.min(Math.max(pAnim.fStep,scImageMgr.fMinStep),scImageMgr.fMaxStep);
}
scImageMgr.xSetAnmLp = function(pAnim,pLp) {
	pAnim.fLoop = pLp;
}
scImageMgr.switchAnimTask = function(pAnim,pNewIdx){
	this.fIdx = -1;
	this.fRateOld = [.9, .8, .7, .6, .5, .4, .3, .2, .1];
	this.fRateNew = [.1, .2, .3, .4, .5, .6, .7, .8, .9];
	try{
		if (pAnim.fBtnInitPly) pAnim.fBtnInitPly.style.display="none";
		this.fAnim = pAnim;
		if (this.fIsRunning) this.terminate();
		this.fNewIdx = pNewIdx;
		this.fOldImg = this.fAnim.fImgs[this.fAnim.fCurrImgIdx];
		this.fNewImg = this.fAnim.fImgs[this.fNewIdx];
		scImageMgr.xStartOpacityEffect(this.fOldImg, 1);
		scImageMgr.xStartOpacityEffect(this.fNewImg, 0);
		if (!this.fAnim.fSoft) {
			this.terminate();
			return;
		}
		this.fEndTime = ( Date.now  ? Date.now() : new Date().getTime() ) + 100;
		this.fIdx = -1;
		this.fIsRunning = true;
		scTiLib.addTaskNow(this);
	}catch(e){scCoLib.log("ERROR scImageMgr.switchAnimTask : "+e);}
}
scImageMgr.switchAnimTask.prototype.execTask = function(){
	while(this.fEndTime < (Date.now ? Date.now() : new Date().getTime()) && this.fIdx < this.fRateOld.length) {
		this.fIdx++;
		this.fEndTime += 100;
	}
	this.fIdx++;
	this.fEndTime += 100;
	if(this.fIdx >= this.fRateOld.length) {
		scImageMgr.xEndOpacityEffect(this.fOldImg, 0);
		scImageMgr.xEndOpacityEffect(this.fNewImg, 1);
		this.fAnim.fCurrImgIdx = this.fNewIdx;
		if (this.fAnim.fCtrIdx) this.fAnim.fCtrIdx.innerHTML = this.fNewIdx + 1;
		this.fIsRunning = false;
		return false;
	}
	scImageMgr.xSetOpacity(this.fOldImg, this.fRateOld[this.fIdx]);
	scImageMgr.xSetOpacity(this.fNewImg, this.fRateNew[this.fIdx]);
	return true;
}
scImageMgr.switchAnimTask.prototype.terminate = function(){
	this.fIdx = this.fRateOld.length;
	this.execTask();
}

/* === Zoom manager ========================================================= */
scImageMgr.xInitZms = function(pCo) {
	for(var i=0; i<this.fPathZoom.length; i++) {
		var vZooms = scPaLib.findNodes(this.fPathZoom[i].fPath, pCo);
		for(var j=0; j<vZooms.length; j++) {
			var vAnc = vZooms[j];
			try {
				vAnc.fImg = scPaLib.findNode("des:img", vAnc);
				vAnc.fZmUri = vAnc.href;
				vAnc.fOpts = this.fPathZoom[i].fOpts;
				vAnc.fName=this.fTypZm+"Zm";
				vAnc.fObj=vAnc;
				vAnc.setAttribute("role", "button");
				if (!vAnc.title) vAnc.title = this.xGetStr(32);
				vAnc.onclick=function(){
					if (this.fImg && this.fImg.fIsAdapted && this.fImg.fWidth > window.innerWidth) {
							this.target = "_blank";
						return true;
					} else {
							this.target = "_self";
						return scImageMgr.xBtnMgr(this);
					}
				}
				vAnc.onkeydown=function(pEvent){scDynUiMgr.handleBtnKeyDwn(pEvent);}
				vAnc.onkeyup=function(pEvent){scDynUiMgr.handleBtnKeyUp(pEvent);}
			} catch(e){
				scCoLib.log("scImageMgr.xInitZms::Error : "+e);
			}
		}
	}
}
scImageMgr.xInitZm = function(pAnc) {
	var vOpts = pAnc.fOpts;
	pAnc.fImg = scPaLib.findNode("des:img", pAnc);
	pAnc.fCvs = scDynUiMgr.addElement("div", this.fDisplayRoot,vOpts.clsPre+"Cvs", null, {display:"none"});
	pAnc.fCvs.fAnc = pAnc;
	pAnc.fCvs.setAttribute("role", "dialog");
	pAnc.fCvs.onclick=function(){return scImageMgr.xClsZm(this.fAnc);}
	pAnc.fOver = scDynUiMgr.addElement("div", pAnc.fCvs,vOpts.clsPre+"Over");
	pAnc.fOver.fAnc = pAnc;
	pAnc.fOver.onclick=function(){return scImageMgr.xClsZm(this.fAnc);}
	pAnc.fFra = scDynUiMgr.addElement("div", pAnc.fCvs,vOpts.clsPre+"Fra", null, {visibility:vOpts.type == "svg" ? "" : "hidden"});
	pAnc.fFra.onclick=function(pEvt){
		var vEvt = scImageMgr.xGetEvt(pEvt);
		vEvt.cancelBubble = true;
		if (vEvt.stopPropagation) vEvt.stopPropagation();
	}
	var vCo = pAnc.fCo = scDynUiMgr.addElement("div",pAnc.fFra,vOpts.clsPre+"Co");
	vCo.style.position = "relative";
	var vImgBtn = null;
	var vImg = null;
	if (vOpts.type == "iframe"){
		vImg = vCo.fImg = scDynUiMgr.addElement("iframe",vCo,null);
		vImg.fAnc = pAnc;
		vCo.fOvr = scDynUiMgr.addElement("div",vCo,null);
		vCo.fOvr.fAnc = pAnc;
		vCo.fOvr.onclick=function(){return scImageMgr.xClsZm(this.fAnc);}
		vCo.fOvr.style.cursor = "pointer";
	} else if (vOpts.type == "svg"){
		vImg = vCo.fImg = scPaLib.findNode("des:img|svg", pAnc).cloneNode(true);
		vCo.appendChild(vImg);
		vImg.fAnc = pAnc;
		var vWidth, vHeight;
		if (vImg.tagName.toLowerCase() == 'svg') {
			vWidth = vImg.width.baseVal.value;
			vHeight = vImg.height.baseVal.value;
			if (!vImg.getAttribute("viewBox")) vImg.setAttribute("viewBox", "0 0 " + vWidth + " " + vHeight);
		} else {
			vWidth = vImg.width;
			vHeight = vImg.height;
		}
		pAnc.fDefHeight = vHeight * (vOpts.svgMax==1 ? 1000 : 0);
		pAnc.fDefWidth = vWidth * (vOpts.svgMax==1 ? 1000 : 0);
		pAnc.fRatio = pAnc.fDefWidth/pAnc.fDefHeight;
		pAnc.fDeltaHeight = scImageMgr.xGetEltHeight(pAnc.fFra) - scImageMgr.xGetEltHeight(pAnc.fCo) + scCoLib.toInt(scImageMgr.xReadStyle(pAnc.fCvs,"paddingTop")) + scCoLib.toInt(scImageMgr.xReadStyle(pAnc.fCvs,"paddingBottom"));
		pAnc.fDeltaWidth = scImageMgr.xGetEltWidth(pAnc.fFra) - scImageMgr.xGetEltWidth(pAnc.fCo) + scCoLib.toInt(scImageMgr.xReadStyle(pAnc.fCvs,"paddingLeft")) + scCoLib.toInt(scImageMgr.xReadStyle(pAnc.fCvs,"paddingRight"));
	} else {
		var vAddMag = vOpts.mag > 0;
		if (!vAddMag){
			vImgBtn = scImageMgr.xAddBtn(vCo,pAnc,scImageMgr.fTypZm,"BtnImgCls","",this.xGetStr(31));
			vImgBtn.innerHTML = "";
			vImgBtn.style.display = "inline-block";
		}
		vImg = vCo.fImg = scDynUiMgr.addElement("img",(vAddMag ? vCo : vImgBtn),null);
		vImg.fAnc = pAnc;
//		vImg.style.cursor = "pointer";
		vImg.setAttribute("alt",pAnc.fImg && pAnc.fImg.alt ? pAnc.fImg.alt : "");
		vImg.onload = scImageMgr.sLoadZmImg;
		if (vAddMag){
			vImg.onmouseover = this.sZmMagShow;
			vImg.onmousemove = this.sZmImgMove;
			var vMag = vCo.fImg.fMag = scDynUiMgr.addElement("div", vCo, vOpts.clsPre+"Mag", null, {display:"none"});
			vMag.fClass = vOpts.clsPre+"Mag";
			vMag.fClassMax = vOpts.clsPre+"MagMax";
			vMag.style.position="absolute";
			vMag.fAnc = pAnc;
			vMag.style.backgroundColor = "white";
			vMag.style.backgroundImage = 'url("'+pAnc.fZmUri+'")';
			vMag.style.zIndex = "100";
			vMag.onmousemove = this.sZmMagMove;
			vMag.onmouseout = this.sZmMagHide;
			if (vOpts.magMax > 0) vMag.onclick = this.sZmMagClick;
		}
	}
	if (vOpts.toolbar == 1){
		pAnc.fTlb = scDynUiMgr.addElement("div",pAnc.fFra,vOpts.clsPre+"Tlb");
		pAnc.fClsBtn = scImageMgr.xAddBtn((this.xMobileCheck() ? pAnc.fFra : pAnc.fTlb),pAnc,scImageMgr.fTypZm,"BtnCls",this.xGetStr(30),this.xGetStr(31));
		if (vOpts.titlePath){
			var vTiSrc =scPaLib.findNode(vOpts.titlePath, pAnc);
			if (vTiSrc){
				var vTiElt = scDynUiMgr.addElement("div",pAnc.fTlb,vOpts.clsPre+"Ti");
				vTiElt.appendChild(vTiSrc.cloneNode(true));
			}
		}
	} else pAnc.fClsBtn = vImgBtn;
	var vResizer = {
		onResizedDes : function(pOwnerNode, pEvent) {},
		onResizedAnc : function(pOwnerNode, pEvent) {
			if(pEvent.phase==1) {
				if(scImageMgr.fCurrItem == pOwnerNode.fAnc) scImageMgr.xRedrawZm(pOwnerNode.fAnc);
			}
		}
	}
	scSiLib.addRule(vCo.fImg, vResizer);
}
scImageMgr.xOpenZm = function(pAnc) {
	if ("scDragMgr" in window) { // do not open the zoom if the image is in a scDragMgr label that has just been dropped.
		var vAncs = scPaLib.findNodes("anc:",pAnc);
		for(var i=0; i<vAncs.length; i++) if (vAncs[i].fGroup && vAncs[i].fGroup._isThresholdExceeded) return;
	}
	document.body.classList.add("imgLoading");
	if(!pAnc.fCo) scImageMgr.xInitZm(pAnc);
	if(this.xReadStyle(pAnc.fCvs,"position") == "absolute") window.scroll(0,0); // if position:absolute, we must scroll the SS into view.
	scImageMgr.fadeInTask.initTask(pAnc);
	scTiLib.addTaskNow(scImageMgr.fadeInTask);
	if(pAnc.fCo && !pAnc.fCo.fImg.src && pAnc.fOpts.type!="svg") pAnc.fCo.fImg.setAttribute("src", pAnc.fZmUri);
	else scImageMgr.xRedrawZm(pAnc);
	scImageMgr.fCurrItem = pAnc;
	pAnc.fKeyUpOld = document.onkeyup;
	document.onkeyup = scImageMgr.xKeyMgr;
	this.xNotifyListeners("onZoomOpen", pAnc);
	this.xNotifyListeners("onOverlayOpen", pAnc);
	this.xToggleFocusables();
	this.xFocus(pAnc.fClsBtn);
}
scImageMgr.xClsZm = function(pAnc) {
	scImageMgr.fadeOutTask.initTask(pAnc,function(){
		scImageMgr.xNotifyListeners("onZoomClose", pAnc);
		scImageMgr.xNotifyListeners("onOverlayClose", pAnc);
	});
	scTiLib.addTaskNow(scImageMgr.fadeOutTask);
	document.onkeyup = pAnc.fKeyUpOld;
	scImageMgr.fCurrItem = null;
	scImageMgr.xToggleFocusables();
	scImageMgr.xFocus(pAnc);
}
scImageMgr.sLoadZmImg = function() {
	var vAnc = this.fAnc;
	vAnc.fDefHeight = this.height;
	vAnc.fDefWidth = this.width;
	vAnc.fRatio = vAnc.fDefWidth/vAnc.fDefHeight;
	vAnc.fDeltaHeight = scImageMgr.xGetEltHeight(vAnc.fFra) - scImageMgr.xGetEltHeight(vAnc.fCo) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCvs,"paddingTop")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCvs,"paddingBottom"));
	vAnc.fDeltaWidth = scImageMgr.xGetEltWidth(vAnc.fFra) - scImageMgr.xGetEltWidth(vAnc.fCo) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCvs,"paddingLeft")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCvs,"paddingRight"));
	vAnc.fFra.style.position="absolute";
	scImageMgr.xRedrawZm(vAnc);
	vAnc.fFra.style.visibility="";
}
scImageMgr.sZmMagShow = function(pEvt) {
	var vEvt = scImageMgr.xGetEvt(pEvt);
	var vImg = vEvt.target;
	try {
		var vMag = vImg.fMag;
		var vAnc = vImg.fAnc
		if (!vMag.fEnabled) return;
		vMag.fAct = true;
		var vX = vEvt.offsetX || vEvt.layerX;
		var vY = vEvt.offsetY || vEvt.layerY;
		if (vMag.fMaxDefault) scImageMgr.xZmMagMax(vMag,true);
		else scImageMgr.xZmMagUpdate(vAnc, vMag, vX, vY,true);
		vMag.style.display = "";
	} catch(e){
		scCoLib.log("scImageMgr.sZmMagShow::Error : "+e);
	}
}
scImageMgr.sZmImgMove = function(pEvt) {
	var vEvt = scImageMgr.xGetEvt(pEvt);
	var vImg = vEvt.target;
	try {
		var vMag = vImg.fMag;
		if (!vMag.fEnabled) return;
		if (!vMag.fAct) scImageMgr.sZmMagShow(pEvt);
	} catch(e){
		scCoLib.log("scImageMgr.sZmImgMove::Error : "+e);
	}
}
scImageMgr.sZmMagHide = function(pEvt) {
	var vEvt = scImageMgr.xGetEvt(pEvt);
	var vMag = vEvt.target;
	try {
		vMag.fAct = false;
		scImageMgr.xZmMagMax(vMag,false);
		vMag.style.display = "none";
	} catch(e){
		scCoLib.log("scImageMgr.sZmMagHide::Error : "+e);
	}
}
scImageMgr.sZmMagMove = function(pEvt) {
	var vEvt = scImageMgr.xGetEvt(pEvt);
	var vMag = vEvt.target;
	var vAnc = vMag.fAnc
	var vX = vMag.offsetLeft + (vEvt.offsetX || vEvt.layerX);
	var vY = vMag.offsetTop + (vEvt.offsetY || vEvt.layerY);
	try {
		if (!vMag.fMax) {
			scImageMgr.xZmMagUpdate(vAnc,vMag,vX,vY,true);
		} else if (vMag.fMaxDefault || vAnc.fOpts.magPan == 1) {
			scImageMgr.xZmMagUpdate(vAnc,vMag,vX,vY,false);
		}
	} catch(e){
		scCoLib.log("scImageMgr.sZmMagMove::Error : "+e);
	}
}
scImageMgr.sZmMagClick = function(pEvt) {
	var vEvt = scImageMgr.xGetEvt(pEvt);
	var vMag = vEvt.target;
	if (!vMag.fMaxDefault) {
		scImageMgr.xZmMagMax(vMag,!vMag.fMax);
		if (!vMag.fMax) scImageMgr.sZmMagMove(vEvt);
	}
}
scImageMgr.xZmMagUpdate = function(pAnc, pMag, pX, pY, pUpdtPos) {
	try {
		var vTop = Math.round(Math.min(pAnc.fCurrHeight-pMag.fHeight, Math.max(0,pY - pMag.fHeight/2)));
		var vLeft = Math.round(Math.min(pAnc.fCurrWidth-pMag.fWidth, Math.max(0,pX - pMag.fWidth/2)));
		if (pUpdtPos) {
			pMag.style.left = (vLeft)+"px";
			pMag.style.top = (vTop)+"px";
		}
		pMag.style.backgroundPosition = Math.round(Math.min(vLeft/(pAnc.fCurrWidth-pMag.fWidth)*100,100))+"% "+Math.round(Math.min(vTop/(pAnc.fCurrHeight-pMag.fHeight)*100,100))+"%";
	} catch(e){
		scCoLib.log("scImageMgr.xZmMagUpdate::Error : "+e);
	}
}
scImageMgr.xZmMagMax = function(pMag, pMax) {
	try {
		var vAnc = pMag.fAnc;
		if (pMax){
			pMag.fMax = true;
			pMag.style.top = "0px";
			pMag.style.left = "0px";
			pMag.style.width = vAnc.fCurrWidth+"px";
			pMag.style.height = vAnc.fCurrHeight+"px";
			scImageMgr.xSwitchClass(pMag, pMag.fClass, pMag.fClassMax);
		} else {
			pMag.fMax = false;
			pMag.style.width = pMag.fWidth+"px";
			pMag.style.height = pMag.fHeight+"px";
			scImageMgr.xSwitchClass(pMag, pMag.fClassMax, pMag.fClass);
		}
	} catch(e){
		scCoLib.log("scImageMgr.xZmMagMax::Error : "+e);
	}
}
scImageMgr.xRedrawZm = function(pAnc) {
	try {
		if (pAnc.fOpts.type == "iframe") return;
		var vCoHeight = pAnc.fCvs.clientHeight - pAnc.fDeltaHeight - (scImageMgr.xMobileCheck() ? 0 : scImageMgr.fDeltaGalleryTop);
		var vCoWidth = pAnc.fCvs.clientWidth - pAnc.fDeltaWidth - (scImageMgr.xMobileCheck() ? 0 : scImageMgr.fDeltaGalleryLeft);
		if (vCoHeight == 0 || vCoWidth == 0) return;
		var vCoRatio = vCoWidth/vCoHeight;
		var vFra = pAnc.fFra;
		var vCo = pAnc.fCo;
		var vImg = vCo.fImg;
		var vNewHeight = 0;
		var vNewWidth = 0;
		if (pAnc.fRatio <= vCoRatio && vCoHeight < pAnc.fDefHeight) vNewHeight = vCoHeight;
		if (pAnc.fRatio >= vCoRatio && vCoWidth < pAnc.fDefWidth) vNewWidth = vCoWidth;
		vImg.style.width = (vNewWidth>0 ? scCoLib.toInt(vNewWidth)+"px" : "auto");
		vImg.style.height = (vNewHeight>0 ? scCoLib.toInt(vNewHeight)+"px" : "auto");
		var vImgHeight = pAnc.fCurrHeight = scCoLib.toInt(vNewHeight > 0 ? vNewHeight : vNewWidth > 0 ? vNewWidth/pAnc.fRatio : pAnc.fDefHeight);
		var vImgWidth = pAnc.fCurrWidth = scCoLib.toInt(vNewWidth > 0 ? vNewWidth : vNewHeight > 0 ? vNewHeight*pAnc.fRatio : pAnc.fDefWidth);
		vCo.style.width = vImgWidth+"px";
		vCo.style.height = vImgHeight+"px";
		if (pAnc.fOpts.mag){
			var vMag = vImg.fMag;
			vMag.fEnabled = vImgWidth < pAnc.fDefWidth;
			vMag.fWidth = scCoLib.toInt(vImgWidth * pAnc.fOpts.magScale);
			vMag.fHeight = scCoLib.toInt(vImgHeight * pAnc.fOpts.magScale);
			vMag.style.width = vMag.fWidth+"px";
			vMag.style.height = vMag.fHeight+"px";
		}
		vFra.style.marginTop = scCoLib.toInt((vCoHeight - vImgHeight) / 2 + (scImageMgr.xMobileCheck() ? 0 : scImageMgr.fDeltaGalleryTop) / 2) + "px";
		vFra.style[this.fMarginStart] = scCoLib.toInt((vCoWidth - vImgWidth) / 2 + (scImageMgr.xMobileCheck() ? 0 : scImageMgr.fDeltaGalleryLeft) / 2) + "px";
		document.body.classList.remove("imgLoading");
	} catch(e){
		scCoLib.log("scImageMgr.xRedrawZm::Error : "+e);
	}
}

/* === Slider manager =================================================== */
scImageMgr.xInitSliders = function(pCo) {
	document.body.classList.add("sliderLoading");
	for(var i=0; i<this.fPathSlider.length; i++) {
		var vSliders = scPaLib.findNodes(this.fPathSlider[i].fPath,pCo);
		for(var j=0; j<vSliders.length; j++) {
			var vSlider = vSliders[j];
			vSlider.fOpts = this.fPathSlider[i].fOpts;
			vSlider.fOrigHeight = scCoLib.toInt(this.xReadStyle(vSlider, "height"));
			vSlider.fSliderWidth = this.xGetEltWidth(vSlider);
			vSlider.fSliderHeight = this.xGetEltHeight(vSlider);
			try {
				vSlider.fResizeTimer = 0;
				vSlider.fImgs = scPaLib.findNodes("des:img", vSlider);
				for (var k=0; k<vSlider.fImgs.length; k++) {
					var vImg = vSlider.fImgs[k];
					vImg.fNaturalWidth = Number(vImg.getAttribute("data-width"));
					vImg.fNaturalHeight = Number(vImg.getAttribute("data-height"));
					vImg.style.visibility = "hidden";
					vImg.fOrigWidth = vImg.fNaturalHeight > vSlider.fOrigHeight ? vImg.fNaturalWidth * (vSlider.fOrigHeight / vImg.fNaturalHeight) : vImg.fNaturalWidth;
					vImg.fOrigHeight = vImg.fNaturalHeight * vImg.fOrigWidth / vImg.fNaturalWidth;
					vImg.style.position = "absolute";
					this.xSliderSetImageSize(vImg, vSlider);
					vImg.onload = function() {
						this.style.top = vSlider.fMaxHeight / 2 -  this.height / 2 + "px";
						if (this === vSlider.fImgs[0]) scImageMgr.xRunSlider(vSlider);
					}
				}
				vSlider.fMaxHeight = this.xSliderGetMaxHeigth(vSlider);
				vSlider.style.height = vSlider.fMaxHeight + "px";
				var vTools = scDynUiMgr.addElement("div", vSlider, vSlider.fOpts.clsPre+"Tools", vSlider.firstChild);
				vSlider.fToolsOver = scDynUiMgr.addElement("div", vTools, vSlider.fOpts.clsPre+"ToolsOver");
				vSlider.fToolsOver.style.height = vSlider.fMaxHeight + "px";
				vSlider.fToolsOver.style.position = "absolute";
				vSlider.fToolsOver.style.top = "0";
				vSlider.fToolsExt = scDynUiMgr.addElement("div", vTools, vSlider.fOpts.clsPre+"ToolsOver");
				vSlider.fPauseBtn = scImageMgr.xAddBtn(vSlider.fToolsOver,vSlider,this.fTypSlider,"BtnPause",scImageMgr.xGetStr(18),scImageMgr.xGetStr(19));
				vSlider.fPauseBtn.onclick = function(){return scImageMgr.xBtnMgr(this);}
				vSlider.fPauseBtn.fObj = vSlider;
				vSlider.fPlayBtn = scImageMgr.xAddBtn(vSlider.fToolsOver,vSlider,this.fTypSlider,"BtnPlay",scImageMgr.xGetStr(16),scImageMgr.xGetStr(17));
				vSlider.fPlayBtn.onclick = function(){return scImageMgr.xBtnMgr(this);}
				vSlider.fPlayBtn.fObj = vSlider;
				vSlider.fPlayBtn.style.display = "none";
				if (vSlider.fImgs.length > 1) {
					vSlider.fPrvBtn = scImageMgr.xAddBtn(vSlider.fToolsExt,vSlider,this.fTypSlider,"BtnPrv",scImageMgr.xGetStr(0),scImageMgr.xGetStr(1));
					vSlider.fPrvBtn.onclick = function(){return scImageMgr.xBtnMgr(this);}
					vSlider.fPrvBtn.fObj = vSlider;
					vSlider.fPrvBtn.style.display = "none";
					vSlider.fNxtBtn = scImageMgr.xAddBtn(vSlider.fToolsExt,vSlider,this.fTypSlider,"BtnNxt",scImageMgr.xGetStr(2),scImageMgr.xGetStr(3));
					vSlider.fNxtBtn.onclick = function(){return scImageMgr.xBtnMgr(this);}
					vSlider.fNxtBtn.fObj = vSlider;
				}
				vSlider.fTimer = scDynUiMgr.addElement("div", vSlider.fToolsOver, vSlider.fOpts.clsPre+"Timer");
				vSlider.fTimerNb = scDynUiMgr.addElement("div", vSlider.fTimer, vSlider.fOpts.clsPre+"TimerNb");
				vSlider.fTimerProgressBar = scDynUiMgr.addElement("div", vSlider.fTimer, vSlider.fOpts.clsPre+"TimerProgressBar");
				vSlider.fTimerProgressBarSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				vSlider.fTimerProgressBarSvg.classList.add(vSlider.fOpts.clsPre+"TimerProgressBarSvg")
				vSlider.fTimerProgressBarSvg.setAttribute("width", "120");
				vSlider.fTimerProgressBarSvg.setAttribute("height", "120");
				vSlider.fTimerProgressBarSvg.setAttribute("viewBox", "0 0 120 120");
				vSlider.fTimerProgressBarSvg.style.display = "none";
				vSlider.fTimerProgressBar.appendChild(vSlider.fTimerProgressBarSvg);
				vSlider.fTimerProgressBarCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				vSlider.fTimerProgressBarCircle.setAttribute("cx", "60");
				vSlider.fTimerProgressBarCircle.setAttribute("cy", "60");
				vSlider.fTimerProgressBarCircle.setAttribute("r", "54");
				vSlider.fTimerProgressBarSvg.appendChild(vSlider.fTimerProgressBarCircle);
				vSlider.fCurrentImageIndex = 0;
				// On charge la première image
				vSlider.fImgs[0].src = vSlider.fImgs[0].getAttribute("data-src");
				var vResizer = {
					onResizedDes : function(pOwnerNode, pEvent) {},
					onResizedAnc : function(pOwnerNode, pEvent) {
						clearTimeout(pOwnerNode.fResizeTimer);
						pOwnerNode.fResizeTimer = setTimeout(function() {
							pOwnerNode.classList.remove("isResized");
						}, 250);
						pOwnerNode.classList.add("isResized");
						var vCurrentImage = pOwnerNode.fImgs[pOwnerNode.fCurrentImageIndex];
						pOwnerNode.fSliderWidth = scImageMgr.xGetEltWidth(pOwnerNode);
						for (var k=0; k<pOwnerNode.fImgs.length; k++) {
							scImageMgr.xSliderSetImageSize(pOwnerNode.fImgs[k], pOwnerNode);
						}
						vCurrentImage.style.left = pOwnerNode.fSliderWidth / 2 - vCurrentImage.width / 2 + "px";
						pOwnerNode.fMaxHeight = scImageMgr.xSliderGetMaxHeigth(pOwnerNode);
						for (var k=0; k<pOwnerNode.fImgs.length; k++) {
							var vImg = pOwnerNode.fImgs[k];
							if (vImg.src) vImg.style.top = pOwnerNode.fMaxHeight / 2 -  vImg.height / 2 + "px";
						}
						pOwnerNode.style.height = pOwnerNode.fMaxHeight + "px";
						pOwnerNode.fToolsOver.style.left = pOwnerNode.fSliderWidth / 2 - vCurrentImage.width / 2  + "px";
						pOwnerNode.fToolsOver.style.width = vCurrentImage.width + "px";
						pOwnerNode.fToolsOver.style.height = pOwnerNode.fMaxHeight + "px";
					}
				}
				scSiLib.addRule(vSlider, vResizer);
			} catch(e){
				scCoLib.log("scImageMgr.onLoad::Slider init Error : "+e);
			}
		}
	}
}

scImageMgr.xSliderGetMaxHeigth = function(pSlider) {
	return Math.max.apply(Math, pSlider.fImgs.map(function(pImg) { return pImg.height; }));
}

scImageMgr.xSliderSetImageSize = function(pImg, pSlider) {
	pImg.width = Math.round(pSlider.fSliderWidth < pImg.fOrigWidth ? pSlider.fSliderWidth : pImg.fNaturalHeight > pSlider.fOrigHeight ? pImg.fNaturalWidth * (pSlider.fSliderHeight / pImg.fNaturalHeight) : pImg.fOrigWidth);
	pImg.height = Math.round(pImg.width * pImg.fNaturalHeight / pImg.fNaturalWidth);
	pImg.style.left = pSlider.fSliderWidth + "px";
}

scImageMgr.xRunSlider = function(pSlider) {
	document.body.classList.remove("sliderLoading");
	// On charge l'image suivante  et précédente si elles ne sont pas chargée
	var vNextIndex = pSlider.fCurrentImageIndex + 1;
	if (pSlider.fImgs[vNextIndex] && !pSlider.fImgs[vNextIndex].src) pSlider.fImgs[vNextIndex].src = pSlider.fImgs[vNextIndex].getAttribute("data-src");
	var vPrevIndex = pSlider.fCurrentImageIndex - 1;
	if (pSlider.fImgs[vPrevIndex] && !pSlider.fImgs[vPrevIndex].src) pSlider.fImgs[vPrevIndex].src = pSlider.fImgs[vPrevIndex].getAttribute("data-src");
	var vLastIndex = pSlider.fImgs.length - 1;
	if (!pSlider.fImgs[vLastIndex].src) pSlider.fImgs[vLastIndex].src = pSlider.fImgs[vLastIndex].getAttribute("data-src");
	var vCurrentImageWidth = pSlider.fImgs[pSlider.fCurrentImageIndex].width;
	pSlider.fToolsOver.style.width = vCurrentImageWidth + "px";
	pSlider.fToolsOver.style.left = pSlider.fSliderWidth / 2 - vCurrentImageWidth / 2  + "px";
	if (!scImageMgr.isSliderPaused) {
		var vDuration = pSlider.fOpts.speed;
		var vImgTime = 0;
		pSlider.fImgTimeInterval = setInterval(function () {
			vImgTime++
			pSlider.fTimerProgressBarSvg.style.display = "";
			if (vImgTime === 12) pSlider.fToolsOver.style.display = "";
			if (vImgTime === 12) pSlider.fToolsExt.style.display = "";
			pSlider.fTimerNb.setAttribute("data-progress", vImgTime);
			pSlider.fTimerProgressBar.setAttribute("data-progress", vImgTime);
			if (vImgTime === 98) pSlider.fToolsOver.style.display = "none";
			if (vImgTime === 98) pSlider.fToolsExt.style.display = "none";
			pSlider.fTimerProgressBarCircle.setAttribute("stroke-dasharray", (339.292 * (vImgTime/100)) + " 339.292");
		}, vDuration / 100);
	}
	pSlider.fImgs[pSlider.fCurrentImageIndex].style.visibility = "visible";
	pSlider.fImgs[pSlider.fCurrentImageIndex].style.left = pSlider.fSliderWidth < pSlider.fImgs[pSlider.fCurrentImageIndex].fOrigWidth ? 0 : pSlider.fSliderWidth / 2 - vCurrentImageWidth / 2  + "px";
	if (!scImageMgr.isSliderPaused) {
		pSlider.fSliderTimer = setTimeout(function() {
			scImageMgr.xSliderNxt(pSlider);
		}, vDuration);
	}
}

scImageMgr.xSliderNxt = function(pSlider) {
	clearTimeout(pSlider.fSliderTimer);
	clearInterval(pSlider.fImgTimeInterval);
	if (pSlider.fPrevImageIndex !== undefined) {
		pSlider.fImgs[pSlider.fPrevImageIndex].style.visibility = "hidden";
		pSlider.fImgs[pSlider.fPrevImageIndex].style.left = pSlider.fSliderWidth  + "px";
	}
	pSlider.fPrevImageIndex = pSlider.fCurrentImageIndex;
	if (pSlider.fCurrentImageIndex < pSlider.fImgs.length - 1) pSlider.fCurrentImageIndex++;
	else pSlider.fCurrentImageIndex = 0;
	if (pSlider.fImgs[pSlider.fPrevImageIndex]) pSlider.fImgs[pSlider.fPrevImageIndex].style.left = -pSlider.fImgs[pSlider.fPrevImageIndex].width + "px";
	pSlider.fPrvBtn.style.display = "";
	scImageMgr.xRunSlider(pSlider);
}

scImageMgr.xSliderPrv = function(pSlider) {
	clearTimeout(pSlider.fSliderTimer);
	clearInterval(pSlider.fImgTimeInterval);
	pSlider.fImgs[pSlider.fCurrentImageIndex].style.left = pSlider.fSliderWidth + "px";
	if (pSlider.fCurrentImageIndex === 0) pSlider.fCurrentImageIndex = pSlider.fImgs.length - 1;
	else pSlider.fCurrentImageIndex--;

	// TODO voir si possible d'avoir la fleche gauche dès le départ
	// if (pSlider.fPrevImageIndex === undefined) pSlider.fImgs[pSlider.fImgs.length - 1].style.left = -pSlider.fImgs[pSlider.fImgs.length - 1].width + "px";

	pSlider.fPrevImageIndex = pSlider.fCurrentImageIndex !== 0 ? pSlider.fCurrentImageIndex - 1 : pSlider.fImgs.length - 1;
	pSlider.fImgs[pSlider.fPrevImageIndex].style.left = -pSlider.fImgs[pSlider.fPrevImageIndex].width + "px";
	scImageMgr.xRunSlider(pSlider);
}

scImageMgr.xPauseSlider = function(pSlider) {
	scImageMgr.isSliderPaused = true;
	pSlider.fPauseBtn.style.display = "none";
	pSlider.fTimer.style.display = "none";
	pSlider.fPlayBtn.style.display = "";
	clearTimeout(pSlider.fSliderTimer);
	clearInterval(pSlider.fImgTimeInterval);
}

scImageMgr.xPlaySlider = function(pSlider) {
	scImageMgr.isSliderPaused = false;
	pSlider.fPlayBtn.style.display = "none";
	pSlider.fTimer.style.display = "";
	pSlider.fPauseBtn.style.display = "";
	scImageMgr.xRunSlider(pSlider);
}

/* === Sequence manager =================================================== */
scImageMgr.xInitSqs = function(pCo) {
	scImageMgr.registerListener("onZoomOpen", function(pAnc) {scImageMgr.xPauseSeq(pAnc.fObj);});
	for(var i=0; i<this.fPathSeq.length; i++) {
		var vSeqs = scPaLib.findNodes(this.fPathSeq[i].fPath,pCo);
		for(var j=0; j<vSeqs.length; j++) {
			var vSeq = vSeqs[j];
			vSeq.fOpts = this.fPathSeq[i].fOpts;
			try {
				// Init player
				vSeq.fAncs = scPaLib.findNodes("des:a.galPvLnk", vSeq);
				vSeq.fToolsOver = scDynUiMgr.addElement("div", vSeq, vSeq.fOpts.clsPre+"ToolsOver");
				vSeq.fToolsOver.style.position = "absolute";
				vSeq.fPauseBtn = scImageMgr.xAddBtn(vSeq.fToolsOver,vSeq,this.fTypSeq,"BtnPause",scImageMgr.xGetStr(18),scImageMgr.xGetStr(19));
				vSeq.fPauseBtn.onclick = function(){return scImageMgr.xBtnMgr(this);}
				vSeq.fPauseBtn.fObj = vSeq;
				vSeq.fPauseBtn.style.display = "none";
				vSeq.fPlayBtn = scImageMgr.xAddBtn(vSeq.fToolsOver,vSeq,this.fTypSeq,"BtnPlay",scImageMgr.xGetStr(16),scImageMgr.xGetStr(17));
				vSeq.fPlayBtn.onclick = function(){return scImageMgr.xBtnMgr(this);}
				vSeq.fPlayBtn.fObj = vSeq;
				if (vSeq.fAncs.length > 1) {
					vSeq.fPrvBtn = scImageMgr.xAddBtn(vSeq.fToolsOver,vSeq,this.fTypSeq,"BtnPrv",scImageMgr.xGetStr(0),scImageMgr.xGetStr(1));
					vSeq.fPrvBtn.onclick = function(){return scImageMgr.xBtnMgr(this);}
					vSeq.fPrvBtn.fObj = vSeq;
					// vSeq.fPrvBtn.style.display = "none";
					vSeq.fNxtBtn = scImageMgr.xAddBtn(vSeq.fToolsOver,vSeq,this.fTypSeq,"BtnNxt",scImageMgr.xGetStr(2),scImageMgr.xGetStr(3));
					vSeq.fNxtBtn.onclick = function(){return scImageMgr.xBtnMgr(this);}
					vSeq.fNxtBtn.fObj = vSeq;
				}
				// Init anchors & images
				for(var k=0; k<vSeq.fAncs.length; k++) {
					var vAnc = vSeq.fAncs[k];
					vAnc.parentNode.style.position = "absolute";
					vAnc.parentNode.style.top = scImageMgr.xGetEltHeight(vSeq.fToolsOver) + "px";
					vAnc.parentNode.style.opacity = 0;
					vAnc.parentNode.style.transition = "opacity 1s ease-out";
					vAnc.fZmUri = vAnc.href;
					vAnc.href = "#";
					vAnc.target = "_self";
					vAnc.fName=this.fTypSeq+"Zm";
					if (vAnc.title && vAnc.title.length>0) vAnc.fTitle=vAnc.title;
					vAnc.onclick=function(){
						if (this.fImg && this.fImg.fIsAdapted && this.fImg.fWidth > window.innerWidth) {
							this.target = "_blank";
							return true;
						} else {
							this.target = "_self";
							return scImageMgr.xBtnMgr(this);
						}
					}
					vAnc.onkeydown=function(pEvent){scDynUiMgr.handleBtnKeyDwn(pEvent);}
					vAnc.onkeyup=function(pEvent){scDynUiMgr.handleBtnKeyUp(pEvent);}
					vAnc.fImg = scPaLib.findNode("des:img.imgPv", vAnc);
					vAnc.fObj = vSeq;
					vAnc.fOpts = vSeq.fOpts;
					vSeq.height = scImageMgr.xGetEltHeight(vAnc.parentNode);
				}
				vSeq.fAncs[0].parentNode.style.opacity = 1;
				vSeq.fAncs[0].parentNode.style.visibility = "visible";
				vSeq.style.height = vSeq.height + scImageMgr.xGetEltHeight(vSeq.fToolsOver) + "px";
				vSeq.fCurrentImageIndex = 0;
				vSeq.fName="seq";
			} catch(e){
				scCoLib.log("scImageMgr.onLoad::Sequence init Error : "+e);
			}
		}
	}
}

scImageMgr.xRunSeq = function(pSeq) {
	pSeq.fAncs[pSeq.fCurrentImageIndex].parentNode.style.visibility = "visible";
	pSeq.fAncs[pSeq.fCurrentImageIndex].parentNode.style.opacity = 1;
	if (!scImageMgr.isSeqPaused) {
		pSeq.fSeqTimer = setTimeout(function() {
			scImageMgr.xSeqNxt(pSeq);
		}, 3000);
	}
}

scImageMgr.xSeqNxt = function(pSeq) {
	clearTimeout(pSeq.fSeqTimer);
	pSeq.fPrevImageIndex = pSeq.fCurrentImageIndex;
	if (pSeq.fCurrentImageIndex < pSeq.fAncs.length - 1) pSeq.fCurrentImageIndex++;
	else pSeq.fCurrentImageIndex = 0;
	if (pSeq.fAncs[pSeq.fPrevImageIndex]) {
		pSeq.fAncs[pSeq.fPrevImageIndex].parentNode.style.opacity = 0;
		setTimeout(function() {
			pSeq.fAncs[pSeq.fPrevImageIndex].parentNode.style.visibility = "hidden";
		}, 1000);
	}
	scImageMgr.xRunSeq(pSeq);
}

scImageMgr.xSeqPrv = function(pSeq) {
	clearTimeout(pSeq.fSeqTimer);
	pSeq.fPrevImageIndex = pSeq.fCurrentImageIndex;
	if (pSeq.fCurrentImageIndex === 0) pSeq.fCurrentImageIndex = pSeq.fAncs.length - 1;
	else pSeq.fCurrentImageIndex--;
	pSeq.fAncs[pSeq.fPrevImageIndex].parentNode.style.opacity = 0;
	setTimeout(function() {
		pSeq.fAncs[pSeq.fPrevImageIndex].parentNode.style.visibility = "hidden";
	}, 1000);
	scImageMgr.xRunSeq(pSeq);
}

scImageMgr.xPauseSeq = function(pSeq) {
	scImageMgr.isSeqPaused = true;
	pSeq.fPauseBtn.style.display = "none";
	pSeq.fPlayBtn.style.display = "";
	clearTimeout(pSeq.fSeqTimer);
}

scImageMgr.xPlaySeq = function(pSeq) {
	scImageMgr.isSeqPaused = false;
	pSeq.fPlayBtn.style.display = "none";
	pSeq.fPauseBtn.style.display = "";
	scImageMgr.xRunSeq(pSeq);
}

/* === Slide-show manager =================================================== */
scImageMgr.xInitSss = function(pCo) {
	for(var i=0; i<this.fPathGal.length; i++) {
		var vGals = scPaLib.findNodes(this.fPathGal[i].fPath,pCo);
		for(var j=0; j<vGals.length; j++) {
			var vGal = vGals[j];
			vGal.fOpts = this.fPathGal[i].fOpts;
			try {
				vGal.fAncs = scPaLib.findNodes("des:a.galPvLnk", vGal);
				if (vGal.getAttribute("data-mode") === "adapted") {
					vGal.style.display = "block";
					vGal.fImgs = scPaLib.findNodes("des:img.imgPv", vGal);
					for (var k=0; k<vGal.fImgs.length; k++) {
						var vImg = vGal.fImgs[k];
						vImg.fPaddingWidth = scCoLib.toInt(scImageMgr.xReadStyle(vImg, 'padding-left')) + scCoLib.toInt(scImageMgr.xReadStyle(vImg, 'padding-right'));
						vImg.fMarginWidth = scCoLib.toInt(scImageMgr.xReadStyle(vImg, 'margin-left')) + scCoLib.toInt(scImageMgr.xReadStyle(vImg, 'margin-right'));
						vImg.fOrigWidth = scImageMgr.xGetEltWidth(vImg) - vImg.fPaddingWidth;
						vImg.fPaddingHeight = scCoLib.toInt(scImageMgr.xReadStyle(vImg, 'padding-top')) + scCoLib.toInt(scImageMgr.xReadStyle(vImg, 'padding-bottom'));
						vImg.fMarginHeight = scCoLib.toInt(scImageMgr.xReadStyle(vImg, 'margin-top')) + scCoLib.toInt(scImageMgr.xReadStyle(vImg, 'margin-bottom'));
						vImg.fOrigHeight = scImageMgr.xGetEltHeight(vImg) - vImg.fPaddingHeight;
					}
					scImageMgr.xResizeThumbsSs(vGal);
					var vResizer = {
						onResizedDes : function(pOwnerNode, pEvent) {},
						onResizedAnc : function(pOwnerNode, pEvent) {
							scImageMgr.xResizeThumbsSs(pOwnerNode);
						}
					}
					scSiLib.addRule(vGal, vResizer);
				}
				// Init anchors & images
				for(var k=0; k<vGal.fAncs.length; k++) {
					var vAnc = vGal.fAncs[k];
					vAnc.fSsUri = vAnc.href;
					vAnc.fIdx = k;
					vAnc.href = "#";
					vAnc.target = "_self";
					vAnc.fName=this.fTypGal+"Pv";
					if (vAnc.title && vAnc.title.length>0){
						vAnc.fTitle=vAnc.title;
						vAnc.title = scImageMgr.xGetStr(27) + " " + vAnc.fTitle;
					}
					vAnc.onclick=function(){return scImageMgr.xBtnMgr(this);}
					vAnc.fImg = scPaLib.findNode("des:img.imgPv", vAnc);
					vAnc.fObj = vGal;
				}
				// Init SlideShow elements
				this.xInitSs(vGal);
				vGal.fSsStep = scImageMgr.fDefaultStep;
				vGal.fName="gal";
			} catch(e){
				scCoLib.log("scImageMgr.onLoad::Gallery init Error : "+e);
			}
		}
	}
}
scImageMgr.xResizeThumbsSs = function (pGal) {
    setTimeout(function () {
        var vRatio = 0;
        var vGalleryAvailableWidth = scImageMgr.xGetEltWidth(pGal) - 1;
        var vMaxImgsPerRow = 0;
        var vRowWidth = 0;
        if (pGal.fImgs) {
            for (var k = 0; k < pGal.fImgs.length; k++) {
                var vImg = pGal.fImgs[k];
                vImg.fHeight = null
                vRatio += vImg.fOrigWidth / (vImg.fOrigHeight);
                vRowWidth += vImg.fOrigWidth;
                vMaxImgsPerRow++;
                if (vRowWidth >= vGalleryAvailableWidth) {
                    for (var l = k - (vMaxImgsPerRow - 1); l <= k; l++) {
                        var vImage = pGal.fImgs[l];
                        vImage.fHeight = (vGalleryAvailableWidth - (vImage.fPaddingWidth + vImage.fMarginWidth) * vMaxImgsPerRow) / vRatio;
                    }
                    vRatio = 0;
                    vRowWidth = 0;
                    vMaxImgsPerRow = 0;
                }
            }
            for (var k = 0; k < pGal.fImgs.length; k++) {
                var vImg = pGal.fImgs[k];
                if (vImg.fHeight) {
                    vImg.style.height = vImg.fHeight + "px";
                    vImg.style.width = "auto";
                } else {
                    vImg.style.height = "auto";
                }
            }
        }
    })
}
scImageMgr.xInitSs = function(pAlbFra) {
	var vOpts = pAlbFra.fOpts;
	pAlbFra.fCvs = scDynUiMgr.addElement("div",this.fDisplayRoot,vOpts.clsPre+"Cvs", null, {display:"none"});
	pAlbFra.fCvs.setAttribute("role", "dialog");
	pAlbFra.fOver = scDynUiMgr.addElement("div",pAlbFra.fCvs,vOpts.clsPre+"Over");
	pAlbFra.fOver.fAlbFra = pAlbFra;
	pAlbFra.fOver.onclick=function(){return scImageMgr.xClsSs(this.fAlbFra);}
	pAlbFra.fFraRoot = scDynUiMgr.addElement("div",pAlbFra.fCvs,vOpts.clsPre+"Fra");
	pAlbFra.fSsCo = scDynUiMgr.addElement("ul",pAlbFra.fFraRoot,vOpts.clsPre+"Co");
	pAlbFra.fSsImgFras = [];
	for(var i=0; i<pAlbFra.fAncs.length; i++) {
		pAlbFra.fSsImgFras[i] = scDynUiMgr.addElement("li",pAlbFra.fSsCo,vOpts.clsPre+"ImgFra", null, {visibility:"hidden"});
		pAlbFra.fSsImgFras[i].fCo = scDynUiMgr.addElement("div",pAlbFra.fSsImgFras[i],vOpts.clsPre+"ImgCo");
		pAlbFra.fSsImgFras[i].fImg = scDynUiMgr.addElement("img",pAlbFra.fSsImgFras[i].fCo,null);
		pAlbFra.fSsImgFras[i].fImg.setAttribute("alt",pAlbFra.fAncs[i].fImg.alt ? pAlbFra.fAncs[i].fImg.alt : "");
		pAlbFra.fAncs[i].fCvs = pAlbFra.fCvs;
		pAlbFra.fSsImgFras[i].fImg.fAnc = pAlbFra.fAncs[i];
		pAlbFra.fSsImgFras[i].fImg.fAnc.fFraRoot = pAlbFra.fFraRoot;
		pAlbFra.fSsImgFras[i].fImg.fAnc.fFra = pAlbFra.fSsImgFras[i];
		pAlbFra.fSsImgFras[i].fImg.fAnc.fCo = pAlbFra.fSsImgFras[i].fCo;
		pAlbFra.fSsImgFras[i].fImg.fAnc.fOpts = vOpts;
		pAlbFra.fSsImgFras[i].fImg.fAnc.fImg = pAlbFra.fSsImgFras[i].fImg;
		pAlbFra.fSsImgFras[i].fImg.onload = scImageMgr.sLoadSsImg;
		var vResizer = {
			onResizedDes : function(pOwnerNode, pEvent) {},
			onResizedAnc : function(pOwnerNode, pEvent) {
				if(pEvent.phase==1) {
					if(scImageMgr.fCurrItem.fCurrAnc == pOwnerNode.fAnc) {
						scImageMgr.xRedrawSs(pOwnerNode.fAnc);
					}
				}
			}
		}
		scSiLib.addRule(pAlbFra.fSsImgFras[i].fImg, vResizer);
	}
	pAlbFra.fSsTbr = scDynUiMgr.addElement("div",pAlbFra.fFraRoot,vOpts.clsPre+"Tbr");
	pAlbFra.fSsTi = scDynUiMgr.addElement("div",pAlbFra.fSsTbr,vOpts.clsPre+"Ti");
	pAlbFra.fSsTi.setAttribute("aria-live", "polite");
	var vBtns = scDynUiMgr.addElement("div",pAlbFra.fSsTbr,vOpts.clsPre+"Btns");
	scImageMgr.xAddSep(vBtns);
	if (pAlbFra.fAncs.length>1){
		pAlbFra.fSsBtnPrv = scImageMgr.xAddBtn(vBtns,pAlbFra,this.fTypGal,"BtnPrv",scImageMgr.xGetStr(0),scImageMgr.xGetStr(1));
		scImageMgr.xAddSep(vBtns);
		pAlbFra.fSsBtnPly = scImageMgr.xAddBtn(vBtns,pAlbFra,this.fTypGal,"BtnPly",scImageMgr.xGetStr(6),scImageMgr.xGetStr(7));
		pAlbFra.fSsBtnPse = scImageMgr.xAddBtn(vBtns,pAlbFra,this.fTypGal,"BtnPse",scImageMgr.xGetStr(8),scImageMgr.xGetStr(9));
		pAlbFra.fSsBtnPse.style.display = "none";
		scImageMgr.xAddSep(vBtns);
		pAlbFra.fSsBtnNxt = scImageMgr.xAddBtn(vBtns,pAlbFra,this.fTypGal,"BtnNxt",scImageMgr.xGetStr(2),scImageMgr.xGetStr(3));
		scImageMgr.xAddSep(vBtns);
	}
	pAlbFra.fSsBtnCls = scImageMgr.xAddBtn((this.xMobileCheck() ? vBtns : pAlbFra.fCvs),pAlbFra,this.fTypGal,"BtnCls",scImageMgr.xGetStr(4),scImageMgr.xGetStr(5));
	pAlbFra.fSsCount = scDynUiMgr.addElement("span",pAlbFra.fSsTbr,vOpts.clsPre+"Count")
}
scImageMgr.xSsStart = function(pAlbFra) {
	scImageMgr.xOpenSs(pAlbFra,pAlbFra.fAncs[0]);
	scImageMgr.xPlySs(pAlbFra);
}
scImageMgr.xOpenSs = function(pAlbFra,pAnc) {
	if(this.xReadStyle(pAlbFra.fCvs,"position") == "absolute") window.scroll(0,0); // if position:absolute, we must scroll the SS into view.
	document.body.classList.add("noScroll");
	scImageMgr.fadeInTask.initTask(pAlbFra);
	scTiLib.addTaskNow(scImageMgr.fadeInTask);
	scImageMgr.xUdtSs(pAlbFra,pAnc);
	scImageMgr.fCurrItem = pAlbFra;
	pAlbFra.fInitAnc = pAnc;
	pAlbFra.fKeyUpOld = document.onkeyup;
	document.onkeyup = scImageMgr.xKeyMgr;
	this.xNotifyListeners("onAnimationOpen", pAlbFra);
	this.xNotifyListeners("onOverlayOpen", pAlbFra);
	this.xToggleFocusables();
	this.xFocus(pAlbFra.fSsBtnPly);
}
scImageMgr.xUdtSs = function(pAlbFra,pNewAnc) {
	document.body.classList.add("imgLoading");
	pAlbFra.fCurrAnc = pNewAnc;
	if(!pAlbFra.fSsImgFras[pNewAnc.fIdx].fImg.src) pAlbFra.fSsImgFras[pNewAnc.fIdx].fImg.setAttribute("src", pNewAnc.fSsUri);
	else scImageMgr.xRedrawSs(pNewAnc);
	var vOpts = pAlbFra.fOpts;
	pAlbFra.fSsHasPrv = pNewAnc.fIdx != 0;
	pAlbFra.fSsHasNxt = pNewAnc.fIdx != pAlbFra.fAncs.length - 1;
	if (pAlbFra.fSsHasNxt){
		pAlbFra.fNxtSsAnc = pAlbFra.fAncs[Math.min(pNewAnc.fIdx + 1,pAlbFra.fAncs.length - 1)];
		if(!pAlbFra.fSsImgFras[pAlbFra.fNxtSsAnc.fIdx].fImg.src) pAlbFra.fSsImgFras[pAlbFra.fNxtSsAnc.fIdx].fImg.setAttribute("src", pAlbFra.fNxtSsAnc.fSsUri);
	} else if(pAlbFra.fSsAutoPly) scImageMgr.xPseSs(pAlbFra);
	if (pAlbFra.fSsHasPrv){
		pAlbFra.fPrvSsAnc = pAlbFra.fAncs[Math.max(pNewAnc.fIdx - 1,0)];
		if(!pAlbFra.fSsImgFras[pAlbFra.fPrvSsAnc.fIdx].fImg.src) pAlbFra.fSsImgFras[pAlbFra.fPrvSsAnc.fIdx].fImg.setAttribute("src", pAlbFra.fPrvSsAnc.fSsUri);
	}
	pAlbFra.fSsTi.innerHTML = (pNewAnc.fTitle ? pNewAnc.fTitle : "");
	pAlbFra.fSsCount.innerHTML = (pNewAnc.fIdx+1)+"/"+pAlbFra.fAncs.length;
	if (pAlbFra.fSsBtnPrv) {
		scImageMgr.xSwitchClass(pAlbFra.fSsBtnPrv,(pAlbFra.fSsHasPrv?vOpts.clsPre+"BtnNoPrv":vOpts.clsPre+"BtnPrv"),(pAlbFra.fSsHasPrv?vOpts.clsPre+"BtnPrv":vOpts.clsPre+"BtnNoPrv"));
		if (pAlbFra.fSsHasPrv) pAlbFra.fSsBtnPrv.removeAttribute("aria-disabled");
		else pAlbFra.fSsBtnPrv.setAttribute("aria-disabled", "true");
	}
	if (pAlbFra.fSsBtnNxt) {
		scImageMgr.xSwitchClass(pAlbFra.fSsBtnNxt,(pAlbFra.fSsHasNxt?vOpts.clsPre+"BtnNoNxt":vOpts.clsPre+"BtnNxt"),(pAlbFra.fSsHasNxt?vOpts.clsPre+"BtnNxt":vOpts.clsPre+"BtnNoNxt"));
		if (pAlbFra.fSsHasNxt) pAlbFra.fSsBtnNxt.removeAttribute("aria-disabled");
		else pAlbFra.fSsBtnNxt.setAttribute("aria-disabled", "true");
	}

	scImageMgr.switchSsTask.initTask(pAlbFra,pNewAnc);
	scTiLib.addTaskNow(scImageMgr.switchSsTask);
}
scImageMgr.xNxtSs = function(pAlbFra) {
	if (!pAlbFra.fSsHasNxt) return false;
	scImageMgr.xUdtSs(pAlbFra,pAlbFra.fNxtSsAnc);
	return true;
}
scImageMgr.xPrvSs = function(pAlbFra) {
	if (!pAlbFra.fSsHasPrv) return false;
	scImageMgr.xUdtSs(pAlbFra,pAlbFra.fPrvSsAnc);
	return true;
}
scImageMgr.xClsSs = function(pAlbFra) {
	scImageMgr.fadeOutTask.initTask(pAlbFra,function(){
		scImageMgr.xNotifyListeners("onAnimationClose", pAlbFra);
		scImageMgr.xNotifyListeners("onOverlayClose", pAlbFra);
	});
	scTiLib.addTaskNow(scImageMgr.fadeOutTask);
	document.onkeyup = pAlbFra.fKeyUpOld;
	pAlbFra.fSsAutoPly = false;
	scImageMgr.fCurrItem = null;
	scImageMgr.xToggleFocusables();
	scImageMgr.xFocus(pAlbFra.fInitAnc);
	document.body.classList.remove("noScroll");
	scImageMgr.xResizeThumbsSs(pAlbFra);
}
scImageMgr.xPlySs = function(pAlbFra) {
	if (pAlbFra.fAncs.length<=1) return;
	pAlbFra.fSsAutoPly = true;
	pAlbFra.fSsBtnPly.style.display="none";
	pAlbFra.fSsBtnPse.style.display="";
	scImageMgr.xFocus(pAlbFra.fSsBtnPse);
	if (! scImageMgr.xNxtSs(pAlbFra)) scImageMgr.xUdtSs(pAlbFra,pAlbFra.fAncs[0]);
	pAlbFra.fNxtSsProc = window.setTimeout(scImageMgr.xAutoSs, pAlbFra.fSsStep);
}
scImageMgr.xPseSs = function(pAlbFra) {
	if (pAlbFra.fAncs.length<=1) return;
	pAlbFra.fSsAutoPly = false;
	pAlbFra.fSsBtnPly.style.display="";
	pAlbFra.fSsBtnPse.style.display="none";
	scImageMgr.xFocus(pAlbFra.fSsBtnPly);
	window.clearTimeout(pAlbFra.fNxtSsProc);
//	pAlbFra.fNxtSsProc = -1;
}
scImageMgr.sLoadSsImg = function() {
	var vAnc = this.fAnc;
	vAnc.fDefHeight = this.height;
	vAnc.fDefWidth = this.width;
	vAnc.fRatio = vAnc.fDefWidth/vAnc.fDefHeight;
	vAnc.fDeltaTop = scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCvs,"paddingTop")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fFra,"paddingTop")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCo,"paddingTop"));
	vAnc.fDeltaBottom = scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCvs,"paddingBottom")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fFra,"paddingBottom")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCo,"paddingBottom"));
	vAnc.fDeltaHeight = vAnc.fDeltaTop + vAnc.fDeltaBottom;
	vAnc.fDeltaWidth = scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCvs,"paddingLeft")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCvs,"paddingRight")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fFra,"paddingLeft")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fFra,"paddingRight")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCo,"paddingLeft")) + scCoLib.toInt(scImageMgr.xReadStyle(vAnc.fCo,"paddingRight"));
	vAnc.fCo.style.position="absolute";
	vAnc.fFra.style.position="absolute";
	if (scImageMgr.fCurrItem.fCurrAnc === vAnc) scImageMgr.xRedrawSs(vAnc);
}
scImageMgr.xRedrawSs = function(pAnc) {
	try {
		if (pAnc.fOpts.type == "iframe") return;
		var vImg = pAnc.fImg;
		if (!vImg.complete || typeof vImg.naturalWidth != "undefined" && vImg.naturalWidth == 0) return scImageMgr.xRedrawSs(pAnc);
		var vCoHeight = pAnc.fCvs.clientHeight - pAnc.fDeltaHeight - (scImageMgr.xMobileCheck() ? 0 : scImageMgr.fDeltaGalleryTop);
		var vCoWidth = pAnc.fCvs.clientWidth - pAnc.fDeltaWidth - (scImageMgr.xMobileCheck() ? 0 : scImageMgr.fDeltaGalleryLeft);
		if (vCoHeight == 0 || vCoWidth == 0) return;
		var vCoRatio = vCoWidth/vCoHeight;
		var vFra = pAnc.fFra;
		var vCo = pAnc.fCo;

		var vNewHeight = 0;
		var vNewWidth = 0;
		if (pAnc.fRatio <= vCoRatio && vCoHeight < pAnc.fDefHeight) vNewHeight = vCoHeight;
		if (pAnc.fRatio >= vCoRatio && vCoWidth < pAnc.fDefWidth) vNewWidth = vCoWidth;
		vImg.style.width = (vNewWidth>0 ? scCoLib.toInt(vNewWidth)+"px" : "auto");
		vImg.style.height = (vNewHeight>0 ? scCoLib.toInt(vNewHeight)+"px" : "auto");
		var vImgHeight = pAnc.fCurrHeight = scCoLib.toInt(vNewHeight > 0 ? vNewHeight : vNewWidth > 0 ? vNewWidth/pAnc.fRatio : pAnc.fDefHeight);
		var vImgWidth = pAnc.fCurrWidth = scCoLib.toInt(vNewWidth > 0 ? vNewWidth : vNewHeight > 0 ? vNewHeight*pAnc.fRatio : pAnc.fDefWidth);
		vCo.style.width = vImgWidth+"px";
		vCo.style.height = vImgHeight+"px";
		vCo.style.top="0" + pAnc.fDeltaTop + "px";
		vCo.style.left="0" + pAnc.fDeltaWidth / 2 + "px";
		// TODO mag - a voir
		// if (pAnc.fOpts.mag){
		// 	var vMag = vImg.fMag;
		// 	vMag.fEnabled = vImgWidth < pAnc.fDefWidth;
		// 	vMag.fWidth = scCoLib.toInt(vImgWidth * pAnc.fOpts.magScale);
		// 	vMag.fHeight = scCoLib.toInt(vImgHeight * pAnc.fOpts.magScale);
		// 	vMag.style.width = vMag.fWidth+"px";
		// 	vMag.style.height = vMag.fHeight+"px";
		// }
		vFra.style.width = vImgWidth+"px";
		vFra.style.height = vImgHeight+"px";
		vFra.style.top = scCoLib.toInt((vCoHeight - vImgHeight) / 2 + (scImageMgr.xMobileCheck() ? 0 : scImageMgr.fDeltaGalleryTop) / 2) + "px";
		vFra.style.left = scCoLib.toInt((vCoWidth - vImgWidth) / 2 + (scImageMgr.xMobileCheck() ? 0 : scImageMgr.fDeltaGalleryLeft) / 2) + "px";
		document.body.classList.remove("imgLoading");
		scImageMgr.xUpdateSsFraRoot(scImageMgr.fCurrItem, pAnc);

	} catch(e){
		scCoLib.log("scImageMgr.xRedrawSs::Error : "+e);
	}
}
scImageMgr.xUpdateSsFraRoot = function(pAlbFra, pAnc) {
	pAnc.fFraRoot.style.width = pAnc.fFra.clientWidth + "px";
	pAnc.fFraRoot.style.height = pAnc.fFra.clientHeight + "px";
	pAnc.fFraRoot.style.marginTop = pAnc.fFra.offsetTop + "px";
	pAnc.fFraRoot.style.marginLeft = pAnc.fFra.offsetLeft + "px";
	pAlbFra.fSsTbr.style.display = "";
}
scImageMgr.xAutoSs = function() {
	if (scImageMgr.fCurrItem){
		if (scImageMgr.fCurrItem.fSsAutoPly){
			scImageMgr.xNxtSs(scImageMgr.fCurrItem);
			if (scImageMgr.fCurrItem.fSsHasNxt) scImageMgr.fCurrItem.fNxtSsProc = window.setTimeout(scImageMgr.xAutoSs, scImageMgr.fCurrItem.fSsStep);
		}
	}
}
scImageMgr.switchSsTask = {
	fIdx: -1,
	fRateOld: [.9, .8, .7, .6, .5, .4, .3, .2, .1],
	fRateNew: [.1, .2, .3, .4, .5, .6, .7, .8, .9],
	execTask : function(){
		while(this.fEndTime < (Date.now ? Date.now() : new Date().getTime()) && this.fIdx < this.fRateOld.length) {
			this.fIdx++;
			this.fEndTime += 100;
		}
		this.fIdx++;
		this.fEndTime += 100;
		if(this.fIdx >= this.fRateOld.length) {
			if (this.fAlbFra.fCurrSsAnc) scImageMgr.xSetOpacity(this.fAlbFra.fSsImgFras[this.fAlbFra.fCurrSsAnc.fIdx],0);
			if (this.fAlbFra.fCurrSsAnc && this.fAlbFra.fCurrSsAnc.fIdx != this.fNewAnc.fIdx) this.fAlbFra.fSsImgFras[this.fAlbFra.fCurrSsAnc.fIdx].style.visibility = "hidden";
			scImageMgr.xSetOpacity(this.fAlbFra.fSsImgFras[this.fNewAnc.fIdx],1);
			this.fAlbFra.fCurrSsAnc = this.fNewAnc;
			this.fIsRunning = false;
			return false;
		}
		if (this.fAlbFra.fCurrSsAnc) scImageMgr.xSetOpacity(this.fAlbFra.fSsImgFras[this.fAlbFra.fCurrSsAnc.fIdx], this.fRateOld[this.fIdx]);
		scImageMgr.xSetOpacity(this.fAlbFra.fSsImgFras[this.fNewAnc.fIdx], this.fRateNew[this.fIdx]);
		return true;
	},

	terminate : function(){
		this.fIdx = this.fRateOld.length;
		this.execTask();
	},
	initTask : function(pAlbFra,pNewAnc){
		this.fAlbFra = pAlbFra;
		if (this.fIsRunning) this.terminate();
		this.fNewAnc = pNewAnc;
		scImageMgr.xSetOpacity(this.fAlbFra.fSsImgFras[this.fNewAnc.fIdx],0);
		this.fAlbFra.fSsImgFras[this.fNewAnc.fIdx].style.visibility = "";

		this.fEndTime = ( Date.now  ? Date.now() : new Date().getTime() ) + 100;
		this.fIdx = -1;
		this.fIsRunning = true;
	}
}

/* === Tasks ================================================================ */
scImageMgr.fadeInTask = {
	fIdx: -1,
	fRate: [.1, .2, .3, .4, .5, .6, .7, .8, .9],
	execTask : function(){
		while(this.fEndTime < (Date.now ? Date.now() : new Date().getTime()) && this.fIdx < this.fRate.length) {
			this.fIdx++;
			this.fEndTime += 100;
		}
		this.fIdx++;
		this.fEndTime += 100;
		if(this.fIdx >= this.fRate.length) {
			scImageMgr.xSetOpacity(this.fObj.fOver,scImageMgr.fOverAlpha);
			scImageMgr.xSetOpacity(this.fObj.fCvs,1);
			return false;
		}
		scImageMgr.xSetOpacity(this.fObj.fOver, Math.min(this.fRate[this.fIdx], scImageMgr.fOverAlpha));
		scImageMgr.xSetOpacity(this.fObj.fCvs, this.fRate[this.fIdx]);
		return true;
	},
	terminate : function(){
		this.fIdx = this.fRate.length;
		this.execTask();
	},
	initTask : function(pObj){
		this.fObj = pObj;
		this.fEndTime = ( Date.now  ? Date.now() : new Date().getTime() ) + 100;
		scImageMgr.xSetOpacity(this.fObj.fOver, .0);
		scImageMgr.xSetOpacity(this.fObj.fCvs, .0);
		this.fObj.fOver.style.display = "";
		this.fObj.fOver.style.height = "100%";
		this.fObj.fOver.style.width = "100%";
		this.fObj.fCvs.style.display = "";
		this.fIdx = -1;
	}
}
scImageMgr.fadeOutTask = {
	fIdx: -1,
	fRate: [.8, .6, .4, .3, .2, .1],
	execTask : function(){
		while(this.fEndTime < (Date.now ? Date.now() : new Date().getTime()) && this.fIdx < this.fRate.length) {
			this.fIdx++;
			this.fEndTime += 100;
		}
		this.fIdx++;
		this.fEndTime += 100;
		if(this.fIdx >= this.fRate.length) {
			scImageMgr.xSetOpacity(this.fObj.fOver,0);
			scImageMgr.xSetOpacity(this.fObj.fCvs,0);
			this.fObj.fOver.style.display = "none";
			this.fObj.fCvs.style.display = "none";
			if (this.fObj.fCurrSsAnc) scImageMgr.xSetOpacity(this.fObj.fSsImgFras[this.fObj.fCurrSsAnc.fIdx],0);
			if (this.fObj.fCurrSsAnc) this.fObj.fSsImgFras[this.fObj.fCurrSsAnc.fIdx].style.visibility = "hidden";
			if (this.fEndFunc) this.fEndFunc();
			return false;
		}
		scImageMgr.xSetOpacity(this.fObj.fOver, Math.min(this.fRate[this.fIdx], scImageMgr.fOverAlpha));
		scImageMgr.xSetOpacity(this.fObj.fCvs, this.fRate[this.fIdx]);
		return true;
	},
	terminate : function(){
		this.fIdx = this.fRate.length;
		this.execTask();
	},
	initTask : function(pObj, pEndFunc){
		this.fObj = pObj;
		this.fEndFunc = pEndFunc;
		this.fEndTime = ( Date.now  ? Date.now() : new Date().getTime() ) + 100;
		this.fIdx = -1;
	}
}
/** scImageMgr.FadeEltTask : scTiLib task that fades a given element in or out.
 * @param pElt element to fade.
 * @param pDir fade direction : 0=out, 1=in.
 * @param pInstant optionnal parameter if true no animation.
 */
scImageMgr.FadeEltTask = function(pElt,pDir,pInstant){
	this.fRate = new Array();
	this.fRate[0] = [.9, .85, .8, .7, .6, .5, .4, .3, .2, .15, .1];
	this.fRate[1] = [.1, .15, .2, .3, .4, .5, .6, .7, .8, .85, .9];
	try{
		this.fElt = pElt;
		this.fDir = (pDir >= 1 ? 1 : 0);
		if (pInstant) {
			this.terminate();
			return;
		}
		if (this.fElt.fFadeTask) {
			this.fElt.fFadeTask.changeDir(this.fDir);
		} else {
			scImageMgr.xStartOpacityEffect(this.fElt, 1-this.fDir);
			this.fEndTime = ( Date.now  ? Date.now() : new Date().getTime() ) + 100;
			this.fIdx = -1;
			this.fElt.fFadeTask = this;
			scTiLib.addTaskNow(this);
		}
	}catch(e){scCoLib.log("ERROR scImageMgr.FadeEltTask: "+e);}
}
scImageMgr.FadeEltTask.prototype.execTask = function(){
	while(this.fEndTime < (Date.now ? Date.now() : new Date().getTime()) && this.fIdx < this.fRate[this.fDir].length) {
		this.fIdx++;
		this.fEndTime += 100;
	}
	this.fIdx++;
	this.fEndTime += 100;
	if(this.fIdx >= this.fRate[this.fDir].length) {
		scImageMgr.xEndOpacityEffect(this.fElt, this.fDir);
		this.fElt.fFadeTask = null;
		return false;
	}
	scImageMgr.xSetOpacity(this.fElt, this.fRate[this.fDir][this.fIdx]);
	return true;
}
scImageMgr.FadeEltTask.prototype.changeDir = function(pDir){
	var vDir = (pDir >= 1 ? 1 : 0)
	if (vDir != this.fDir) this.fIdx = this.fRate[this.fDir].length - this.fIdx - 1;
	this.fDir = vDir;
}
scImageMgr.FadeEltTask.prototype.terminate = function(){
	this.fIdx = this.fRate[this.fDir].length;
	this.execTask();
}

/* === Toolbox ============================================================== */
/** scImageMgr.xReadStyle : cross-browser css rule reader */
scImageMgr.xReadStyle = function(pElt, pProp) {
	try {
		var vVal = null;
		if (pElt.style[pProp]) {
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
}
/** scImageMgr.xGetEltTop. */
scImageMgr.xGetEltTop = function(pElt, pRoot) {
	var vY;
	var vRoot = pRoot || null;
	vY = scCoLib.toInt(pElt.offsetTop);
	if (pElt.offsetParent != vRoot && pElt.offsetParent.tagName.toLowerCase() != 'body' && pElt.offsetParent.tagName.toLowerCase() != 'html') {
		vY -= pElt.offsetParent.scrollTop;
		vY += this.xGetEltTop(pElt.offsetParent, vRoot);
	}
	return vY;
}
/** scImageMgr.xGetEltLeft. */
scImageMgr.xGetEltLeft = function(pElt, pRoot) {
	var vX;
	var vRoot = pRoot || null;
	vX = scCoLib.toInt(pElt.offsetLeft);
	if (pElt.offsetParent != vRoot && pElt.offsetParent.tagName.toLowerCase() != 'body' && pElt.offsetParent.tagName.toLowerCase() != 'html') {
		vX -= pElt.offsetParent.scrollLeft;
		vX += this.xGetEltLeft(pElt.offsetParent, vRoot);
	}
	return vX;
}
/** scImageMgr.xGetEltWidth. */
scImageMgr.xGetEltWidth = function(pElt) {
	return(scCoLib.toInt(pElt.style.pixelWidth || pElt.offsetWidth)+(this.fNavie? (scCoLib.toInt(pElt.currentStyle.borderRightWidth)+scCoLib.toInt(pElt.currentStyle.borderLeftWidth)):0));
}
/** scImageMgr.xGetEltHeight. */
scImageMgr.xGetEltHeight = function(pElt) {
	return(scCoLib.toInt(pElt.style.pixelHeight || pElt.offsetHeight)+(this.fNavie? (scCoLib.toInt(pElt.currentStyle.borderTopWidth)+scCoLib.toInt(pElt.currentStyle.borderBottomWidth)):0));
}
/** scImageMgr.xPageHeight. */
scImageMgr.xPageHeight = function() {
	if(this.fPgeFra){
		if(this.fPgeFra.offsetHeight) return this.fPgeFra.offsetHeight + this.xGetEltTop(this.fPgeFra) + scCoLib.toInt(this.xReadStyle(this.fPgeFra, "marginBottom"));
		else if(this.fPgeFra.clientHeight) return this.fPgeFra.clientHeight + this.xGetEltTop(this.fPgeFra) + scCoLib.toInt(this.xReadStyle(this.fPgeFra, "marginBottom"));
	}
}
/** scImageMgr.xPageWidth. */
scImageMgr.xPageWidth = function() {
	if(this.fPgeFra){
		if(this.fPgeFra.offsetWidth) return this.fPgeFra.offsetWidth + this.xGetEltLeft(this.fPgeFra) + scCoLib.toInt(this.xReadStyle(this.fPgeFra, this.fMarginEnd));
		else if(this.fPgeFra.clientWidth) return this.fPgeFra.clientWidth + this.xGetEltLeft(this.fPgeFra) + scCoLib.toInt(this.xReadStyle(this.fPgeFra, this.fMarginEnd));
	}
}
/** scImageMgr.xClientHeight. */
scImageMgr.xClientHeight = function() {
	if (document.documentElement) {
		return document.documentElement.clientHeight;
	} else if (window.innerHeight >= 0) {
		return window.innerHeight;
	} else if (this.fDisplayRoot.clientHeight >= 0) {
		return this.fDisplayRoot.clientHeight;
	} else {
		return 0;
	}
}
/** scImageMgr.xClientWidth. */
scImageMgr.xClientWidth = function() {
	if (document.documentElement) {
		return document.documentElement.clientWidth;
	} else if (window.innerWidth >= 0) {
		return window.innerWidth;
	} else if (this.fDisplayRoot.clientWidth >= 0) {
		return this.fDisplayRoot.clientWidth;
	} else {
		return 0;
	}
}
/** scImageMgr.xNotifyListeners - calls all the listeners of a given type. */
scImageMgr.xNotifyListeners = function(pType,pRes) {
	var vListener = scImageMgr.fListeners[pType];
	for(var i=0; i<vListener.length; i++) {
		try {
			vListener[i](pRes);
		} catch(e) {scCoLib.log("ERROR scImageMgr.xNotifyListeners: "+e);}
	}
}
/** scImageMgr.xAddSep : Add a simple textual separator : " | ". */
scImageMgr.xAddSep = function(pParent){
	var vSep = document.createElement("span");
	vSep.className = "scImgSep";
	vSep.innerHTML = " | "
	pParent.appendChild(vSep);
}
/** scImageMgr.xAddBtn : Add a HTML button to a parent node. */
scImageMgr.xAddBtn = function(pParent,pObj,pType,pName,pCapt,pTitle,pNoCmd){
	var vBtn = scDynUiMgr.addElement("a", pParent, pObj.fOpts.clsPre+pName);
	vBtn.fName = pType+pName;
	vBtn.href = "#";
	vBtn.target = "_self";
	vBtn.setAttribute("role", "button");
	if (!pNoCmd) {
		vBtn.onclick=function(){return scImageMgr.xBtnMgr(this);}
		vBtn.onkeydown=function(pEvent){scDynUiMgr.handleBtnKeyDwn(pEvent);}
		vBtn.onkeyup=function(pEvent){scDynUiMgr.handleBtnKeyUp(pEvent);}
	}
	vBtn.setAttribute("title",pTitle);
	vBtn.innerHTML="<span>"+pCapt+"</span>"
	vBtn.fObj = pObj;
	pParent.appendChild(vBtn);
	return vBtn;
}
/** scImageMgr.xTogglePageFocus : */
scImageMgr.xToggleFocusables = function() {
	if (!this.fFocus) return;
	if (this.fFocusablesDisabled && this.fFocusables){
		for (var i=0; i<this.fFocusables.length; i++){
			var vElt = this.fFocusables[i];
			vElt.setAttribute("tabindex", vElt.fscImageMgrTabIndex || "");
			vElt.fscImageMgrTabIndex = null;
		}
		this.fFocusablesDisabled = false;
	} else {
		this.fFocusables = scPaLib.findNodes(this.fPathFocusables, this.fSourceRoot);
		for (var i=0; i<this.fFocusables.length; i++){
			var vElt = this.fFocusables[i];
			if (this.fCurrItem && !this.xIsEltContainedByNode(vElt,this.fCurrItem.fCvs)) {
				vElt.fscImageMgrTabIndex = vElt.getAttribute("tabindex");
				vElt.setAttribute("tabindex", "-1");
			}
		}
		this.fFocusablesDisabled = true;
	}
}
/** scImageMgr.xFocus : */
scImageMgr.xFocus = function(pNode) {
	if (this.fFocus && pNode) try{pNode.focus();}catch(e){};
}
/** imgZoomMgr.xGetEvt : cross-browser event retreiver */
scImageMgr.xGetEvt = function(pEvt) {
	var vEvt = pEvt || window.event;
	if (vEvt.srcElement && !vEvt.target) vEvt.target = vEvt.srcElement;
	return(vEvt);
}
/** scImageMgr.xIsVisible : */
scImageMgr.xIsVisible = function(pNode) {
	var vAncs = scPaLib.findNodes("anc:", pNode);
	for(var i=0; i<vAncs.length; i++) if (vAncs[i].nodeType == 1 && scImageMgr.xReadStyle(vAncs[i],"display") == "none") return false;
	return true;
}
/** scImageMgr.xIsEltContainedByNode : */
scImageMgr.xIsEltContainedByNode = function(pElt, pContainer) {
	var vElt = pElt;
	var vFound = false;
	if (vElt) {
		while (vElt.parentNode && !vFound) {
			vElt = vElt.parentNode;
			vFound = vElt == pContainer;
		}
	}
	return(vFound);
}
/** scImageMgr.xGetStr : Reteive a string. */
scImageMgr.xGetStr = function(pStrId) {
	return (this.fLocalize ? this.fStrings[pStrId] : "");
}
/** scImageMgr.xSwitchClass : Replace a CSS class. */
scImageMgr.xSwitchClass = function(pNode, pClassOld, pClassNew) {
	if (pClassOld && pClassOld != '') {
		var vCurrentClasses = pNode.className.split(' ');
		var vNewClasses = new Array();
		var vClassFound = false;
		for(var i=0, n=vCurrentClasses.length; i<n; i++) {
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
/** Set the opacity of a given node.
 * @param pRate Variable de 0 à 1.
 */
scImageMgr.xSetOpacity = function(pNode, pRate){
	if(!this.fNavie8) pNode.style.opacity = pRate;
	else pNode.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity="+pRate*100+")";
}
/** Start the opacity of a given node.
 * On ajoute le filtre d'opacité sur IE.
 * On place le node en visibility: "".
 * @param pRate 2 valeurs possibles: 0 (invisible) ou 1 (visible).
 */
scImageMgr.xStartOpacityEffect = function(pNode, pRate){
	if(!this.fNavie8) pNode.style.opacity = pRate;
	else pNode.style.filter = pRate==1 ? "progid:DXImageTransform.Microsoft.Alpha(opacity=100)" : "progid:DXImageTransform.Microsoft.Alpha(opacity=0)";
	pNode.style.visibility = "";
}
/** End the opacity of a given node.
 * On supprime le filtre d'opacité sur IE (évite des bugs de refresh).
 * On place le node en visibility: hidden.
 * @param pRate 2 valeurs possibles: 0 (invisible) ou 1 (visible).
 */
scImageMgr.xEndOpacityEffect = function(pNode, pRate){
		if(!this.fNavie8) pNode.style.opacity = pRate;
		else pNode.style.removeAttribute("filter");
	if(pRate == 0) pNode.style.visibility = "hidden";
	else pNode.style.visibility = "";
}
scImageMgr.xMobileCheck = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
  };
scImageMgr.loadSortKey = "ZZZ";
