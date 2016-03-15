/**
 * @fileoverview 不同feed分类,下拉列表位置渲染
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created  2012-11-19
 * @vertion 0.01
 */
$import("mojie/_mojie.js");
$import("sina/core/dom/getXY.js");

Mojie.feedTypeList = function(x1, x2, x3){
    var dropNode = $E("allfeed"), subtype = $E("subtype");
    if(dropNode){
        var allBtn = Core.Dom.getXY(dropNode);
    }
    if(subtype){
        subtype.style.position = "absolute";
    }
    if($IE6 || $IE7 || (document.documentMode && document.documentMode === 7)){
        subtype.style.top = allBtn[1] + x3 + "px";
        subtype.style.left = allBtn[0] - 2 + "px";
    }else if($IE8 && document.documentMode > 7){
        subtype.style.top = allBtn[1] + x2 + "px";
        subtype.style.left = allBtn[0] + "px";
    }else{
        subtype.style.top = allBtn[1] + x1 + "px";//25
        subtype.style.left = allBtn[0] + 1 + "px";
    }
};
