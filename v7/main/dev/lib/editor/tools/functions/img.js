/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 插入图片 按钮执行的操作
 */
$import("sina/core/class/extend.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    img: function(){
	        //trace("插入图片");
	        if (!window.imageDialog){
				var url="http://control.blog.sina.com.cn/admin/ria/article_addM_image.php";
				if(this.ctg_id){
					url+="?ctg_id="+this.ctg_id;
				}
				if(this.isDomain){
					url+="?domain";
				}
	            window.imageDialog = new Editor.Utils.IframeDialog({
	                url: url,
	                title: "插入图片",
	                width: 660,
	                height: 450,
					dialogName:"imageDialog"
	            });	
				if(this.editor.initImageOpertae){
					this.editor.initImageOpertae();
				}
			}
			this.editor.blur();
	        window.imageDialog.show();
	    }
	}
);


