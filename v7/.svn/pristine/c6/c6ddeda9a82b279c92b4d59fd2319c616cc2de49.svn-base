/**
 * @fileoverview 相框头图修改弹出层
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-18
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/ui/renderer/simpleRenderer.js");

$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");
$import("lib/component/flashComponent/headPhotoEditor.js");
$import("lib/component/flashComponent/headPhotoEditorConfig.js");

$import("baby/flashComponent/flashComponent.js");

scope.flashComponent.HeadPhotoEditorDialog=function(tpl){
	this.tpl=tpl;
}.$define({
	
	tpl:"",
	
	_isInit:false,
	
	_dialog:null,
	
	_initDialog:function(){
		this._dialog=winDialog.createCustomsDialog({
			content:'<div style="width:540px;height:400px;" id="divHeadPhotoEditorFlash"></div>',
			title:"上传宝宝照片",
			renderer:Ui.SimpleRenderer
		});
		
		this._isInit=true;
	},
	
	_initFlash:function(){
		var cfg=Lib.flashComponent.HeadPhotoEditorConfig["t"+this.tpl] || Lib.flashComponent.HeadPhotoEditorConfig["t3_34"],
			headPhotoInfo=scope.UserBabyPic || {},
			me=this;
			
		Lib.checkAuthor();
		scope.babyHeadPhotoEditor = new Lib.flashComponent.HeadPhotoEditor({
			url:$_GLOBAL.flashBasicURL + "baby/headPhotoEditor.swf?"+(new Date()).getTime(),
			width:540,
			height:400,
			containerID:"divHeadPhotoEditorFlash",
			flashID:"swfHeadPhotoEditor",
			flashVar:[
					"maskURL=",cfg.maskURL,
					"&maskX=",cfg.maskX,
					"&maskY=",cfg.maskY,
					"&photoURL=",headPhotoInfo.photoURL || cfg.defaultPhoto,
					"&photoX=",headPhotoInfo.photoX || 0,
					"&photoY=",headPhotoInfo.photoY || 0,
					"&photoZoom=",headPhotoInfo.zoom || 1,
					"&photoAngle=",headPhotoInfo.angle || 0,
					"&frameURL=",cfg.frameURL,
					"&uploadURL=","http://icp.api.sina.com.cn/person/up_pic.php",
					"&fuid=",$UID,
					//"&fuid=","1250041040",
					"&type=","babyicon",
					"&isShowButton=1",
					"&echo=","",
					"&middlePointX=",cfg.middlePointX,
					"&middlePointY=",cfg.middlePointY,
					"&saveURL=","http://control.blog.sina.com.cn/riaapi/reg/init_blog_headflash.php",
					"&onCancel=","scope.babyHeadPhotoEditor.onCancel",
					"&onSaved=","scope.babyHeadPhotoEditor.onSaved",
					"&onUploaded=","scope.babyHeadPhotoEditor.onUploaded",
					"&onSendCompleted=","scope.babyHeadPhotoEditor.onSendCompleted",
					"&onFileTypeError=","scope.babyHeadPhotoEditor.onFileTypeError"
			].join("")
		});
		
		scope.babyHeadPhotoEditor.onCancel=function(){
			me.hidden();
		};
	},
	
	show:function(){
		!this._isInit && this._initDialog();
		
		this._dialog.setFixed(true);
		this._dialog.setAreaLocked(true);
		this._dialog.show();
		this._dialog.setMiddle();	
		
		var me=this;
		setTimeout(function(){
			me._initFlash();	
			me.onShow && me.onShow.call(me);
		},1);
		
		
	},
	hidden:function(){
		this._dialog.hidden();
	},
	onShow:function(){
		
	}
});