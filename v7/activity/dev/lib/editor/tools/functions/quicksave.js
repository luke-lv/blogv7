/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 快速保存 按钮执行的操作
 */
$import("sina/core/class/extend.js");
$import("lib/editor/utils/EditorLayer.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    quicksave: function(){
	        if (this.editor.isSaveing) {
	            return;
	        }
	        //trace("quicksave")
	      this.editor.isSaveing = true;
		  this.editor.disabledToolItem("quicksave");
			
			
	        if (!this.editor.tipLayer) {
	            this.editor.tipLayer = new Editor.Utils.EditorLayer();
	            this.editor.tipLayer.setContent("博文已经成功保存到草稿箱");
	        }
	        articlePosTempBtnFunc({
	            callback: function(){
	                this.editor.tipLayer.show();
	                setTimeout(function(){
	                    this.editor.tipLayer.hidden();
	                }.bind2(this), 5000);
	            }.bind2(this),
				hiddenTip:function(){
					this.editor.tipLayer.hidden();
					this.editor.disabledToolItem("quicksave",true);
					this.editor.isSaveing = false;
				}.bind2(this)
	        });
	    }
	}
);


