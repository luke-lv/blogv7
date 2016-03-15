/**
 * @fileoverview
 * @author zhihan | zhihan@staff.sina.com.cn
 * @version 1.0
 * @since 2011-05-10
 */
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
 
if(!window.scope) {
	window.scope = {};
}

scope.verifyCodeDebug = function(imgElm,callback) {
	var _handleFuc = function(e) {
		callback && callback(e);
		Utils.Io.JsLoad.request("http://interface.blog.sina.com.cn/riaapi/imgerror.php?src="+encodeURIComponent(imgElm.src), {
			onComplete: function(){
			}
		});
	}
	
	Core.Events.addEvent(imgElm, _handleFuc,'error');
	Core.Events.addEvent(imgElm, _handleFuc,'abort');
}
