/**
 * @id Core.Dom.contains
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 * 删除指定的元素的指定样式
 */
$import("sina/core/dom/_dom.js");
/**
 * @for Core.Dom.contains
 * @param {HTMLElement | Document} oParentNode 父节点
 * @param {HTMLElement} oNode 需要判断的子节点
 * @return {Boolean} 是否是父节点的子节点
 * @author FlashSoft | fangchao@staff.sina.com.cn
 */
if( document.documentElement.contains ){
    Core.Dom.contains = function( oParentNode, oNode ) {
        return oParentNode.contains ? oParentNode.contains(oNode) : true;
    };
}else if( document.documentElement.compareDocumentPosition ){
    Core.Dom.contains = function( oParentNode, oNode ) {
        return oParentNode === oNode || !!(oParentNode.compareDocumentPosition(oNode) & 16);
    };
}else{
    Core.Dom.contains = function(oParentNode, oNode) {
        while( oNode ){
            if( oParentNode === oNode ){
                return true
            }
            oNode = oNode.parentNode;
        }
        return false;
    };
}