/**
 * @fileoverview 向任何url请求一次，即投递一个日志
 * @author Book | liming9@staff
 * @created 2012年7月18日
 */
function commonLog(url){
	var image = window.clog_img = new Image();
	image.onload = image.onerror = function(){
        window.clog_img = null;
    };
	image.src = url + (url.indexOf('?')>0 ? '&__rnd=' : '?') + Math.random();
	image = null;
}
