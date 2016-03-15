/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器弹出层基类
 * @author dongguang | dongguang@staff.sina.com.cn
 */
$import("lib/editor/tools/tools.js");
$import("sina/core/class/create.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/ui/template.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");

Editor.Tools.OperateLayer = Core.Class.create();
Editor.Tools.OperateLayer.prototype = {
    initialize: function(editor, tamplate){

    },
	/**
	 * 初始化内容节点，需要子类覆盖
	 */
    initElement: function(){
    },
	/**
	 * 设置位置 即 left top
	 */
    setPosition: function(){
        var e = Core.Events.getEvent();
        var et = Core.Events.fixEvent(e);
        var ele = et.target;
        var left = Core.Dom.getLeft(ele);
        var top = Core.Dom.getTop(ele) + ele.offsetHeight + 1;
        this.layer.setPosition({
            x: left-5,
            y: top
        });
    },
	/**
	 * 停止时间传递
	 */
    stopEvent: function(){
        Core.Events.stopEvent();
    },
	/**
	 * 获取触发事件元素
	 */
    getEventElement: function(){
        var e = Core.Events.getEvent();
        var et = Core.Events.fixEvent(e);
        return et.target;
    },
	/**
	 * 执行函数，需要子类覆盖
	 */
    exec: function(){
       
    },
	/**
	 * 隐藏
	 */
    hidden: function(){
        //trace("hidden");
        this.layer.hidden();
		this.isShow=false;
        
    },
	/**
	 * 显示
	 */
    show: function(){
		this.isShow=this.isShow||false;
		if(this.isShow){
			this.hidden();
		}else{
			this.setPosition();
        	this.stopEvent();
        	this.layer.show();
			this.layer.entity.style.zIndex="1025";
			this.setColor(this.getEventElement().style.backgroundColor);
			this.isShow=true;
		}
    }
	/**
	 * 设置flash默认选中的颜色
	 */
	,setColor:function(color){
		//trace("OperateLayer.setColor.color："+color);
		var ele=$E("seteditorcolorswf_"+this.id);
		if(ele && ele.setColor){
			ele.setColor(color);
		}
	}
};

