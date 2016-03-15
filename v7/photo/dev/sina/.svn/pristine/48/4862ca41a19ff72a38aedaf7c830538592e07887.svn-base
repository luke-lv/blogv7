/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Sina类库的根节点和基础方法
 */
/**
 * @class Sina{Object}做为整个类结构的根scope
 * @author stan | chaoliang@staff.sina.com.cn
 */
if (typeof Sina == 'undefined') {
	Sina = {};
}

/**
 * 在Sina下建立子对象
 * @author stan | chaoliang@staff.sina.com.cn
 * @example
 		Sina.pkg("Core.Array");
 		alert(typeof Core.Array);	//[Object Object]
 */
Sina.pkg = function(ns) {
    if (!ns || !ns.length){
		return null;
	}
    var levels = ns.split(".");
    var nsobj = Sina;
    for (var i= (levels[0] == "Sina") ? 1 : 0; i< levels.length; ++ i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }
	return nsobj;
};

/**
 * 根据元素的id获取对应节点的引用
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {String} id 节点的id或者节点本身
 * @modified 修正fangchao修改造成的无节点的情况下返回值前后不一致的问题
 */
function $E(oID) {
	var node = typeof oID == "string"? document.getElementById(oID): oID;
	if (node != null) {
		return node;
	}
	return null;
}

/**
 * 根据tagname创建制定类型的节点元素
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {String} tagName 制定的节点类型
 */
function $C(tagName) { 
	return document.createElement(tagName);
}

/**
 * 根据Name来查找元素
 * @author Random | yanghao@staff.sina.com.cn
 * @param {String} name 需要查找的name名称
 */
function $N(name){
	return document.getElementsByName(name);
}

/**
 * 根据TagName来查找元素
 * @author xy |xinyu@staff.sina.com.cn
 * @param {Object} obj 需要在哪个节点下根据tagname查找
 * @param {String} tagName 需要查找的tag
 */
function $T(obj,tagName){
	return obj.getElementsByTagName(tagName);
}

try{
	document.execCommand("BackgroundImageCache", false, true);
}catch(e){}
