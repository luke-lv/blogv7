/**
 * @desc	百合中奖对话框
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/ui/dialog/backShadow.js");

$import("comps/baihe/dialog/Dialog.js");
$import("comps/baihe/happyTemplate.js");
$import("comps/baihe/_baihe.js");

$import("lib/dialogConfig.js");
/* NODES：
 * awardName;
 * rewrite;
 * ok;
 */
Baihe.happyDialog = function(opt){
	this.awardHash = {
		0:"没有",
		1:"红豆礼包(十颗)",
		2:"水晶百合试用装(3日)",
		3:"水晶百合1月装",
		4:"水晶百合3月装",
		5:"水晶百合6月装",
		6:"水晶百合1年装",
		7:"牵红线1次装",
		8:"牵红线3次装",
		9:"牵红线6次装",
		10:"香水",
		11:"U盘8G",
		12:"Ipad"
	};
	var __this = this;
	opt = opt || {};
	this.opt = opt;
	this.onSuccess	= opt.onSuccess || function(){};
	this.onError	= opt.onError || function(){};
	this.onFail		= opt.onFail || function(){};
	
	this.canInput = true;
	
	this.template = Baihe.happyTemplate;
	this.initDialogTemplate("baihe_happyWords");
	this.initDialogEvents();
	
	// 字数检测
	var __nodes = this.nodes;
	var __temp;
	this.trimStr;
	this.WORDS_LEN = 80;				// 字数限制
	this.remain = this.WORDS_LEN;
	this.inputTimer = setInterval(function(){
		__this.trimStr = Core.String.trim(__nodes.happyWords.value);
		__this.remain = __this.WORDS_LEN - Core.String.byteLength(__this.trimStr);
		__this.remain = Math.ceil(__this.remain*0.5);
		if(__this.remain < 0){
			__temp = "已超出 <span style='color:white; font-weight:bold;'>"+(__this.remain*(-1))+"</span> 字";
			__this.canInput = false;
		}else if(__this.remain == 0){
			__temp = "字数刚好";
			__this.canInput = true;
		}else if(__this.remain > 0){
			__temp = "剩 "+__this.remain+" 字";
			__this.canInput = true;
		}
		__nodes.remain.innerHTML = __temp;
	}, 500);
	
	// 奖品名
	__nodes.btnCls.style.display = "none";
	if(typeof opt.awardId != "undefined"){
		__nodes.awardName.innerHTML = this.awardHash[opt.awardId];
	}
	
	
}.$extend(Baihe.Dialog).$defineProto({
	
	initDialogEvents:function(){
		this.$super.initDialogEvents();
		var __this = this;
		var __nodes = this.nodes;
		
		Core.Events.addEvent(__nodes.rewrite, function(){		// 重新写
			__nodes.happyWords.innerHTML = "";
			__nodes.happyWords.focus();
		}, "click");
		
		// 提交
		Core.Events.addEvent(__nodes.ok, function(){
			__this.sendHappy();
		}, "click");
	},
	
	show:function(id){
		if(typeof id != "undefined"){
			this.nodes.awardName.innerHTML = this.awardHash[id];
			this.opt.awardId = id;
		}
		this.$super.show();
		this.nodes.happyWords.focus();
	},
	
	sendHappy:function(){
		if(Baihe.userChangeDetected()) return;			// 登录组件已引本类
		
		var __this = this;
		var TIP = "还是写点什么助兴的吧～";
		if(!this.canInput) return;
		if(this.remain == Math.ceil(this.WORDS_LEN*0.5)){
			this.nodes.happyWords.value = TIP;
			this.nodes.happyWords.focus();
			return;
		}
		if(this.nodes.happyWords.value == TIP){
			this.nodes.happyWords.focus();
			return;
		}
		
		new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=save_happyWords", "jsload").request({
			GET:{
				happyWords:		__this.trimStr
			},
			onSuccess:function(res){
				winDialog.alert("记录成功", {
					icon:"03"
				});
				__this.onSuccess();
			},
			onError:function(res){
				winDialog.alert("抱歉，您的 happyWords 没有记录下来，请联系我们");
				__this.onError();
			},
			onFail:function(){
				winDialog.alert("抱歉，您的 happyWords 没有记录下来，请联系我们！");
				__this.onFail();
			}
		});
		
		this.hide();
	}
	
});






