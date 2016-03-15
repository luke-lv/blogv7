


$import("sina/core/events/addEvent.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/ui/tween/transition.js");

$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");

$import("comps/5years/innovBar.js");


(function(){
	
	// 总宽 200px
	var _width = 200;
	var _ratio_per = 3;
	
	// 获取目标节点
	var articleInnov = $E("articleInnov");
	var articleNum = $E("articleNum");
	var graphInnov = $E("graphInnov");
	var graphNum = $E("graphNum");
	var popInnov = $E("popInnov");
	var popNum = $E("popNum");
	
	if(!articleInnov) return;
	
	
	// 获取目标数据
	var art = +(articleNum.getAttribute("num"));
	var gra = +(graphNum.getAttribute("num"));
	var pop = +(popNum.getAttribute("num"));
	
	// 排序
	var forArrange = [
		{ node: articleInnov, numNode: articleNum, id: "art", val: art },
		{ node: graphInnov, numNode: graphNum, id: "gra", val: gra },
		{ node: popInnov, numNode: popNum, id: "pop", val: pop }
	];
	forArrange.sort(function(a, b){
		return (a.val - b.val);				// 升序
	});
	
	
	
	
	
	// 处理排序数组中的相等量（相邻）
	var lv = 1;			// 所占份数，肯定不会大于 _ratio_per。
	var nextVal;
	var lastVal;
	var curVal;
	for(var i=0; i<forArrange.length; i++){
		curVal = forArrange[i].val;
		nextVal = forArrange[i+1] && forArrange[i+1].val;
		lastVal = forArrange[i-1] && forArrange[i-1].val;
		
		if(curVal == 0){
			forArrange[i].ratio = 0;
		}else{
			forArrange[i].ratio = lv;
			if(curVal != nextVal){
				lv += 1;
			}
		}
		
	}
	
	// 执行所有 bar 动画。
	for(var i=0; i<forArrange.length; i++){
		Comps.innovBar({
			barNode: forArrange[i].node,
			numNode: forArrange[i].numNode,
			startValue: 0,			// 都是 0。
			endWidth: forArrange[i].ratio * 0.33 * _width,
			endValue: forArrange[i].val
		});
	}
	
	
})();



