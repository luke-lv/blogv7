/**
 * @fileoverview 相框照片Flash编辑器
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-13
 */

$import("sina/sina.js");

$import("lib/ticket.js");
$import("lib/checkAuthor.js");
$import("lib/component/flashComponent/headPhotoEditor.js");
$import("lib/component/flashComponent/headPhotoEditorConfig.js");

$registJob("baby_headPhotoEditor", function() {

	var cfg=Lib.flashComponent.HeadPhotoEditorConfig["t"+scope.tpl] || Lib.flashComponent.HeadPhotoEditorConfig["t3_34"];
	Lib.checkAuthor();

	scope.babyHeadPhotoEditor = new Lib.flashComponent.HeadPhotoEditor({
		url:$_GLOBAL.flashBasicURL + "baby/headPhotoEditor.swf?"+(new Date()).getTime(),
		width:540,
		height:355,
		containerID:"flashHeadPhotoEditor",
		flashID:"swfHeadPhotoEditor",
		flashVar:[
				"maskURL=",cfg.maskURL,
				"&maskX=",cfg.maskX,
				"&maskY=",cfg.maskY,
				"&photoURL=",cfg.defaultPhoto,
				"&photoX=",80,
				"&photoY=",-42,
				"&photoZoom=",1,
				"&photoAngle=",0,
				"&frameURL=",cfg.frameURL,
				"&uploadURL=","http://icp.api.sina.com.cn/person/up_pic.php",
				"&fuid=",$UID,
				//"&fuid=","1250041040",
				"&type=","babyicon",
				"&output=","",
				"&middlePointX=",cfg.middlePointX,
				"&middlePointY=",cfg.middlePointY,
				"&saveURL=","",
				"&onCancel=","scope.babyHeadPhotoEditor.onCancel",
				"&onSaved=","scope.babyHeadPhotoEditor.onSaved",
				"&onUploaded=","scope.babyHeadPhotoEditor.onUploaded",
				"&onSendCompleted=","scope.babyHeadPhotoEditor.onSendCompleted",
				"&onFileTypeError=","scope.babyHeadPhotoEditor.onFileTypeError"
		].join("")
	});
	

	//添加保存图片到图片服务器的动态方法
	scope.babyHeadPhotoEditor.saveToPhotoServer=function(){
		//取图片上传票据
		Lib.Ticket.get(function(data){
			scope.babyHeadPhotoEditor.sendTo("http://upload.photo.sina.com.cn/interface/pic_upload.php"+
							"?s=json"+
							"&ticket="+data.ticket[0]+
							"&app=photo"+
							"&t="+(new Date()).getTime());
		},1);
               
	};
	
});