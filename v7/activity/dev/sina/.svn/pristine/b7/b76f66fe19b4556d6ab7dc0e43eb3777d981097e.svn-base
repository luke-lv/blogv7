/** 
 * @fileoverview 根据样式名获取元素集合
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-11
 * @forcopy $import("sina/core/dom/byClass.js");
 */
$import("sina/core/dom/_dom.js");

/**
 * 根据样式名获取元素集合
 * @method
 * @param {String} className 样式名
 * @param {String} tagName 在什么标签里查找。可选。
 * @param {HTMLElement} elem 在什么节点里查找。tagName没有的话这个也不要有。可选。
 * @type [HTMLElement]
 */
Core.Dom.byClass = function(className, tagName, elem){
    elem = elem || document;
    if(elem.getElementsByClassName){
        return elem.getElementsByClassName(className);
    }
    var rcn = new RegExp('\\b'+className+'\\b'),
        ret = [],
        els = elem.getElementsByTagName(tagName),
        i,
        len = els.length;
    for(i=0; i<len; i++){
        elem = els[i];
        if (elem.nodeType === 1 && elem.className && rcn.test(elem.className) ){
            ret.push(elem);
        }
    }
    return ret;
};
