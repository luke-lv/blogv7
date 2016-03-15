/**
 * @fileoverview 留言垃圾箱
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-12-25
 */

$import("sina/sina.js");
$import("lib/interface.js");
$import("product/spam/spam.js");
$import("jobs/resource.js");
$import("lib/dialogConfig.js");

$registJob("guestBookSpam", function(){
	var cbList=$N("ids[]");
	var selectAllCbs=[$E("selectAll1")];
	var removeButtons=[$E("deleteAll1")];
	var restoreButtons=[$E("resumePage1")];
	var removeAllButtons=[$E("clearAll1")];
	var objInterfaceSet={
		removeInterface:new Interface("http://control.blog.sina.com.cn/admin/wall/walladmin_spam_del.php", "ijax"),
		removeAllInterface:new Interface("http://control.blog.sina.com.cn/admin/wall/walladmin_spam_clear.php", "ijax"),
		restoreInterface:new Interface("http://control.blog.sina.com.cn/admin/wall/walladmin_spam_resume.php", "ijax")
	};
	
	var spam=new scope.Spam(cbList,selectAllCbs,removeButtons,restoreButtons,removeAllButtons,objInterfaceSet);
	spam.type="guestBook";
	
	//恢复按钮
	window.wallResume=function(ID){
		spam.spamBase.restore(ID);
	};
	
	//删除按钮
	window.wallDelete=function(ID,uid){		
		var friendUID = uid; 		
		var styleState="";
		if($UID==friendUID||friendUID==0){
			styleState=' style="display:none" ';
		}		
		winDialog.confirm($RESOURCE.delete_guestBookspam, {
			subText:'<div '+styleState+'><input id="ccbAddToBlock" type="checkbox"/><label for="ccbAddToBlock">将此人加入黑名单</label></div>',
			textOk:'删除',
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
				//删除留言
				spam.spamBase.remove(ID);
			}
		});
		
	};

});