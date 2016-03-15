/**
 * @fileoverview 宝宝进度条Flash插件检测
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-
 */

$import("sina/sina.js");
$import("lib/flashDetector.js");

$registJob("baby_babyBarFlashDetect", function() {
	var divBabyBayFlash=$E("divBabyBarFlash"),
		fd=new Lib.FlashDetector("9.0.0"),
		text=['#{reason}，为了能够正常显示，请您 ',
				'<a target="_blank" href="http://get.adobe.com/cn/flashplayer/">',
					'<img src="http://simg.sinajs.cn/blog7style/images/common/baby/flash.png">',
					'下载最新版本',
				'</a>',
				'。'
			].join("");
		
	fd.onUninstalled=function(){
		divBabyBayFlash && (divBabyBayFlash.innerHTML=text.replace(/\#\{reason\}/g,"您的浏览器未安装Flash播放器"));
	};
	fd.onVersionLower=function(clientVersion){
		divBabyBayFlash && (divBabyBayFlash.innerHTML=text.replace(/\#\{reason\}/g,"您的Flash播放器版本过低"));
	};
	fd.detect();
});