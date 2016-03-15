/**
 * @desc	注册流程 inputCheck
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputBase.js");


Reg.InputCheck = function(opt){
	
}.$extend(Reg.InputBase).$defineProto({
	changeColor: function(){},
	removeColor: function(){},
	validTxt: function(){
		if(!this.entity.checked){
			this.validator.stop = true;			// 阻止正则校验链
			this.proccessStop = true;			// 阻止提交操作
			this.showErrTips("需同意使用协议和服务条款");
		}
		this.finishValid();
	}
});



