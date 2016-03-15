/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 自动排版 按钮执行的操作
 */
$import("sina/core/class/extend.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	    justifyfull: function(){
	        this.editor.history.add();
	        var eBody = this.editor.iframeDocument.body;
	        var eChilds = eBody.childNodes;
	        for (var i = 0; i < eChilds.length; i++) {
	            if (eChilds[i].tagName) {
	            
	                // 去掉首尾空格
	                eChilds[i].innerHTML = eChilds[i].innerHTML.split('&nbsp;').join('');
	                eChilds[i].innerHTML = eChilds[i].innerHTML.replace(/(^[ |　|]*)|([ |　|]*$)/g, "");
	                eChilds[i].innerHTML = eChilds[i].innerHTML.split('').join('&nbsp;');
	                
	                // 是否已经排过版,使用 2em 会使段落排版混乱［h1,h2混］,可设计默认 28 像素。通过计算子节点 fontSize 方式同样有此问题
	                if (!eChilds[i].style.textIndent) {
	                    eChilds[i].style.textIndent = '2em';
	                    // 默认排版前
	                }
	                else {
	                    eChilds[i].style.textIndent = '';
	                }
	                // 纯文本
	            }
	            else {
	                eBody.innerHTML = '<div style="text-indent:2em;">' + eBody.innerHTML.replace(/(^[ |　]*)|([ |　]*$)/g, "");
	                +'</div>';
	            }
	            if ($IE) 
	                this.editor.iframeDocument.selection.createRange().collapse(false);
	            this.editor.rangeCache.save();
	        }
	    }
	}
);


