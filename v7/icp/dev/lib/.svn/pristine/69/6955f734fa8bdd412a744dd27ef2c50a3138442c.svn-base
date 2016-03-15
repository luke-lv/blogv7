/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器历史纪录类（for ie）
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("lib/editor/utils/utils.js");
$import("sina/core/class/create.js");


Editor.Utils.EditorHistory = Core.Class.create();
Editor.Utils.EditorHistory.prototype = {
    levels: [],
    current: 0,
    editor: null,
    initialize: function(editor, max){
        this.editor = editor;
        this.max = max || 100;
    },
    /**
     * 添加历史纪录
     */
    add: function(){
        if (!$IE) {
            return;
        }
		//trace("EditorHistory.add");
        var contentWindow = this.editor.iframeWindow;
        this.levels[this.current++] = addTolevels();
        
        if (this.current >= this.max) {
            this.levels.shift();
        }
        this.current = this.levels.length;
        function addTolevels(){
            var obj = {};
            var html = contentWindow.document.body.innerHTML;
            obj.htmlcode = html;
            if (contentWindow.document.selection.type == 'Text') {
                obj.selrange = contentWindow.document.selection.createRange().getBookmark();
            }
			return obj;
        }
    },
    /**
     * 指定恢复到某一版本
     */
    gotoLevel: function(step){
	   if (!$IE) {
            return;
        }
        var obj = this.levels[step];
        this.editor.iframeWindow.document.body.innerHTML = obj.htmlcode;
        if (obj.selrange) {
            var range = this.editor.iframeDocument.selection.createRange();
            range.moveToBookmark(obj.selrange);
            range.select();
        }
    },
    /**
     * 重做
     */
    redo: function(){
		//trace("EditorHistory.redo");
        var step = this.current + 1;
        if (this.levels[step]) {
            this.gotoLevel(step);
			this.current++;
        }
    },
    /**
     * 撤销
     */
    undo: function(){
		//trace("EditorHistory.undo");
        var step = this.current - 1;
        if (this.levels[step]) {
            this.gotoLevel(step);
			this.current--;
        }
    }
};
