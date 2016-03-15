/**
 * @fileoverview 回复留言区域面板
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-24
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/utils/form/sinput.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/string/byteLength.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("msg/guestBook.js");
$import("product/guestBook/templates/writeBackFieldTemplate.js");


/**
 * 回复留言区域面板类
 */
scope.WriteBackField=Core.Class.create();
scope.WriteBackField.prototype = {
	
	/**
	 * 提交数据的接口对象
	 */
	interfaceSubmit:null,
	
	/**
	 * 回复留言区域容器
	 */
	entity:null,
	
	/**
	 * 提交回复按钮
	 */
	btnSubmit:null,
	
	/**
	 * 回复按钮链接
	 */
	linkSubmit:null,
	
	/**
	 * 取消回复按钮
	 */
	btnCancel:null,
	
	/**
	 * 取消按钮链接
	 */
	linkCancel:null,
	
	/**
	 * 输入内容字数提示span
	 */
	txtPrompt:null,
	
	/**
	 * 回复区域的ID，与留言的ID相对应
	 */
	ID:null,
	
	/**
	 * 最大字节数
	 */
	maxLength:600,
	
	/**
	 * 回复用户的UID
	 */
	replyUID:null,
	
	/**
	 * 是否已经显示
	 */
	isShowing:false,
	
	/**
	 * 要更新的模板节点名称数组
	 */
	nodeNames:["txtWriteBackPrompt","txtWriteBackContent","linkWriteBackSubmit","btnWriteBackSubmit","linkWriteBackCancel","btnWriteBackCancel"],
	
	/**
	 * 初始化
	 */
	initialize:function(ID,replyUID){
		this.interfaceSubmit=new Interface("http://wall.cws.api.sina.com.cn/reply.php","ijax");
		this.ID=ID;
		this.replyUID=replyUID;
	},
	
	/**
	 * 呈现回复区域框
	 */
	_render:function(){
		//字数限制在300个汉字
		this.limitWords(this.maxLength);
		
		//"回复"按钮事件
		Lib.checkAuthor();
		var _this=this;
		if ($isAdmin) {
			function _doSubmit(){
				var str = _this.txtContent.value;
				if (str.replace(/\s/g, "") == "") {
					winDialog.alert("请输入回复内容!");
				}
				else {
					_this.submit(str);
				}
				Core.Events.stopEvent();
			}
			Core.Events.addEvent(this.btnSubmit,_doSubmit, "click");
			
			Core.Events.addEvent(this.linkSubmit,function(){
				var e=Core.Events.getEvent();
				if(e.keyCode=="13"){
					_doSubmit();
				}
			},"keydown");
		}
		
		//"取消"按钮事件
		Core.Events.addEvent(this.btnCancel,function(){
			_this.hidden();
		},"click");
		Core.Events.addEvent(this.linkCancel,function(){
			var e=Core.Events.getEvent();
			if(e.keyCode=="13"){
				_this.hidden();
			}
		},"keydown");
	},
	
	/**
	 * 字数限制
	 * @param {Number} n 字节数(一个汉字两个字节)
	 */
	limitWords:function(n){
		var _this=this;
    	Utils.Form.limitMaxLen(this.txtContent, n);
		_this.txtPrompt.innerHTML = "还可以输入"+Math.floor(n/2)+"个汉字";
    	Core.Events.addEvent(this.txtContent, function(){
			var s = _this.txtContent.value;
	        if (Core.String.byteLength(s) > n) {
				_this.txtPrompt.innerHTML = "还可以输入0个汉字";
			}
			else {
				_this.txtPrompt.innerHTML = "还可以输入" + Math.floor((n - Core.String.byteLength(s)) / 2) + "个汉字";
			}
		}, "keyup");
	},
	
	/**
	 * 提交回复
	 * @param {String} message 回复的内容
	 */
	submit:function(message){
		var _this=this;
		this.interfaceSubmit.request({
			POST : {
				rid:_this.replyUID,	
				msg:message
			},
			onSuccess : function (data) {
				_this.onReplied();
			},
			onError : function (data) {
				winDialog.alert(
					$GUESTBOOK_MSG[data["code"]],
					{ icon : "02" }
				);
			},
			onFail : function (){
			}
		});
	},
	
	/**
	 * 回复成功后触发
	 */
	onReplied:function(){
		
	},
	
	/**
	 * 显示
	 */
	show:function(){
		if (!this.isShowing) {
			this.entity = $E("divWriteBack_" + this.ID);
			this.entity.style.display = "";
			this.entity.innerHTML = this.getNodesUpdatedHTML(scope.writeBackFieldTemplate, this.ID, this.nodeNames);
			this.txtContent = $E("txtWriteBackContent_" + this.ID);
			this.btnSubmit = $E("btnWriteBackSubmit_" + this.ID);
			this.linkSubmit= $E("linkWriteBackSubmit_" + this.ID);
			this.btnCancel = $E("btnWriteBackCancel_" + this.ID);
			this.linkCancel = $E("linkWriteBackCancel_" + this.ID);
			this.txtPrompt = $E("txtWriteBackPrompt_" + this.ID);
			this._render();
			this.isShowing=true;
			this.onShow();
		}
	},
	
	/**
	 * 隐藏
	 */
	hidden:function(){
		this.entity.style.display="none";
		this.entity.innerHTML="";
		this.isShowing=false;
		this.onHidden();
	},
	
	/**
	 * 显示时触发
	 */
	onShow:function(){
		
	},
	
	/**
	 * 隐藏时触发
	 */
	onHidden:function(){
		
	},
	
	/**
	 * 获取更新模板获取节点后的HTML
	 * @param {String} tempalte 模板
	 * @param {String} ID 留言的唯一ID
	 * @param {Array} nodeNames 要更新的节点名称
	 * @descriptioin
	 * 		ID="100"
	 * 		"<div id="#{divContent}"></div>"
	 * 		替换成
	 * 		"<div id="divContent_100"></div>"
	 */
	getNodesUpdatedHTML:function(template,ID,nodeNames){
		var i,len=nodeNames.length;
		for(i=0;i<len;i++){
			template=template.replace(new RegExp("#\{"+nodeNames[i]+"\}","g"),nodeNames[i]+"_"+ID);
		}
		return template;
	}
};