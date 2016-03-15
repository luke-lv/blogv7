/**
 * @desc	注册流程 inputQuestion
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputBase.js");


Reg.InputQuestion = function(opt){
	
}.$extend(Reg.InputBase).$defineProto({
	validTxt: function(){
		this.$super.validTxt();
		this.validator
				.cantEmpty()
				.cantUnderlineLast()
				.cantSpaceBothSide()
				// .cantHaveUnicode("密码查询问题不能包含全角字符")
				// .cantWiredChar("密码查询问题不能包含特殊字符")
				.mustNormalChar("不能包含半角数字、半角字母和汉字以外的字符")
				.cantLenWrong("4-20");
		
		this.finishValid();
	}
});



