/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 水印的版权须知
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/ui/panel.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("msg/uploadImageMSG.js");


var WaterCopyright = Core.Class.create();

WaterCopyright.prototype = {
    initialize: function(eleId){
		this.layer=new Ui.Panel();
		this.layer.setTemplate(this.initElement());
		this.attachEvent(eleId);
	},initElement:function(){
		var html='<div id="#{panel}" class="signtipLayer"><div class="arrow"></div><div id="#{content}" class="signtipLayer_txt">'+$SYSMSG["A77776"]+'</div></div>';
		return html;
	},
	setPosition: function(){
        var ele = Core.Events.getEventTarget();
        var left = Core.Dom.getLeft(ele)+ele.offsetWidth+5;
        var top = Core.Dom.getTop(ele)-8;
        this.layer.setPosition({
            x: left,
            y: top
        });
    },
	attachEvent:function(eleId){
		Core.Events.addEvent($E(eleId),this.show.bind2(this),"mouseover");
		Core.Events.addEvent($E(eleId),this.hidden.bind2(this),"mouseout");
	},
	show:function(){
		//trace("show");
		this.setPosition();
		this.layer.show();
	},
	hidden:function(){
		//trace("hidden");
		this.layer.hidden();
	}
};
