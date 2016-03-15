/**
 * @fileoverview	博客访客脚印记录功能
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @update at 2010-03-29	by dcw1123
 */
$import("sina/utils/io/jsload.js");
$import("lib/jobs.js");
$import("lib/checkAuthor.js");
$registJob("recordVisitor", function(){
	Lib.checkAuthor();
	if($isLogin && !$isAdmin){
		(function(){
			if(scope.unreadMsg){
				if(!scope.unreadMsg.foot){ scope.unreadMsg.foot = 0; }	//接口不稳定。默认留脚印，哪怕他设了不留脚印。
				if(!(scope.unreadMsg.foot*1)){							//登录者打开了留脚印。
					var param = {
						"pid"	: 8,
						"uid"	: scope.$uid
					};
					if(typeof ctg_id != "undefined"){
						param.subid = ctg_id;						//是一个相册页面上的全局变量。
					}
					Utils.Io.JsLoad.request("http://footprint.cws.api.sina.com.cn/add.php", {
						GET : param
					});
				}
			}else{
				setTimeout(arguments.callee, 200);
			}
		})();
	}
});