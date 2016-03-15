$import('sina/core/system/winSize.js');
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("lib/LocalDB.js");
$import("lib/component/msnGuide/msnGuide.js");
/**
 * @fileoverview msn搬家用户引导
 * @author zhangkai2@staff.sina.com.cn
 * @created 2010-12-22
 */
$registJob("msnGuide", function(){
	/*
	显示彩蛋规则
	1 搬家用户 或是 connect用户
	2 如果不是新搬家用户 前5天按照用户UID取模 和 上线天数作比较 判断彩蛋是否出现
	3 判断用户是否点击过彩蛋*/
	//检测是否是 搬家用户 或是connect用户
	if(Utils.Cookie.getCookie('msnBindInfo') !== $UID+"_1" && !(scope.$private && scope.$private.isMsnMove == 1)){
		return;
	}
	
	//通过referrer判断是否是新搬家用户
	if(document.referrer.indexOf("http://move.blog.sina.com.cn/msnmove/migration_ready.php")<0){
		//非新搬家用户  则在上线日期5天之内 选择性的为用户显示彩蛋
		//现显示规则为 如果UID%5等于上线天数-1 则为该用户显示彩蛋
		//上线日期!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		
		//month参数从0开始 代表1月
		//详细https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date
		var startDate=new Date(2010,11,29);
		var currentDate =new Date();
		//一天为86400000毫秒
		if((currentDate-startDate)/86400000<5 && $UID%5!==(parseInt((currentDate-startDate)/86400000))){
			//不符合规则 直接返回
			return;
		}
	}
	
	//检测LocalDB所需flash是否已加载
	if (Lib.LocalDB.FlaDom) {
		setTimeout(function(){displayMulticolorEggFlash();},1000);
	}else{
		//这块要检查下有问题没!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		var localStoreFlashContainer=$C("div");
		localStoreFlashContainer.id="localStoreFlashContainer";
		localStoreFlashContainer.style.cssText="position:absolute;left:0;top:0;";
		document.body.appendChild(localStoreFlashContainer);
		Lib.LocalDB.regiFun.push(displayMulticolorEgg);
		Lib.LocalDB.loadFlash(localStoreFlashContainer);
	}
	
	/**
	 * 显示彩蛋flash
	 */
	function displayMulticolorEggFlash(){
		//设置无限大10年时间 
		if(Lib.LocalDB.get("msnGuideFlashClicked_"+$UID,315360000000) !== "clicked"){
			//没有点击过彩蛋
			
			//在判断用户是否点击过flash中的关闭按钮
			if(Utils.Cookie.getCookie('msnGuideFlashCloseButtonClicked_'+$UID) === "clicked"){
				return;
			}
			
			var multicolorEggFlashContainer=$C("div");
			multicolorEggFlashContainer.id="msnGuide_MulticolorEggFlashContainer";
			multicolorEggFlashContainer.style.cssText="z-index:2001;position:absolute;width:300px;height:280px";
			document.body.appendChild(multicolorEggFlashContainer);
			
			var winSize = Core.System.winSize();
			multicolorEggFlashContainer.style.left = (winSize.width - multicolorEggFlashContainer.offsetWidth) / 2 + "px";
            multicolorEggFlashContainer.style.top = (winSize.height - multicolorEggFlashContainer.offsetHeight) / 2 + Math.max(document.documentElement.scrollTop, document.body.scrollTop) + "px";
			
			var random="";
			//为什么要加这个
			if(window.$Maxthon||window.$360||window.$TT){
				random="?t="+Core.Math.getUniqueId();
			}
			//加载彩蛋flash
			//加的这些参数是啥意思
			var multicolorEggFlash = new Utils.Flash.swfObject("http://sjs.sinajs.cn/blog7swf/MulticolorEgg.swf"+random, "multicolorEggFlash", "300", "280", "9", "#00ff00");
			multicolorEggFlash.addParam("quality", "high");
			multicolorEggFlash.addParam("wmode", "transparent");
			multicolorEggFlash.addParam("allowScriptAccess", "always");
			multicolorEggFlash.write("msnGuide_MulticolorEggFlashContainer");
		}
	}
});


