// Skin specific Javascript code - use sparingly and with caution
(function (){
    if (scPaLib.checkNode(".tplGuide", sc$("page"))) {
        const vDefaultMenuOpen = "false";
        let vMenuOpen = localStorage.getItem("menuActive");
        if (vMenuOpen === null) vMenuOpen = vDefaultMenuOpen;
        document.body.fMenu = vMenuOpen === "true";
        const vBtn = scDynUiMgr.addElement("button", sc$("header"), "showMenu");
        vBtn.onclick = function(){
            if (document.body.fMenu){
                document.body.classList.remove("menuActive");
                document.body.classList.add("menuInactive");
                this.setAttribute("title",  outMgr.fStrings[4].split(" '%s'")[0]);
            } else {
                document.body.classList.add("menuActive");
                document.body.classList.remove("menuInactive");
                this.setAttribute("title",  outMgr.fStrings[5].split(" '%s'")[0]);
            }
            document.body.fMenu = !document.body.fMenu;
            if(responsive.getColumns() === 2) localStorage.setItem("menuActive", document.body.fMenu);
        }
        vBtn.innerHTML = '<span>☰</span>';
        if (document.body.fMenu){
            document.body.classList.add("menuActive");
            vBtn.setAttribute("title",  outMgr.fStrings[5].split(" '%s'")[0]);
        }else{
            document.body.classList.add("menuInactive");
            vBtn.setAttribute("title",  outMgr.fStrings[4].split(" '%s'")[0]);
        }

        responsive.registerListener("layoutChange", function(pNumCols){
            if (pNumCols === 1){
                document.body.classList.add("oneColumn");
                document.body.classList.remove("twoColumn");
                if (document.body.fMenu){
                    document.body.fMenu = false;
                    document.body.classList.remove("menuActive");
                    document.body.classList.add("menuInactive");
                }
            } else {
                document.body.classList.remove("oneColumn");
                document.body.classList.add("twoColumn");
                if (!document.body.fMenu && localStorage.getItem("menuActive")==="true"){
                    document.body.fMenu = true;
                    document.body.classList.add("menuActive");
                    document.body.classList.remove("menuInactive");
                }
            }
        });
    }
})();
// Sommaire de page se réduit au scroll
(function (){
    responsive.registerListener("scrollChange", function(pOffset){
        if (tplMgr.fSecOutCo && !tplMgr.fSecOutCo.fCollapsed) tplMgr.fSecOutBtn.click();
    });
})();