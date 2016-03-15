/**
 * @desc	注册流程 inputPwdConfirm
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputBase.js");


Reg.InputPwdConfirm = function(opt){
	
	this.primaryPwd = opt.primaryPwd;
	
	var __this = this;
	Reg.attachValidObj.joinMember(this, function(){
		// console.log("callback: "+__this.entity.id);
		__this.validTxt(true);
	});
	
}.$extend(Reg.InputBase).$defineProto({
	watchingInput:function(){
		var __this = this;
		var flagGreen = 0, regF = scope && scope.$submit;
		Core.Events.addEvent(this.entity, function(){
			if(!flagGreen && regF){
				__this.hideGreen();
				regF = 1;
			}
			__this.changeColor("inputGreen");
			__this.showNoteTips();
		}, "focus");
		Core.Events.addEvent(this.entity, function(){
			Reg.attachValidObj.notifyBlur();
		}, "blur");
		if(regF){
			__this.showGreen();
		}
	},
	validSame: function(){
		if(!this.validator.stop && (this.entity.value != this.primaryPwd.value)){
			this.validator.stop = true;
			this.showErrTips("两次输入的密码不一致");
			this.changeColor("inputRed");
		}
		this.finishValid();
	},
	validTxt: function(force){
		// if(!this.primaryPwd.value){
		// 	this.removeColor();
		// 	this.hideAllTips();
		// 	return;
		// }
		this.$super.validTxt(force);
		this.validator
				.cantEmpty("请输入确认密码")
				.cantHaveUnicode("确认密码不能包含全角字符")
				.cantHaveChinese("确认密码请勿使用特殊字符")
				.cantHaveSpace("确认密码不能包含空格符")
				.cantWiredCharPWR()
				.cantLenWrong("6-16");
		this.validSame();
	}
});



