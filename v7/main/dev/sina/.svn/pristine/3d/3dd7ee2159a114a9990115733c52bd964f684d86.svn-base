/**
 * @id Core.Dom.addHTML
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Sina用于节点查找的一些方法，及对dom节点对象的扩展
 */
$import("sina/core/dom/_dom.js");
$import("sina/core/system/br.js");
/**
 * 给指定对象增加HTML[不会破坏这个对象固有节点的事件]
 * @for Core.Dom.addHTML
 * @method addHTML
 * @param {HTMLElement | Document |} oParentNode 节点对象
 * @param {String} sHTML 代码字符串
 * @return {Void}
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @update 07.12.26
 * @author Qiangyee | wangqiang1@staff.sina.com.cn
 * @update 2012.04.05
 * @see system.base.js
 * @exception
		Core.Dom.addHTML(document.body, "<input/>");
 */
Core.Dom.addHTML = function(oParentNode, sHTML) {
	oParentNode.insertAdjacentHTML("beforeend", sHTML);
};
// insertAdjacentHTML方法已加入w3c标准
// https://developer.mozilla.org/en/DOM/Element.insertAdjacentHTML
if (!$C("div").insertAdjacentHTML) {
	Core.Dom.addHTML = function(oParentNode, sHTML){
		var oRange = oParentNode.ownerDocument.createRange();
		oRange.setStartBefore(oParentNode);
		var oFrag = oRange.createContextualFragment(sHTML);
		oParentNode.appendChild(oFrag);
	};
}