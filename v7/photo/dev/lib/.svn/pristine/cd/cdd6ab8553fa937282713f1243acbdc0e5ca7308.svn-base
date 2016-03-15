/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 图片上传
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/math/getRandomNumber.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/string/j2o.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/setXY.js");
$import("sina/utils/flash/swf.js");
$import("editor/tools/uploadimage/LoadingList.js");
$import("editor/tools/uploadimage/WaterCopyright.js");
$import("other/getImgStaticPath.js");
$import("msg/uploadImageMSG.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/json.js");
$import("lib/ticket.js");

var UploadImage = Core.Class.create();

UploadImage.prototype = {
	width:310,
	height:30,
	view:"select",
	FLASH_ID:"uploadimageflash_",
	EMBED_ID:"uploadimage_",
    initialize: function(container,dialogName){
	   this.initFlashContainer(container);
	   this.dialogName=dialogName||"imageDialog";
       this.initUploadFlash();
	   this.initFlashPosition();
	   window.loadingList=new LoadingList();
	   Core.Events.addEvent($E("watermark"),this.waterMark.bind2(this));
	   this.waterCopyright=new WaterCopyright("waternotice");
	   this.initWaterMarkSelect();
	   this.initGetPicSizeFla();
	   
	   
    },
    initUploadFlash:function(){
		var params='uploadImage.setparams|uploadImage.error';
	    var swf_url = $_GLOBAL.flashBasicURL + "fileuploadv5.swf?"+Core.Math.getUniqueId();
        var x = Utils.Flash.swfView.Add(swf_url, this.FLASH_ID + this.id, this.EMBED_ID + this.id, this.width, this.height, "9.0.0.0", "#000", {
            setparams:"uploadImage.setParams",
			isready:"uploadImageIsRead"
			
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
		flashContainer.style.width=this.width+"px";
		flashContainer.style.height=this.height+"px";
		flashContainer.style.position="absolute";
		flashContainer.style.overflow="hidden";
		flashContainer.id=this.FLASH_ID+this.id;
		Core.Dom.opacity(flashContainer, 0);
		$E(container).appendChild(flashContainer);
		
	},
	initFlashPosition:function(){
		//trace("UploadImage.initFlashPosition")
		//this.setFlashPosition(102,65);
		this.moveFlash();
	},
	uploadFinish:function(fileName,data,flashInfo){
		//trace("uploadFinish_pama1_fileName:"+fileName);
		//trace("uploadFinish_pama2_data:"+data);
		//trace("uploadFinish_pama3_flashInfo:"+flashInfo);
		
		data=data.replace(/(<meta[\.\w\s\S\d]*\/><script[\.\w\s\S\d]*>[\.\w\s\S\d]*<\/script>)/gi,'');
		data=Core.String.j2o(data);
		if(data.code=="A00006"){
			trace(fileName+":sucsess");
			//window.loadingList.setOperate(fileName,"finish");
			var imageData=data.data.pics.pic_1;
			//trace("-------start----------");
			//trace(imageData.pid);
			//trace(imageData.name);
			this.setAllTip("finish");
			//trace("-------end----------");
			var isAdd=imageList.add(getImgStaticPath(imageData.pid,"square"),"upload");
			//trace(">>imageList.at:"+imageList.at);
			//trace(">>isAdd:"+isAdd);
			if(isAdd){
				window.loadingList.setPid(imageData.name,imageData.pid);
				window.loadingList.setRange(imageData.name,100);
			}else{
				window.loadingList.error(imageData.name,true,"图片已满");
			}
//			if(imageList.at>=imageList.eleMax){
//				this.swapGoto("hidden");
//			}else{
//				this.swapGoto();
//			}
		}else{
			imageList.at++;
			var count=data.data.count.toString();
			trace("uplaod");
			switch(count){
				case "1":
					var imageData=data.data.pics.pic_1;
					var str=imageData.ret.toString();
					var name=imageData.name;
			
					switch(str) {
						case "-11":
						trace(str);
						trace('name:'+name);
							window.loadingList.error(name,true,$SYSMSG["A77772"]);
							break;
						default:
							window.loadingList.error(name,true);
					}
					break;
				default:
					window.loadingList.error(fileName,true,$SYSMSG["A77772"]);
			}
			this.setAllTip();
			
			//showError(data.code);
		}
		this.moveFlash();
//		var flashEle=$E("uploadimage_"+this.id);
	}
	,error:function(code,name){
		//trace("uploadImage_error:"+code);
		//trace("uploadImage_error:"+name);
		imageList.at++;
		this.setAllTip();
		if(name){
			switch(code) {
				case "A06004":
					window.loadingList.error(name,true,$SYSMSG["A77771"]);
					break;
				default:
					window.loadingList.error(name,true,$SYSMSG["A77774"]);
			}
		}else{
			window.loadingList.allError();
		}
	}
	,selectFile:function(names){
		//trace("uploadImage_selectFile:"+names);
//		if(!this.view!="loading"){
//			this.setLoadingView();
//		}
		var loadFiles=names.split("|");
		for(var i=0;i<loadFiles.length;i++){
			if(imageList.eleMax-imageList.at-i>0){
				window.loadingList.add(imageList.getIdByIndex(imageList.at+i),loadFiles[i]);
				
				if(!imageList.isAddRemvoeFunc){
					imageList.addDelCallback(window.loadingList.remove.bind2(window.loadingList));
					imageList.isAddRemvoeFunc=true;
				}
				
			}else{
				this.setAllTip("error");
				this.stopUpload(loadFiles[i]);
				//window.loadingList.add(loadFiles[i]);
			}
		}
		this.setSize();
		this.moveFlash();
	},
	progress:function(name,num){
		//trace("uploadImage_progress_length:"+arguments.length);
		//trace("uploadImage_progress_param1:"+name);
		//trace("uploadImage_progress_param2:"+num);
		if(num<100){
			window.loadingList.setRange(name,num);
		}
	},
	setParams:function(){
		  //    var params='multi|blog|json|1|||'+encodeURIComponent(__SINAPRO__)+'|2M|http://upload.photo.sina.com.cn/interface/pic_upload.php?' + Core.Math.getUniqueId() + '|Images(jpg,gif,png):*.jpg;*.gif;*.png|uploadImage.selectFile|uploadImage.progress|uploadImage.uploadFinish|uploadImage.error';
      	 //trace("flash_callback:uploadImage.setParams");
		 var type="multi";
		 if(imageList.eleMax<2){
		 	type="single";
		 }
		 
		var url = "http://upload.photo.sina.com.cn/interface/pic_upload.php?app=blog&s=json";
		if(scope.$token){
			url+="&token="+scope.$token;
		}
		if(scope.$vipsign){
			url+="&vipsign="+scope.$vipsign;
		}
		if(scope.$pic_encrypt){
			url+="&pic_encrypt="+scope.$pic_encrypt;
		}
		
	
//		if(scope.$pic_encrypt) {
//			url = 'http://upload.photo.sina.com.cn/interface/pic_upload.php?app=blog&s=json&loginstr=' + encodeURIComponent(scope.$pic_encrypt);
//		}
//		else if(__SINAPRO__ != "" && __SINAPRO__ != null) {
//			url = 'http://upload.photo.sina.com.cn/interface/pic_upload.php?app=blog&s=json&sess=' + __SINAPRO__;
//		}
	  	 //var url = 'http://upload.photo.sina.com.cn/interface/pic_upload.php?app=theme&s=json&sess=' + __SINAPRO__ + '&loginstr=' + encodeURIComponent(scope.$pic_encrypt);
		// var url = 'http://upload.photo.sina.com.cn/interface/pic_upload.php?app=blog&s=json&loginstr=' + encodeURIComponent(scope.$pic_encrypt);
        var size="5M";
		if(parent.scope.$is_photo_vip){
			size="10M";
		}
//		trace(size);
		$E(this.EMBED_ID+ this.id).setParams(url + '|'+type+'|'+size+'|Images(jpg,jpeg,gif,png):*.jpg;*.jpeg;*.gif;*.png|uploadImage.selectFile|uploadImage.progress|uploadImage.uploadFinish|uploadImage.error|uploadImage.getTicket|redo');
	},
//	setLoadingView:function(){
//		$E("upload_file_li").style.display="none";
//		
//		$E("upload_loading_li").style.display="block";
//		this.waterDisabled(true);
//		
//		if(!$E("watermark").checked){
//			$E("upload_watermark_li").style.display="none";
//		
//			$E("upload_info_li").style.display="none";
//			$E("upload_button_li").style.display="none";
//			$E("watermarkinfo").style.display="none";
//		}
//		
//		
//		
//		this.setAllTip("wait");
//		this.setFlashSize();
//		this.view="loading"
//	},
//	setOperateVeiw:function(){
//		//trace("UploadImage.setOperateVeiw");
//		$E("upload_loading_li").style.display="none";
//		$E("upload_file_li").style.display="block";
//		$E("upload_info_li").style.display="block";
//		$E("upload_button_li").style.display="block";
//		$E("upload_watermark_li").style.display="block";
//		
//		this.waterDisabled();
//		$E("watermarkinfo").style.display="none";
//		
//		this.view="operate";
//		this.initFlashPosition();
//		this.setFlashSize("lager");
//		this.setSize();
//	},
	waterDisabled:function(disabled){
		if(disabled){
			$E("watermark").disabled=true;
			
		}else{
			$E("watermark").disabled=false;
		}
	},
	setFlashSize:function(size){
		var ele=$E(this.FLASH_ID+this.id);
		size = size || "small";
		switch(size) {
			case "small":
				ele.style.width=60+"px";
			    ele.style.height=25+"px";
				break;
			case "hidden":
				ele.style.width=1+"px";
				ele.style.height=1+"px";
				break;
			default:
				ele.style.width=this.width+"px";
				ele.style.height=this.height+"px";
		}

	},
	setSize:function(){
		top[this.dialogName].setSize(660,document.body.offsetHeight);
	},
	setAllTip:function(type){
		var html="";
		switch(type) {
			case "error":
				html='<span class="cRed">'+imageList.eleMax+'张以后的图片已自动忽略</span>';
				break;
			case "wait":
				html='<span class="cGreen">添加中，请等待...</span>';
				break;
			case "finish":
				html='<span class="cGreen">图片已经添加完成</span>';
				break;
			default:
				html='';
			
		}
		$E("upload_image_note").innerHTML=html;
		this.moveFlash();
	},
	moveFlash:function(){
		var xy=Core.Dom.getXY($E("upload_file_li"));
		this.setFlashPosition(xy[0]+100,xy[1]);
	},
	/**
	 * 取得票据
	 */
	getTicket:function(){
		Lib.Ticket.get(this.ticketCallback.bind2(this),20);
	},
	/**
	 * 向flash添加票据
	 */
	ticketCallback:function(jsonStr){
		var ele=$E(this.EMBED_ID+this.id);
		ele.addTicket(Utils.Json.obj2json(jsonStr));
	},
	setFlashPosition:function(x,y){
		//trace("UploadImage.setFlashPosition");
		var flashEle=$E(this.FLASH_ID+this.id);
		Core.Dom.setXY(flashEle,[x,y]);
	},
	stopUpload:function(name){
		 $E(this.EMBED_ID + this.id).cancel(name);
	},
	swapGoto:function(type){
		type=type||"show";
		if(typeof(this.gotoType)=="undefined"){
			this.gotoType="show";
		}
		if(type=="show" && this.gotoType!="show"){
			$E("upload_go_on").parentNode.style.display="";
			this.gotoType="show";
			this.moveFlash();
		}
		if(type=="hidden" && this.gotoType!="hidden"){
			$E("upload_go_on").parentNode.style.display="none";
			this.setFlashSize("hidden");
			this.gotoType="hidden";
		}
	},
	initWaterMarkSelect:function(){
		var ele=$E("watermark");
		var cookieValue=Utils.Cookie.getCookie("water_mark_" + scope.$uid);
		//trace("initWaterMarkSelect.cookieValue:"+cookieValue);
		if(cookieValue=="1"){
			ele.checked=true;
			this.waterMark();
		}else{
			ele.checked=false;
		}
	},
	waterMark: function(){
		var ele = $E("watermark");
		var url;
		var flashEle = $E(this.EMBED_ID+ this.id);
		if(typeof flashEle.setMask !="undefined") {
			if (ele.checked) {
				//trace("设置水印");
				if (top.scope.$uhost && top.scope.$uhost != "") {
					url = "blog.sina.com.cn/" + top.scope.$uhost;
				}
				else {
					url = "blog.sina.com.cn/u/" + top.scope.$uid;
				}
				flashEle.setMask(1, url);
				Utils.Cookie.setCookie("water_mark_" + scope.$uid, "1", 999);
			}
			else {
				//trace("取消设置水印");
				flashEle.setMask(0);
				Utils.Cookie.setCookie("water_mark_" + scope.$uid, "0", 999);
			}
		}else{
			setTimeout(this.waterMark.bind2(this),50);
		}
		
	},
	initGetPicSizeFla:function(){
		try {
			var fNode=$C("div");
			fNode.id="GetPicSize";
			$E("headerTab").appendChild(fNode);
			var tStr="";
			if($TT||$360||$Maxthon){
				tStr="?t="+Core.Math.getRandomNumber(1,99999);//针对360、遨游、tt 防止恶意缓存
				}
			Utils.Flash.swfView.Add($_GLOBAL.flashBasicURL + "getPicSize.swf"+tStr, "GetPicSize", "getPicSizeSWF", "1", "1", "8", "#ffffff", {}, {
				allowScriptAccess: "always",
				wmode: "transparent"
			});
			Utils.Flash.swfView.Init();	
			this._getPicSizeSWF = $E("getPicSizeSWF");	
			parent.trace("获取图片大小flash加载成功！！！！！");	
		}catch(ex){
			parent.trace("获取图片大小flash加载失败");
		}
	},
	getFlashReady:function(){
		parent.trace("flash回调");
		top.isPicFlaReady=true;
		
	},
	getSizeStart:function(){		
		try{
			//this._getPicSizeSWF.getStart();
			$E("getPicSizeSWF").getStart();
		}catch(e){
			parent.trace("flash getStart函数不可用");
		}
		
	},
	getSize:function(url){		
		try {
			this._getPicSizeSWF.getPicSize(url);
		}catch(e){
			parent.trace("flash getPicSize函数不可用");
		}
		//getAlbumPicSize
	},
	ImgSizeRet:function(url,obj){
		//Modified by W.Qiang , pictures's domain changes to sinaimg.cn, 2011-03-15
		if (url.indexOf("photo.sina") != -1 || url.indexOf("sinaimg.cn") != -1) {
			var pId = url.substring(url.lastIndexOf('/') + 1);
			pId = pId.replace(/&\d{3}/, "");
			parent.top.ArticleIMGFuncs.picSizeObj[pId] = obj;
			
		}else{
			parent.top.ArticleIMGFuncs.picSizeObj[url] = obj;
			
		}
	}
};
