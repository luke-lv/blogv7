/**
 * @fileoverview 浏览器Flash插件检测类，可检测版本和是否安装Flash插件
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-27
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");

$import("lib/lib.js");

Lib.FlashDetector=function(ver){
	this.version=ver;
}.$define({
	
	/**
	 * 版本号
	 */
	version:"",
	
	detect:function(){
		var nav=window.navigator,
			i,
			l,
			isFlashed,
			clientVersion="0.0.0";
			
		if(nav.plugins && nav.plugins.length){
			for(i=0,l=nav.plugins.length;i<l;i++){
				if(nav.plugins[i].name.toLowerCase().indexOf("shockwave flash")!=-1){
					clientVersion=nav.plugins[i].description.toLowerCase().replace(/shockwave flash\s?/,"").split(" ")[0];
					isFlashed=true;
					break;
				}
			}
		}else if(window.ActiveXObject){
			for(i=11;i>=1;i--){
				try{
					if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i)) {
						clientVersion = i + ".0";
						isFlashed=true;
						break;
					}
				}catch(ex){}
			}
		}
		
		
		if(isFlashed){
			//安装了Flash插件则继续检测Flash版本号
			this._detectVersion(clientVersion);
		}else{
			this.onUninstalled && this.onUninstalled.call(this);
		}
		
		
	},
	
	//版本号检测
	_detectVersion:function(clientVersion){
		var cvs=this._getFormatVersion(clientVersion).split("."),
			vs=this._getFormatVersion(this.version).split("."),
			i,
			l=vs.length;
		
		for(i=0;i<l;i++){
			if(+cvs[i]>+vs[i]){
				this.onSuccess && this.onSuccess.call(this);
				return;
			}else{
				if(+cvs[i]<+vs[i]){
					this.onVersionLower && this.onVersionLower.call(this,clientVersion);
					return;
				}
			}
		}
		
		this.onSuccess && this.onSuccess.call(this);
	},
	
	_getFormatVersion:function(ver){
		var v=ver+"";
		v.indexOf(".")==-1 && (v+=".0.0");
		v.split(".").length<3 && (v+=".0");
		return v;
	},
	
	/**
	 * 低于指定版本时触发
	 */
	onVersionLower:function(clientVersion){},
	
	/**
	 * 未安装Flash插件时触发
	 */
	onUninstalled:function(){},
	
	/**
	 * 检测成功时触发
	 */
	onSuccess:function(){}
});
