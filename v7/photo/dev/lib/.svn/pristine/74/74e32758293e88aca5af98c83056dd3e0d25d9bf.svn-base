/**
 * @fileoverview 搜索下拉面板
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-05
 */
$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");

$import("lib/component/platformTray/templates/searchTemplate.js");
$import("lib/panel.js");

/**
 * 搜索下拉面板类，继承于Panel类
 */
scope.SearchPanel=Core.Class.define(function(){
	Lib.Panel.prototype.initialize.apply(this, arguments);
	this.setTemplate(scope.searchPanelTemplate);
},Lib.Panel,{
	
	//搜索信息配置(配置信息中的对象名称与模板中的节点ID保持一致)
	config:{
		//博文
		"blog":{
			"text":"博文",
			"url":"http://search.sina.com.cn/?c=blog",
			"keyName":"q",
			"range":"article",
            "by":"all"
		},
		
		//博主
		"bauthor":{
			"text":"博主",
			"url":"http://search.sina.com.cn/?c=blog",
			"keyName":"q",
			"range":"author",
            "by":"all"
		},
		
		//音乐
		"song":{
			"text":"音乐",
			"url":"http://music.sina.com.cn/yueku/search/s.php",
			"keyName":"k",
			"t":"song",
			"s":"",
			"ts":"",
			"type":"",
			"stype":""
		},
		
		//视频
		"video":{
			"text":"视频",
			"url":"http://search.video.sina.com.cn/search.php",
			"keyName":"k",
			"t":"",
			"s":"sup",
			"ts":"",
			"type":"boke",
			"stype":"1"
		},
		
		//播主
		"vauthor":{
			"text":"播主",
			"url":"http://search.video.sina.com.cn/search.php",
			"keyName":"k",
			"t":"",
			"s":"sup",
			"ts":"",
			"type":"boke",
			"stype":"3"
		}
		
	}
	
});


