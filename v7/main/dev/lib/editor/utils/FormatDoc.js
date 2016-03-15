/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 针对拷贝过来（剪贴板）的内容进行过滤
 */
$import("lib/editor/utils/utils.js");
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("lib/editor/utils/CacheIframe.js");
$import("msg/blogEditorMSG.js");


Editor.Utils.FormatDoc = Core.Class.create();
Editor.Utils.FormatDoc.prototype = { 
    reg: /<\w[^>]* class="?(MsoNormal)|(MsoTitle)"?/gi,
    initialize: function(documentElement, editor){
        this.editor = editor;
		this.cache=new Editor.Utils.CacheIframe(this.editor.iframeUrl);
        // https://bug-34894-attachments.webkit.org/attachment.cgi?id=48645
        // webkit 内核浏览器会触发此BUG  
        // w3c标准没有beforepaste事件 wangqiang1
        documentElement.body.onbeforepaste = function(){
            this.operate();
        }.bind2(this);
        
    },
    format: function(html){
        // for Word2000+
        html = html.replace(/<\/?SPAN[^>]*>/gi, "");
        html = html.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3");
        html = html.replace(/<(\w[^>]*) style="([^"]*)"([^>]*)/gi, "<$1$3");
        html = html.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3");
        html = html.replace(/<\\?\?xml[^>]*>/gi, "");
        html = html.replace(/<\/?\w+:[^>]*>/gi, "");
        // for Word2000
        html = html.replace(/<img+.[^>]*>/gi, "");
        return html;
    },
    getPasteData: function(){
        var tif = this.cache.get();
        tlf = tif.contentWindow.document;
        tlf.body.innerHTML = "";
        if (!tlf.body.createTextRange){
            return "";
        }
        tlf.body.createTextRange().execCommand("Paste");
        var html = tlf.body.innerHTML;
        var len = html.indexOf("&nbsp;");
        if (len == 0) {
			html = html.replace(/\&nbsp;/i, "");
		}
        var htmlData = html;
        tlf.body.innerHTML = "";
        return htmlData;
    },
    isDoc: function(str){
        str = str || this.getPasteData();
        return this.reg.test(str);
    },
    operate: function(){
        var data = this.getPasteData();
        if (this.isDoc(data)){
            clipboardData.setData('text', "");
            winDialog.confirm($SYSMSG['B02003'], {
                funcOk: function(){
                    data = this.format(data);
                    this.editor.insertHTML(data);
                }.bind2(this)                ,
                funcCancel: function(){
                    data = data.replace(/<img+.[^>]*>/gi, "");
                    data = data.replace(/<\/?\w+:imagedata[^>]*>/gi, "");
                    data = data.replace(/<\/?\w+:shape[^>]*>/gi, "");
                    this.editor.insertHTML(data);
                }.bind2(this),
                textOk: "是",
                textCancel: "否",
                defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
                title: "提示",
                icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
            });
        }
    }
};
