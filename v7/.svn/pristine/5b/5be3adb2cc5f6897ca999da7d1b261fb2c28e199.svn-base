/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器基类(抽象类)
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/system/br.js");

/**
 * 编辑器基类, 仅提供编辑器相关操作的方法
 * 创造相关的界面需继承此类。
 * @author @author dg.liu | dongguang@staff.sina.com.cn
 */
var Editor={};
Editor.AbstractBase = Core.Class.create();
Editor.AbstractBase.prototype = {
	//唯一id
    _id: null,
	_focusElementId:"",
    _iframeUrl: "",
    iframe: null,
    iframeWindow: null,
    iframeDocument: null,
	rangeCache: null,
	/**
	 * 构造将被子类所覆盖
	 */
    initialize: function(){
        throw new Error("Editor.AbstractBase为抽象类不能被实例化");
    },
	/**
	 * 让编辑器失去焦点；避免编辑光标在弹出层上闪烁
	 */
	blur:function(){
		$E(this._focusElementId).focus();
	},
	/**
	 * 执行编辑器内iframe的execCommand命令
	 * @param {String} cmd
	 * @param {String} value
	 */
    execCommand: function(cmd, value){
        this.iframeWindow.focus();
        this.iframeDocument.execCommand(cmd, "", value);
        this.iframeWindow.focus();
    },
	getContentHtml:function(){
		return this.iframeDocument.body.innerHTML;
	},
	getContentText:function(){
		if($IE){
			return this.iframeDocument.body.innerText;
		}else{
			return this.iframeDocument.body.textContent;
		}
	},
	/**
	 * 恢复编辑器内选区或焦点
	 */
    selectRange: function(){
        this.rangeCache.select();
    },
	/**
	 * 获取编辑器内聚焦元素
	 */
    getFocusElement: function(){
        if (!$IE) {
            var select = this.iframeWindow.getSelection();
            var range = select.getRangeAt(0);
            var elm = range.commonAncestorContainer;
            if (elm.tagName) {
                if (elm.tagName.toLowerCase() == "body") {
                    return elm;
                }
            }
            if (!range.collapsed) {
                if (range.startContainer == range.endContainer || (1 && range.startContainer == range.endContainer.parentNode)) {
                    if (range.startOffset - range.endOffset < 2 || 1) {
                        if (range.startContainer.hasChildNodes()) {
                            return range.startContainer.childNodes[range.startOffset];
                        }
                    }
                }
                return elm.parentNode;
            }
            else {
                return elm.parentNode;
            }
        }
        else {
            var range = this.iframeDocument.selection.createRange();
            return range.item ? range.item(0) : range.parentElement();
        }
    },
	/**
	 * 获取选择文本
	 * @param {Object} select
	 */
	getRangTxt : function (select) {
		if ($IE) {
			if (select) {
				this.selectRange();
			}
			var rang = this.iframeDocument.selection.createRange();
			if (rang.item) {
				return rang.item(0).outerHTML;
			}
			return rang.htmlText;
		}
		else {
				var rang = this.iframeWindow.getSelection().getRangeAt(0);
				var dFragment = rang.cloneContents();
				var div = document.createElement("div");
				div.appendChild(dFragment);
				return div.innerHTML;
			}
	},
	/**
	 * 向编辑器的iframe的body中插入html
	 * @param {String} s_html
	 * @param {Object} s_obj ff 3.6.9 不支持自定义属性，采用后添加方式
	 */
    insertHTML: function(s_html,s_obj){
        if ($IE && this.history) {
            this.history.add();
        }
        if ($IE) {
            try {
                this.selectRange();
                this.iframeWindow.focus();
                var oRang = this.iframeDocument.selection.createRange();
                if (this.iframeDocument.selection.type.toLowerCase() == "control") {
                    var tempRange = this.iframeDocument.body.createTextRange();
                    tempRange.moveToElementText(oRang.item(0));
                    oRang = tempRange;
                }
                oRang.pasteHTML(s_html);
                oRang.collapse(false);
                oRang.select();
                this.rangeCache.save();
            } 
            catch (e) {}
        }
        else {
            this.execCommand('insertHTML', s_html);
			if(s_obj) {
				var ele = this.iframeDocument.getElementById(s_obj.id);
				if(ele) {
					for(var key in s_obj.properites) {
						ele.setAttribute(key,s_obj.properites[key]);
					}
					ele.removeAttribute('id');
				}
			}
        }
    },
    /**
     * 需要在onload之后执行的方法
     */
    _onLoadOperates: function(){
        if (this.loadOpartes) {
            var len = this.loadOpartes.length;
            for (var i = 0; i < len; i++) {
                try {
                    this.loadOpartes[i]();
                } 
                catch (e) {}
            }
        }
    },
	/**
	 * 添加需要在onload之后执行的函数
	 * @param {Function} func
	 */
    _addOperateToOnload: function(func){
		if (!this.loadOpartes) {
			this.loadOpartes = [];
		}
		this.loadOpartes.push(func);
    },
    /**
     * 初始化编辑器的iframe
     */
    _initIframe: function(container, className){
        this._id = Core.Math.getUniqueId();
        var iframeParent = container;
		iframeParent.innerHTML = "";
		
        this.iframe = $C("iframe");
        this.iframe.className = className;
        if (this._iframeUrl != "") {
            this.iframe.src = this._iframeUrl + "?" + Math.random();
        }
 		this.iframe.setAttribute('frameborder', '0', 0);
        iframeParent.appendChild(this.iframe);
 
        this.iframeWindow = this.iframe.contentWindow;
	
        Core.Events.addEvent(this.iframe, function(){
			this.onload=true;
			if(arguments.callee.down){
				return;
			}
            this.iframeDocument = this.iframeWindow.document;
            if ($IE) {
                this.iframeDocument.body.contentEditable = true;
            }
            else {
				this.iframeDocument.designMode = "on";
            }
			arguments.callee.down=true;
            this._onLoadOperates();
        }.bind2(this), 'load');
		if(this._iframeUrl == ""){
			this.iframeWindow.document.open();
			this.iframeWindow.document.write(this._setEditorHTML(""));
			this.iframeWindow.document.close();
		}
    },
	/**
	 * 初始化编辑器iframe中的内容（需要自定义的HTML时，可在子类中重写该方法）
	 * @param {String} sContent body中的html
	 */
    _setEditorHTML:function (sContent){
       var html = "<html></head><body>"+sContent+"</body></html>";
        return html;
	}
};

