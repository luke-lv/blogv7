/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @fileoverview 测试程序
 */

$import("editor/BlogEditor.js");

$registJob("editor", function(){
	var option={
		iframe_container:"SinaEditor_Iframe",
		iframe_cls:"iframe",
		textarea:"SinaEditorTextarea",
		checkbox:"SinaEditor_59_viewcodecheckbox",
		heightModeId:"height_mode"
	};
	window.editor=new BlogEditor(option);
});