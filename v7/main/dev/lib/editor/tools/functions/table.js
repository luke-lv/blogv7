/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 插入表格 按钮执行的操作
 */
$import("sina/core/class/extend.js");
$import("lib/editor/utils/IframeDialog.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    table: function(){
	        //trace("插入表格");
	        if (!window.tableDialog || !window.tableDialog.entity) 
	            window.tableDialog = new Editor.Utils.IframeDialog({
	                url: "http://control.blog.sina.com.cn/admin/ria/article_addM_table.html",
	                title: "插入表格",
	                width: 311,
	                height: 256
	            });
	        window.tableDialog.show();
	    }
	}
);


