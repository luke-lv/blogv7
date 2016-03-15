/**
 * @desc	百合首页立即参加
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/checkAuthor.js");
$import("lib/interface.js");
$import("sina/core/events/addEvent.js");

$import("comps/baihe/pageLogin.js");

$registJob("iGo", function(){
	
	// 立即测试钮
	var mustGo = $E("go_daily");
	var mustGo_2 = $E("mustGo");
	var mustGo_1 = $E("go_daily_1");
	if(mustGo) Core.Events.addEvent(mustGo, eventHandler, "click");
	if(mustGo_1) Core.Events.addEvent(mustGo_1, eventHandler, "click");
	if(mustGo_2) Core.Events.addEvent(mustGo_2, eventHandler, "click");
	
	function eventHandler(){
		new Baihe.userIdChange().isUserChange();		// 有调用 Lib.checkAuthor()，
		if(!$isLogin){									// 未登录
			// new Baihe.pageLogin().updateLoginInfo();	// 更新状态。用户取消登录也要更新登录框。
			Baihe.login(function(){
				checkToNext();
				// new Baihe.pageLogin().updateLoginInfo();
			});
		}else if($isUserChange){						// 帐号改变，应保证登录先判断
			winDialog.alert("权限错误，用户已变更");
			setTimeout(function(){window.location.reload();}, 3000);
		}else{
			// new Baihe.pageLogin().updateLoginInfo();	// 更新状态。在其他页面登录后。
			checkToNext();
		}
	}
	
	function checkToNext(){
		window.location.href = "http://control.blog.sina.com.cn/baihe/daily.php";
		return;
	}
});



