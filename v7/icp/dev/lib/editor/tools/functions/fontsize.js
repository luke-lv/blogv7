/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 字号 按钮执行的操作
 */
$import("sina/core/class/extend.js");
$import("lib/editor/tools/FontSize.js");
$import("lib/editor/utils/EventObserver.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    fontsize: function(){
	        if (this.layers.fs) {
	            this.layers.show("fs");
	        }
	        else {
				if(this.editor.type=="smallEditor"){
				    this.layers.add("fs",new Editor.Tools.FontSize(this.editor, '<div id="#{entity}" class="fontItemContent_small"><div id="#{content}" class="fontItemTitle">字号</div></div>'));	
				}else{
					this.layers.add("fs",new Editor.Tools.FontSize(this.editor, '<div id="#{entity}" class="fontItemContent"><div id="#{content}" class="fontItemTitle">字号</div></div>'));
				}
	          
	            if (!this.documentClickObserver) {
	                this.documentClickObserver = new Editor.Utils.EventObserver(document, "click");
	                this.documentMousedownObserver = new Editor.Utils.EventObserver(this.editor.iframeDocument, "mousedown");
	                this.bodyClickObserver = new Editor.Utils.EventObserver(this.editor.iframeDocument.body, "click");
	            }
	            this.documentClickObserver.attach(this.layers.fs.hidden.bind2(this.layers.fs));
	            this.documentMousedownObserver.attach(this.layers.fs.hidden.bind2(this.layers.fs));
	            this.bodyClickObserver.attach(this.layers.fs.hidden.bind2(this.layers.fs));
	            this.layers.show("fs");
	        }
	    }
	}
);


