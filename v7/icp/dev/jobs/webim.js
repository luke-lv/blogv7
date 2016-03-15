/**
 * @fileoverview
 *	增加 webIM 布码
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *	2010.01.26 启用新的 webIM 客户端，由 JS 根据当前访客是否登录来控制 JS 的加载
 */
$import("sina/utils/io/loadCss.js");
$import("sina/utils/io/jsload.js");

$import("lib/jobs.js");
$import("lib/checkAuthor.js");
$registJob("webim", function (){
	Lib.checkAuthor();
	if($isLogin == true && typeof ucClient == "undefined"){
		Utils.Io.loadCss({
			url : "http://sjs.sinajs.cn/webchat/blog/chatroomBlog.css"
		});
		Utils.Io.JsLoad.request("http://sjs.sinajs.cn/webchat/common/baseMerge.js", {
			onComplete : function () {
				Utils.Io.JsLoad.request("http://sjs.sinajs.cn/webchat/apps/blog/webucBlog.js", {
					noreturn: true
				});
			},
			noreturn: true
            ,isRemove : false
		});		
	}
});