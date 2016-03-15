/**
 * @desc	注册流程 inputPwd
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputBase.js");


Reg.InputValid = function(opt){
	
}.$extend(Reg.InputBase).$defineProto({
	validTxt: function(){
		this.$super.validTxt();
		this.validator
				.cantEmpty()
				.cantHaveSpace()
				.mustLetterOrNum("不能包含全角的数字、英文字母");
		
		this.finishValid();
	}
});



