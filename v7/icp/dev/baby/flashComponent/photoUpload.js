/**
 * @fileoverview 相框头图显示的flash
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-04
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");

$import("lib/component/flashComponent/flashContainer.js");

scope.PhotoUpload=function(cfg){
	
}.$extends(Lib.flashComponent.FlashContianer).$define({
	setUploadURL:function(url){
		this._flashEntity.setUploadURL && this._flashEntity.setUploadURL(url);
	},
	sendTo:function(url){
		this._flashEntity.sendTo && this._flashEntity.sendTo(url);
	}
});
