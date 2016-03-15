/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 博客编辑器类
 */
$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("lib/editor/AbstractStandard.js");
$import("lib/editor/tools/Tool.js");
$import("lib/editor/tools/SmallOperate.js");
$import("lib/editor/utils/EditorHistory.js");
$import("lib/editor/utils/RangeCache.js");
$import("lib/editor/tools/Status.js");
$import("sina/ui/template.js");
$import("sina/core/function/bind3.js");
$import("sina/utils/cookie/setCookie.js");
$import("lib/editor/utils/FormatDoc.js");

Editor.SmallEditor = Core.Class.create();
Editor.SmallEditor.prototype = {
    //iframeUrl: "blank.html",
	_iframeUrl: "http://blog.sina.com.cn/main_v5/ria/blank.html",
	type:"smallEditor",
	/**
	 * 
	 * @param {Object} option
	 * {
			iframe_container:"SinaEditor_Iframe",
			iframe_cls:"iframe_h",
			textarea_container:"SinaEditor_Textarea",
			textarea_cls:"textarea_h"
		};
	 */
    initialize: function(option){
        //trace("BlogEditor");
		if(!option||!option.iframe_container){
			return;
		}
		this._focusElementId=option.focusElementId;
        this._initIframe($E(option.iframe_container), option.iframe_cls);
		this.initTextArea($E(option.textarea));
        this.operate = new Editor.Tools.Operate(this,true);
		this.history = new Editor.Utils.EditorHistory(this, 50);
		this.rangeCache=new Editor.Utils.RangeCache(this);
		this._addOperateToOnload(this.addEventsToBody.bind2(this));
		this._addOperateToOnload(this.addEventsToDocument.bind2(this));
		this._addOperateToOnload(this.initToosStatus.bind2(this));
		this._addOperateToOnload(function(){this.formatDoc=new  Editor.Utils.FormatDoc(this.iframeDocument,this);}.bind2(this));
		this.initModeSwap(option.checkbox);
        this.initTool();
		
    },
	/**
	 * 初始化工具栏
	 */
    initTool: function(){
		var classTemplate="ico_#{operate}_#{num}";
        var baseToolConfig = {
            classTemplate: classTemplate,
            tools: {
                bold: {title: "加粗"},
                fontsize: {title: "字号",inner:"<div>12px</div>"},
                forecolor: {title: "文字颜色",style:"background-color:#000;" },
				link: {title: "插入链接"},
                img: {title: "插入图片"}
            }
        };
        this.baseTools = new Editor.Tools.Tool("mini_tools", baseToolConfig);
        this.baseTools.setOperate(this.operate);
        this.baseTools.initElements();
		
    },
	/**
	 * 初始化工具栏中按钮状态
	 */
	initToosStatus:function(){
		this.baseToolStatus=new Editor.Tools.Status(this.baseTools.id,this,["bold", "forecolor","fontsize"]);
		
		Core.Events.addEvent(this.iframeDocument.body,this.baseToolStatus.checkAllStatus.bind2(this.baseToolStatus),"mouseup");
		Core.Events.addEvent(this.iframeDocument,this.baseToolStatus.checkAllStatus.bind2(this.baseToolStatus),"keyup");
		
	},
	/**
	 * 初始化代码模式与设计模式之间切换
	 * @param {String || Element} checkbox 绑定事件的元素或元素的id
	 */
	initModeSwap:function(checkbox){
		Core.Events.addEvent(checkbox,this.swapMode.bind2(this),"click");
	},
	
	addEventsToBody:function(){
		Core.Events.addEvent(this.iframeDocument.body, this.rangeCache.save.bind2(this.rangeCache), "mouseup");
	},
	addEventsToDocument:function(){
		var saveStatusTimer;
		Core.Events.addEvent(this.iframeDocument,function(){
			clearTimeout(saveStatusTimer);
			saveStatusTimer = setTimeout(function(){
				this.rangeCache.save();
			}.bind2(this), 500);
		}.bind2(this),"mouseup");
		
		var saveTimer;
		Core.Events.addEvent(this.iframeDocument,function(e){
			//trace("add");
			if (e.ctrlKey && e.keyCode == 90 || e.ctrlKey) {
				return;
			}
			clearTimeout(saveTimer);
			saveTimer = setTimeout(function(){
				this.history.add();
			}.bind2(this), 500);
		}.bind2(this), "keydown");
	},
	swapShutOut:function(type){
			if(type=="edit"){
				this.baseTools.setShutOutProperty($E("mini_tools"));
				this.baseTools.shutOut.show();
			}else{
				this.baseTools.shutOut.hidden();
			}
		
	},
	/** 
	 * 发表博文前转换博文到input中 
	 */
	setSourceValue:function () {
		if(this.modeType == "edit"){
//			_setEditorMode(true);
//			_formatVideo();
			this.frameToArea();
		}else {
//			_formatVideo();
//			_editorArea.value = _formatCode(_editorDocument.body.innerHTML);
		}
	},
	/** 判断是否有图片跟Flash */
	getMediaTag : function () {
		var imgs = this.iframeDocument.getElementsByTagName("img");
		var lens = imgs.length;
		var facepath = "http://simg.sinajs.cn/blog/images/face/";
		var facepathlen = facepath.length;
		var isIMG = 0;
		var isMedia = 0;
		for(var i = 0; i < lens && isIMG == false; i ++) {
			if(imgs[i].src.substr(0, facepathlen) != facepath && imgs[i].src != "http://simg.sinajs.cn/blog/v5images/editor/video_new.jpg") {
				isIMG = 1;
			}
			if(imgs[i].src == "http://simg.sinajs.cn/blog/v5images/editor/video_new.jpg"){
				isMedia = 1;
			}
		}
		
		var objs = this.iframeDocument.getElementsByTagName("object");
		if(objs.length > 0) isMedia = 1;
		
		var objs = this.iframeDocument.getElementsByTagName("embed");
		if(objs.length > 0) isMedia = 1;
		
		
		return [isIMG, isMedia];
	},
	swapSize:function(type){
		var containerEle=$E("sizeContainer");
		switch(type) {
			case "big":
				containerEle.className="SmallblogEditorWrap myWidth_L";
				break;
			case "hit":
				containerEle.className="SmallblogEditorWrap myWidth_M";
				break;
			case "small":
				containerEle.className="SmallblogEditorWrap myWidth_S";
				break;
		}
	}
};
Core.Class.extend(Editor.SmallEditor.prototype,Editor.AbstractStandard.prototype,true);