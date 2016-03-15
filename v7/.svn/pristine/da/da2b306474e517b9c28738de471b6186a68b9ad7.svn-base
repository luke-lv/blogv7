/**
 * @fileoverview 页面区域统计分析
 * @author xy xinyu@staff.sina.com.cn
 * @date 2011-01-13
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/system/winSize.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/system/getScrollPos.js");
$import("lib/LocalDB.js");

$registJob("toZoneStatic", function(){
	if(scope.$uid%2==0){
		Utils.Io.JsLoad.request("http://sjs.sinajs.cn/blog7activity/zoneStatic.js", {
				onComplete	:	function (){
					if (typeof zoneStatic=="function") {
						zoneStatic();
					}
					if(typeof traceFunction=="function"){
						traceFunction();
					}
				},
				noreturn	: true
                ,isRemove : false
		});
	}
});