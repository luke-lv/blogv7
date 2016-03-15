/**
 * @desc	百合感言浮层
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */
 
$import("comps/baihe/happyDialog.js");
$import("comps/baihe/gladDialog.js");
$import("comps/baihe/regDialog.js");
$import("comps/baihe/shareDialog.js");
$import("comps/baihe/login.js");
$import("comps/sinaflash.js");
$import("comps/baihe/luckyTimes.js");

$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");

$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByClass.js");


$registJob("happyDialog", function(){
	
	// 加载 flash，不用判断 flash 加载成功与否。因为是 flash 先回调 js。
	Lib.checkAuthor();
	
	var luckyBox = $E("luckyBox");
	luckyBox.innerHTML = "";
	
	var __fl = new sinaFlash(
		"http://client.sina.com.cn/201012baihe/goodluck_cs33.swf?blogUid="+$UID+"&t="+(new Date().getTime()),
		"luckyBoxObj",				// object 标签 id
		"595px",
		"280px",
		"9",
		"#FFFFFF",
		false,
		"high",
		"http://www.sina.com.cn/",
		"http://www.sina.com.cn/",
		false
	);
	__fl.addParam("allowScriptAccess", "always");
	__fl.addParam("wmode", "transparent");
	__fl.addVariable("blogUid", $UID);
	__fl.write("luckyBox");
	
	
	// 没法使用他们的 AS。
	// window.$luckyBoxObj = $E("luckyBoxObj");
	
	
	// 调注册浮层
	var __regDial = new Baihe.regDialog({
		onSuccess:function(){				// 注册成功后
			window.location.reload();
		}
	});
	__regDial.setTitle("为保证中奖后能联系到您，请准确填写");
	__regDial.hideSomeFormItems(7);
	
	// 绍敏接口调用后，flash 的回调
	window.callBaiheRegist = function(){
		__regDial.show();
	};
	
	
	// flash 中奖后的回调相关
	var happyTimesCtrl = Baihe.luckyTimes.init();
	var gd = new Baihe.gladDialog();
	var hd = new Baihe.happyDialog();
	function subLuckyTime(){				// 更新中奖数
		trace("sub times");
		Lib.checkAuthor();
		new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=get_lot_num1", "ijax").request({
			GET:{
				t:	new Date().getTime()
			},
			onSuccess:function(res){
				Baihe.luckyTimes.init().update(res);
			},
			onError:function(){
				__this.happyTimes.innerHTML = 0;
			},
			onFail:function(){
				__this.happyTimes.innerHTML = 0;
			}
		});
	}
	window.callBaiheHappyWords = function(awardId){
		trace("award_"+awardId);
		awardId = (+awardId);
		if(awardId==12){					// 中 ipad 奖
			setTimeout(function(){
				hd.show(awardId);
			}, 3500);
		}else if(awardId==0){				// 未中奖
			trace("redBean_"+scope.$is_getredbean);
			if(scope.$life_stages == "single" && !(+scope.$is_getredbean)){		// 1 是拿过红豆了
				setTimeout(function(){
					gd.show();
				}, 3500);
			}
		}
		subLuckyTime();
	};
	
	// 抽奖flash开始前的预判断
	window.f_j_baihe = function(){
		new Baihe.userIdChange().isUserChange();
		if(!$isLogin){						// 未登录
			trace("f_j：unlogin");
			mode1("权限错误，用户未登录");
			return false;
		}else if($isUserChange){			// 帐号改变，应保证登录先判断
			trace("f_j：changed");
			mode1("权限错误，用户已变更");
			return false;
		}
		trace("f_j：normal");
		return true;						// 状态正常
		
		function mode1(str){
			setTimeout(function(){window.location.reload();}, 3000);
			winDialog.alert(str, {
				funcOk:function(){window.location.reload();},
				funcClose:function(){window.location.reload();}
			});
		}
	};
	
	
	
});






