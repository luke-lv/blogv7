/**
 * @fileoverview 动态基础
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-14
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");

$import("lib/interface.js");

$import("msg/feed.js");


/**
 * 动态
 */
scope.FeedBase=Core.Class.create();
scope.FeedBase.prototype={
	
	/**
	 * 动态类型
	 * 		"personal" 个人动态
	 * 		"attention" 关注动态
	 */
	type:"friend",
	
	/**
	 * 数据筛选
	 * 		"all" 全部
	 * 		"blog" 博文
	 * 		"photo" 图片
	 * 		"video" 视频
	 */	
	filter:"all",
	
	/**
	 * 初始化
	 */
	initialize:function(){
		
	},
	
	
	/**
	 * 获取数据
	 * @param {function} callBack 回调函数
	 * @param {String} uid 用户ID
	 * @param {Number} pageID 当前页ID
	 */
	updateData:function(callBack,uid,pageID){
		//接口地址
		var hashUrl={
			"personal":"http://control.blog.sina.com.cn/riaapi/feed/feedlist_v7.php",
			"attention":"http://control.blog.sina.com.cn/riaapi/feed/feed_attention_list_v7.php"
		};
		
		//数据筛选参数
		var	hashFilter={
			"all":"0",
			"blog":"1",
			"video":"2",
			"photo":"3"
		};
		
		var filter=hashFilter[this.filter];
		var url=hashUrl[this.type];


		(new Interface(url, "jsload")).request({
			GET : {
				uid:uid,
				page:pageID,
				type:filter,
				version:"7"
			},
			onSuccess : function (content) {
				callBack(content["data"],content["count"]);
			},
			onError : function (content) {
				var failContent='内容读取失败,请尝试<a href="'+window.location.toString().replace(/#.*/,"")+'">刷新</a>页面再次查看';
				callBack(failContent);
			},
			onFail : function (){
				var failContent='内容读取失败,请尝试<a href="'+window.location.toString().replace(/#.*/,"")+'">刷新</a>页面再次查看';
				callBack(failContent);
			}
		});
		return false;
		
	}
};

