/**
 * @desc	百合活动信息页抽奖按钮
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */
 
$import("comps/baihe/login.js");
$import("lib/checkAuthor.js");
$import("sina/core/events/addEvent.js");
$import("comps/baihe/pageLogin.js");


$registJob("info_luckyBtn", function(){
	var luckyBtn = $E("lottery");
	if(!luckyBtn) return;
	
	Core.Events.addEvent(luckyBtn, function(){
		Lib.checkAuthor();
		if($isLogin){
			// new Baihe.pageLogin().updateLoginInfo();
			window.location.href = "http://control.blog.sina.com.cn/baihe/lottery.php";
		}else{
			new Baihe.pageLogin().updateLoginInfo();	// 怕用户取消登录框。
			Baihe.login(function(){
				window.location.href = "http://control.blog.sina.com.cn/baihe/lottery.php";
			});
		}
	}, "click");
	
});

