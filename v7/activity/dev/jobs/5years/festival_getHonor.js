


$import("sina/core/events/addEvent.js");
$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");
$import("lib/login/ui.js");
$import("lib/interface.js");

// 未登录时的获取勋章。
(function(){
	var getHonorBtn = $E("imme_getHonor");
	var compInterface = "http://interface.blog.sina.com.cn/blog_5years/interface.php";
	if(!getHonorBtn) return;
	
	Core.Events.addEvent(getHonorBtn, function(){
		Lib.checkAuthor();
		if($isLogin){
			window.location.reload();
		}else{
			var userLogin = new Lib.Login.Ui();
			userLogin.login(function(){
				window.location.reload();
			});
			// ifm 广告隐藏
			$E("login_ad").style.display = "none";
		}
	}, "click");
})();



