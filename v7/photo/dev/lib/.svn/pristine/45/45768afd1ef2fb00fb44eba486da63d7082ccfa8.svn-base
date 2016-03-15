/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 初始化用户的登录后信息
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("lib/lib.js");
$import("sina/sina.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/core/system/keyValue.js");

Lib.checkAuthor = function(){
	
	var AuthorInfo = unescape(Utils.Cookie.getCookie("SUP"));
	if(AuthorInfo && AuthorInfo != "") {
		$UID = Core.System.keyValue(AuthorInfo, "uid");
		$nick = decodeURIComponent(Core.System.keyValue(AuthorInfo, "nick"));
		$isLogin = !!($UID);
		if (typeof scope.$uid == "undefined") {
			$isAdmin = false;
		}else {
			$isAdmin = (scope.$uid == $UID);
		}
	}else {
		// Modified by L.Ming 如果 SUP 不存在，尝试再去检查 SU
		AuthorInfo = Utils.Cookie.getCookie("SU");
		if(AuthorInfo && AuthorInfo != "") {
			var match = AuthorInfo.match(/^([^:]*:){2}(\d{5,11})/);
            $UID = (match&&match[2]) || null;
			window.$isLogin = !!($UID);
			if(typeof scope.$uid == "undefined") {
				window.$isAdmin = false;
			}else {
				window.$isAdmin = (scope.$uid == $UID);
			}
		}else {
			$UID = null;
			$isLogin = false;
			$isAdmin = false;
		}
	}
};
