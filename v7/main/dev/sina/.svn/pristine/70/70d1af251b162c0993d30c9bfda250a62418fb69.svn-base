/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview cookie操作类
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */
$import("sina/utils/cookie/_cookie.js");

/**
 * 设置cookie
 * @param {String} name cookie名
 * @param {String} value cookie值
 * @param {Number} expire Cookie有效期，单位：小时
 * @param {String} path 路径
 * @param {String} domain 域
 * @param {Boolean} secure 安全cookie
 * @example
 * Utils.Cookie.setCookie('name','sina',null,"")
 */
Utils.Cookie.setCookie = function (name, value, expire, path, domain, secure) {
		var cstr = [];
		cstr.push(name + '=' + escape(value));
		if(expire){
			var dd = new Date();
			var expires = dd.getTime() + expire * 3600000;
			dd.setTime(expires);
			cstr.push('expires=' + dd.toGMTString());
		}
		if (path) {
			cstr.push('path=' + path);
		}
		if (domain) {
			cstr.push('domain=' + domain);
		}
		if (secure) {
			cstr.push(secure);
		}
		document.cookie = cstr.join(';');
};