$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * 向上寻找指定className的节点
 * @id Core.Dom.previous
 * @param {Element} elm 元素id或引用
 * @param {String} className 样式名
 * @return {Element} 符合条件的节点
 */
Core.Dom.previous = function(elm, _className) {
	var o = $E(elm);
	if (o == o.parentNode.firstChild) {
		return null;
	}
	var prev = o.previousSibling;
	if(prev.nodeType != 1){
		return Core.Dom.previous(prev, _className);
	}
	if(new RegExp("\\b" + _className + "\\b").test(prev.className)) {
		return prev;
	}else{
		return Core.Dom.previous(prev, _className);
	}
};