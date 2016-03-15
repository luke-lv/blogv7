/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 默认排版 按钮执行的操作
 */
$import("sina/core/class/extend.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    imgdefault: function(){
	        //trace("默认排版");
	        var elm = this.editor.getFocusElement();
	        if (elm.tagName.toLowerCase() == "img") {
	            elm.removeAttribute("align");
	            Core.Dom.setStyle(elm, "display", "");
	            Core.Dom.setStyle(elm, "margin", "");
	            Core.Dom.setStyle(elm, "textAlign", "");
	        }
	    }
	}
);


