/**
 * @fileoverview 订阅博客
 * @author xy xinyu@staff.sina.com.cn
 */

$import("lib/jobs.js");
$import("lib/subscribe.js");

$registJob('subscribe',function(){
	
	Core.Events.addEvent($E('SubscribeNewRss'),function(){
		if(!window.mySubscribe)
			window.mySubscribe = new Lib.subscribe();
		window.mySubscribe.show();
	});
});