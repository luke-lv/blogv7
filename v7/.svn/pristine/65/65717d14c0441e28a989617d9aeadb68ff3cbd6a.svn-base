/**
 * @author darkty2009
 */
$import("product/attention/attention.js");
$import("jobs/resource.js");

$registJob("attention", function() {
	var att = new scope.Attention();
	
	window.$cancelAttention = function(uid, aid) {
		winDialog.confirm("是否要取消关注？", {
			funcOk:function() {
				att.cancel(uid, aid);
			}
		});
	}
	
	window.$removeAttention = function(uid, aid) {
		var msg = '确定要移除此人吗？移除后，此人将不在你的列表中显示，也不能接收你的动态。';
		var tips = '<p  class="c666"><input type="checkbox" id="addToBlackList" class="iptChk" />'+$RESOURCE['black_1']+'</p><p class="c999 l20">'+$RESOURCE['black_2']+' </p>';
		winDialog.confirm(msg, {
			subText: tips,
			icon:"04",
			funcOk : function () {
				att.remove(uid, aid, $E("addToBlackList").checked?1:0);
			}
		});	
	}
});
