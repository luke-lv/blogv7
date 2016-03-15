/**
 * @fileoverview 举报对话框
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-01-15
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/form/sinput.js");
$import("sina/utils/form/radio.js");

$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/component/report/template.js");

/**
 * 举报对话框
 */
scope.GeneralReport=Core.Class.create();
scope.GeneralReport.prototype = {
	
	/**
	 * 举报类型
	 * 		"comment" 评论
	 * 		"blog" 博文
	 * 		"guestBook" 留言
	 * 		"friend" 添加好友
	 * 		"paperlist" 纸条
	 */
	type:"",
	
	/**
	 * 举报类型的数据配置
	 */
	_hashType:{
		//评论
		"comment" :{
			"class":"2",
			"initFunction":null
		},
		
		//博文
	 	"blog" : {
			"class":"1",
			"initFunction":null
		},
		
		//留言
	 	"guestBook" : {
			"class":"3",
			"initFunction":null
		},
		
		//好友请求
		"friend" : {
			"class":"4",
			"initFunction":null
		},

		//相册评论
		"photoComment" : {
			"class":"5",
			"initFunction":null
		},

		//纸条
		"paperlist" : {
			"class":"6",
			"initFunction":null
		}
	},
	
	/**
	 * 提交数据的接口对象
	 */
	dataInterface:null,
	
	/**
	 * 能否提交
	 */
	canSubmit:true,
	
	/**
	 * 举报内容的唯一ID
	 */
	bodyID:"",
	
	/**
	 * 被举报的UID
	 */
	reportUID:"",
	
	/**
	 * 用户名称信息1的HTML
	 */
	userNameInfo1:"",
	
	/**
	 * 用户名称信息2的HTML
	 */
	userNameInfo2:"",
	
	/**
	 * 标题的HTML
	 */
	titleInfo:"",
	
	/**
	 * 被举报人的昵称
	 */
	nickName:"",
	
	/**
	 * 摘要内容的信息
	 */
	contentInfo:"",
	
	/**
	 * 纸条举报人的UID
	 */
	tUID:"",
	
	/**
	 * 对话框是否已经初始化
	 */
	_isInitDialog:false,
	
	/**
	 * 对话框对象
	 */
	_dialog:null,
	
	initialize: function(){
		this.dataInterface=new Interface("http://control.blog.sina.com.cn/admin/advice/impeach_post_content.php?version=7","ijax"); 
		this._hashType["comment"]["initFunction"]=this._commentInit;
		this._hashType["blog"]["initFunction"]=this._blogInit;
		this._hashType["guestBook"]["initFunction"]=this._guestBookInit;
		this._hashType["friend"]["initFunction"]=this._friendInit;
		this._hashType["photoComment"]["initFunction"]=this._photoCommentInit;
		this._hashType["paperlist"]["initFunction"]=this._paperlistInit;
	},
	
	/**
	 * 显示对话框
	 */
	show:function(){
		!this._isInitDialog && this._initDialog();
		this._dialog.setAreaLocked(true);
		this._dialog.setMiddle();
		this._dialog.show();
		this._isInitDialog=true;
		this._hashType[this.type]["initFunction"].call(this);
	},
	
	hidden:function(){
		this._dialog.hidden();
	},
	
	clear:function(){
		var nd=this._dialog.nodes;
		nd.resumeInfo.innerHTML="";
		nd.resumeContent.value="";
		nd.cbBlogHost.checked=false;
		Utils.Form.Radio.set($N("chocla"),"");
		nd.reportReason.value="";
	},
	
	submit:function(){
		var me=this;
		this.dataInterface.request({
			POST : {
				"body_id" : me.bodyID,
				"class" : me._hashType[me.type]["class"],
				"type" : Utils.Form.Radio.get($N("chocla")),
				"fnickname":me.nickName,
				"fuid":me.reportUID,
				"tuid":me.tUID,
				"reason":me._dialog.nodes["reportReason"].value,
				"is_report":me._dialog.nodes["cbBlogHost"].checked
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
			content:scope.reportStartTpl
		});
		var me=this,
			nd=this._dialog.nodes;
			
		this._dialog.addEventListener("hidden",function(){
			me.clear();
		});
		
		Core.Events.addEvent(nd.btnOk,function(){
			if (me.canSubmit) {
				me.canSubmit=false;
				me.submit();
			}
		},"click");
		Core.Events.addEvent(nd.btnCancel,function(){
			me._dialog.hidden();
		},"click");
		
		Utils.Form.limitMaxLen(nd.reportReason,400);
	},
	
	/**
	 * 初始化评论摘要 			
	 */
	_commentInit:function(){
		this._dialog.nodes["resumeInfo"].innerHTML="您要举报的是"+this.userNameInfo1+"在博文"+this.titleInfo+"中发表的评论，摘要如下：";
		this._dialog.nodes["resumeContent"].value=this.contentInfo;
		this._dialog.nodes["cbBlogHost"].checked=false;
	},
	
	/**
	 * 初始化博文摘要
	 */
	_blogInit:function(){
		this._dialog.nodes["resumeInfo"].innerHTML="您要举报的是"+this.userNameInfo1+"发表的"+this.titleInfo+"，摘要如下：";
		this._dialog.nodes["resumeContent"].value=this.contentInfo;
		this._dialog.nodes["cbBlogHost"].checked=false;
	},
	
	/**
	 * 初始化留言摘要
	 */
	_guestBookInit:function(){
		this._dialog.nodes["resumeInfo"].innerHTML="您要举报的是"+this.userNameInfo1+"在"+this.userNameInfo2+"博客的留言，摘要如下：";
		this._dialog.nodes["resumeContent"].value=this.contentInfo;
		this._dialog.nodes["cbBlogHost"].checked=false;
	},
	
	/**
	 * 初始化好友邀请摘要
	 */
	_friendInit:function(){
		this._dialog.nodes["resumeInfo"].innerHTML="您要举报的是"+this.userNameInfo1+"给您发的好友申请，摘要如下：";
		this._dialog.nodes["resumeContent"].value=this.contentInfo;
		this._dialog.nodes["cbBlogHost"].checked=true;
	},
	
	/**
	 * 初始化图片评论摘要 			
	 */
	_photoCommentInit:function(){
		this._dialog.nodes["resumeInfo"].innerHTML="您要举报的是"+this.userNameInfo1+"在图片"+this.titleInfo+"中发表的评论，摘要如下：";
		this._dialog.nodes["resumeContent"].value=this.contentInfo;
		this._dialog.nodes["cbBlogHost"].checked=false;
	},
	
	/**
	 * 初始化纸条摘要 			
	 */
	_paperlistInit:function(){
		this._dialog.nodes["resumeInfo"].innerHTML="您要举报的是"+this.userNameInfo1+"给您发送的纸条，摘要如下：";
		this._dialog.nodes["resumeContent"].value=this.contentInfo;
		this._dialog.nodes["cbBlogHost"].checked=false;
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