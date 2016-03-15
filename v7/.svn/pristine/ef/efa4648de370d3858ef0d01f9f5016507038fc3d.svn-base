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

$registJob("miniBlogAttention", function(){
		var itfcAttention=new Interface("http://weibo.com/attention/aj_addfollow.php","jsload");
		scope.attMiniBlog=function(){
			Lib.checkAuthor();
			if($UID){
				Utils.Io.JsLoad.request("http://weibo.com/attention/aj_addfollow.php?jsdomain=1&uid=1231759973&fromuid="+$UID, {
					onComplete: function(){
					}
				});
			}
		};
});