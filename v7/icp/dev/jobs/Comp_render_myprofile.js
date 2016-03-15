/**
 * @fileoverview
 *	我的档案页——个人资料组件渲染
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
$import("component/comp_901_myprofile.js");
$import("component/comp_994.js");
$registJob("Comp_render", function () {
	Lib.Component.compSize = {
		"901"	: 210,
		"994"	: 210
	};
	Lib.Component.renderByList([901, 994]);
});