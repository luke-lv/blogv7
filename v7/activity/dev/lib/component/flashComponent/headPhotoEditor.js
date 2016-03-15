/**
 * @fileoverview 育儿相框头图的Flash编辑器
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-13
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");

$import("lib/component/flashComponent/flashContainer.js");

$import("lib/component/flashComponent/headPhotoEditorConfig.js");

Lib.flashComponent.HeadPhotoEditor=function(cfg){
	
}.$extends(Lib.flashComponent.FlashContianer).$define({
	
	/**
	 * 根据模板号呈现flash内容
	 * @param {String} tplName
	 */
	updateRender:function(tplName){
		var hpc=Lib.flashComponent.HeadPhotoEditorConfig[tplName];
		this._flashEntity.setFrameURL && this._flashEntity.setFrameURL(hpc.frameURL);
		this._flashEntity.setMask && this._flashEntity.setMask(hpc.maskURL,hpc.maskX,hpc.maskY);
		this._flashEntity.setMiddlePoint && this._flashEntity.setMiddlePoint(hpc.middlePointX,hpc.middlePointY);
		this.resetPhoto();
	},
	resetPhoto:function(){
		this._flashEntity.resetPhoto && this._flashEntity.resetPhoto();
	},
	save:function(){
		this._flashEntity.save && this._flashEntity.save();
	},
	setMessage:function(msg){
		this._flashEntity.setMessage && this._flashEntity.setMessage(msg);
	},
	setPhotoParam:function(angle,zoom,x,y){
		this._flashEntity.setPhotoParam && this._flashEntity.setPhotoParam(angle,zoom,x,y); 
	},
	getSaveParams:function(){
		return this._flashEntity.getSaveParams?this._flashEntity.getSaveParams():"";
	},
	sendTo:function(url){
		this._flashEntity.sendTo && this._flashEntity.sendTo(url);
	},
	setSavedPhotoURL:function(url){
		this._flashEntity.setSavedPhotoURL && this._flashEntity.setSavedPhotoURL(url);
	},
	setSendToURL:function(url){
		this._flashEntity.setSendToURL && this._flashEntity.setSendToURL(url);
	}
});