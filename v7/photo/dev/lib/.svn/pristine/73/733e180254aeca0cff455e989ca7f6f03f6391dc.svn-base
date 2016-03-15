/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 图片居中排版 按钮执行的操作
 */
$import("sina/core/class/extend.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    imgtop: function(){
	        //trace("图片居中排版");
	        var elm = this.editor.getFocusElement();
	        if (elm.tagName.toLowerCase() == "img") {
	            elm.removeAttribute("align");
	            Core.Dom.setStyle(elm, "display", "block");
	            Core.Dom.setStyle(elm, "margin", "0 auto");
	            Core.Dom.setStyle(elm, "textAlign", "center");
	        }
	    }
	}
);


