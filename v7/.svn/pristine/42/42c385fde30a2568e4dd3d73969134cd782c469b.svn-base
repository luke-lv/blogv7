/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/string/trim.js");
$import('sina/utils/form/sinput.js');
$import('sina/utils/form/functionlimit.js');

$registJob("format_title", function () {
	var titleEle=$E("articleTitle");
    Utils.Form.limitMaxLen(titleEle,96);
	Utils.Form.functionlimit(titleEle,Core.String.trim,true);
});