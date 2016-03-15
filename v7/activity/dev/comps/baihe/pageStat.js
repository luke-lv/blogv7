/**
 * @desc	百合页面状态组件
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/baihe/_baihe.js");
$import("comps/baihe/login.js");
$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");


// 使用这些标记时，必须调用过 detectingNow()，否则不准确！
// 应当、且、只使用这些标记的 true 状态。即不要对这些标记使用非号，包括 else。因为它们的 false 状态实在是没有多少明确的意义。并且完全不准确！
var $isUserChange = false;				
var $isUserPromote = false;
var $isUserQuit = false;
var $isGuestStatus = false;
var $isGuestAlways = false;


// 单例
Baihe.pageStatObj;
Baihe.PageStat = function(){
	if(Baihe.pageStatObj) return Baihe.pageStatObj;
	Baihe.pageStatObj = this;
	
	var __this = this;
	this.callbackMgr = {};
	
	Lib.checkAuthor();
	var __id = undefined;				// 三个状态，undefined、true、false
	var __curLogin = $isLogin;			// 两个状态，true、false
	
	this.setStat = function(stat){
		__curLogin = stat;
	};
	this.getStat = function(){
		return __curLogin;
	};
	this.setUid = function(uid){
		__id = uid;
	};
	this.getUid = function(){
		return __id;
	};
	
	
	// 默认回调
	this.defaultCallback = {};
	this.defaultCallback.onGuestAlways = __guestAct;
	this.defaultCallback.onGuestStatus = __guestAct;
	this.defaultCallback.onUserPromote = function(){ __refresh("页面检测到你已登录，现将刷新页面"); };
	this.defaultCallback.onUserChange = function(){ __refresh("你已在其它页面更换登录，现将刷新页面"); };
	this.defaultCallback.onUserQuit = function(){ __refresh("你已在其它页面退出，现将刷新页面"); };
	function __refresh(str){
		winDialog.alert(str);
		setTimeout(function(){
			window.location.reload();
		}, 3000);
	}
	function __guestAct(){
		Baihe.login(__this.defaultLoginCallback);
	}
	
}.$defineProto({
	
	// CAUTION!：仅供登录组件回调使用，标记页面显示的状态
	setPageStat:function(){
		Lib.checkAuthor();
		this.setUid($UID);
		this.setStat($isLogin);
	},
	
	/*
	检测完的后续操作就两种，要么继续，要么执行回调。所以有回调的，一律返回 true 就行。
	四种使用模式：回调模式（传入操作名），和纯检测模式。
	这些状态是互相独立的，一旦有一个 true，其它就不可能了，没有交叉。
	所以回调模式中，检测到任何一个状态，回调完就可以返回 true，然后终止宿主函数执行。
	*/
	testException:function(){
		
		// 区分模式
		var __targetCallbacks;
		if(typeof arguments[0] == "string"){
			if(typeof arguments[1] == "boolean" && arguments[1]){	// actName, true[, callback]。执行自定义回调，没有则执行默认
				__targetCallbacks = this.callbackMgr[arguments[0]] || this.defaultCallback;
				this.defaultLoginCallback = arguments[2];
			}else{													// actName[, callback]。仅执行自定义回调
				__targetCallbacks = this.callbackMgr[arguments[0]] || {};
			}
		}
		if(typeof arguments[0] == "boolean" && arguments[0]){		// 默认回调模式。true[, callback]。执行默认回调
			__targetCallbacks = this.defaultLoginCallback;
			this.defaultLoginCallback = arguments[1];
		}
		if(arguments[0] == "undefined"){							// 纯检测模式。
			__targetCallbacks = {};
		}
		
		// 检测、执行模式
		Lib.checkAuthor();
		var __curLogin = this.getStat();
		var __uid = this.getUid();
		
		$isUserPromote = $isLogin && !__curLogin;
		if($isUserPromote && __targetCallbacks.onUserPromote)
		return __targetCallbacks.onUserPromote() || true;
		
		$isUserChange = $isLogin && __curLogin && __uid!=$UID;
		if($isUserChange && __targetCallbacks.onUserChange)
		return __targetCallbacks.onUserChange() || true;
		
		$isUserQuit = !$isLogin && __curLogin;
		if($isUserQuit && __targetCallbacks.onUserQuit)
		return __targetCallbacks.onUserQuit() || true;
		
		$isGuestAlways = !$isLogin && __uid=="undefined";		// 最后两个状态有先后顺序！
		if($isGuestAlways && __targetCallbacks.onGuestAlways)
		return __targetCallbacks.onGuestAlways() || true;
		
		$isGuestStatus = !$isLogin && !__curLogin;
		if($isGuestStatus && __targetCallbacks.onGuestStatus)
		return __targetCallbacks.onGuestStatus() || true;
		
		return false;									// 无异常，宿主继续。
	},
	
	// 注册回调采用操作命名方式，不使用观察者。因为不需要广播。
	setCallbacks:function(opName, callbacks){
		if(typeof opName != "string") return;
		for(var n in callbacks){
			this.callbackMgr[opName][n] = callbacks[n];
		}
	}
	
});

/*
curlogin？所有登录组件中必须回调。
一开始加载时，记录！然后只能在所有登录入口的回调中修改！
有些是需要刷新状态的！状态区别很重要，可以各自定义是否需要刷新！

登录	登录	（无意义）			（无意义）								（无意义）				状态一致的已登录！
未登录	登录	curlogin false		且 islogin true							isUserPromote			状态不一致的已登录！	刷新
登录	换登录	curlogin true		且 islogin true		且 __id != uid		isUserChange			状态不一致的已登录！	刷新		__id 不能 undefined，所以要求 curLogin true！
登录	未登录	curlogin true		且 islogin false						isUserQuit				状态不一致的未登录！	刷新
状态一致的未登录curlogin false		且 islogin false						isGuestStatus			状态一致的未登录！		弹浮层		__id undefined 肯定 curlogin false，反之未必！对应：状态一致的未登录 / 一直未登录。
从未登录		__id undefined		且 islogin false						isGuestAlways			从未登录！				弹浮层

登录			islogin true		纯已登录状态标记
未登录			islogin false		纯未登录状态标记
*/

/*
鉴于 $isLogin 可以随便修改，所以加密方案放弃。
但确实已经有方案了！
登录 core 中包含本组件就是！
所有登录组件必须使用登录 core 就没问题了。
*/

