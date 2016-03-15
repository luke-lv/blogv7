/**
 * @fileoverview
 *	相册专辑详情页的组件渲染
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
$import("lib/component/class/_class.js");
$import("lib/component/class/registComp.js");
$import("lib/component/renderControl/renderByList.js");

// 具体的组件类
$import("component/comp_47.js");
$registJob("Comp_render", function () {
	Lib.Component.compSize = {
		"47"	: 210
	};
	Lib.Component.renderByList([47]);
});