/**
 * @desc	注册流程 inputNick
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputBase.js");


Reg.InputNick = function(opt){
	
}.$extend(Reg.InputBase).$defineProto({
	validTxt: function(){
		this.$super.validTxt();
		this.validator
				.cantEmpty()
				.cantNumAll()
				.cantHaveUnicode()
				.cantUpcase()
				.mustNormalChar()
				.cantLenWrong("4-20");
		
		this.finishValid();
	}
});



