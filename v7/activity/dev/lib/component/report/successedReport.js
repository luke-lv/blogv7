/**
 * @fileoverview 举报成功对话框
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-01-18
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/form/inputListen.js");

$import("lib/login/ui.js");
$import("lib/checkAuthor.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/component/report/template.js");
$import("lib/login/ui.js");

/**
 * 举报成功对话框
 */
scope.SuccessedReport=Core.Class.create();
scope.SuccessedReport.prototype = {
	
	/**
	 * 登录对话框
	 */
	loginUI:null,
	
	/**
	 * 是否已经初始化对话框
	 */
	_isInitDialog:false,
	
	/**
	 * 是否能提交
	 */
	canSubmit:true,
	
	/**
	 * 提交数据的接口对象
	 */
	dataInterface:null,
	
	/**
	 * 数据库标识ID
	 */
	dataID:"",
	
	/**
	 * 唯一ID
	 */
	bodyID:"",
	
	/**
	 * 举报人信息
	 */
	userInfo:{
		nickName:"" //昵称
	},
	
	/**
	 * 初始化
	 */
	initialize:function(){
		this.dataInterface=new Interface("http://control.blog.sina.com.cn/admin/advice/impeach_post_userinfo.php?version=7","ijax");
		this.loginUI = new Lib.Login.Ui();
	},
	
	show:function(){
		!this._isInitDialog && this._initDialog();
		this._dialog.setAreaLocked(true);
		this._dialog.setMiddle();
		this._dialog.show();
		this._isInitDialog=true;
	},
	
	/**
	 * 显示用户信息表单
	 * @param {Boolean} state 显示状态
	 */
	displayUserInfo:function(state){
		this._dialog.nodes["userForm"].style.display = state===false?"none":"";
	},
	
	/**
	 * 先登录再提交
	 */
	login:function(){
		var me=this;
		this.loginUI.login(function(){
			me.submit();
		});
	},
	
	/**
	 * 清除已填内容
	 */
	clear:function(){
		var nd=this._dialog.nodes;
		nd.cbCustom.checked=false;
		nd.cbOtherMethod.checked=false;
		nd.userForm.style.display="none";
		nd.userName.value="";
		nd.userEmail.value="";
		nd.userTel.value="";
	},
	
	hidden:function(){
		this._dialog.hidden();
	},
	
	submit:function(){
		var me=this,
			nd=this._dialog.nodes;
			
		Lib.checkAuthor();
		
		me.canSubmit=false;
		this.dataInterface.request({
			POST : {
				"id":me.dataID,
				"body_id":me.bodyID,
				"nickname":typeof($nick)=="undefined"?"":$nick,
				"name":nd.userName.value,
				"email":nd.userEmail.value,
				"phone":nd.userTel.value,
				"uid":$UID,
				"is_login":nd.cbCustom.checked?"1":"0"
			},
			onSuccess : function (data) {
				me.canSubmit=true;
				me.onSuccessed(data);
			},
			onError : function (err) {
				me.canSubmit=true;
				me.onError(err);
			},
			onFail : function (){
				me.canSubmit=true;
			}
		});
	},
	
	_initDialog:function(){
		this._dialog=winDialog.createCustomsDialog({
			tpl:scope.reportMainTpl,
			content:scope.reportSuccessTpl
		});
		
		var me=this,
			nd=this._dialog.nodes;
			
		this._dialog.addEventListener("hidden",function(){
			me.clear();
		});
		
		Lib.checkAuthor();
		nd.guestText.style.display=$isLogin?"none":"";
			
		Core.Events.addEvent(nd.btnOk,function(){
			if (me.canSubmit){
				Lib.checkAuthor();
				if(!$isLogin && nd.cbCustom.checked){
					me.login();
				}else{
					me.submit();
				}
			}
		},"click");
		Core.Events.addEvent(nd.cbOtherMethod,function(){
			me.displayUserInfo(nd.cbOtherMethod.checked);
		},"click");
		
		Utils.Form.inputListen(nd.userName,100);
		Utils.Form.inputListen(nd.userEmail,200);
		Utils.Form.inputListen(nd.userTel,100);
		
	},
	
	/**
	 * 成功时触发
	 */
	onSuccessed:function(data){},
	
	/**
	 * 失败时触发
	 * @param {Object} err
	 */
	onError:function(err){}
	
};

