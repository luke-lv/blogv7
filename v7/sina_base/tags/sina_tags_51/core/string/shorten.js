/**
 * @fileoverview 
 * 				BLOGBUG-5107发现的问题，因此写了该shorten2
 * 				原来的shorten有个bug 
 * 				比如 对：asjdgljlksjdfljasxldjggpajoixujcvcnxzccp 进行shortn(xxx,40);
 * 				则会出现省略号，其实这个字符串就40个字符
 * @author xy xinyu@staff.sina.com.cn
 */


$import("sina/core/string/_string.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");

Core.String.shorten = function(str, len, suffix){
	if(Core.String.byteLength(str) <= len){
		return str;
	}
	if(suffix != ""){
		suffix = suffix || "...";
	}
	else{
		suffix = "";
	}
	return Core.String.leftB(str,len)+suffix;
};
