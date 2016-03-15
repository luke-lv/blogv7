/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 状态码文件基础方法，状态码定义文件需要引入
 * @author stan | chaoliang@staff.sina.com.cn
 */
var $SYSMSG = {};
$SYSMSG.extend = function (info, override){
	for (var i in info) {
		$SYSMSG[i] = !!override == false ? info[i] : $SYSMSG[i];
	}
};

