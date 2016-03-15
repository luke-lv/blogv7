/** 
 * @fileoverview 评论及回复的举报
 * @author gaolei | gaolei2@staff.sina.com.cn
 */
$import("sina/core/class/oop.js");
$import("lib/component/report/blogReport.js");
$import("lib/interface.js");
$import("lib/commentv2/_comment.js");
// TODO 需要测试，据说这里不需要前端修改，如果不需要，可以把replyReport和blogReport合并。
// 已经合并为一个方法,为了保证灵活度保留了2个入口

CommentV2.Report = function(){
	// 举报组件
	this.BR = new Lib.BlogReport();
	this.getInterface = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/getCms.php", "jsload");
}.$define({
	/**
	 * 举报评论
 	 */
	commentReport: function(data){
		trace("CommentV2.Report.commentReport");
		var param = {
			cms_id: data.commentid,
			uid: data.src_uid
		};
		this.setReport(data, param);
	},
	
	/**
	 * 举报回复
 	 */
	replyReport: function(data){
		trace("CommentV2.Report.replyReport");
		var param = {
			cms_id: data.replyid,
			uid: data.src_uid
		};
		this.setReport(data, param);
	},
	/**
     * 举报操作
	 **/
	setReport:function(data, param) {
		var __this = this;
	 	var	bID = scope.$articleid,			// 博文ID
				cID = data.commentid,			// 评论ID，回复跟这个有区别
				bodyID = bID+"_"+cID, 	
				nickName = data.uname, 		// 发评论人的昵称
				reportUID = data.comm_uid,	// 评论ID
				userNameInfo1 = "",				// 用户信息
				userNameInfo2 = "",				// 这个貌似没用，旧版本举报也没用到，猜测是举报人的时候有用
				titleInfo = '<a target="_blank" href="http://blog.sina.com.cn/s/blog_'+bID+'.html">'+$E("t_"+bID).innerHTML+'</a>';	// 文章相关信息
		data.ulink = data.ulink ? data.ulink : "http://blog.sina.com.cn/u/"+data.comm_uid;
		if (data.comm_uid != 0){
			userNameInfo1 = '<a href="'+data.ulink+'" target="_blank">'+nickName+'</a>';
		}else{// 匿名
			userNameInfo1 = '<strong>'+nickName+'</strong>';
		}
		this.getInterface.request({
			GET: param,
			onSuccess: function(res){
				var contentInfo = res.cms_body;
				__this.BR.start("comment",nickName,bodyID,reportUID,userNameInfo1,userNameInfo2,titleInfo,contentInfo);
			},
			onError: function(res){
				
			},
			onFail: function(){
			}
		});
	 }
});