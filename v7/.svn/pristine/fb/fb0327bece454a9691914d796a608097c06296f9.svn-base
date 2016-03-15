/**
 * 搜人项目下你可能认识的人
 * @author zhihan | zhihan@staff.sina.com.cn
 * @version 1.0
 * @history
 */
$import("lib/jobs.js");
$import("lib/component/class/_class.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("msg/pushcode.js");
$import("sina/utils/io/ajax.js");

$registJob("spCompPush", function () {
	var load = function() {
		var _entry = new Interface("http://control.blog.sina.com.cn/riaapi/profile/show_suggest.php?sp=yes", "jsload");
		_entry.request({
			onSuccess : function(res){
				$E('suggestBody').innerHTML = res;
				bindBtn();
			},
			onError : function(res){
				if(res.code == "A00007"){	//未登录
					winDialog.alert($SYSMSG[res.code]);
				}
				if(res.code == "A00008"){	//uid 非博主。
					winDialog.alert($SYSMSG[res.code]);
				}
				if(res.code == "A11007"){	//非博客用户直接跳转。
					window.location.href = "http://blog.sina.com.cn/u/"+$UID;
				}
			}
		});
	}
	
	var bindBtn = function() {
		var changeBtn = $E("changeSuggest");
		if(changeBtn){
			changeBtn.onclick = function(){
				load();
				return false;
			};
		}
	}
	bindBtn();
});