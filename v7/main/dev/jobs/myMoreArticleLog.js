/**
 * @fileoverview 此文件应用于我的更多文章，上一篇，下一篇统计布玛 
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created     2012-12-26
 * @vertion 0.01
 * @引用该job的conf: article articleM 
 */
$import("lib/jobs.js");
$import("lib/sendLog.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/byClass.js");

$registJob('myMoreArticleLog', function() {
	//下线我的更多文章 前一篇 后一篇布玛统计
	// var arWrap = $E('articlebody');
	// if(arWrap){
	// 	var logWrap = Core.Dom.byClass('chooseOk','div',arWrap);
	// 	if(logWrap.length){
	// 		v7sendLog('45_01_22_' + scope.$uid);
	// 		Core.Events.addEvent(logWrap[0], function(event){
	// 			var target= (event && event.target) || (window.event && window.event.srcElement);
	// 	        if(target && target.tagName && target.tagName.toLowerCase() == 'a'){
	// 	        	v7sendLog('45_01_03');
	// 	        }
	// 		});
	// 	}
	// }
	// var new_cont = $E("new_nextprev_" + scope.$articleid);
	// if(!!new_cont && new_cont.children[0] && new_cont.children[1]){
	// 	var prev = new_cont.children[0];
	// 	var next = new_cont.children[1];
	// 	logPrev(prev);
	// 	logNext(next);
	// 	return;
	// }else if(!!new_cont && new_cont.children[0] && new_cont.children[0].children[0].innerHTML === '前一篇：'){
	// 	var prev = new_cont.children[0];
	// 	logPrev(prev);
	// 	return;
	// }else if(!!new_cont && new_cont.children[0] && new_cont.children[0].children[0].innerHTML === '后一篇：'){
	// 	var next = new_cont.children[0];
	// 	logPrev(next);
	// 	return;
	// }

	// function logPrev(el){
	// 	Core.Events.addEvent(el, function(event){
	// 		var target= (event && event.target) || (window.event && window.event.srcElement);
	//         if(target && target.tagName && target.tagName.toLowerCase() == 'a'){
	//         	v7sendLog('45_01_05');
	//         }
	// 	});
	// }

	// function logNext(el){
	// 	Core.Events.addEvent(el, function(event){
	// 		var target= (event && event.target) || (window.event && window.event.srcElement);
	//         if(target && target.tagName && target.tagName.toLowerCase() == 'a'){
	//         	v7sendLog('45_01_06');
	//         }
	// 	});
	// }
});