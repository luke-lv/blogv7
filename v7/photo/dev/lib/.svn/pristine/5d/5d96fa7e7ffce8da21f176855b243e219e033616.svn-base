/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 图片上传图片属性设置
 */
$import("sina/core/class/create.js");
$import("sina/core/function/bind3.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");



var PropertySet = Core.Class.create();

PropertySet.prototype = {
    initialize: function(containerId,option){
		if(!containerId || !$E(containerId)){
			return;
		}
		this.containerId=containerId;
		this.id=Core.Math.getUniqueId();
		this.propertys=option.p;
		this.initElement(option.n);
		var p=Utils.Cookie.getCookie("property_set_"+this.containerId+"_" + scope.$uid);
		this.setProperty(p);
    }
	,initElement:function(name){
		Core.Dom.addHTML($E(this.containerId),name+'：<span style="padding:0px;" id="pt_c_'+this.id+'"></span>');
	},
	setProperty:function(property){
		var htmlArr=[];
		var i=0;
		for(var name in this.propertys){
			if(i==0 && !property){
				property=name;
			}
			if(name==property){
				htmlArr.push("<strong>"+this.propertys[name]+"</strong>");
			}else{
				htmlArr.push('<a href="#" id="ps_set_'+name+'" onclick="return false">'+this.propertys[name]+'</a>');
			}
			i++;
		}
		$E("pt_c_"+this.id).innerHTML=htmlArr.join("");
		this.value=property;
		this.saveToCookie(property);
		this.setEvent();
	},
	saveToCookie:function(value){
		Utils.Cookie.setCookie("property_set_"+this.containerId+"_" + scope.$uid,value,999);
	},
	setEvent:function(){
		for (var name in this.propertys) {
			 var ele=$E("ps_set_"+name);
			 if(ele){
			 	Core.Events.removeEvent(ele,Core.Function.bind3(this.setProperty,this,[name]),"click");
			 	Core.Events.addEvent(ele,Core.Function.bind3(this.setProperty,this,[name]),"click");
			 }
		}
	}

};
