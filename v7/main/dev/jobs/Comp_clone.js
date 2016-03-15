/**
 * @fileoverview
 *	组件克隆功能
 	查找页面上，所有 class=SG_comClone 的 A link，这个 class 表示这是一个组件克隆链接
 	给这样链接绑定 onclick 事件，用于执行克隆组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/array/foreach.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/up.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");

$import("lib/jobs.js");

$import("component/include/cloneComponent.js");

$registJob("Comp_clone", function () {
	// 扫描所有 class=SG_comClone 的 A 链接，并获得组件 ID 及宽度
	// 并给该链接绑定组件克隆的事件，参数为组件 ID 及宽度
	var cloneLinks = Core.Dom.getElementsByClass(document.body, "a", "SG_comClone");
	if(cloneLinks.length > 0){
		Core.Array.foreach(cloneLinks, function (x) {
			var comp_cnt = Core.Dom.up(x, "SG_conn");
			if(comp_cnt != null){
				var comp_id = comp_cnt.id.replace("module_", "");
				var size = comp_cnt.parentNode.className.substr(7, 2);
				Core.Events.addEvent(x , Core.Function.bind3(Lib.Component.clone, null, [comp_id, size]));
			}
		});
	}
});
