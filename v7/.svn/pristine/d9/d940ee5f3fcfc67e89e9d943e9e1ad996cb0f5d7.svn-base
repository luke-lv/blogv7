/**
 * @fileoverview 移除关注
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");

$import("lib/dialogConfig.js");

$import("product/attention/attention.js");

$registJob("removeAttention", function(){
	window.$removeAttention = function(uid,aid){
		winDialog.confirm("确定要移除此人吗？移除后，此人将不在你的列表中显示，也不能接收你的动态。",{
			subText:'<input type="checkbox" id="cbIsBlack"/><label for="cbIsBlack">加入黑名单</label><br/>'+
					'被加入后，对方再也不能给你留言、发纸条，不能加你为好友、不能加你为关注，不会在你的访客中留下访问记录。',
			funcOk:function(){
				var isBlack=$E("cbIsBlack").checked?"1":"0";
				(new scope.Attention()).remove(uid,aid,isBlack);
			}
		});
	};
});