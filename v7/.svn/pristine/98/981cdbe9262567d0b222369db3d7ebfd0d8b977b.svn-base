/**
 * @fileoverview more浮层
 * @author dcw1123@staff.sina.com.cn
 */
$import("sina/core/class/define.js");

$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("articleManage/ArticleMange.js");
$import("msg/articleManageMSG.js");
$import("msg/blogSystemMSG.js");

$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/system/br.js");

$import("sina/core/array/foreach.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/events/stopEvent.js");

$import("sina/ui/tween.js");

App.moreLayer = function (sAid, evt) {
    // 	var more = $E("a_more_" + sAid);
    // var more_em = more.getElementsByTagName("em")[0];
    // var evtTar = Core.Events.getEventTarget(evt);
    // var moreLayer = $E("a_layer_" + sAid);
    // if((more == evtTar) || (more_em == evtTar)){
    // 	evt = Core.Events.fixEvent(evt);
    // 	if($IE6 || $IE7){		//IE8 竟然变好了……
    // 		evt.pageX = evt.pageX + document.documentElement.scrollLeft;
    // 		evt.pageY = evt.pageY + document.documentElement.scrollTop;
    // 	}
    // 	moreLayer.style.left = evt.pageX-53+"px";
    // 	moreLayer.style.top = evt.pageY+7+"px";
    // 	moreLayer.style.display = "";
    // }else{
    // 	moreLayer.style.display = "none";
    // }

    var beHidLayer = "";
    var beVisLayer = "";
    var beVisMore = "";

    if (!scope.moreLayerId) scope.moreLayerId = [0, 0];
    scope.moreLayerId.push(sAid);
    scope.moreLayerId.shift();

    beHidLayer = $E("a_layer_" + scope.moreLayerId[0]);
    beVisMore = $E("a_more_" + scope.moreLayerId[1]);
    beVisLayer = $E("a_layer_" + scope.moreLayerId[1]);
    beVisLayer.style.left = Core.Dom.getLeft(beVisMore) - 30 + "px";
    beVisLayer.style.top = Core.Dom.getTop(beVisMore) + beVisMore.offsetHeight + "px";

    if (beHidLayer) beHidLayer.style.display = "none";

    beVisLayer.style.height = '80px';
    beVisLayer.style.display = "";
    //new Ui.tween(beVisLayer, ["height"], [80], 0.4, "strongEaseOut", function(){
    //
    //});

    beVisLayer.onmouseout = (function (ele) {
        return function (e) {
            e = e || window.event;
            //var src = e.target || e.srcElement;
            var src = e.relatedTarget || e.toElement;
            if ($FF) {
                if (!isChildNodes(ele, src)) {
                    ele.style.display = 'none';
                }
            } else {
                if (!ele.contains(src)) {
                    ele.style.display = 'none';
                }
            }
        }
    })(beVisLayer);

    function isChildNodes(ele, src) {
        if (ele.hasChildNodes()) {
            var children = ele.childNodes;
            for (var i = 0; children[i]; i++) {
                if (isChildNodes(children[i], src)) {
                    return true;
                }
            }
        }
        return ele == src;
    }
};



