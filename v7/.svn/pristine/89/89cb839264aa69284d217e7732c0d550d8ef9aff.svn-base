/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 快速博文发布器
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("lib/editor/AbstractBase.js");
$import("lib/editor/tools/Tool.js");
$import("sina/ui/template.js");
$import("sina/core/function/bind3.js");
$import("sina/utils/cookie/setCookie.js");
$import("lib/editor/utils/RangeCache.js");

Editor.QuickEditor = Core.Class.create();
Editor.QuickEditor.prototype = {
	_iframeUrl: "http://blog.sina.com.cn/main_v5/ria/blank.html",
	type:"QuickEditor",
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
        //trace("QuickEditor");
		if(!option||!option.container){
			return;
		}
		this._focusElementId=option.focusElementId;
		this.container=option.container;
		this._initIframe($E(this.container),option.className);
		this.rangeCache=new Editor.Utils.RangeCache(this);
		this._addOperateToOnload(this.addEventsToBody.bind2(this));
		this._addOperateToOnload(this.addEventsToDocument.bind2(this));
//        this.initTool();
		
    },
	/**
	 * 设置编辑器的滚动条的显示隐藏
	 * @param {String} value yew|no
	 */
	setScrolling:function(value){
		this.iframe.setAttribute('scrolling', value);
	},
	/**
	 * 设置编辑器高
	 * @param {Number} height
	 */
	setHeight:function(height){
		$E(this.container).style.height=height+"px";
		this.iframe.setAttribute('height', height);
	},
	setAutoHeight:function(autoHeight){
		if(!this.clearAutoHeight){
			this.clearAutoHeight=setInterval(autoHeight,200);
		}
	},
	addEventsToBody:function(){
		this.setHeight(53);
		Core.Events.addEvent(this.iframeDocument.body, this.rangeCache.save.bind2(this.rangeCache), "mouseup");
		Core.Events.addEvent(this.iframeDocument.body, this.rangeCache.save.bind2(this.rangeCache), "keyup");
		this.iframeDocument.body.style.padding="10px";
		if(!$IE){
			this.iframeDocument.body.style.height="auto";
		}
	},
	addEventsToDocument:function(){
		var saveStatusTimer;
		Core.Events.addEvent(this.iframeDocument,function(){
			clearTimeout(saveStatusTimer);
			saveStatusTimer = setTimeout(function(){
				trace("this.rangeCache.save");
				this.rangeCache.save();
			}.bind2(this), 500);
		}.bind2(this),"mouseup");
	}
};
Core.Class.extend(Editor.QuickEditor.prototype,Editor.AbstractBase.prototype,true);