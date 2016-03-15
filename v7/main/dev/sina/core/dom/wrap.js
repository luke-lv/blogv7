$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
$import("sina/core/dom/insertAfter.js");
/**
 * 使用设定的标签包容指定节点
 * @param {Object} elm
 * @param {Object} tagName
 */
Core.Dom.wrap = function(elm, tagName) {
	var wrapper = $C(tagName);
	Core.Dom.insertAfter(wrapper, elm);
	wrapper.appendChild(elm);
	return wrapper;
};
