/**
 * @fileoverview 手机订阅
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @created 2009-11-11
 */


$import("sina/sina.js");

$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");

$import("lib/component/attention/phone_attention_add.js");

$registJob("phone_attention_add", function(){
	scope.pa_add=new scope.PhoneAttentionAdd();
});