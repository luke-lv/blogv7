/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview cookie操作类
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */

$import("sina/utils/cookie/_cookie.js");

/**
 * 删除cookie
 * @param {String} name cookie名
 */
Utils.Cookie.deleteCookie = function(name) {
		document.cookie = name + '=;' + 'expires=Fri, 31 Dec 1999 23:59:59 GMT;'; 
};
