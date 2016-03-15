/**
 * @desc	百合登录对话框
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/baihe/_baihe.js");
$import("comps/baihe/tblogAtt.js");
$import("lib/login/ui.js");
$import("comps/baihe/userChange.js");


Baihe.login = function(callback){
	var Login = new Lib.Login.Ui();
	Login.login(function(){
		callback();
		new Baihe.userIdChange().setUid();		// 设置 uid
		scope.attMiniBlog();
	});
	var ads = $E("login_ad");
	if(ads) ads.style.display = "none";
};


