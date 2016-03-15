/**
 * @desc	注册流程 inputPwd
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputBase.js");
 

Reg.InputPwd = function(opt){
	
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
	validTxt: function(force){
		this.$super.validTxt(force);
		this.validator
				.cantEmpty("请输入密码")
				.cantHaveUnicode("密码不能包含全角字符")
				.cantHaveChinese("密码请勿使用特殊字符")
				.cantHaveSpace("密码不能包含空格符")
				.cantWiredCharPWR()
				.cantLenWrong("6-16");
		
		this.finishValid();
	}
});



function getBottomInch(inch, width, height){
    return (width*inch/Math.sqrt(width*width+height*height)).toFixed(2);
}

