/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 剪切 按钮执行的操作
 */
$import("sina/core/class/extend.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    cut: function(){
	        this.editor.history.add();
	        this.editor.execCommand("cut");
	    }
	}
);


