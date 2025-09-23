// Skin specific Javascript code - use sparingly and with caution
// Sommaire de page se réduit au scroll
(function (){
    responsive.registerListener("scrollChange", function(pOffset){
        if (tplMgr.fSecOutCo && !tplMgr.fSecOutCo.fCollapsed) tplMgr.fSecOutBtn.click();
    });
})();