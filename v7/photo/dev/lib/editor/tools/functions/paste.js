/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 粘贴 按钮执行的操作
 */
$import("sina/core/class/extend.js");
$import("lib/dialogConfig.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    paste: function(){
			if($IE) {
				this.editor.history.add();
				this.editor.execCommand("paste");
			} else {
				winDialog.alert("您的浏览器安全设置不允许使用粘贴操作，请使用快捷键(Cmd/Ctrl+V)来完成。", {
					icon: "01"
				});
			}
	    }
	}
);


