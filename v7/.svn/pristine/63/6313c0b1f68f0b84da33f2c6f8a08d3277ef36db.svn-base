/**
 * @fileoverview 留言板隐私设置
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-25
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/system/br.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");

$import("msg/guestBook.js");
$import("product/guestBook/templates/privacySetTemplate.js");


/**
 * 留言板隐私设置类
 */
scope.PrivacySet=Core.Class.create();
scope.PrivacySet.prototype = {
	
	/**
	 * 设置面板对话框
	 */
	settingDialog:null,
	
	/**
	 * 提交数据的接口对象
	 */
	interfaceSubmit:null,
	
	/**
	 * 获取隐私设置的数据接口对象
	 */
	interfaceGetPrivacySet:null,
	
	/**
	 * 当前的值
	 */
	value:null,
	
	/**
	 * 初始化
	 */
	initialize:function(){
		this.interfaceSubmit=new Interface("http://wall.cws.api.sina.com.cn/set_privacy.php","jsload");
		this.interfaceSubmit.isSubmitting=false;
		
		this.interfaceGetPrivacySet=new Interface("http://wall.cws.api.sina.com.cn/get_privacy.php","jsload");
		this.initDialog();
		this.initPrivacySet();
	},
	
	/**
	 * 初始化显示对话框
	 */
	initDialog:function(){
		this.settingDialog=winDialog.createCustomsDialog({
			title:"留言板隐私设置",
			content:scope.privacySetTemplate
		});
//		if(!$IE6){
//			this.settingDialog.setDisplayMode("alpha");
//		}
		this.settingDialog.setMiddle();
		this.settingDialog.setFixed(true);
		
		var _this=this;
		var nodes=this.settingDialog.nodes;
		
		//保存
		Core.Events.addEvent(nodes["btnSave"],function(){
			_this.submit(_this._getRadioValue("radPrivacy"));
			Core.Events.stopEvent();
		},"click");
		
		//取消
		Core.Events.addEvent(nodes["btnCancel"],function(){
			_this.hidden();
		},"click");
	},
	
	/**
	 * 通过接口请求，获取当前的个人隐私设置
	 */
	initPrivacySet:function(){
		var _this=this;
		this.interfaceGetPrivacySet.request({
			onSuccess : function (data) {
				_this.value=data["value"];
			},
			onError : function (data) {

			},
			onFail : function (){
			}
		});
	},
	
	/**
	 * 提交设置的数据
	 * @param {String} value
	 * 				"0" 公开
	 * 				"1" 非公开
	 */
	submit:function(value){
		var _this=this;
		if (!this.interfaceSubmit.isSubmitting) {
			this.interfaceSubmit.isSubmitting=true;
			this.interfaceSubmit.request({
				GET: {
					value: value
				},
				onSuccess: function(data){
					if (parseInt(data["rows"]) > 0) {
						_this.hidden();
						_this.value = value;
						winDialog.alert("留言隐私设置成功！", {
							"icon": "03"
						});
					}
					else {
						winDialog.alert("留言隐私设置失败！");
					}
					_this.interfaceSubmit.isSubmitting=false;
				},
				onError: function(data){
					winDialog.alert($GUESTBOOK_MSG[data["code"]], {
						icon: "02"
					});
					_this.interfaceSubmit.isSubmitting=false;
				},
				onFail: function(){
					_this.interfaceSubmit.isSubmitting=false;
				}
			});
		}
	},
	
	/**
	 * 更新数据
	 */
	updateData:function(){
		var nodes=this.settingDialog.nodes;
		nodes["rdAll"].checked=this.value==0;
		nodes["rdOwn"].checked=this.value==1;
	},
	
	/**
	 * 显示
	 */
	show:function(){
		this.settingDialog.show();
		this.settingDialog.setMiddle();
		this.settingDialog.setAreaLocked(true);
	},
	
	/**
	 * 隐藏
	 */
	hidden:function(){
		this.settingDialog.hidden();
	},
	
	/**
	 * 根据Name来获取radioButton的值
	 * @param {String} radioName
	 */
	_getRadioValue:function(radioName){
		for(var i=0;i<$N(radioName).length;i++){
			if($N(radioName)[i].checked){
				return $N(radioName)[i].value;
			}
		}
	}
};