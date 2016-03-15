/**
 * @fileoverview
 *	限制博主搜索框的字符长度
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/utils/form/inputListen.js");

$import("lib/jobs.js");

$registJob("searchbox_Limit", function () {
	if($E("keyword")){
		Utils.Form.inputListen($E("keyword"), 50);
	}
});
