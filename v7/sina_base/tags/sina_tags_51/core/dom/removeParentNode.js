$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
$import("sina/core/dom/insertAfter.js")
/**
 * @id Core.Dom.removeNode
 * 删除指定节点的父节点
 * @method Core.Dom.removeNode
 * @param {String | HTMLElement} node 被删除的对象ID或者对象本身
 * @author Stan | chaoliang@staff.sina.com.cn 
 */
Core.Dom.removeParentNode = function(node){
	node = $E(node);
	var parentNode = node.parentNode;
	Core.Dom.insertAfter(node, parentNode);
	parentNode.parentNode.removeChild(parentNode);
};