/**
 * @fileoverview 取消关注
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");

$import("lib/dialogConfig.js");

$import("product/attention/attention.js");

$registJob("cancelAttention", function(){
	window.$cancelAttention = function(uid,aid){
		winDialog.confirm("确定要取消此关注吗?",{
			subText:"取消关注后，对方的动态不会在你的关注动态中显示，你也不会在对方的“谁在关注”的列表中显示。",
			funcOk:function(){
				(new scope.Attention()).cancel(uid,aid);
			}
		});		
	};
});