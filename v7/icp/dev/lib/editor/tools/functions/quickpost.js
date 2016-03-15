/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 快速发表 按钮执行的操作
 */
$import("sina/core/class/extend.js");
$import("lib/editor/utils/EditorLayer.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    quickpost: function(){
	    
	        if (this.editor.post) {
	            return;
	        }
	        //trace("quickpost")
	        this.editor.post = true;
			
			this.editor.disabledToolItem("quickpost");
			
	        if (!this.editor.tipLayer) {
	            this.editor.tipLayer = new Editor.Utils.EditorLayer();
	        }
			this.editor.tipLayer.setContent("博文保存中");
			this.editor.tipLayer.show();
	        articlePostBtnFunc({
	            callback: function(frmJson){
					this.editor.tipLayer.hidden();
	                this.editor.tipLayer.setContent('<span>博文已经发表<span><a href="http://blog.sina.com.cn/s/blog_' + frmJson.data + '.html" target="_blank">[查看]</a>');
	                this.editor.tipLayer.show();
	                setTimeout(function(){
	                    this.editor.tipLayer.hidden();
	                }.bind2(this), 5000);
	            }.bind2(this),
				hiddenTip:function(){
					this.editor.tipLayer.hidden();
					this.editor.disabledToolItem("quickpost",true);
					this.editor.post = false;
				}.bind2(this)
	        });
	    }
	}
);

