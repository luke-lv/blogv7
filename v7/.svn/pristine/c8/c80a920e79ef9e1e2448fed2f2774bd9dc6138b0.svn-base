/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 快速发博文
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/SendArticle.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/getLeft.js");

$registJob("quick_sendArticle", function(){
	
	var option={
		iframe_container:"iframe_container",
		iframe_cls:"iframe",
		textarea:"editor_textarea",
		checkbox:"editor_checkbox"
	};
	scope.uploadImageIsRead=function(){
			//trace("flase_callback:uploadImageIsRead");
			if(window.sendArticle){
				return true;
			}else{
				return false;
			}
		};
	window.editor=new Editor.QuickEditor(option);
	
	window.sendArticle=new App.SendArticle();
//	ele.style.display="none";
});