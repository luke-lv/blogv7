/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 插入相册图片
 */
$import("sina/core/class/create.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/pagination.js");
$import("sina/core/array/each.js");
$import("lib/builder.js");
$import("sina/core/string/shorten.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/utils/form/inputListen.js");
$import("sina/core/dom/getChildrenByClass.js");

var WebImage = Core.Class.create();

WebImage.prototype = {
	initialize: function(){
		Core.Events.addEvent($E("web_image_submit"),this.addImage,"click");
		this.buttonStatus();
		Utils.Form.inputListen($E("web_image_input"), 400);
	},
	buttonStatus:function(){
		if(!imageList.isFull()){
			$E("web_image_submit").parentNode.className="SG_aBtn SG_aBtnB";
		}else{
			$E("web_image_submit").parentNode.className="SG_aBtn SG_aBtn_dis";
		}
	},
	addImage:function(){
		//trace("webImage.addImage");
		if(imageList.isFull()){
			return;
		}
		// var url = "http://hits.blog.sina.com.cn/hits?act=3&uid=00000202&varname=urlpic";
		url = "http://comet.blog.sina.com.cn/api?maintype=hits&act=3&uid=00000202&varname=urlpic"
		Utils.Io.JsLoad.request(url, {
			onComplete: function(){
			}
		});	
		var ele=$E("web_image_input");
		var value=ele.value.toLowerCase();
		if(value=="http://" || value.indexOf("http://")!=0){
			top.winDialog.alert($SYSMSG["A06012"], {
		        icon:"01"
		    });
			return;
		}
		if(window.imageList.checkValue(value)!=false){
			top.winDialog.alert($SYSMSG["A06011"], {
		        icon:"01"
		    });
			return;
		}
		if(!window.imageList.add(ele.value)){
			top.showError("B79010");
		}
		
		ele.value="http://";
//		
	}
};
