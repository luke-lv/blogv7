/**
 * @fileoverview 促登陆项目——博文正文页弹
 * @author Lvyuan | rarny@163.com
 * @version 1.0
 * @history
 *
 */
 
$import("lib/checkAuthor.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/core/system/keyValue.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/insertTemplate.js");
$import("lib/login/_login.js");
$import("lib/login/ui.js");
$import("lib/component/include/attention.js");
$import("sina/ui/tween.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("lib/login/info.js");

$registJob('loginFollow', function(){

	Lib.checkAuthor();
	var loginFollow = $E("loginFollow");
	var onceloggedonblog = unescape(Utils.Cookie.getCookie("onceloggedonblog"));
	
	var userInfo = Lib.Login.info();
	var uid = userInfo.uid;
	var nick = userInfo.nick;
	
	//没有loginFollow节点，没有曾登陆Cookie，已登录用户，如果SSO没返回uid，都不用显示浮层。
	if (!loginFollow || !onceloggedonblog || $isLogin || !uid || !nick){
		return;
	}
	// 访问自己的博客，不用显示浮层
	if (uid === scope.$uid){
		return;
	}
	var tpl = '<div class="loginFollow">'+
						'<div class="con">'+
							'<p id="#{loginFollowCon}"></p>'+
						'<div class="btm"><a id="#{loginBtn}" href="javascript:void(0);" class="btn" title="登录并关注"></a><span>还没有博客账号？点此<a href="https://login.sina.com.cn/signup/signupmail.php?entry=blog&r=&srcuid=&src=blogicp" target="_blank" onclick="v7sendLog(\'44_01_03_'+uid+'\')">注册</a>一个</span></div>'+
                '</div>'+
              '</div>';
			  
	var nodes = Utils.insertTemplate(loginFollow, tpl, "BeforeEnd");
	
	nodes.loginFollowCon.innerHTML = 'Hi，'+nick+'！我是'+(scope.owenerNickName || $E("ownernick").innerHTML.replace(/(\r|\n)/g,""))+'。  现在就登录关注我的博客，不要错过我的任何更新！';

	// 浮层曝光次数统计
	v7sendLog('44_01_01_'+uid);
	var trayLogin = new Lib.Login.Ui();
	Core.Events.addEvent(nodes.loginBtn,function(){
		//点击登录按钮
		v7sendLog('44_01_02_'+uid);
		trayLogin.login(function(){
			// console.log("促登陆成功");
			//促登陆成功后加关注
			v7sendLog('44_01_04_'+uid);
			Lib.Component.Attention($UID, scope.$uid, function(){
				//直接刷新
				location.reload();
				// Core.Events.removeEvent(nodes.loginBtn)
			});
		});
	},"click");
	
	//暂时不考虑动画
	function tween(){
		// console.log("twn start 2");
		var twn = new Ui.TweenStrategy();
		// console.log("twn start 3");
		twn.onTween = function(value){
			
		};
		twn.onEnd = function(){
			
		};
		twn.start();
	}

});