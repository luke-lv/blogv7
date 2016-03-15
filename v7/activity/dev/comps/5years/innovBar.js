
$import("comps/_comps.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/ui/tween/transition.js");

Comps.innovBar = function(oParam){
	
	var isTween = false;
	if(isTween) return;
	
	var barNode = oParam.barNode;
	var numNode = oParam.numNode;
	
	var duration = oParam.duration || 1;		// 秒
	var tweenType = oParam.tweenType || "simple";
	var callback = oParam.callback || function(){};
	
	var startValue = oParam.startValue || 0;
	var endValue = oParam.endValue || 0;
	var endWidth = oParam.endWidth || 0;
	
	var tweenBar;
	var tweenNum;
	
	if(barNode){
		tweenBar = new Ui.TweenStrategy(
			startValue,
			endWidth,
			duration,
			Ui.Transition[tweenType]
		);
		tweenBar.onTween = function(val){
			barNode.style.width = val+'px';
		};
		tweenBar.start();
	}
	
	// callback 和 isTween 只处理一次
	if(numNode){
		tweenNum = new Ui.TweenStrategy(
			startValue,
			endValue,
			duration,
			Ui.Transition[tweenType]
		);
		tweenNum.onTween = function(val){
			numNode.innerHTML = parseInt(val, 10);
		};
		tweenNum.onEnd = function(){
			callback();
			isTween = false;
		};
		tweenNum.start();
	}
	
};



