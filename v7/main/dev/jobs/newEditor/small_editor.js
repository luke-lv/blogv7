/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @fileoverview 测试程序
 */

$import("editor/SmallEditor.js");

$registJob("small_editor", function(){
	var option={
		iframe_container:"iframe_container",
		iframe_cls:"iframe",
		textarea:"editor_textarea",
		checkbox:"editor_checkbox"
	};
	window.editor=new Editor.SmallEditor(option);
});