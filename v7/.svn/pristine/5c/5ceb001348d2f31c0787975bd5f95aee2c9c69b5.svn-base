/**
 * @desc	注册流程 inputEmail
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputBase.js");
$import("comps/reg/suggest.js");
$import("sina/utils/io/ajax.js");


Reg.InputEmail = function(opt){
	
	this.nextFocusNode = opt.nextFocusNode;
	Lib.passcardOBJ.init(
		this.entity,
		{	overfcolor:		"#999",		// 鼠标经过字体颜色
			overbgcolor:	"#e8f4fc",	// 鼠标经过背景颜色
			outfcolor:		"#000000",	// 鼠标离开字体颜色
			outbgcolor:		""			// 鼠标离开背景颜色
		},
		this.nextFocusNode || null
	);
	
}.$extend(Reg.InputBase).$defineProto({
	handleEnterKey: function(){},
	
	validOccupy: function(){
		var __this = this;
		if(this.validator.stop){
			__this.finishValid();
			return;
		}
		
		Utils.Io.Ajax.request("/signup/check_user.php"+"?t="+(new Date().getTime()), {
			returnType:"txt",
			POST:{
				from:	"othermail",
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
				.cantLenWrong("0-32", "邮箱地址格式不正确")
				.notAEmail()
				.cantSinaMail();
		
		this.validOccupy();		// 异步
	}
});



