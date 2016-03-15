/**
 * @desc	结果页呼出注册浮层
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("sina/core/events/addEvent.js");

$import("comps/baihe/regDialog.js");
$import("comps/baihe/login.js");
$import("comps/baihe/pageLogin.js");


$registJob("result_toReg", function(){
	
	var more_call = $E("more_call");
	var more_detail = $E("more_detail");
	var hot_call_list = $E("hot_call_list");
	var allImg = hot_call_list.getElementsByTagName("li");
	
	var regDial = new Baihe.regDialog({
		onSuccess:function(){									// 注册成功后
			window.location.href = "http://www.baihe.com";		// 刘冲？
		}
	});
	regDial.setTitle("为保证中奖后能联系到您，请准确填写");
	regDial.hideSomeFormItems(7);
	
	if(more_call) Core.Events.addEvent(more_call, showRegIfCan, "click");
	if(more_detail) Core.Events.addEvent(more_detail, showRegIfCan, "click");
	for(var i=0; i<allImg.length; i++){
		var targ = allImg[i];
		Core.Events.addEvent(targ, showRegIfCan, "click");
	}
	
	function showRegIfCan(){			// 页面太难进入，所以尽量这里不刷新了。
		if(Baihe.userChangeDetected()) return;			// 登录组件已引本类
		new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=checkexist&data=test_page", "jsload").request({
			onSuccess:function(res){			// 未注册过
				regDial.show();
			},
			onError:function(res){				// 注册过
				window.location.href = "http://www.baihe.com";		// 刘冲？
			}
		});
	}
	
});


