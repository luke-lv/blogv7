/**
 * 个人中心推人模块
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 */
$import("lib/component/class/comp_baseClass.js");
$import("lib/component/class/registComp.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("msg/pushcode.js");

$registComp(993, {
	
	load : function(){
			this.bindBtn();
	},
	__getInfo:function(){
		var that = this;
		var _entry = new Interface("http://control.blog.sina.com.cn/riaapi/profile/show_suggest.php", "jsload");
		_entry.request({
			onSuccess : function(res){
				
				that.setContent(res);
				that.bindBtn();
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
	},
	bindBtn : function(){
		var that = this;
		var changeBtn = $E("changeSuggest");
		if(changeBtn){
			changeBtn.onclick = function(){				
				that.__getInfo();
				return false;
			};
		}
	}
});
