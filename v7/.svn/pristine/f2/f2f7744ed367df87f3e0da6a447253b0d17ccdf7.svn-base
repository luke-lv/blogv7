/**
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 * 博文列表点击外边，more 菜单消失。
 * 2010.03.12
 */
$import('sina/core/events/addEvent.js');
$import("sina/core/events/getEvent.js");
$import("sina/core/events/getEventTarget.js");

$registJob("blogListCancelMore", function(){
	
	// 	var a = scope.$blogArticleSortArticleids;
	// 
	// //获取所有 more 节点。
	// //内部已经不能添加了。
	// var layers = [];
	// 
	// Core.Array.foreach(a, function(aId, i){
	// 	layers.pop($E("a_layer_"+aId));
	// });
	
	if(!scope.moreLayerId) scope.moreLayerId = [0, 0];
	
	Core.Events.addEvent(document, function(){
		var layer1 = $E("a_layer_"+scope.moreLayerId[0]);
		var layer2 = $E("a_layer_"+scope.moreLayerId[1]);
		if(layer1) layer1.style.display = "none";
		if(layer2) layer2.style.display = "none";
	}, "click");
	
});

