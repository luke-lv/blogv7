/**
 * @fileoverview 页面设置上方提示小黄条
 * @author dg.liu | donggguang@staff.sina.com.cn
 * @created 2010-04-21
 *
 */
$import("sina/sina.js");

$import("lib/jobs.js");
$import("lib/component/tip/tip.js");
$import("component/include/cloneComponent.js");

$registJob("modify_tip", function () {
	scope.tip=new Lib.Tip($E("sinablogb"));
});
