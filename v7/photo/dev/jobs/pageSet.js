/*
 * Copyright (c) 2008, Sina Inc. All rights reserved.
 * 自定义设置
 */

/**
 * 定义一个示例 Job —— pageSet
 * @author dg.liu| dongguang@staff.sina.com.cn
 */
$import("sina/module/set/diy.js");
$import("sina/core/events/addEvent.js");

$registJob("pageSet", function(){
	var diy = new Diy();
	Core.Events.addEvent("pageSet", function (){
		if(!diy.dialog){
			diy.initDialog();
		}
		diy.dialog.setHelp("http://blog.sina.com.cn/lm/help/2009/photo.html?id=48");
		diy.dialog.show();
		
	});
});