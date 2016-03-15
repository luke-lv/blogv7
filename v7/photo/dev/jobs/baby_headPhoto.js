/**
 * @fileoverview 相框头图显示的flash
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-10
 */

$import("sina/sina.js");
$import("lib/component/flashComponent/headPhoto.js");
$import("lib/component/flashComponent/headPhotoEditorConfig.js");

$registJob("baby_headPhoto", function() {
	var cfg=Lib.flashComponent.HeadPhotoEditorConfig["t"+scope.tpl] || Lib.flashComponent.HeadPhotoEditorConfig["t3_34"],
		headPhotoInfo=scope.UserBabyPic || {},
		headFlash=$E("headflash"),
		babyTpls=scope.babyTpl_conf || ["3_34","3_35","3_36","3_37"],
		isShowHead=false;
		
	for(var i=0,l=babyTpls.length;i<l;i++){
		if(babyTpls[i]==scope.tpl){
			isShowHead=true;
			break;
		}
	}

	if(!headFlash || !isShowHead){
		return;
	}
		
	headFlash.style.display="";
	
	scope.headPhoto = new Lib.flashComponent.HeadPhoto({
		url:$_GLOBAL.flashBasicURL + "baby/headPhoto.swf",
		width:540,
		height:285,
		containerID:"headflash",
		flashID:"flashHeadPhoto",
		flashVar:[
				"maskURL=",cfg.maskURL,
				"&maskX=",cfg.maskX,
				"&maskY=",cfg.maskY,
				"&middlePointX=",cfg.middlePointX,
				"&middlePointY=",cfg.middlePointY,
				"&photoURL=",headPhotoInfo.photoURL || cfg.defaultPhoto,
				"&photoX=",headPhotoInfo.photoX || 0,
				"&photoY=",headPhotoInfo.photoY || 0,
				"&photoZoom=",headPhotoInfo.zoom || 1,
				"&photoAngle=",headPhotoInfo.angle || 0 
		].join("")
	});
});