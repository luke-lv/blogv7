/**
 * @fileoverview 统计RSS订阅统计
 * @author xy xinyu@staff.sina.com.cn
 */
$import('lib/sendLog.js');
 
$registJob("rssLog", function(){
	window.rssSendLog = function(key) {
		v7sendLog(encodeURIComponent(key),scope.$pageid,'rssSend');
	}
});
