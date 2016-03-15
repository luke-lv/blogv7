/**
 * @fileoverview 博客评论并转载
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-03-17
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/system/winSize.js");

$import("lib/interface.js");
$import("lib/panel.js");

$import("msg/articleQuoteMSG.js");
$import("article/quote.js");

var CommentQuote=Core.Class.create();
CommentQuote.prototype = {
	
	_isInitTip:false,
	
	_tip:null,
	
	quote:null,
	
	commentText:"",
	
	articleID:"",
	
	interfaceSave:null,
	
	initialize:function(){
		this.interfaceSave=new Interface("http://control.blog.sina.com.cn/riaapi/article/edit_cat.php","ijax");
		this._initQuote();
	},
	
	_initQuote:function(){
		var me=this;
		this.quote=new Quote();
		this.quote.onSuccess=function(aID,url){
			me.hideTip();
			winDialog.alert("博文已成功转载！<br/><span style='font-weight: 100; font-size: 12px;'><a target='_blank' href='" + url + "'>查看转载博文>></a></span>", {
							icon: "03"});
			me.onSuccess();
		};
		this.quote.onError=function(){
			me.hideTip();
		};
	},
	
	showTip:function(text){
		var tp,
			win=Core.System.winSize();
			
		!this._isInitTip && this._initTip();
		tp=this._tip;
		tp.getNodes().content.innerHTML=text;
		
		//让tip居中显示
		tp.visibility="hidden";
		tp.show();
		tp.setPosition(win.width/2-(+tp.entity.offsetWidth)/2,
						win.height/2-(+tp.entity.offsetHeight)/2);
		tp.visibility="";
		tp.setFixed(true);
	},
	
	check:function(articleID,commentText){
		this.articleID=articleID;
		this.commentText=commentText;
		this.quote.check(articleID,commentText,"1");
	},
	
	hideTip:function(){
		this._tip && this._tip.hidden();
	},
	
	_initTip:function(){
		this._tip=new Lib.Panel();
		this._tip.setTemplate(['<div id="#{panel}" style="z-index:512;border:1px solid #CC9933; background:#FFFFCC; padding:20px;">',
									'<div id="#{content}"></div>',
								'</div>'].join(""));
		this._isInitTip=true;
	},
	
	onSuccess:function(){}
};