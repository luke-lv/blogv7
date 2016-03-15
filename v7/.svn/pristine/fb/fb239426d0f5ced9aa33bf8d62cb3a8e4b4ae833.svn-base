/**
 * @fileoverview 关注微博头条博客
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-06-29
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");

$import("lib/interface.js");
$import("lib/checkAuthor.js");


scope.attMiniBlog = function(){
	return;
	
	// 领导说要干掉。
	
	Lib.checkAuthor();
	if($UID){
		// 649378025 百合微博 uid
		Utils.Io.JsLoad.request("http://t.sina.com.cn/attention/aj_addfollow.php?jsdomain=1&uid=1649378025&fromuid="+$UID, {
			onComplete: function(){
				trace("attTblogOk");
				scope.$is_loginjoin = "yes";
			}
		});
	}
};


