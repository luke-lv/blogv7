/**
 * @fileoverview	博客访客脚印记录功能
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @update at 2010-02-04	by dcw1123
 */
$import("sina/utils/io/jsload.js");
$import("lib/jobs.js");
$import("lib/checkAuthor.js");
$registJob("recordVisitor", function(){
	Lib.checkAuthor();
	if($isLogin && !$isAdmin){					//登录、非博主。
		(function(){
			//console.log(scope.unreadMsg);
			if(scope.unreadMsg){
				// console.log("foot: " + scope.unreadMsg.foot);
				// console.log("login: " + $isLogin);
				// console.log("admin: " + $isAdmin);
				if(!scope.unreadMsg.foot){ scope.unreadMsg.foot = 0; }	//接口不稳定。默认留脚印，哪怕他设了不留脚印。
				if(!(scope.unreadMsg.foot*1)){						//登录者打开了留脚印。
					//console.log("is in");
					var param = {
						"pid" : 1,
						"uid" : scope.$uid
					};
					if(typeof scope.$articleid != "undefined"){
						param.subid = scope.$articleid;
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