/**
 * @fileoverview 模板克隆
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-27
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");

$import("lib/lib.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");

$import("lib/component/templateClone/msg/templateClone.js");
$import("lib/openBlog.js");

/**
 * 模板克隆类
 */
Lib.TemplateClone=Core.Class.create();
Lib.TemplateClone.prototype = {
	
	/**
	 * 克隆位置类型
	 * 		0 从托盘克隆
	 * 		1 从头图克隆
	 */
	type:"1",
	
	/**
	 * 版本号
	 */
	version:"7",
	
	/**
	 * 模板克隆请求接口
	 */
	interfaceClone:null,
	
	/**
	 * 克隆按钮
	 */
	btnClone:null,
	
	/**
	 * 初始化
	 * @param {Object} btnClone 克隆按钮DOM
	 * @param {Function} callBack 克隆成功后的回调方法
	 */
	initialize:function(btnClone,callBack){
		var _this=this;
		this.interfaceClone=new Interface("http://control.blog.sina.com.cn/riaapi/conf/template_clone.php","jsload");
		this.btnClone=btnClone;
		if(this.btnClone){
			Core.Events.addEvent(this.btnClone,function(){
				_this.clone(callBack);
			},"click");
		}
	},
	
	/**
	 * 开始克隆
	 * @param {Function} callBack 克隆成功后的回调方法
	 */
	clone:function(callBack, tplNum){
		var _this=this;
		//var tipText = scope.temp315.cosText(tplNum);				//315
var a315 = "<a style='color:red' href='http://finance.sina.com.cn/333/2010-02-05/guest920.shtml' target='_blank'>315十大行业满意度调查</a>";
var tipText = tplNum ? a315 : "";
		Lib.checkAuthor();
		if($isLogin){
			winDialog.confirm("确定使用此模板吗?",{
				subText : tipText,									//315
				funcOk:function(){
					scope.blogOpener.showDialog(function() {
						_this.request(callBack);
					});
				}
			});
		}else{
			var templateCloneLogin = new Lib.Login.Ui();
			templateCloneLogin.login(function(){
				winDialog.confirm("确定使用此模板吗?",{
					subText : tipText,								//315
					funcOk:function(){
						scope.blogOpener.showDialog(function() {
							_this.request(callBack);
						});
					},
					funcCancel:function(){
						location.reload();
					}
				});
			});
		}
	},
	
	/**
	 * 请求克隆接口
	 * @param {Function} callBack 克隆成功后的回调方法
	 */
	request:function(callBack){
		var _this=this;
		this.interfaceClone.request({
			GET : {
				uid_cloned:scope.$uid,	
				type:_this.type,
				version:_this.version
			},
			onSuccess : function (data) {
				if(callBack){
					callBack();
				}
			},
			onError : function (data) {
				if (data["code"] == "A11007") {
					//未开通新浪博客
					Lib.checkAuthor();
					var tempAlertDialog=winDialog.alert($TEMPLATECLONE_MSG[data["code"]].replace(/#\{linkNewBlog\}/g,"http://control.blog.sina.com.cn/reg/reg_blog.php?version=7"), {
						icon: "01"
					});
					$E('cloneTemplateButNoReg').onclick = function() {
						tempAlertDialog.hidden().destroy();
					};
				}
				else {
					winDialog.alert($TEMPLATECLONE_MSG[data["code"]], {
						icon: "02"
					});
				}
			},
			onFail : function (){
			}
		});
	}
};