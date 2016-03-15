/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 标准的编辑器类(抽象类)
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("lib/editor/AbstractBase.js");

/**
 * 编辑器基类, 仅提供编辑器相关操作的方法
 * 创造相关的界面需继承此类。
 * @author @author dg.liu | dongguang@staff.sina.com.cn
 */

Editor.AbstractStandard = Core.Class.create();
Editor.AbstractStandard.prototype = {
    textarea: null,
    history: null,
    tools: null,
    operate: null,
	formatDoc:null,
	imageOperate:null,
	modeType:"edit",
	/**
	 * 构造将被子类所覆盖
	 */
    initialize: function(){
        throw new Error("Editor.AbstractStandard为抽象类不能被实例化");
    },
    /**
     * 初始化代码模式所用到的textarea
     */
    initTextArea: function(textarea){
       /*var ta = $C("textarea");
        ta.className = className;
        container.appendChild(ta);
        */
        this.textarea = textarea;
    },
    /**
     * 切换代码模式与编辑模式
     */
    swapMode: function(){
		//trace("swapMode");
		this.swapShutOut(this.modeType);
        if (this.modeType == "edit") {
            if(this.iframeDocument){
				this.frameToArea();
			}
            this.iframe.parentNode.style.display = "none";
			this.textarea.parentNode.style.display="block";
            this.textarea.style.display = "block";
            this.modeType = "code";
        }
        else {
			if(this.iframeDocument){
				this.areaToFrame();
			}
            this.textarea.parentNode.style.display = "none";
            this.iframe.parentNode.style.display = "block";
			this.textarea.style.display = "none";
            this.modeType = "edit";
        }
    },
	getContentHtml:function(){
		this.frameToArea();
		return this.textarea.value;
	},
	/**
	 * 源码模式和编辑模式切换时回调的函数;预留给子类覆盖
	 * @param {String} type 切换的模式 edit:编辑;code：源码
	 */
	swapShutOut:function(type){
		//trace("Editor.swapShutOut");
	},
	/**
	 * 代码模式和编辑模式切换时复制数据，将iframe内容copy到textarea中。
	 */
	frameToArea:function(){
		this.textarea.parentNode.style.display = "none";
		this.textarea.value =this.formatCode(this.iframeDocument.body.innerHTML);
	},
	/**
	 * 代码模式和编辑模式切换时复制数据，将textarea内容copy到iframe中。
	 */
	areaToFrame:function(){
		if(!this.iframeDocument){
			setTimeout(function(){
				this.areaToFrame();
			}.bind2(this),500);
			return;
		}
		this.iframeDocument.body.innerHTML=this.textarea.value;
	},
	/**
	 * 过滤html代码；编辑模式与代码模式切换时调用
	 * @param {String} sCodeString
	 */
	formatCode:function (sCodeString) {
		sCodeString = sCodeString.replace(/<(\/?)(ul|hr|table|meta|link|tbody|tr|object|body|head|html)(|[^>]+)>\s*/g, '\n<$1$2$3>\n');
		sCodeString = sCodeString.replace(/\s*<(p|h[1-6]|div|title|style|pre|script|td|li)(|[^>]+)>/g, '\n<$1$2>');
		sCodeString = sCodeString.replace(/<\/(p|h[1-6]|div|title|style|pre|script|td|li)>\s*/g, '</$1>\n');
		sCodeString = sCodeString.replace(/(<font)(>)/gi, '$1 size=#$2');
		return sCodeString;
	}
};
Core.Class.extend(Editor.AbstractStandard.prototype,Editor.AbstractBase.prototype,true);
