/**
 * @fileoverview 相框头图显示的flash
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-04
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");

$import("lib/component/flashComponent/flashContainer.js");
$import("lib/component/flashComponent/flashComponent.js");

Lib.flashComponent.HeadPhoto=function(cfg){
	
}.$extends(Lib.flashComponent.FlashContianer).$define({
	
	/**
	 * 设置遮罩层的坐标
	 * @param {Number} x
	 * @param {Number} y
	 */
	setMaskPosition:function(x,y){
		x=isNaN(x)?0:x;
		y=isNaN(y)?0:y;
		this._flashEntity.setMaskPosition && this._flashEntity.setMaskPosition(x,y);
	},
	
	/**
	 * 设置照片的地址
	 * @param {String} url
	 */
	setPhotoURL:function(url){
		this._flashEntity.setPhotoURL && this._flashEntity.setPhotoURL(url);
	},
	
	/**
	 * 获取照片的地址
	 */
	getPhotoURL:function(url){
		if(this._flashEntity.getPhotoURL){
			return this._flashEntity.getPhotoURL();
		}
	},
	
	/**
	 * 设置照片的坐标
	 * @param {Number} x
	 * @param {Number} y
	 */
	setPhotoPosition:function(x,y){
		x=isNaN(x)?0:x;
		y=isNaN(y)?0:y;
		this._flashEntity.setPhotoPosition && this._flashEntity.setPhotoPosition(x,y);
	},
	
	/**
	 * 设置照片的缩放比例
	 * @param {Number} zoom
	 */
	setPhotoZoom:function(zoom){
		zoom=isNaN(zoom)?1:zoom;
		this._flashEntity.setPhotoZoom && this._flashEntity.setPhotoZoom(zoom);
	},
	
	/**
	 * 设置照片的旋转角度
	 * @param {Number} angle
	 */
	setPhotoAngle:function(angle){
		angle=isNaN(angle)?0:angle;
		this._flashEntity.setPhotoAngle && this._flashEntity.setPhotoAngle(angle);
	}

});
