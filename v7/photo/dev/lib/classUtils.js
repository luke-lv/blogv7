/*
 @info		css class 相关的工具，建议用于 MixPrototype
 @usage		oop.js 中定义的 $mixProto 方法： function(){}.$mixProto(Lib.classUtils);
 @author	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/lib.js");
$import("sina/core/string/trim.js");


Lib.classUtils = function(){};


// 为节点添加 class，若有就不加，class 不重复。
Lib.classUtils.prototype.addClass = function(dom, clz){
	if(!dom){ return false; }
	if(!this.hasClass(dom, clz)){
		dom.className = Core.String.trim(dom.className.concat(" " + clz));
	}
};


// 被指定的 class 将全部删除，保证该 class 不会存在。
// ( +|^)clz(?=( |$))。
Lib.classUtils.prototype.delClass = function(dom, clz){
	if(!dom){ return false; }
	var reg = new RegExp("( +|^)" + clz + "(?=( |$))", "ig");
	dom.className = Core.String.trim(dom.className.replace(reg, ""));
};


// 该节点是否有指定的 class
Lib.classUtils.prototype.hasClass = function(dom, clz){
	if(!dom){ return false; }
	var reg = new RegExp("( +|^)" + clz + "(?=( |$))", "ig");
	return reg.test(dom.className);
};


