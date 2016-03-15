/**
 * @fileoverview
 *	通过简易方式快速扩展一个动态组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2009.08.10
 * @history
 * 
 */
$import("lib/component/class/_class.js");
$import("sina/core/class/define.js");
/**
 * 快速创建一个无需接口请求的动态组件
 * @param {String} id			新组件 ID
 * @param {JsonObject} override	需要扩展的方法
 * @param {Object} superClass	被继承组件的 ID
 */
$registComp = Lib.Component.registComp = function (id, override, superClass) {
//	Debug.info(id + " is extend form " + superClass);
	superClass = (superClass == null) ? Lib.Component.Comp : Lib.Component["Comp_" + superClass];
	superClass = superClass || Lib.Component.Comp;
	override.compId = id;
	Lib.Component["Comp_" + id] = Core.Class.define(null, superClass, override);
};