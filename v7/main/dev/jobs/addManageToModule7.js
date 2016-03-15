/**
 * @fileoverview
 *	博文列表页，给分类组件的管理增加链接的事件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");

$import("lib/jobs.js");

$registJob("addManageToModule7", function () {
	var comp = $E("module_7");
	if (comp) {
		var editNode = Core.Dom.getElementsByClass(comp, "span", "edit");
		if (editNode && comp.getAttribute("binded") == null) {
			var a = $T(editNode[0], 'a')[0];
			Core.Events.addEvent(a, function(){
				window.CateDialog.show();
			});
			comp.setAttribute("binded", true);
		}
	}
});
