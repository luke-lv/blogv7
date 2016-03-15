/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 事件监听类
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/array/ArrayWithout.js");
Editor.Utils.EventObserver = Core.Class.create();

Editor.Utils.EventObserver.prototype = {
    observers: [],
	type:"click",
    initialize: function(element,type){
		this.type=type;
		Core.Events.addEvent(element, this.exec.bind2(this), this.type);
    },
	attach:function(func){
		this.observers.push(func);
		return this.observers.length-1;
		
	},
	exec:function(){
		var len=this.observers.length;
		for(var i=0;i<len;i++){
			this.observers[i]();
		}
	},
	detach:function(step){
		//Core.Array.ArrayWithout(this.observers,step);
		this.observers[step]=function(){};
	},
	finalize: function(){
		this.observers=[];
		//Core.Events.removeEvent(Element,this.exec,type);
	}
};
