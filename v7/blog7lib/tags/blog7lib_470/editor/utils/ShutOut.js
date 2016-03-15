/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 遮罩
 */
$import("lib/editor/utils/utils.js");
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/setStyle.js");

Editor.Utils.ShutOut = Core.Class.create();
Editor.Utils.ShutOut.prototype = {
    initialize: function(){
		this.id=Core.Math.getUniqueId();
		Core.Dom.addHTML(document.body,'<div id="shut_out'+this.id+'" style="display:none;background:#F1F1F1;position: absolute; z-index: 1025;"></div>');
	},
	setProperty:function(ele){
		var left=Core.Dom.getLeft(ele);
		var top=Core.Dom.getTop(ele);
		var width=ele.offsetWidth;
		var height=ele.offsetHeight;
		this.setPosition(left,top);
		this.setSize(width,height);
		this.setOpacity();
	},
	setOpacity:function(num){
		Core.Dom.setStyle($E("shut_out"+this.id),"opacity",num||0.8);
	},
	setPosition:function(x,y){
		$E("shut_out"+this.id).style.top=y+"px";
		$E("shut_out"+this.id).style.left=x+"px";
	},
	setSize:function(width,height){
		$E("shut_out"+this.id).style.width=width+"px";
		$E("shut_out"+this.id).style.height=height+"px";
	},
	show:function(){
		//trace("ShutOut.show");
		$E("shut_out"+this.id).style.display="block";
	},
	hidden:function(){
		//trace("ShutOut.hidden");
		$E("shut_out"+this.id).style.display="none";
	}
};
