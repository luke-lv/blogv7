/**
 * @fileoverview 搜索底部浮层的job
 * @author xy xinyu@staff.sina.com.cn
 * 
 * 2011-1-28 被我修改了...
 * @author zhangkai2@staff.sina.com.cn
 */


$import("lib/jobs.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/io/loadExternalCSS.js");
$import('searchFloatingLayer/searchFloatingLayer.js');

$registJob('outSearch',function(){
	(typeof BlogAd == "undefined" ? loadJsAd : loadAd)();
	function loadJsAd(){
        // 此接口由销售技术负责，有问题CALL他
		Utils.Io.JsLoad.request("http://pfp.sina.com.cn/blog/js/blogad.js", {
			charset:"gb2312",
			onComplete:function(){
				if(typeof BlogAd == "undefined") return;
				loadAd();
			}
            ,isRemove : false
		});
	}
	function loadAd(){
		new BlogAd({ pos:"jumpin" }).getAd(function(res){
			if(!(+res.code))
			Utils.Io.loadExternalCSS($_GLOBAL.cssBasicURL+'module/layer/re_seach.css',function(){
				var sObj = scope.searchFloatingLayer;
				if(sObj.isDisplay()){			// 判断是否符合显示规则
					sObj.displayFloatingLayer(res);
				}
			});
		});
	}
});


