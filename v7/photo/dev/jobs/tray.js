
$import("sina/sina.js");
$import("lib/tray/trayPanel.js");
$import("lib/component/platformTray/platformTrayPlus.js");
$import("lib/checkAuthor.js");
$import("lib/listener.js");
$import("sina/utils/cookie/getCookie.js");
// $import("sina/core/system/keyValue.js");
$import("lib/login/info.js");

/**
 * @fileoverview 顶部托盘
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-24
 */
$registJob("tray", function(){
    // 注册托盘数据加载成功通知
    Lib.Listener.add("tray-data-loaded");
	Lib.checkAuthor();
	var tray;
    var $logo = $E("login_bar_logo_link_350");
    var isNewTray = 'ntopbar_main' === $logo.parentNode.className;
    if (isNewTray) {
        tray = Lib.TrayPanel();
    } else {
        tray = new Lib.PlatformTrayPlus();
    }

	var userInfo = Lib.Login.info();
	var uid = userInfo.uid;
	
	window.$onceLog = false;
	var onceloggedonblog = unescape(Utils.Cookie.getCookie("onceloggedonblog"));
	if (onceloggedonblog && uid){//只有uid和Cookie同时存在，才考虑促登陆状态
		time = onceloggedonblog;
		var now = new Date().getTime();
		if (time && (now > time)){
			$onceLog = true;
		}
	}
	
	if ($isLogin) {
		tray.load("login");
	}else if (!isNewTray && $onceLog){
		// console.log("促登陆")
		tray.load("oncelogedon");
	}else {
		tray.load("logout");
	}
	
	//配置全局的托盘呈现修改方法
	window.$tray={};
	window.$tray.renderLogin=function(){
		Lib.checkAuthor();
		if ($isLogin) {
			tray.load("login");
		}
	};
	window.$tray.renderLogout=function(){
		tray.load("logout");
	};
});