/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 字色 按钮执行的操作
 */
$import("sina/core/class/extend.js");
$import("lib/editor/tools/SetColor.js");
$import("lib/editor/utils/EventObserver.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	 	forecolor: function(){
	        if (this.layers.fc) {
	            this.layers.show("fc");
	        }
	        else {
	            this.layers.add("fc",new Editor.Tools.SetColor(this.editor, '<div id="#{entity}" class="colorItemContent"><div id="#{content}" class="colorItemTitle">颜色选取</div></div>', 'setFontColor'));
	            if (!this.documentClickObserver) {
	                this.documentClickObserver = new Editor.Utils.EventObserver(document, "click");
	                this.documentMousedownObserver = new Editor.Utils.EventObserver(this.editor.iframeDocument, "mousedown");
	                this.bodyClickObserver = new Editor.Utils.EventObserver(this.editor.iframeDocument.body, "click");
	            }
	            this.documentClickObserver.attach(this.layers.fc.hidden.bind2(this.layers.fc));
	            this.documentMousedownObserver.attach(this.layers.fc.hidden.bind2(this.layers.fc));
	            this.bodyClickObserver.attach(this.layers.fc.hidden.bind2(this.layers.fc));
	            this.layers.show("fc");
	        }
	    },
		/**
	     * flash回调设置文字颜色
	     * @param {String} color
	     */
	    setFontColor: function(color){
	        this.layers.fc.hidden();
	        this.editor.execCommand("foreColor", color);
			if(this.editor.swapToolStatus){
				this.editor.swapToolStatus("forecolor");
			}
			
	    }
	}
);
//flash回调设置字体颜色
function setFontColor(color){
     window.editor.operate.setFontColor(color);
}

