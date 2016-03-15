/**
 * @fileoverview 订阅博客
 * @author xy xinyu@staff.sina.com.cn
 */

$import("lib/jobs.js");
$import("lib/subscribe.js");

$registJob('subscribe',function(){
	var mySubscribe = new Lib.subscribe();
	if ($E('SubscribeNewRss')) {
		Core.Events.addEvent($E('SubscribeNewRss'), mySubscribe.show.bind2(mySubscribe));
	}
});