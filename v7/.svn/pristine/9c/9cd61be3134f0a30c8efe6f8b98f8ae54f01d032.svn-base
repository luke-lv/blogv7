/**
 * @desc	百合中百合花对话框
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/baihe/dialog/Dialog.js");
$import("comps/baihe/happyTemplate.js");
$import("comps/baihe/_baihe.js");

$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("sina/utils/cookie/getCookie.js");


Baihe.gladDialog = function(opt){
	var __this = this;
	
	opt = opt || {};
	this.onSuccess	= opt.onSuccess || function(){};
	this.onError	= opt.onError || function(){};
	this.onFail		= opt.onFail || function(){};
	
	this.template = Baihe.gladTemplate;
	this.initDialogTemplate("baihe_gladWords");
	this.initDialogEvents();
	
	var __baiheCookie = Utils.Cookie.getCookie("baihe_"+$UID);
	var __email = "";
	var __pass = "";
	if(__baiheCookie){
		__baiheCookie = decodeURIComponent(__baiheCookie);
		__baiheCookie = __baiheCookie.split("|");
		__email = encodeURIComponent(__baiheCookie[0]);
		__pass = encodeURIComponent(__baiheCookie[1]);
		this.nodes.redirBtn.href = "http://passport.baihe.com/login.jsp?txtLoginEMail="+__email+"&txtLoginPwd="+__pass;
	}else{
		new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=get_baihe_info", "jsload").request({
			onSuccess:function(res){
				__email = encodeURIComponent(res.email);
				__pass = encodeURIComponent(res.password);
				__this.nodes.redirBtn.href = "http://passport.baihe.com/login.jsp?txtLoginEMail="+__email+"&txtLoginPwd="+__pass;
			}
		});
	}
	this.nodes.btnCls.style.display = "none";
	Core.Events.addEvent(this.nodes.redirBtn, function(){		// 已领取红豆
		new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=update_userredbean", "jsload").request({
			onSuccess:function(res){
				scope.$is_getredbean = 1;		// 1 是拿过红豆了
			},
			onError:function(res){
				
			}
		});
	}, "click");
	
}.$extend(Baihe.Dialog).$defineProto({
	
	initDialogEvents:function(){
		this.$super.initDialogEvents();
		var __this = this;
		Core.Events.addEvent(this.nodes.redirBtn, function(){
			__this.hide();
		}, "click");
	}
	
});



