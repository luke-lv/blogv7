/**
 * @fileoverview
 *	blog_tag365页面图片轮播
 * @author Lvyuan | rarny@163.com
 * @version 1.0
 * @history
 *
 */
$import("sina/ui/tween/transition.js");
$import("component/tween/TweenStrategyEx.js");

$registJob('actSlide', function(){
		var oPicBox = $E("picCon");
		var aLi = oPicBox.getElementsByTagName("li");
		var oneWidth = 600;
		var tweenTime = 0.8;
		var intervalTime = 3500;
		var mode = "regularEaseIn";
		var length = aLi.length;

		var start = 0, end = -oneWidth;

		var iNow = 0;
		var btn = true;
		
		if (!oPicBox){
			return;
		}
		oPicBox.style.width =  9999 + "px";
		var cloneNode = oPicBox.children[0].cloneNode(true);
		oPicBox.appendChild(cloneNode);

		//修复ie6,7下图片滚动错位
		for(var i = 0;i <aLi.length; i++){
			aLi[i].children[0].style.display = "block";
		}

		function autoMove() {
			if(!!tween && !btn){
				tween.stop();
			}
			var tween = new TweenStrategyEx([start], [end], tweenTime, Ui.Transition[mode]);
			tween.onTween = function (value) {
				btn = false;
				oPicBox.style.left = value[0] + "px";
			};
			tween.onEnd = function (){
				++iNow;
				if(iNow == length){
					iNow = 0;
					oPicBox.style.left = 0 + "px";
				}
				start = -iNow*oneWidth;
				end = -(iNow+1)*oneWidth;
				tween = null;
				btn = true;
			};
			tween.start();
		}

		window.setInterval(function() {
			autoMove();
		}, intervalTime);
		
});