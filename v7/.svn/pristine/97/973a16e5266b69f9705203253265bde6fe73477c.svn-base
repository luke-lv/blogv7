/**
 * @desc	百合判断用户更换
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/baihe/_baihe.js");
$import("comps/baihe/login.js");
$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");


// 还能返回一个参数，从未登录状态
// 两个未登录，一个登录了，另一个应该知道并刷新。

Baihe.pageUserIdObj;
$isUserChange = null;
Baihe.userIdChange = function(){
	if(Baihe.pageUserIdObj) return Baihe.pageUserIdObj;		// 单例类
	Baihe.pageUserIdObj = this;
	
	var __id = null;
	var __idAssigned = false;
	this.getUid = function(){
		return __id;
	};
	this.setUid = function(){
		if(__idAssigned) return;		// 只能设置一次
		
		Lib.checkAuthor();
		if($isLogin){
			__id = $UID;
			__idAssigned = true;
		}
	};
	
}.$defineProto({
	
	isUserChange:function(){			// $isUserChange 是只跟登录有关的判断
		Lib.checkAuthor();
		if($isLogin){
			if(this.getUid() && this.getUid()!=$UID) $isUserChange = true;		// 必须之前有登录才行，否则会误判
			else $isUserChange = false;
		}
	}
	
});


// 侦测函数
Baihe.userChangeDetected = function(mode, strIsChange, strUnlogin){
	var exStatAlert;
	switch(mode){
		case 1:		exStatAlert = mode1; break;
		case 2:		exStatAlert = mode2; break;
		default:	exStatAlert = mode1; break;
	}
	new Baihe.userIdChange().isUserChange();		// 有调用 Lib.checkAuthor()，
	if(!$isLogin){									// 未登录
		exStatAlert(strUnlogin || "权限错误，用户未登录");
		// login()
		return true;
	}else if($isUserChange){						// 帐号改变，应保证登录先判断
		exStatAlert(strIsChange || "权限错误，用户已变更");
		return true;
	}
	function mode1(str){
		setTimeout(function(){window.location.reload();}, 3000);
		winDialog.alert(str, {
			funcOk:function(){window.location.reload();},
			funcClose:function(){window.location.reload();}
		});
	}
	function mode2(){
		window.location.reload();
	}
	function login(){
		Baihe.login(function(){
			window.location.reload();
		});
	}
};





