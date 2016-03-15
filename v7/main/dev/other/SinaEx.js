/** 
 * @fileoverview 对新浪包的一些扩展或优化，觉得常用而新浪包又没有的请自己添加到这里
 * @author Book | liming9@staff.sina.com.cn
 * @version 31 | 2011-08-17
 * @importcopy $import("other/SinaEx.js");
 */
//$import("sina/sina.js");
/**
 * 扩展包命名空间
 * @namespace SinaEx
 */
if (typeof SinaEx === "undefined") {
	SinaEx = {};
}
/**
 * 从源节点指定的方向搜索元素，如果没有找到，返回null
 * @method
 * @param {HTMLElement} element 源节点
 * @param {String} direction 遍历的方向名称，取值为previousSibling,nextSibling
 * @param {String} start 遍历的开始位置，取值为firstChild,lastChild,previousSibling,nextSibling
 * @type HTMLElement
 */
SinaEx.findNode = function(element, direction, start) {
	for (var node = element[start]; node; node = node[direction]) {
		if (node.nodeType == 1) {
			return node;
		}
	}
	return null;
};

/**
 * 获取源节点的上一个兄弟元素节点，查找不到时返回null
 * @method
 * @param {HTMLElement} element 源节点
 * @type HTMLElement
 */
SinaEx.prev = function (element) {
	return SinaEx.findNode(element, 'previousSibling', 'previousSibling');
};

/**
 * 获取源节点的下一个兄弟元素节点，查找不到时返回null
 * @method
 * @param {HTMLElement} element 源节点
 * @type HTMLElement
 */
SinaEx.next = function (element) {
	return SinaEx.findNode(element, 'nextSibling', 'nextSibling');
};

/**
 * 获取源节点的第一个元素节点，查找不到时返回null
 * @method
 * @param {HTMLElement} element 源节点
 * @type HTMLElement
 */
SinaEx.firstChild = function (element) {
	return SinaEx.findNode(element, 'nextSibling', 'firstChild');
};
/**
 * 从源节点开始获取nodeName为未指定标签名的父元素，查找不到时返回null
 * @method
 * @param {HTMLElement} node 源节点
 * @param {String} nodeName 指定的元素标签名
 * @type HTMLElement
 */
SinaEx.parent = function (node, nodeName) {
	// Modified by wangqiang1@staff
	// 文档节点没有tagName, 因此不能使用tagName
	nodeName = nodeName.toLowerCase();
	while(node){
		if(node.nodeName.toLowerCase() === nodeName){
			return node;
		}
		node = node.parentNode;
	}
	return null;
};
/**
 * 把一段html字符串创建成一个元素节点
 * @method
 * @param {String} html html字符串。注意这个字符串是只包含一个元素的字符串。
        如果需要创建一系列节点可先用一个适当标签包裹。
 * @type HTMLElement
 */
SinaEx.createNode = function(html){
    var node = document.createElement('div');
    node.innerHTML = html;
    return node.firstChild;
};

SinaEx.addClass = function(node, classname) {
	var cn = node.className;
	if( (' '+cn+' ').indexOf(' '+classname+' ')===-1 ){
		node.className = classname+' '+cn;
	}
};
SinaEx.removeClass = function(node, classname) {
	var cn = (' '+node.className+' ').replace(' '+classname+' ', ' ');
    node.className = cn.replace(/^\s+/, '').replace(/\s+$/, '');
};

if( document.documentElement.contains ){
    SinaEx.contains = function( a, b ) {
        return a.contains ? a.contains(b) : true;
    };
}else if( document.documentElement.compareDocumentPosition ){
    SinaEx.contains = function( a, b ) {
        return a===b || !!(a.compareDocumentPosition(b) & 16);
    };
}else{
    SinaEx.contains = function(a, b) {
        while(b){
            if(a===b){return true}
            b=b.parentNode;
        }
        return false;
    };
}

