/**
 * @desc	注册流程 inputEmail
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputBase.js");
$import("sina/utils/io/ajax.js");


Reg.InputName = function(opt){
	
}.$extend(Reg.InputBase).$defineProto({
	validOccupy: function(){
		var __this = this;
		if(this.validator.stop){
			__this.finishValid();
			return;
		}
		
		Utils.Io.Ajax.request("/signup/check_user.php"+"?t="+(new Date().getTime()), {
			returnType:"txt",
			POST:{
				from:	"cnmail",
				name:	__this.entity.value
			},
			onComplete:function(res){
				switch(res){
					case "no":			// InputBase 处理了对勾
						break;
					case "yes":
						__this.validator.stop = true;
						__this.proccessStop = true;
						__this.showErrTips("邮箱被占用");
						__this.changeColor("inputRed");
						break;
					case "error":
						__this.validator.stop = true;
						__this.proccessStop = true;
						__this.showErrTips("系统繁忙");
						__this.changeColor("inputRed");
						break;
				}
				__this.finishValid();
			},
			onException:function(res){
				
			}
		});
	},
	validTxt: function(){
		this.$super.validTxt();
		this.validator
				.cantEmpty("请输入邮箱名")
				.cantHaveUnicode()
				.cantHaveChinese()
				.cantHaveSpace()
				.cantUpcase()
				.cantWiredChar()
				.cantLenWrong("4-16", "邮箱名长度为 4-16 位")
				.cantNumAll()
				.cantUnderlineBothSide();
		
		this.validOccupy();		// 异步
	}
});



