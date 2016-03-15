/**
 * @fileoverview 读取需要推广的群博客的数据
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/string/trim.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("msg/attention.js");

/**
 * 关注
 */
scope.LoadPromoteCrowds = Core.Class.create();
scope.LoadPromoteCrowds.prototype={
	
	/**
	 * 添加关注的接口地址
	 */
	loadPromoteCrowdsUrl:"http://control.blog.sina.com.cn/riaapi/profile/attention_pop_group.php",
	
	/**
	 * 加载推广群数据的接口
	 */
	interfaceLoadPromoteData:null,
	
	/**
	 * 初始化
	 */
	initialize:function(){
		//this.interfaceLoadPromoteData = new Interface('http://127.0.0.1/blog7_702_promotecrowd/interface.js',"jsload");
		this.interfaceLoadPromoteData = new Interface(this.loadPromoteCrowdsUrl,"jsload");
	},
	
	/**
	 * 
	 * @param {Number} uid blog用户ID
	 * @param {UpdatePromoteCrowdsEl} el 群博客推广面板更新类
	 */
	load:function(uid, el){
		var _this=this;
		this.interfaceLoadPromoteData.request({
			GET : {
				uid : uid
			},
			onSuccess : function (data) {
				el.setPromoteData(data);
				el.updateEl();
			},
			onError : function (data) {
				el.updateEl([]);
				/*
				winDialog.alert($ATTENTION_MSG[data.code],{
					funcOk:_this.errorHandle, 
					funcClose:_this.errorHandle,
					icon : "02" 
				});
				*/
			},
			onFail : function (){
				el.updateEl([]);
			}
		});
	},
	
	/**
	 * 有错误时，关闭提示框时触发
	 */
	errorHandle:function(){
		
	}
	
};