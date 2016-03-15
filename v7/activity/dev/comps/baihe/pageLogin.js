/**
 * @desc	百合页登录类
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("comps/baihe/activeBlog.js");

$import("sina/core/events/addEvent.js");
$import("sina/core/string/shorten.js");

$import("comps/oop.js");
$import("comps/baihe/_baihe.js");
$import("comps/baihe/login.js");
$import("comps/baihe/luckyTimes.js");


Baihe.pageLoginObj;
Baihe.pageLogin = function(){
	if(Baihe.pageLoginObj){
		return Baihe.pageLoginObj;
	}
	Baihe.pageLoginObj = this;
	
	
	var __this = this;
	
	this.unLoginInfo = $E("unLoginInfo");
	this.loginInfo = $E("loginInfo");
	this.statUnlogin;
	
	this.loginBtn = $E("loginBtn");
	this.mustGo = $E("mustGo");
	this.userNick = $E("userNick");
	this.happyTimes = $E("happyTimes");
	
	
	// 登录钮
	Lib.checkAuthor();
	Core.Events.addEvent(this.loginBtn, function(){
		Baihe.login(function(){						// 登录成功
			__this.updateLoginInfo();
			new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=check_user_login", "ijax").request({
				GET:{
					t:	new Date().getTime()
				},
				onSuccess:function(res){			// 已开通
					
				},
				onError:function(res){
					if(res.code == "A40005")		// 未开通
					Baihe.activeBlog();
				}
			});
		});
	}, "click");
	
	
	// 自动更新状态和登录
	if($isLogin){
		this.updateLoginInfo();
	}else{
		this.autoLogin();
	}
	
}.$defineProto({
	
	autoLogin:function(){					// 自动登录。
		var __this = this;
		
		// 如此时没有 sinaSSOConfig！关系到 pv，必须加上，关键参数就行。
		// 这样 loginPost 中的 sso 属于后加载了，所以需要重新 sinaSSOController.init()
		window.sinaSSOConfig = {
			pageCharset:	"utf-8",
			noActiveTime:	14400,		// 不活跃时间
			setDomain:		true,
			entry:			'blog',
			useIframe:		true
		};
		Utils.Io.JsLoad.request("http://i.sso.sina.com.cn/js/ssologin.js", {
            isRemove : false,
			onComplete: function(){
				if(sinaSSOController)
				sinaSSOController.autoLogin(function(coki){
					if(coki){
						__this.updateLoginInfo();	// 故意写出 if else 的。告知回调是有两种状态的。只是写进 updateLoginInfo 里了。
					}else{
						__this.updateLoginInfo();
					}
				});
			},
			onException: function(){ },
			timeout: 10000
		});
	},
	
	checkLoginStat:function(){
		if(this.unLoginInfo.style.display.toLowerCase() != "none"){
			this.statUnlogin = true;		// 显示的是未登录
		}else{
			this.statUnlogin = false;		// 显示的是已登录
		}
	},
	
	updateLoginInfo:function(forceF5){		// forceF5：是否只根据 cookie 状态刷新
		var __this = this;
		Lib.checkAuthor();
		if($isLogin){
			var sNick = this.getUserNick();
			var uid = this.getUserUid();
			nick = Core.String.shorten(sNick, 12, "...");
			this.userNick.innerHTML = uid ? "<a style='padding:0' href='http://blog.sina.com.cn/u/"+uid+"' target='_blank' title="+sNick+">"+nick+"</a>" : nick;
			this.loginInfo.style.display = "block";
			this.unLoginInfo.style.display = "none";
			
			new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=get_lot_num1", "ijax").request({
				GET:{
					t:	new Date().getTime()
				},
				onSuccess:function(res){
					Baihe.luckyTimes.init().update(res);
					// __this.happyTimes.innerHTML = res;			// wiered
				},
				onError:function(){
					__this.happyTimes.innerHTML = 0;
				},
				onFail:function(){
					__this.happyTimes.innerHTML = 0;
				}
			});
		}else{
			this.loginInfo.style.display = "none";
			this.unLoginInfo.style.display = "block";
		}
	},
	
	getUserUid:function(){
		var SUPCookie = Utils.Cookie.getCookie("SUP");
		var transed_SUPCookie = decodeURIComponent(decodeURIComponent(SUPCookie));
		var matchCookie = transed_SUPCookie.match(/uid=([0-9]+?)&user/);
		var matchLoginName = matchCookie && matchCookie.length && matchCookie[1];
		return matchLoginName;
	},
	
	getUserNick:function(){
		var SUPCookie = Utils.Cookie.getCookie("SUP");
		var transed_SUPCookie = decodeURIComponent(decodeURIComponent(SUPCookie));
		var matchCookie = transed_SUPCookie.match(/nick=(.+?)&sex/);
		var matchLoginName = matchCookie && matchCookie.length && matchCookie[1];
		return matchLoginName;			// 可能是 encode 的
	},
	
	setHappyTimes:function(str){
		this.happyTimes.innerHTML = str || 0;
	}
});






