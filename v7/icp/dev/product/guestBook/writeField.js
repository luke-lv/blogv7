/**
 * @fileoverview 发留言区域面板
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-24
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/utils/form/sinput.js");
$import("sina/utils/limitLength.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/getLeft.js");
$import("sina/utils/io/jsload.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/component/face/face.js");
$import("lib/insertSmiles/insertSmileFormInit.js");

$import("msg/guestBook.js");
$import("product/guestBook/login.js");
$import("tempLib/insertSmiles/insertSmileFormInit.js");
$import("lib/openBlog.js");
$import("lib/showError.js")
$import("lib/checkManager.js");
var checkCodeBox_write={
	id:'#checkCodeBox1'
}
var checkManager2=new Lib.checkManager(checkCodeBox_write);
/**
 * 发留言区域面板类
 */
scope.WriteField=Core.Class.create();
scope.WriteField.prototype = {
	
	/**
	 * 提交数据的接口对象
	 */
	interfaceSubmit:null,
	
	/**
	 * 留言内容文本框
	 */
	txtMessage:null,
	
	/**
	 * 插入表情按钮
	 */
	btnShowFaceEditor:null,
	
	/**
	 * 发留言按钮
	 */
	btnPostMessage:null,
	
	/**
	 * 发留言按钮链接
	 */
	linkPostMessage:null,
	
	/**
	 * 留言登录
	 */
	guestBookLogin:null,
	
	/**
	 * 可输入的最大字节数
	 */
	maxLength:600,
	
	/**
	 * 字数提示span
	 */
	txtMessagePrompt:null,
	
	/**
	 * 插入表情组件对象
	 */
	faceEditor:null,
	
	/**
	 * 是否为已经登录状态
	 */
	isLogin:null,
	
	
	initialize:function(){
		this.frameId = 'postCommentIframe';
		var frameId = this.frameId;
		var frame = $E(frameId);
		var test = frame || document.createElement('iframe');
		if(!frame) {
			$E('commentArea').style.display = 'none';
			var par = $E('commentArea').parentNode;
			var outter = $C('div');
			outter.style.cssText = 'float:left;';
			par.insertBefore(outter,$E('commentArea'));
			
			test.id = 'postCommentIframe';
			test.setAttribute('frameborder','0');
			test.style.cssText = 'border: 1px solid rgb(199, 199, 199); height: 158px; width: 448px; background-color: white;';
			outter.appendChild(test);
			
		}
		this.frame = $E(frameId);
		
		this.interfaceSubmit=new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/notewalladd.php", "ijax");
		//this.interfaceSubmit=new Interface("http://wall.cws.api.sina.com.cn/write.php","ijax");
		this.interfaceSubmit.isSubmitting=false;
		this.txtMessage = ($E("smilesSortShow") == null) ? $E("txtMessage") : $E("commentArea");
		this.txtMessagePrompt=$E("txtMessagePrompt");
		this.btnPostMessage=$E("btnPostMessage");
		this.btnShowFaceEditor=$E("btnInsertFace");
		this.linkPostMessage=$E("linkPostMessage");
		
		var _this=this;
		this.guestBookLogin=new scope.GuestBookLogin();
		if($E("smilesSortShow") == null){
			this.txtMessage.style.width = "680px";
			this.faceEditor=new Lib.Face(this.txtMessage);
			_this.bindFace();
		}else{
			var arrPix = [-325, 40 + ($IE ? -2 : 0)];
			var events = {
							'interval' : {
								'after' : function(frameId, area) {
									scope.commEditor.handleChange(frameId);
									var maxLength = 600;
									//var str = area.value;
									var str = area.value.replace(/\n/g,'');
									var len = maxLength / 2;
									if(str != '\n' && str != '\u000D\u000A') {
										len = Math.floor((maxLength - Core.String.byteLength(str)) / 2);;
									}
									if(len >= 0) {
										$E('txtMessagePrompt').innerHTML = "还可以输入"+len+"个汉字";
									} else {
										$E('txtMessagePrompt').innerHTML = "已超出<b style='color:red;' num='"+(-1)*len+"'>" + (-1)*len + "</b>个汉字";
									}
								}
							}
						}
			test.onload = function(){
				App.formInsertSmile2("commentArea", "smilesSortShow", "smilesRecommended", null, "smilesSortShow", arrPix,frameId,events);
				//App.formInsertSmile("commentArea", "smilesSortShow", "smilesRecommended", null, "smilesSortShow", arrPix);
			};
			test.src = 'http://blog.sina.com.cn/main_v5/ria/blank2.html';
		}
		
		Lib.checkAuthor();
		this.isLogin=$isLogin;
	},
	bindFace:function(){
		var _this=this;
		Core.Events.addEvent(this.btnShowFaceEditor,function(){
			if (_this.faceEditor.isShowed) {
				_this.faceEditor.hidden();
			}
			else {
				if(!_this.faceEditor.isLoad){
						_this.faceEditor.load();
						_this.initFace();
						_this.faceEditor.isLoad=true;
				}
				
				var x=Core.Dom.getLeft(_this.btnShowFaceEditor)-450;
				var y=Core.Dom.getTop(_this.btnShowFaceEditor) + _this.btnShowFaceEditor.offsetHeight;
				_this.faceEditor.setPosition(x,y);
				_this.faceEditor.show();
			}
			Core.Events.stopEvent();	
		},"mousedown");
	},
	/**
	 * 初始化插入表情
	 */
	initFace:function(){
		var _this=this;
		Core.Events.addEvent(document.body,function(){
			_this.faceEditor.hidden();
		},"mousedown");
		Core.Events.addEvent(this.faceEditor.dialog.entity,function(){
			Core.Events.stopEvent();
		},"mousedown");
	},
	
	
	load:function(){
		//字数限制在300个汉字
		//this.limitWords(this.maxLength);
		
		//"发留言"按钮事件
		var _this=this;
		
		function _doSubmit(){
			if (!_this.interfaceSubmit.isSubmitting) {
				var message = _this.txtMessage.value;
				Lib.checkAuthor();
				if ($isLogin) {
					//登录状态，直接可发留言
					if (_this.checkMessage()) {
						v7sendLog('45_01_14_'+ scope.$uid);
						scope.blogOpener.showDialog(function() {
							_this.submit(message);
						});
					}
				}
				else {
					//未登录状态，先登录再发留言
					if (_this.checkMessage()) {
						_this.loginSubmit(message);
					}
				}
			}
		}
		Core.Events.addEvent(this.btnPostMessage,_doSubmit,"click");
		
		Core.Events.addEvent(this.linkPostMessage,function(){
			var e=Core.Events.getEvent();
			if(e.keyCode=="13"){
				_doSubmit();
			}
		},"keydown");
	},
	
	/**
	 * 清除留言框中的内容
	 */
	clear:function(){
		if(scope.commEditor) {
			scope.commEditor.clearHTML(this.frameId);
		}
		this.txtMessage.value="";
		this.txtMessagePrompt.innerHTML = "还可以输入"+Math.floor(this.maxLength/2)+"个汉字";
	},
	
	/**
	 * 检查留言输入内容
	 */
	checkMessage:function(){
		scope.commEditor.handleChange(this.frameId);
		var my_yanzheng=checkManager2.validate();
		if(!my_yanzheng){
			//验证码输入是否正确验证
			showError(checkManager2.getErrorCode());
			return false;
		}
		var message=this.txtMessage.value;
		if (message.replace(/\s/g, "") == "") {
			winDialog.alert("请输入留言内容!");
			return false;
		}
		var ele = $E('txtMessagePrompt').getElementsByTagName('b')[0];
		if(ele) {
			var num = ele.getAttribute('num');
			winDialog.alert("您输入的内容超出了"+num+"个字");
			return false;
		}

		return true;
	},
	
	/**
	 * 登录后提交留言内容
	 * @param {String} message 留言内容
	 */
	loginSubmit:function(message){
		var _this=this;
		if($E("saveOnline_guest").checked){
    		v7sendLog('48_01_40_1');
    	}else{
    		v7sendLog('48_01_40_0');
    	}
		this.guestBookLogin.callBack=function(){
			this.clearForm();
			$tray.renderLogin();
			v7sendLog('45_01_14_'+ scope.$uid);
			scope.blogOpener.showDialog(function() {
				_this.submit(message);
			});
		};
		this.guestBookLogin.login();
	},
	
	/**
	 * 字数限制
	 * @param {Number} n 字节数(一个汉字两个字节)
	 */
	limitWords:function(n){
		var _this=this;
    	Utils.limitLength(this.txtMessage, n);
		_this.txtMessagePrompt.innerHTML = "还可以输入"+Math.floor(n/2)+"个汉字";
		var tmpfunc=function(){
			var s = _this.txtMessage.value;
	        if (Core.String.byteLength(s) > n) {
				_this.txtMessagePrompt.innerHTML = "还可以输入0个汉字";
			}
			else {
				_this.txtMessagePrompt.innerHTML = "还可以输入" + Math.floor((n - Core.String.byteLength(s)) / 2) + "个汉字";
			}
		};
		//修正留言部分粘贴时还剩几个字不更新的情况
    	Core.Events.addEvent(this.txtMessage, tmpfunc, "keyup");
		Core.Events.addEvent(this.txtMessage, tmpfunc, "blur");
		Core.Events.addEvent(this.txtMessage, tmpfunc, "focus");
		Core.Events.addEvent(this.txtMessage, tmpfunc, "mousedown");
		Core.Events.addEvent(this.txtMessage, tmpfunc, "propertychange");
		Core.Events.addEvent(this.txtMessage, tmpfunc, "input");
	},
	
	/**
	 * 提交留言内容
	 * @param {String} message 留言内容
	 */
	submit:function(message){
		Lib.checkAuthor();
		var _this=this;
		_this.interfaceSubmit.isSubmitting=true;
		var my_data={
			uid: scope.$uid,
			msg: message
		}
		var data_1=checkManager2.getPostData(my_data);
		//console.log(data_1);
			this.interfaceSubmit.request({
				POST: data_1,
				onSuccess: function(data){
					_this.onSubmitSuccessed();
					Lib.checkAuthor();
					if (_this.isLogin != $isLogin) {
						_this.onLoginStateChagedSubmit();
					}
					_this.interfaceSubmit.isSubmitting = false;
					checkManager2.refresh();
				},
				onError: function(data){
					_this.interfaceSubmit.isSubmitting = false;
					if (data["code"] == 'A00008') {
						window.location.reload();
						return;
					}
					winDialog.alert($GUESTBOOK_MSG[data["code"]], {
						icon: "01",
						funcOk: function(){
							Lib.checkAuthor();
							if (_this.isLogin != $isLogin) {
								_this.onLoginStateChagedSubmitError();
							}
						}
					});
					checkManager2.refresh();
				},
				onFail: function(){
					checkManager2.refresh();
					_this.interfaceSubmit.isSubmitting = false;
				}
			});		
	},
	
	/**
	 * 成功发送留言后触发
	 */
	onSubmitSuccessed : function(){
	},
	
	/**
	 * 发留言时登录状态有改变时触发
	 */
	onLoginStateChagedSubmit:function(){
		
	},
	
	/**
	 * 发留言失败，有登录状态改变时触发
	 */
	onLoginStateChagedSubmitError:function(){
		
	}
};