/**
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @fileoverview 编辑器上传图片
 */
$import("sina/ui/tab/tabs.js");
$import("editor/tools/uploadimage/UploadMain.js");

$registJob("add_template_image", function(){
	//trace("job:add_template_image");
	window.uploadMain=new UploadMain(replaceImage,1,"templateDialog");
	function replaceImage(imageLst,uplaodImageLst){
		//trace("replaceImage");
		top.ArticleIMGFuncs.replaceTemplateImage(imageLst,uplaodImageLst.join(","));
		
	}
});