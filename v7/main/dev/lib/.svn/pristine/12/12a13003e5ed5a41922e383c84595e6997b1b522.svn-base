/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 图片上传进度条
 */
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/string/shorten.js");
$import("sina/ui/template.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/removeNode.js");
$import("msg/uploadImageMSG.js");

var UploadLoading = Core.Class.create();

UploadLoading.prototype = {
	ELE_ID:"loading_",
	RATD_ID:"loading_range_",
	ERROR_ID:"image_list_tip_",
	TIP_ID:"loading_tip_",
	DEL_ID:"item_del_",
	state:1,//1、初始化  2、上传中 3、出错 4、完成 5、取消了
    initialize: function(containerId,name,cancelCallback){
		//trace("loading_init");
		trace("containerId:"+containerId);
		this.id=containerId;
		this.name=name;
		
		this.show();
		this.showDel();
		this.cancelCallback=cancelCallback||function(){};
		this.initElement();
	},
	hiddenDel:function(){
		$E(this.DEL_ID+this.id).style.display="none";
	},
	showDel:function(){
		$E(this.DEL_ID+this.id).style.display="";
	},
	show:function(){
		$E(this.ELE_ID+this.id).style.display="";
		this.state=2;
	},
	setError:function(error,tip){
		//trace("uploadloaing.setError:"+error);
		var ele=$E(this.ERROR_ID+this.id);
		if(error){
			ele.innerHTML=tip||$SYSMSG["A77773"];
			ele.style.display="";
			this.state=3;
		}else{
			ele.innerHTML="";
			ele.style.display="";
		}
		
	},
	/**
	 * 进度条的百分比设计
	 * @param {String} range 进度条的百分比
	 */
	setRange:function(range){
		$E(this.RATD_ID+this.id).style.width=range;
	},
	/**
	 * 进度条进度完成，隐藏。
	 */
	setFinish:function(){
		var ele=$E(this.ELE_ID+this.id);
		ele.style.display="none";
		ele.innerHTML="";
		this.state=4;
//		$E(this.DEL_ID+this.id).style.display="";
	},
	setTip:function(text){
		$E(this.TIP_ID+this.id).innerHTML=text;
	},
	cancel:function(){
		//trace("cancel");
		var ele=$E(this.ELE_ID+this.id);
		ele.style.display="none";
		this.setError(false);
		ele.innerHTML="";
		this.hiddenDel();
		
		this.state=5;
		try{
			$E("uploadimage_"+uploadImage.id).cancel(this.name);	
		}catch(e){
			//traceError("上次图片flash被隐藏，无法调用到其内的函数");
		}
		this.cancelCallback(this.name);
	},
	initElement:function(){
		var loadingTemplate='<p id="#{TIP_ID}#{id}">0%</p><div class="loadbanner">'
         	+ '<div  style="width:0%;" id="#{RATD_ID}#{id}"class="loadbanner_c"></div></div>';
		var l_t=new Ui.Template(loadingTemplate);
		Core.Dom.addHTML($E(this.ELE_ID+this.id),l_t.evaluate({id:this.id,RATD_ID:this.RATD_ID,TIP_ID:this.TIP_ID}));
	}
};
