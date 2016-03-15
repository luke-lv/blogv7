/**
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @fileoverview 编辑器上传图片
 */
$import("sina/ui/tab/tabs.js");
$import("editor/tools/uploadimage/UploadMain.js");
$import("sina/utils/url.js");
$registJob("add_image", function(){
	//trace("job:add_image");
	var urlObj=new Utils.Url(window.location.href);
	var type=urlObj.getParam("type");
	if(type){
		new UploadMain(replaceImage,20,"templateDialog");
	}else{
	window.uploadMain=new UploadMain(insertImg);
	}
	
	function insertImg(imageLst,uplaodImageLst,imgParam,selectImgList){
		//trace("insertImg");
		top.ArticleIMGFuncs.addIMGList(imageLst,uplaodImageLst.join(","),"imageDialog",imgParam,selectImgList);
	}
	
	function replaceImage(imageLst,uplaodImageLst){
		//trace("replaceImage");
		top.ArticleIMGFuncs.replaceTemplateImage(imageLst,uplaodImageLst.join(","));
		
	}
});