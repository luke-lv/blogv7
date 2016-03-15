$import("sina/core/dom/byClass.js");
$import("sina/core/dom/getChildrenByClass.js");

$import("lib/util/hoverJq.js");

/**
 * @fileoverview 显示小图片cover
 *
 * @create 2010-12-05
 * @author Qiangyee
 */
$registJob("showCover", function(){
    // 获取top和left值
    var getTL = function(relativeEl, absoluteEl){
        var cHeight = absoluteEl.offsetHeight;
        var cWidth  = absoluteEl.offsetWidth;
        
        var pHeight = relativeEl.offsetHeight;
        var pWidth  = relativeEl.offsetWidth;
        var left = (pWidth - cWidth)/2;
        var top = (pHeight - cHeight)/2 - 10;

        return {
            top  : top  < 0 ? 0 : top,
            left : left < 0 ? 0 : left
        };
    }
    
    var _byCs = Core.Dom.byClass
    var _getChildrenByCls = Core.Dom.getChildrenByClass;
    var main = _byCs("groudmain", "div", document.body)[0];
    var list = _getChildrenByCls(main, "piclist");
    var pics = [];
    for (var i = 0, len = list.length; i < len; i++) {
        var lis = $T(list[i], "li");
        for (var j = 0; j < lis.length; j++) {
            pics.push(lis[j]);
        }
    }

    Lib.util.hoverJq({
        'elm': pics,
        'mouseenter': function(e, el, index) {
            var cover = _byCs("picboxtxt", "div", el)[0];
            cover.style.display = "";
            var tl = getTL(el, cover);

            cover.style.top = tl.top+'px';
            cover.style.left = tl.left+'px';

        },
        'mouseleave': function(e, el, index) {
            var cover = _byCs("picboxtxt", "div", el)[0];
            cover.style.display = "none";
        },
        'delay': 60
    });

    pics = null;
    list = null;
    main = null;
});
