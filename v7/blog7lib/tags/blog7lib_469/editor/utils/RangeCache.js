/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器选区历史记录类，只用于ie
 */
$import("lib/editor/utils/utils.js");
$import("sina/core/class/create.js");


Editor.Utils.RangeCache = Core.Class.create();
Editor.Utils.RangeCache.prototype = {
    range: null,
    selection: null,
    initialize: function(editor){
        this.editor = editor;
    },
	/**
	 * 保存选择区
	 */
    save: function(){
        //trace("保存状态");
        if ($IE) {
            this.selection = this.editor.iframeDocument.selection;
            //trace(typeof this.selection);
            this.range = this.selection.createRange();
        }
        
    },
	/**
	 * 恢复选区
	 */
    select: function(){
        if ($IE) {
            if(this.range) {
                try {
                    this.editor.iframeDocument.focus();
                    this.range.select();
                } 
                catch (e) {
                    this.editor.iframeDocument.focus();
                }
            }
            else {
                this.editor.iframeDocument.focus();
            }
        }
        
    },
	/**
	 * 设置一个range
	 */
	setRange : function(range) {
		this.range = range;
	}
};
