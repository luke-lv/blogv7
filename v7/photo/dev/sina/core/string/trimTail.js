/**
 * @id Core.String.trimTail
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符处理
 */
$import("sina/core/string/_string.js");

/**
 * @for Core.String.trimTail
 * Trim function
 * 截取尾空白，删除字符串尾部的空格
 * @param {String} str 需要删除空格的字符串
 * @return {String} 删除str尾部空格的字符串
 * @author xp | yanbo@staff.sina.com.cn
 *         chenjie | chenjie@staff.sina.com.cn
 * Added on 07.07.12
 * @example
 * 		var testStr = "     前后均是空白     ";
 * 		var result = Core.String.trimTail(testStr);
 * 		alert(result);	//"     前后均是空白"
 */
Core.String.trimTail = function(str){
	return str.replace(/(\u3000|\s|\t)*$/gi, "");
};