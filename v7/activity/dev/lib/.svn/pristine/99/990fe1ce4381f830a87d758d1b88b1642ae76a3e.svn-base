/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Lib类库的根节点和基础方法
 */
/**
 * @class Lib{Object}做为整个类结构的根
 * @author stan | chaoliang@staff.sina.com.cn
 */
if (typeof Lib == 'undefined') {
	Lib = {};
}

/**
 * 在Lib下建立子对象
 * @author stan | chaoliang@staff.sina.com.cn
 * @example
 		Lib.pkg("Login");
 		alert(typeof Lib.Login);	//[Object Object]
 */
Lib.pkg = function(ns) {
    if (!ns || !ns.length){
		return null;
	}
    var levels = ns.split(".");
    var nsobj = Lib;
    for (var i= (levels[0] == "Lib") ? 1 : 0; i< levels.length; ++ i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }
	return nsobj;
};

