/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 背景色 按钮执行的操作
 */
$import("sina/core/class/extend.js");
$import("lib/editor/tools/SetColor.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    hilitecolor: function(){
	        //trace("hiliteColor:function");
	        if (this.layers.hc) {
	            this.layers.show("hc");
	        }
	        else {
	            this.layers.add("hc",new Editor.Tools.SetColor(this.editor, '<div id="#{entity}" class="colorItemContent"><div id="#{content}" class="colorItemTitle">颜色选取</div></div>', 'setBackgroundColor'));
	            if (!this.documentClickObserver) {
	                this.documentClickObserver = new Editor.Utils.EventObserver(document, "click");
	                this.documentMousedownObserver = new Editor.Utils.EventObserver(this.editor.iframeDocument, "mousedown");
	                this.bodyClickObserver = new Editor.Utils.EventObserver(this.editor.iframeDocument.body, "click");
	            }
	            this.documentClickObserver.attach(this.layers.hc.hidden.bind2(this.layers.hc));
	            this.documentMousedownObserver.attach(this.layers.hc.hidden.bind2(this.layers.hc));
	            this.bodyClickObserver.attach(this.layers.hc.hidden.bind2(this.layers.hc));
	            this.layers.show("hc");
	        }
	    },
		/**
	     * flash回调设置背景色
	     * @param {String} color
	     */
	    setBackgroundColor: function(color){
	        //trace(color);
	        this.layers.hc.hidden();
	        if ($IE) {
	            this.editor.execCommand("backcolor", color);
	        }
	        else {
	            this.editor.execCommand("hiliteColor", color);
	        }
			this.editor.swapToolStatus("hilitecolor");
	    }
	}
);
//flash回调设置背景颜色
function setBackgroundColor(color){
	 window.editor.operate.setBackgroundColor(color);
}


