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
	if(scope.$uid=="1513474044"||scope.$uid=="1632440911"||scope.$uid=="1311747503"||scope.$uid=="1374847633"||scope.$uid=="1265252974"||scope.$uid=="1218670734"||scope.$uid=="1156966391"){
		Utils.Io.JsLoad.request("http://sjs.sinajs.cn/blog7activity/zoneStatic.js", {
                isRemove : false,
				onComplete	:	function (){
					if (typeof zoneStatic=="function") {
						zoneStatic();
					}
					if(typeof traceFunction=="function"){
						traceFunction();
					}
				},
				noreturn	: true
		});
	}
});