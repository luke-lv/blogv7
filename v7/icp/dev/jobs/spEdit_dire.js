/**
 * @fileoverview 直接打开编辑
 * @author zhihan | zhihan@staff.sina.com.cn
 */
 
$import("lib/jobs.js");
$import('sina/core/events/fireEvent.js');

$registJob('spEdit',function(){
	var loc = window.location.href.split('#');
	if(loc[1]) {
		var ele = $E(loc[1]);
		if(ele) {
			Core.Events.fireEvent(loc[1], 'click');
		}
	}
});