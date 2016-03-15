/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 图片居左混排 按钮执行的操作
 */
$import("sina/core/class/extend.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    imgright: function(){
	        //trace("图片居左混排");
	        var elm = this.editor.getFocusElement();
	        if (elm.tagName.toLowerCase() == "img") {
	            elm.setAttribute("align", "right");
	            Core.Dom.setStyle(elm, "display", "");
	            Core.Dom.setStyle(elm, "margin", "");
	            Core.Dom.setStyle(elm, "textAlign", "");
	        }
	    }
	}
);


