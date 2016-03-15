/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 插入链接 按钮执行的操作
 */
$import("sina/core/class/extend.js");
$import("lib/editor/utils/IframeDialog.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    link: function(){
	        //trace("插入链接");
			var url="http://control.blog.sina.com.cn/admin/ria/article_addM_link.php";
			if (this.isDomain) {
				url += "?domain=dom";
			}
	        if (!window.linkDialog || !window.linkDialog.entity) {
				 window.linkDialog = new Editor.Utils.IframeDialog({
	                url: url,
	                title: "插入链接",
	                width: 300,
	                height: 150
	            });
			}
			window.linkDialog.show();
	    }
	}
);


