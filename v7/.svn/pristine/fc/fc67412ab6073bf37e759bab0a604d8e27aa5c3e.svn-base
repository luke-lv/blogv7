/**
 * @desc	注册流程 inputAnswer
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputBase.js");


Reg.InputAnswer = function(opt){
	
}.$extend(Reg.InputBase).$defineProto({
	validTxt: function(){
		this.$super.validTxt();
		this.validator
				.cantEmpty()
				.cantSpaceBothSide()
				.cantUnderlineLast()
				.cantHaveUnicode("密码查询答案不能包含全角字符")
				.cantWiredChar("密码查询答案不能包含特殊字符")
				.cantLenWrong("6-80");
		
		this.finishValid();
	}
});



