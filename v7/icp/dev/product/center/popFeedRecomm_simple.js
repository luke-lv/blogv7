/**
 * @fileoverview 名人 feed 推荐
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 * @created 2010-07-01
 */

$import("sina/sina.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/array/foreach.js");
$import("sina/ui/tween.js");

$import("msg/attention.js");
$import("lib/dialogConfig.js");
$import("lib/lib.js");
$import("lib/app.js");
$import("lib/sysmsg.js");
$import("lib/LocalDB.js");

$import("lib/checkAuthor.js");
$import("lib/login/ui.js");

$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/core/dom/next.js");

$import("sina/ui/tween/transition.js");
$import("sina/ui/tween/tweenStrategy.js");

//等待某变量被赋值
// App.waitAssign = function(varpath, callback){
// 	var interval = setInterval(function(){
// 		//trace("Lib.LocalDB.isFlashReady: "+eval(varpath));
// 		if(eval(varpath)){
// 		callback(eval(varpath));
// 		clearInterval(interval);}
// 	}, 500);
// };


//无 feed 展开。
App.popFeedRecomm_toggleEx = function(me, num){
	var popFeedRecomm_feedsBox = $E("popFeedRecomm_feedsBox");
	var popFeedRecomm_moreFeeds = $E("popFeedRecomm_moreFeeds");
	if(!popFeedRecomm_feedsBox) return;
	
	var popFeedRecomm_nextPage = Core.Dom.next(popFeedRecomm_moreFeeds, "SG_page");
	var allFeeds = Core.Dom.byClz(popFeedRecomm_feedsBox, "div", "feedList_cell");
	var batches = Math.ceil(allFeeds.length / num);
	if(App.curBatch > batches){			//修正一下
		App.curBatch = 1;
	}
	//trace(App.curBatch);
	var curBatch_1st_id = num*(App.curBatch-1);
	var i;
	
	if(me.getAttribute("evolved") == "yes"){
		popFeedRecomm_nextPage.style.display = "none";
		for(i=1; i<num; i++){				//收起后，还显示第一个
			if(allFeeds[curBatch_1st_id+i])
			allFeeds[curBatch_1st_id+i].parentNode.style.display = "none";
		}
		me.setAttribute("evolved", "no");
		me.className = "center_cmdfeedarrow";
		me.setAttribute("title", "展开");
		toAnchor("attentionfeed");
	}else{
		popFeedRecomm_nextPage.style.display = "";
		for(i=1; i<num; i++){
			if(allFeeds[curBatch_1st_id+i])
			allFeeds[curBatch_1st_id+i].parentNode.style.display = "";
		}
		me.setAttribute("evolved", "yes");
		me.className = "center_cmdfeedarrow center_cmdfeedarrowUp";
		me.setAttribute("title", "收起");
	}
	
	function toAnchor(a){
		var href = window.location.href;				//处理锚点的 # 号。
		href = href.replace(/#.*/, "");
		if(a.indexOf("#") > -1){
			href += a;
		}else{
			href += "#"+a;
		}
		window.location.href = href;
	}
};

App.resetCurBatch = function(){
	//trace("reseted");
	App.curBatch = 1;
	App.nextBatch = 2; 
};

//点击，显示往后的num条
App.curBatch = 1;
App.nextBatch = 2;
App.popFeedRecomm_otherRecomm = function(num){
	
	/*判断登陆状态*/
	Lib.checkAuthor();
		if(!$isAdmin){
				new Lib.Login.Ui().login(function() {
						location.reload();
				});
				return;
	}
	var popFeedRecomm_feedsBox = $E("popFeedRecomm_feedsBox");
	animateScroll(popFeedRecomm_feedsBox.parentNode, changeDom);
	//toAnchor("popFeedRecomm_toTop");
	
	function changeDom(){
		var allFeeds = Core.Dom.byClz(popFeedRecomm_feedsBox, "div", "feedList_cell");
		var len = allFeeds.length;
		var batches = Math.ceil(len/num);		//总批次
		var i;
		
		//trace(len+"  "+num);
		if(len < num) return;
		
		//修正一下
		if(App.curBatch > batches)	App.curBatch = 1;
		if(App.nextBatch > batches) App.nextBatch = 1;
		
		//trace("curBatch: "+App.curBatch);
		//trace("nextBatch: "+App.nextBatch);
		
		for(i=0; i<num; i++){
			var curBatch_elemIdx = num*(App.curBatch-1)+i;
			var nextBatch_elemIdx = num*(App.nextBatch-1)+i;
			if(allFeeds[nextBatch_elemIdx])
				allFeeds[nextBatch_elemIdx].style.display = "";		//下一批次的显示
			if(allFeeds[curBatch_elemIdx])
				allFeeds[curBatch_elemIdx].style.display = "none";	//点击时，当前显示的批次隐藏
		}
		
		App.curBatch++;
		App.nextBatch++;
	}
	
	// 跳锚点
	function toAnchor(a){
		var href = window.location.href;				//处理锚点的 # 号。
		href = href.replace(/#.*/, "");
		if(a.indexOf("#") > -1){
			href += a;
		}else{
			href += "#"+a;
		}
		window.location.href = href;
	}
	
	// 跳锚点改为动画 scrollTop。
	function animateScroll(matchDom, func){
		var matchClientY = matchDom.getBoundingClientRect().top;
		var curScrollTop = document.documentElement.scrollTop;
		var _tween;
		
		// sina_19 中的新 tween
		_tween = new Ui.TweenStrategy(
			document.documentElement.scrollTop,				//start value
			curScrollTop + matchClientY,					//end value
			0.6,											//duration
			Ui.Transition.strongEaseInOut					//motion type
		);
		_tween.onTween = function(val){
			document.documentElement.scrollTop = val;
		};
		_tween.onEnd = func || function(){
			
		};
		_tween.start();
	}
	
};



//有 feed
(function(){
	var popFeedRecomm_expend = $E("popFeedRecomm_expend");
	var holeBox = $E("popFeedRecomm_feedsBox_parent");
	var noNeedFeedRecomm = Utils.Cookie.getCookie("noNeedFeedRecomm");
	//trace("noNeedFeedRecomm: "+noNeedFeedRecomm);
	
	if(noNeedFeedRecomm != "yes"){
		trace("is Need");
		if(holeBox) holeBox.style.display = "";
	}else{
		trace("no Need");
		if(holeBox) holeBox.style.display = "none";
	}
	
	if(!popFeedRecomm_expend) return;
	var allFeedCells = Core.Dom.byClz(popFeedRecomm_expend, "div", "feedList_cell");
	var i;
	for(i=0; i<allFeedCells.length; i++){
		if(i == 0) allFeedCells[i].style.cssText = "position:absolute;";
		else allFeedCells[i].style.cssText = "position:absolute; top:70px;";
	}
	
	
	//flash 缓存的节点
	// var localDB_Dom = $C("div");
	// localDB_Dom.id = "feedFlashCookie";
	// document.body.appendChild(localDB_Dom);
	// Lib.LocalDB.loadFlash("feedFlashCookie");
	
	//flash cookie 加载出来
	// 	App.waitAssign("Lib.LocalDB.isFlashReady", function(val){
	// 	var notInteresting = Lib.LocalDB.get("feedRecommClosed", 60*60*24*7);		//时间是……秒还是毫秒？
	//trace("feedRecommClosed: "+notInteresting);
	// 	if(!notInteresting){
	// 		$E("popFeedRecomm_feedsBox").style.display = "";
	// 	}else{
	// 		$E("popFeedRecomm_feedsBox").style.display = "none";
	// 	}
	// });
	
})();


//关闭推荐，弹出确认，并记录 flash cookie。
App.popFeedRecomm_close = function(_id){
	winDialog.confirm("确认关闭名博动态推荐？", {
		subText:"<span style='color:#999;'>关闭后一周内将不再显示</span>",
		funcOk:function(){
			var toBeClosse = $E(_id);
			if(toBeClosse){
				toBeClosse.style.display = "none";
			}
			Utils.Cookie.setCookie("noNeedFeedRecomm", "yes", 168, "/", ".sina.com.cn");	//一个礼拜，小时
			
			//这次不用检测了，肯定加载了。
			//Lib.LocalDB.set("notInteresting", true);
		}
	});
};


//向下滑一个。
App.isTween = false;
App.popFeedRecomm_slideDown = function(){
	if(App.isTween) { trace("isTween..."); return false; }
	
	App.isTween = true;
	var popFeedRecomm_expend = $E("popFeedRecomm_expend");
	var allFeedCells = Core.Dom.byClz(popFeedRecomm_expend, "div", "feedList_cell");
	var step = allFeedCells[0].offsetHeight;
	var firstFrame = allFeedCells[0];
	var secondFrame = allFeedCells[1];
	
	var firstFrameTop = parseInt(Core.Dom.getStyle(firstFrame, "top"));
	if(isNaN(firstFrameTop)){
		firstFrame.style.top = "0px";
	}
	
	//trace("firstFrameTop: "+firstFrameTop);
	//trace("step: "+step);
	
	Ui.tween(firstFrame, "top", -step, 0.4, "regularEaseIn", {
		end:function(){
			firstFrame.style.top = step + "px";		//移动完毕，append 到底部，不可见（70px top）
			popFeedRecomm_expend.appendChild(firstFrame);
			App.isTween = false;
			//trace("first frame appended");
		}
	});
	Ui.tween(secondFrame, "top", parseInt(Core.Dom.getStyle(secondFrame, "top"))-step, 0.4, "regularEaseIn", {
		end:function(){
			//trace("second frame moved over");
		}
	});
};


