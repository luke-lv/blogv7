/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 发博文/发照片/发视频
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/events/addEvent.js");
$import("lib/jobs.js");
$import("pageSet/privateSetting.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");


$registJob("privateSetting", function(){
    var setting = new PrivateSetting();
	$E("SG_setting").onclick = function(){
		return false;
	};
    Core.Events.addEvent("SG_setting", function(){
		Lib.checkAuthor();
		if ($isAdmin) {
			setting.show();
		}else if(!$isLogin){
			(new Lib.Login.Ui()).login(function(){
				setting.show();
			});
		}
    });
});
