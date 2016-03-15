/**
 * @author darkty2009
 */
$import("sina/core/events/stopEvent.js");
$import("lib/interface.js");
$import("lib/showError.js");
$import("lib/dialogConfig.js");
$import("jobs/resource.js");

$registJob("friendlist", function() {
	
	window.delfriend = function(id, type) {
		
		var msg = $RESOURCE['friend_del'];
		var tips = '<p  class="c666"><input type="checkbox" id="addToBlackList" class="iptChk" />'+$RESOURCE['black_1']+'</p><p class="c999 l20">'+$RESOURCE['black_2']+' </p>';
		
		winDialog.confirm(msg, {
			subText: tips,
			icon:"04",
			funcOk : function () {
				try {
	Core.Events.stopEvent();
}catch(e) {

}
				var _data = {
						friend_uid : id
					};
				if($E("addToBlackList").checked == true){
					_data.inblack = "1";
				}
				 var _ignore = new Interface("http://control.blog.sina.com.cn/riaapi/profile/DelFriend.php?version=7", "jsload");
				 _ignore.request({
				 	GET : _data,
					onSuccess : function () {
						window.location.reload();
					},
					onError : function (_data) {
						showError(_data.code);
					},
					onFail : function () {
					}
				 });
			}
		});	
		
	};
	
});
