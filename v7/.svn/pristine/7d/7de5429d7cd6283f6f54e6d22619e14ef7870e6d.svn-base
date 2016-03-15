/**
 * @fileoverview 为页面插入flash动态模板
 * @author xinyu xinyu@staff.sina.com.cn
 * @created 2010-02-23
 */
$import("sina/sina.js");
$import('lib/getTplNum.js');
$import("lib/checkAuthor.js");
$import("lib/insertMoban.js");
$import("sina/core/events/addEvent.js");
$import("lib/interface.js");
$import("lib/panel.js");
$registJob("flashtemplate", function(){
    Lib.getTplNum(function(){
		if (scope["tpl"]) {
			Lib.insertMoban();//插入动感模板
		}
	});
    
});
