/**
 * @fileoverview 统计RSS订阅统计
 * @author zhihan zhihan@staff.sina.com.cn
 */
$import('lib/sendLog.js');
 
$registJob("sendLog", function(){
	window.sendLog = function(key) {
		v7sendLog(encodeURIComponent(key),scope.$pageid,'rssSend');
	}
});