/**
 * @fileoverview dom api
 * @date 2012-04-16
 * @author Qiangyee | wangqiang1@staff
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
$import("sina/core/dom/findNode.js");
/**
 * 获取源节点的下一个兄弟元素节点，查找不到时返回null
 * @method
 * @param  {HTMLElement} srcEl 源节点
 * @return {HTMLElement} el    源节点的下一个nodeType为1的节点，去除了#text、#comment
 */
Core.Dom.nextNode = function (srcEl) {
	return Core.Dom.findNode(srcEl, 'nextSibling', 'nextSibling');
};