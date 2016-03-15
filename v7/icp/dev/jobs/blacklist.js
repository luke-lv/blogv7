/**
 * @author darkty2009
 */
$import("sina/core/events/stopEvent.js");
$import("lib/interface.js");
$import("lib/showError.js");
$import("jobs/resource.js");

$registJob("blacklist", function() {
	
	window.delblack = function(id, type) {
		
		winDialog.confirm($RESOURCE['black_del'], {
			funcOk : function() {
				try {
					Core.Events.stopEvent();
				}catch(e) {
				
				}
				new Interface("http://control.blog.sina.com.cn/riaapi/profile/DelBlack.php?version=7", "jsload").request({
					GET : {
						black_uid : id
					},
					onSuccess : function() {
						window.location.reload();
					},
					onError : function(res) {
						showError(res.code);
					},
					onFail : function(res) {
						showError(res.code);
					}
				});
			}
		});
		
	};
	
});
