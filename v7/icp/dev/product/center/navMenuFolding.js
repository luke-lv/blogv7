/**
 * @fileoverview | 个人中心左侧导航改版，加入下拉条。
 * @author L.Ming | liming1@staff.sina.com.cn
 * @modified dcw1123 | chengwei1@sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/string/trim.js");
$import("lib/app.js");
$import("lib/jfCheckIn.js");

App.navMenuFolding = function(){
    //导航菜单上添加积分签到模块 jiangwei5 2014-08-13
    Lib.jfCheckIn.init();
	//如果菜单节点不存在，不做下拉处理。
	if (!$E("leftmenu_2")) return;
	
	//是消息相关页面，则不对消息导航收缩。
	var alwaysUnfold = false;
	var exceptId = ["profile_notice", "profile_paperlist", "profile_invitelist", "profile_replylist", "profile_guestBookM", "profile_commlist", "profile_commphotolist"];
	for(var i=0; i<exceptId.length; i++){
		//trace(scope.$pageid == exceptId[i])
		if(scope.$pageid == exceptId[i]){
			alwaysUnfold = true;
			break;
		}
	}
	for(var i=1; i<9; i++){
		if (!$E("leftmenu_" + i)) {
			//return;
			continue;
		}
		Core.Events.addEvent($E("leftmenu_" + i).parentNode, function (e){
			Core.Events.stopEvent(e);
			var evt = Core.Events.getEvent(e);
			var _target = evt.target || evt.srcElement;
			while(Core.String.trim(_target.className) != "centerMenu_tit"){
				_target = _target.parentNode;
			}
			var wrap = _target.parentNode;
			var cla = Core.String.trim(wrap.className);
			if(cla === "centerMenu"){
				wrap.className = "centerMenu centerMenu_on";
			}else{
				wrap.className = "centerMenu";
			}
		});
	}
	
//	if(!alwaysUnfold){
//		//trace("个人中心首页");
//		//初始化时，如果有消息更新才显示。
//		(function(){
//			var timer = 0;
//			if(typeof(scope.unreadMsg) != "undefined"){
//				//trace("unreadMsg...");
//				clearTimeout(timer);
//				var propReg = new RegExp("version|svr_time|nickname");
//				for(var k in scope.unreadMsg){
//					//trace(k+": "+scope.unreadMsg[k]);
//					//if(propReg.test(k)) trace("untest prop");
//					if(!propReg.test(k) && window.parseInt(scope.unreadMsg[k])>0){
//						$E("leftmenu_2").parentNode.parentNode.parentNode.className = "centerMenu";
//						break;			//中断循环，显示下拉菜单。
//					}
//				}
//			}else{
//				//trace("waiting unreadMsg");
//				timer = setTimeout(arguments.callee, 200);
//			}
//		})();
//	}else{
//		//trace("非个人中心首页");
//		$E("leftmenu_2").parentNode.parentNode.parentNode.className = "centerMenu";
//	}
	
};

