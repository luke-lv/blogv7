/**
 * @fileoverview 评论垃圾箱
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-12-25
 */

$import("sina/sina.js");
$import("lib/interface.js");
$import("product/spam/spam.js");


$registJob("commentSpam", function(){
	var cbList=$N("ids[]");
	var selectAllCbs=[$E("selectAll1")];
	var removeButtons=[$E("deleteAll1")];
	var restoreButtons=[$E("resumePage1")];
	var removeAllButtons=[$E("clearAll1")];
	var objInterfaceSet={
		removeInterface:new Interface("http://control.blog.sina.com.cn/admin/comment/comment_recycle_del.php", "ijax"),
		removeAllInterface:new Interface("http://control.blog.sina.com.cn/admin/comment/comment_clear_del.php", "ijax"),
		restoreInterface:new Interface("http://control.blog.sina.com.cn/admin/comment_new/cms_resume_post.php", "ijax")
	};
	
	var spam=new scope.Spam(cbList,selectAllCbs,removeButtons,restoreButtons,removeAllButtons,objInterfaceSet);
	spam.type="comment";
	
	//恢复按钮
	window.commentResume=function(ID){
		spam.spamBase.restore(ID);
	};
	
	//删除按钮
	window.commentDelete=function(ID){		
		var styleState="";
		var friendUID = $E('nick_'+ID.split('|')[1]).getElementsByTagName('a')[0].href.match(/\d+/)[0];
		if(scope.$uid==friendUID||friendUID==0){
			styleState=' style="display:none" ';
		}						
		winDialog.confirm('确认需要删除此条评论？<br/>删除后无法恢复。', {
			textOk:'删除',
			subText:'<div '+styleState+'><input id="ccbAddToBlock" type="checkbox"/><label for="cbAddToBlock">将此人加入黑名单</label></div>',
			funcOk:function() {
				//加入黑名
				if ($E("ccbAddToBlock").checked) {
					new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/deleblackuid.php", "jsload").request({
						GET: {
							uid: $UID,
							friend_uid: friendUID,
							inblack: 1
						},
						onSuccess: function(res){
						
						},
						onError: function(res){
						
						}
					});
				}
				spam.spamBase.remove(ID);
			}
		});
	};
});