/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 加粗 按钮执行的操作
 */
$import("sina/core/class/extend.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    bold: function(){
	        //trace("bold");
	        this.editor.history.add();
	        this.editor.execCommand("bold");
			if(this.editor.swapToolStatus){
				this.editor.swapToolStatus("bold");
			}
			
	    }
	}
);


