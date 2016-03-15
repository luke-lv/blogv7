/**
 * @fileoverview
 *	修改用户密码
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/system/getParam.js");

$import("lib/jobs.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/showError.js");

$import("msg/account.js");
$registJob("modifyPassword", function () {
	
		function change_password(){
		if($E("old_pw").value == ""){
			showError("A45001");
			return;
		}
		if($E("new_pw").value == ""){
			showError("A45002");
			return;
		}
		if($E("new_pw_retype").value == ""){
			showError("A45003");
			return;
		}
		if($E("new_pw_retype").value != $E("new_pw").value){
			showError("A45004");
			return;
		}
		var sace_accout = new Interface("http://control.blog.sina.com.cn/riaapi/profile/modify_pass_post.php?version=7", "ijax");
		sace_accout.request({
			POST : {
				"oldpasswd" : $E("old_pw").value,
				"passwd" : $E("new_pw").value,
				"passwd2" : $E("new_pw_retype").value,
				"uid" : scope.$uid,
				"productid" : Core.System.getParam("productid")
			},
			onSuccess : function(){
				winDialog.alert($SYSMSG.A45007, {
	  				funcOk: function(){
						window.location.href ="http://blog.sina.com.cn/u/" + scope.$uid;
						return false;
					},
	  				textOk: "确定",
	  				title:	"提示",
	  				icon:	"03"  // 可选值："01"、"02"、"03"、"04"、"05"
	  			}); 
			},
			onError : function(result){
				showError(result.code);
			}
		});
	}
	Core.Events.addEvent("save_btn", change_password);
	
});
