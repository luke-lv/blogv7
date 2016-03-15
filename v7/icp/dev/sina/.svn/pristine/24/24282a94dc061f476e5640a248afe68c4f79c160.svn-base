/**
 * @fileoverview dom api
 * @date 2012-04-16
 * @author Qiangyee | wangqiang1@staff
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * 从源节点指定的方向搜索元素，如果没有找到，返回null
 * @method
 * @param  {HTMLElement} element 源节点
 * @param  {String} direction 遍历的方向名称，取值为previousSibling,nextSibling
 * @param  {String} start 遍历的开始位置，取值为firstChild,lastChild,previousSibling,nextSibling
 * @return {HTMLElement} nodeType为1的dom节点
 */
Core.Dom.findNode = function(element, direction, start) {
	for (var node = element[start]; node; node = node[direction]) {
		if (node.nodeType == 1) {
			return node;
		}
	}
	return null;
};