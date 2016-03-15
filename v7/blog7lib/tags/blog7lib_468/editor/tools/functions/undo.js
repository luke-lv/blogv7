/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 撤销 按钮执行的操作
 */
$import("sina/core/class/extend.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	   	undo: function(){
	        if ($IE) {
	            this.editor.history.undo();
	        }
	        else {
	            this.editor.execCommand("undo");
	        }
	    }
	}
);


