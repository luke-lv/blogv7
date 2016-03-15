/**
 * @desc	百合分享浮层
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */
 
$import("comps/baihe/shareDialog.js");
$import("comps/baihe/login.js");

$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");

$import("sina/core/events/addEvent.js");
$import("comps/baihe/pageLogin.js");

$registJob("shareDialog", function(){
	var shareBtn = $E("invite_friend");
	if(!shareBtn) return;
	
	var dg = new Baihe.shareDialog();
	Core.Events.addEvent(shareBtn, function(){
		dg.show();
	}, "click");
});
