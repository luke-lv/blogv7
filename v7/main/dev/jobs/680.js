/**
 * @fileoverview 博客推荐
 * @author Cai Yue | caiyue0911@gmail.com
 * @created 2009-12-29
 * @modified  包窗广告修改 Modified by gaolei2@ 2013-12-10
 */
$import("sina/sina.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/function/bind3.js");
$import("lib/680/blogRecommendDialog.js");
$import("other/adBlogRecommend.js");
$import("lib/commonLog.js");
$import("jobs/outSearch.js");
$import("lib/oop2.js");
$import("lib/680/_blogAd.js");

// code structure modified for compsition reason		dcw1123 | chengwei1@staff.sina.com.cn
// code reformated

// 包窗广告修改,不再请求以下接口
// http://d1.sina.com.cn/litong/zhitou/sspnew.js
// http://ba.sass.sina.com.cn/front/deliver?psId=PDPS000000011727
// Modified by gaolei2@ 2013-12-10

// var _sinaadsCacheData = {};
// _sinaadsCacheData["PDPS000000011727"] = {
    // size : "260*90",
    // type : 'embed',
    // content : [
        // {
            // pv : ['http://123.126.53.109/click?type=3&t=MjAxMy0wOC0xOSAwO'],  //曝光地址
            // type : ['image', 'image', 'image'],   //素材类型
            // src : [
                // 'http://d1.sina.com.cn/201307/31/504121_100090news_tl04_0801.jpg', //中部大图
                // 'http://d5.sina.com.cn/201307/31/504120_25300ls_kl_bt_0801.jpg',   //左边栏
                // 'http://d5.sina.com.cn/201307/31/504120_25300ls_kl_bt_0801.jpg'    //右边栏
            // ],
            // monitor : ["http://stream.com"],  //点击监控地址
            // link : ['http://stream.com', 'http://stream.sina.com.cn']  //素材链接
        // }
    // ]
// };

blogAd.popAd = function(){
	var nextDisplayTime = 1; //liming9-这个值其实已经无用了 2012年5月24日
	var blogreco;
	var isToggle = false;
	// if(oParam && oParam.ads && oParam.ads[0]){
	var oParam = {code: '2101', ads:{0:{type: "mixed"}}};	// 这个值也没有用了 ，不过lib/680中的blogRecommentDialog和other中的adBlogRecomment用到了，所以拼一个出来
	var that = {} ;
	// 底通上线
	setTimeout(function(){
		Lib.Listener.notify('blogRecommendAfter');
	}, 4000);
	
	if(scope.handler_680 != null){
		return;
	}
	
	scope.handler_680 = null;

	that.renderPopAd = function(data){
		// var data = {
		// 	isAD:			true,
		// 	flashURL:		"http://sjs.sinajs.cn/blog7common/swf/commendation/ad.swf",
		// 	flashWidth:		293,
		// 	flashHeight:	60,
		// 	picURL:			"http://sjs.sinajs.cn/blog7common/swf/commendation/bg.gif",
		// 	borderImg:		"http://sjs.sinajs.cn/blog7common/swf/commendation/mainbg.gif",
		// 	btnImg:			"http://sjs.sinajs.cn/blog7common/swf/commendation/btn.gif",
		// 	clickUrl:		"http://www.sanjin.com.cn/site1/products/cpylb/03/13107.shtml",
		// };
		
		if(checkAd() == false){
			$callJob("outSearch");
			return;
		}
		var isAD = data && data.isAD;
		// console.log("isAd:"+isAD)
		if(isAD){								// 有广告投放时的弹出框
			var t = "?"+(new Date()).getTime();
			data.flashURL && (data.flashURL+=t);
			data.picURL && (data.picURL+=t);
			data.borderImg && (data.borderImg+=t);
			data.btnImg && (data.btnImg+=t);
			blogreco = new Lib.ADBlogRecommendDialog(
				"once",
				nextDisplayTime,
				data.picURL,
				data.flashURL,
				data.flashWidth,
				data.flashHeight,
				data.borderImg,
				data.btnImg,
				data.clickUrl,
				oParam					// 统一广告接口的数据，只管传
			);
			blogreco.onToggle = function(){
				isToggle = true;
			};
			var img = new Image();
			img.onload = function(){
				scope.handler_680 = blogreco;
				scope.Bind680EventHandler && scope.Bind680EventHandler();
				// console.log("show")
				blogreco.show();				// 不一定能 show 出来，得看 cookie。
				tryCallOutSearch();
				setTimeout(function(){
					if(!isToggle && blogreco._slide && blogreco.displayState == "max"){
						blogreco.toggle();
					}
				}, 60000);
				img = null;
			};
			// console.log(data.picURL)
			img.src = data.picURL;
			var isBindFun = false;
			if (data.logurls){
				blogreco.addEventListener("show", function(){
					// console.log("pop show")
					if (!isBindFun){
						isBindFun = true;
						Core.Events.addEvent(blogreco._dialog.nodes.popFlashContent, Core.Function.bind3(adClickCounts,this,[data.logurls]), 'click');
					}
				});
			}
			//liming9-2012年7月16日 添加好耶代码统计
			//commonLog('');
		}else{									// 没有广告投放时的弹出框
			blogreco = new Lib.BlogRecommendDialog("once", nextDisplayTime, oParam);
			blogreco.onToggle = function(){
				isToggle = true;
			};
			scope.handler_680 = blogreco;
			scope.Bind680EventHandler&&scope.Bind680EventHandler();
			blogreco.show();					// 不一定能 show 出来，得看 cookie。

			tryCallOutSearch();
			setTimeout(function(){
				if(!isToggle && blogreco._slide && blogreco._dialog.nodes.btnMin.className == "btnMin"){
					blogreco.toggle();
				}
			}, 60000);
		}
		
		// scope.handler_680 = blogreco;
	}
	
	
    function checkAd(){
		//===新的广告显示机制=== liming9 2012年5月24日
		//1、广告出现时间与次数
		//A）每日必浮出时间：7点到14点、14点到21点 
		//B）每日剩余时间段浮出时间： 在上述必出的基础上，最多再出现一次，即每天最多出现3次；
		//2、广告关闭前后的处理
		//在必出的时间段包框广告被关闭后，该时间段不再浮出广告，但不影响其他时间段的广告浮出；在用户没有关闭广告的情况下，点击博客其他的任何页面都可以出现该广告。
        var match = document.cookie.match(/(?:ad|dlg)680=(\d+)/);
        return match ? classHour(match[1])!==classHour(new Date().getHours()) : true;
    }
    
    function classHour(hour){//把小时分类到三个时间段：1: 昨日21点到今日7点；2: 今日7点到今日14点；3: 今日14点到今日21点。
        if(hour>21){
            return 1
        }else if(hour>14){
            return 3;
        }else if(hour>7){
            return 2;
        }else{
            return 1;
        }
    }
	
	//与包窗广告互斥的底浮
	function tryCallOutSearch(){
		// console.log("tryCallOutSearch");
		if(!blogreco._dialog.entity){
			$callJob("outSearch");
		}else{
			if(blogreco._dialog.entity.style.display == "none"){
				$callJob("outSearch");
			}
		}
	}
	
	function adClickCounts(logurls){
		for (var i=0; i<logurls.length; i++){
			// console.log(logurls[i])
			commonLog && commonLog(logurls[i]);
		}
	};
	
	return that;
};




