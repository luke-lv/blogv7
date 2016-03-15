/*
 * Copyright (c) 2007, Sina Inc. All rights reserved. 
 * @fileoverview 引用外部的js文件，并监测js的载入状态
 */
/**
 * 将单个或者一组js引入到页面上，当载入完成时执行指定的函数
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {String} jsfile 引入的单个文件地址
 * @param {Array} jsfile 引入的多个文件地址组成的数组
 * @param {Function} handle 所引入的js文件全部加载完毕后要执行的函数
 * @example
 * 		var jsfiles = [
 * 				"http://blog.sina.com.cn/file1.js",
 * 				"http://blog.sina.com.cn/file2.js"
 * 		]
 * 		Sina.io.include(jsfiles, function(){
 * 			alert("all file are included");
 * 		})
 * @global $include
 */
$import('lib/lib.js');

Lib.include = function(jsfile, handle, _charset) {
	var ja = new Array();
	var jsHash = {};
	if(typeof jsfile == 'string') ja.push(jsfile);
	else ja = jsfile.slice(0);
	var ua = navigator.userAgent.toLowerCase();
	var isIE = /msie/.test(ua);
	var isOpera = /opera/.test(ua);
	var isMoz = /firefox/.test(ua);
    var isWebkit = /webkit/i.test(ua);
	for(var i=0;i<ja.length;i++) {
		jsHash['j'+i] = false;
		jsHash['count_'+i]=0;
		var js = $C('script');
		js.type = 'text/javascript';
		if(_charset != null && _charset == "gb2312"){
			js.charset = _charset;
		}
		js.src = ja[i];
		js.id = 'j' + i;
		if(isIE) js.onreadystatechange = function() {
			if(this.readyState.toLowerCase() == 'complete' || this.readyState.toLowerCase() == 'loaded'){
				jsHash[this.id] = true;
			}
		};
		if(isMoz || isWebkit) js.onload = function() {
			jsHash[this.id] = true;
		};
		if(isOpera) jsHash['j' + i] = true;
		document.body.appendChild(js);
	}
	var loadTimer = setInterval(function(){

        for (var i = 0; i < ja.length; i++) {
//				trace(jsHash['j'+i]+";jsHash['count_'+i]="+jsHash['count_'+i]+";js.src="+ja[i]);
            if (jsHash['count_' + i] < 5) {
                if (jsHash['j' + i] == false) {
                    jsHash['count_' + i]++;
                    return;
                }
                
            }else{
                continue;
            }
        }
		clearInterval(loadTimer);
		eval(handle)();

	},100);
};
