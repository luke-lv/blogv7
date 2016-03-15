/**
 * @fileoverview flash容器类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-10
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/core/system/br.js");
$import("sina/utils/flash/swfObject.js");

$import("lib/component/flashComponent/flashComponent.js");
$import("lib/flashDetector.js");

Lib.flashComponent.FlashContianer=function(cfg){
	this._initCfg(cfg);
	this._flashDetector=new Lib.FlashDetector(this.flashCfg.version);
	this._detect();
}.$define({
	
	flashCfg:{
		url:"",
		width:0,
		height:0,
		containerID:"divContainer",
		flashID:"flashID",
		flashVar:"",
		version:"9",
		wmode:"transparent",
		allowScriptAccess:"always"
	},
	
	rerender:function(){
		this._initFlash();	
	},
	
	_renderText:['#{reason}，为了能够正常显示，请您 ',
					'<a target="_blank" href="http://get.adobe.com/cn/flashplayer/">',
						'<img src="http://simg.sinajs.cn/blog7style/images/common/baby/flash.png">',
						'下载最新版本',
					'</a>',
					'。'
				].join(""),
	
	_flash:null,
	
	_falshEntity:null,
	
	/**
	 * Flash检测器
	 */
	_flashDetector:null,
	
	_initFlash:function(){
		this._addFlash();
		this._initFlashEntity();
	},
	
	_detect:function(){
		var fd=this._flashDetector,
			me=this;
			
		fd.onSuccess=function(){
			me._initFlash();
		};
		fd.onUninstalled=function(){
			me._renderUninstalled();
		};
		fd.onVersionLower=function(clientVersion){
			me._renderVersionLower();
		};
		fd.detect();
	},
	
	/**
	 * 呈现Flash版本过低
	 */
	_renderVersionLower:function(){
		$E(this.flashCfg.containerID).innerHTML=this._renderText.replace(/\#\{reason\}/g,"您的Flash播放器版本过低");
	},
	
	/**
	 * 呈现未安装Flash插件
	 */
	_renderUninstalled:function(){
		$E(this.flashCfg.containerID).innerHTML=this._renderText.replace(/\#\{reason\}/g,"您的浏览器未安装Flash播放器");
	},
	
	/**
	 * 初始化需要配置的参数
	 * @param {Object} cfg
	 */
	_initCfg:function(cfg){
		var k;
		for(k in this.flashCfg){
			typeof(cfg[k])!="undefined" && (this.flashCfg[k]=cfg[k]);
		}
	},
	
	_addFlash:function(){
		var fc=this.flashCfg,
			me=this;
			
		this._flash = new Utils.Flash.swfObject(fc.url, fc.flashID, fc.width, fc.height, fc.version, "#ffffff");
		this._flash.addParam("allowScriptAccess", fc.allowScriptAccess);
		this._flash.addParam("wmode", fc.wmode);
		this._flash.addParam("flashVars",fc.flashVar);
		this._flash.write(fc.containerID);
	},
	
	_initFlashEntity:function(){
		this._flashEntity=$IE?window[this.flashCfg.flashID]:document[this.flashCfg.flashID];
	}
	

});
