/**
 * @fileoverview 图片上传的flash
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-10
 */

$import("sina/sina.js");

$import("lib/ticket.js");
$import("lib/checkAuthor.js");

$import("baby/flashComponent/photoUpload.js");

$registJob("baby_photoUpload", function() {

scope.photoUpload = {
	saveToPhotoServer: function(){
	}
};

	Lib.checkAuthor();
	scope.photoUpload = new scope.PhotoUpload({
		url:$_GLOBAL.flashBasicURL + "baby/photoUpload.swf",
		width:300,
		height:24,
		containerID:"flashPhotoUpload",
		flashID:"swfPhotoUpload",
		flashVar:[
				"uploadURL=","http://icp.api.sina.com.cn/person/up_pic.php",
				"&fuid=",$UID,
				//"&fuid=","1648117254",
				"&type=","babyicon",
				"&output=","",
				"&scale=",0.331579,
				"&onComplete=","scope.photoUpload.onComplete",
				"&onFileTypeError=","scope.photoUpload.onFileTypeError",
				"&onMaxSizeError=","scope.photoUpload.onMaxSizeError",
				"&onInterfaceError=","scope.photoUpload.onInterfaceError",
				"&onIOError=","scope.photoUpload.onIOError",
				"&onSendCompleted=","scope.photoUpload.onSendCompleted"
		].join("")
	});
	
		
	//添加保存图片到图片服务器的动态方法
	scope.photoUpload.saveToPhotoServer=function(){
		//取图片上传票据
		Lib.Ticket.get(function(data){
			scope.photoUpload.sendTo("http://upload.photo.sina.com.cn/interface/pic_upload.php"+
							"?s=json"+
							"&ticket="+data.ticket[0]+
							"&app=photo"+
							"&t="+(new Date()).getTime());
		},1);
               
	};
	
});
	