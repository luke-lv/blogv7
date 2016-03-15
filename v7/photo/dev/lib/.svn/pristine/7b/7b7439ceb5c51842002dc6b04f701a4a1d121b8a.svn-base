/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 字体 按钮执行的操作
 */
$import("sina/core/class/extend.js");
$import("lib/editor/tools/FontFamily.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    family: function(){
	        //trace("family");
	        if (this.layers.f) {
	            this.layers.show("f");
	        }
	        else {
	            this.layers.add("f",new Editor.Tools.FontFamily(this.editor, '<div id="#{entity}" class="fontItemContent"><div id="#{content}" class="fontItemTitle">字体</div></div>'));
	            if (!this.documentClickObserver) {
	                this.documentClickObserver = new Editor.Utils.EventObserver(document, "click");
	                this.documentMousedownObserver = new Editor.Utils.EventObserver(this.editor.iframeDocument, "mousedown");
	                this.bodyClickObserver = new Editor.Utils.EventObserver(this.editor.iframeDocument.body, "click");
	            }
	            this.documentClickObserver.attach(this.layers.f.hidden.bind2(this.layers.f));
	            this.documentMousedownObserver.attach(this.layers.f.hidden.bind2(this.layers.f));
	            this.bodyClickObserver.attach(this.layers.f.hidden.bind2(this.layers.f));
	            this.layers.show("f");
	        }
	    }
	}
);


