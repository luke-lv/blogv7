/** 
 * @fileoverview 评论及回复的删除
 * @author gaolei | gaolei2@staff.sina.com.cn
 */

$import("sina/core/class/oop.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/removeNode.js");
$import("sina/ui/slide.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");

$import("lib/commentv2/_comment.js");

CommentV2.Delete = function(opt){
	// this.jsonUtil = Utils.Json;
	
	// this.init(opt);
	Lib.checkAuthor();
}.$define({

	// init: function(){

	// },
	/** 
	 *	评论删除
	 * @param opt 通过事件代理传递过来的参数
	 * @param delSucc 删除成功后的回调函数
	 */
	deleteComment: function(opt, delSucc){

		trace("CommentV2.CommentDel.deleteComment");
		var __this = this;
		var data = opt.data;
		
		var styleState = "", subText = "", title = "确认需要删除此条评论？<br/>删除后不可恢复。";
		
		if($UID==data.comm_uid||data.comm_uid==0){// 如果删除自己的评论，或者删除匿名评论，不显示拉黑subText
			styleState=' style="display:none" ';
		}
		
		if (data.fromProduct !== "qing"){//来自qing的评论删除的时候不能加入黑名单
			subText = '<div '+styleState+'><input id="cbAddToBlock_'+data.commentid+'" type="checkbox"/><label for="cbAddToBlock_'+data.commentid+'">将此人加入黑名单</label></div>'
		}
		
		this.del_url = new Interface("http://control.blog.sina.com.cn/admin/comment_new/cms_del_post.php", "ijax");
		
		winDialog.confirm(title,{
			subText: subText,
			textOk:'删除',
			funcOk:function(){
				var deleteOption = {
					POST:{
						"article_id": data.articleid,		// 文章ID
						"cms_id": data.commentid,		// 评论ID
						"cms_uid": data.comm_uid,	// 评论发布者UID
						"login_uid": $UID,					// 当前登录用户
						"inblack": $E("cbAddToBlock_"+data.commentid).checked ? 1 : 0	// 是否加入黑名单
					},
					onSuccess: function(result){
						var node = $E("body_cmt_"+data.commentid).parentNode.parentNode;
						var slide = new Ui.Slide(node);
						slide.onSlideOut = function(){
							Core.Dom.removeNode(node);
						}
						slide.slideOut();
						if (delSucc && typeof delSucc === "function"){
							delSucc(result);
						}
					},
					onError: function(result){
						__this.showError(result);
					},
					onFail: function(result){
						__this.showError(result);
					}
				}
				__this.del_url.request(deleteOption);
			}
		});
	},
	
	/** 
	 *	回复删除
	 * TODO 大部分操作类似评论，其实可以提出来公用
	 * @param opt 通过事件代理传递过来的参数
	 * @param delSucc 删除成功后的回调函数
	 */
	
	deleteReply: function(opt, delSucc){
		trace("CommentV2.CommentDel.deleteReply");
		// trace(opt);
		
		var __this = this;
		var data = opt.data;
		var styleState = "", subText = "", title = "确认需要删除此条回复？<br/>删除后不可恢复。";
		
		if($UID==data.comm_uid){
			styleState=' style="display:none" ';
		}
		
		if (data.fromProduct !== "qing"){//来自qing的评论删除的时候不能加入黑名单
			subText = '<div '+styleState+'><input id="cbAddToBlock_'+data.commentid+'" type="checkbox"/><label for="cbAddToBlock_'+data.commentid+'">将此人加入黑名单</label></div>'
		}
		
		this.del_url = new Interface("http://control.blog.sina.com.cn/admin/comment_new/cms_del_usereply_post.php", "ijax");
		
		winDialog.confirm(title,{
			subText: subText,
			textOk:'删除',
			funcOk:function(){
				var deleteOption = {
					POST:{
						"article_id": data.articleid,				// 文章ID
						"cms_id": data.replyid,					// 回复ID
						"cms_uid": data.comm_uid,						// 回复发布者UID
						"login_uid": $UID,							// 当前登录用户
						"source_uid": data.source_uid,		// 被回复人的UID
						"stair_cmsid": data.commentid,		// 一级评论ID
						"inblack": $E("cbAddToBlock_"+data.commentid).checked ? "1" : "0"	// 是否加入黑名单
					},
					onSuccess: function(result){
						var node = $E("reply_"+data.replyid);
						var slide = new Ui.Slide(node);
						slide.onSlideOut = function(){
							Core.Dom.removeNode(node);
						}
						slide.slideOut();
						if (delSucc && typeof delSucc === "function"){
							delSucc(result);
						}
					},
					onError: function(result){
						__this.showError(result);
					},
					onFail: function(result){
						__this.showError(result);
					}
				}
				__this.del_url.request(deleteOption);
			}
		});
	},
	
	showError: function(result){
		if (result.code == "B00006"){
			return;
		}
		winDialog.alert(($SYSMSG[result.code]||"删除失败，请重试"),{
			"icon": "02"
		});
	}
});
