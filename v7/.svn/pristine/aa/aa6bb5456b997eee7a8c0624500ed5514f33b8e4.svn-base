/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 进度条
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("lib/editor/tools/Tool.js");
$import("sina/ui/template.js");
$import("lib/msg/uploadImageMSG.js");
$import("sina/core/array/ArrayWithout.js");

Editor.UploadImage = Core.Class.create();
Editor.UploadImage.prototype = {
	object_id:"uploadimageflash_",
	embed_ID:"uploadimage_",
	f_width:373,
	f_height:24,
    initialize: function(container,upInputs){
		this.container=container;
		this.upInputs=upInputs;
    },
	initUploadFlash:function(){
		var width=373;
		var height=24;
	    var swf_url = $_GLOBAL.flashBasicURL + "fileuploadv5.swf?"+Core.Math.getUniqueId();
        var x = Utils.Flash.swfView.Add(swf_url, this.object_id + this.id, this.embed_ID + this.id, this.f_width, this.f_height, "9.0.0.0", "#000", {
            setparams:"uploadImage.setParams",
			isready:"scope.uploadImageIsRead"
			
        }, {
            scale: "showall",
            loop: "true",
            play: "true",
            pluginspage: "http://www.macromedia.com/go/getflashplayer",
            allowScriptAccess: "always",
            wmode: "transparent",
            allowFullScreen: 'false',
			wmode:"transparent"
        });
    },
	initFlashContainer:function(container){
		this.id = Core.Math.getUniqueId();
		var flashContainer=$C("div");
		flashContainer.style.width=this.f_width+"px";
		flashContainer.style.height=this.f_height+"px";
		flashContainer.style.position="absolute";
		flashContainer.style.zIndex="999";
//		flashContainer.style.backgroundColor="#000";
		flashContainer.style.overflow="hidden";
		flashContainer.id=this.object_id+this.id;
		Core.Dom.opacity(flashContainer, 1);
		document.body.appendChild(flashContainer);
		
	},selectFile:function(str){
		trace("selectFile:"+str);
		var nameArr=str.split("|");
		
		var names=nameArr.splice(0,10);
		this.cancel(nameArr);
		this.uploadImages=names;
		if(!this.lm){
			this.lm=new Editor.LoadingManage(this.container);
		}
		var len=names.length;
		for(var i=0;i<len;i++){
			this.lm.add(names[i]);
		}
	},
	clearError:function(){
		if(this.lm){
			this.lm.clearError();
		}
	},
	cancel:function(names){
		var len=names.length;
		var ele=$E(this.embed_ID+this.id);
		for(var i=0;i<len;i++){
			ele.cancel(names[i]);
		}
	},
	progress:function(name,num){
		this.lm.setPlan(name,num);
		trace("progress");
	},
	uploadFinish:function(fileName,data,flashInfo){
		trace("uploadFinish");
		data=data.replace(/(<meta[\.\w\s\S\d]*\/><script[\.\w\s\S\d]*>[\.\w\s\S\d]*<\/script>)/gi,'');
		data=Core.String.j2o(data);
		this.uploadImages=Core.Array.ArrayWithout(this.uploadImages,fileName);
		if(data.code=="A00006"){
			trace(fileName+":sucsess");
			
			var imageData=data.data.pics.pic_1;
			this.lm.setFinish(fileName,imageData.pid);
			//this.insertImage(imageData.pid);
		}else{
			this.lm.setError(fileName,"上传失败");
		}
		trace("uploadFinish");
	},
	error:function(code,name){
		this.lm.setError(name,$SYSMSG[code]);
		this.uploadImages=Core.Array.ArrayWithout(this.uploadImages,name);
		trace("error");
	},
	setFlashPosition:function(){
		var xy=Core.Dom.getXY($E(this.upInputs));
		var ele=$E(this.object_id+this.id);
		if(ele){
			ele.style.left=xy[0]+"px";
			ele.style.top=xy[1]+"px";
		}
	
	},
	/**
	 * 取得票据
	 */
	getTicket:function(){
		trace("getTicket");
		Lib.Ticket.get(this.ticketCallback.bind2(this),20);
	},
	/**
	 * 向flash添加票据
	 */
	ticketCallback:function(jsonStr){
		trace("ticketCallback");
		var ele=$E(this.embed_ID+this.id);
		ele.addTicket(Utils.Json.obj2json(jsonStr));
	},
	setParams:function(){
		trace("setParams");
	 	var type="multi";
		var url = "http://upload.photo.sina.com.cn/interface/pic_upload.php?app=blog&s=json";
        var size="5M";
		$E(this.embed_ID+ this.id).setParams(url + '|'+type+'|'+size+'|Images(jpg,jpeg,gif,png):*.jpg;*.jpeg;*.gif;*.png|uploadImage.selectFile|uploadImage.progress|uploadImage.uploadFinish|uploadImage.error|uploadImage.getTicket|redo');
	},
	insertImage:function(pid){
		var html='<a href="http://album.sina.com.cn/pic/'+pid+'&amp;690" target="_blank"><img src="'+this._getImgStaticPath(pid,"small")+'"/></a><br>';	
		editor.insertHTML(html);
	}
};
