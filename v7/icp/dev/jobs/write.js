/**
 * @fileoverview feed分类下拉菜单
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created  2012-11-13
 * @vertion 0.01
 */
$import("sina/ui/slide.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopBubble.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getXY.js");
$import("sina/utils/cookie/getCookie.js");
$import('mojie/slideShow.js');
$import('mojie/feedTypeList.js');
$import("lib/jobs.js");

$registJob("write", function(){
    var dropNode = $E("allfeed"), subtype = $E("subtype"), guanboWrap = $E('guanbofeedout');;
    var allBtn, cver;
    var guanbofeed = Utils.Cookie.getCookie('guanbofeedver'+scope.$uid);
    //判断guanbofeed是否显示，来定位下拉菜单的位置
    // if(!!guanbofeed) {
    //     if(guanboWrap){
    //         cver = guanboWrap.getAttribute('ver');
    //     }
    //     if(cver && cver === guanbofeed) {
    //         Mojie.feedTypeList(24, 23, 21);
    //     }else{
    //         Mojie.feedTypeList(24, 23, 21);
    //     }
    // }else{
    //     Mojie.feedTypeList(24, 23, 21); 
    // }

    Mojie.feedTypeList(24, 23, 21);
    
	if(dropNode != null){
		Core.Events.addEvent(dropNode, function(){
            if(subtype.style.display === ""){
                return;
            }else{
                //在mouseover的时候重新判断下拉浮层位置
                Mojie.feedTypeList(24, 23, 21);
                Mojie.slideShow(subtype, 0, 190);
            }
		}, "mouseover");
	}
	Core.Events.addEvent(dropNode, function(e){ Core.Events.stopEvent(e);});
    Core.Events.addEvent("subtype", function(){
        Core.Events.stopBubble();
        setTimeout(function(){
            Mojie.slideShow(subtype, 180,0);
        }, 300);
    }, "mousedown");
    Core.Events.addEvent(document.body, function(){
        Mojie.slideShow(subtype, 190,0);
    }, "mousedown");   
});
