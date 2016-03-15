/**
 * @fileoverview 这个是振华在开发朋友项目时遗留下来的东西，在做博客7.0时发现还是能用的，并且没有使用prototype，
 * 				 因此，整理出来，继续使用 xy 2009-09-03，看来振华要长存我们之中了
 * @author xs 
 *
 * 拷贝文本内容到剪切板
 */
$import("sina/utils/utils.js");
$import("sina/core/events/addEvent.js");


/**
 * 拷贝文本内容到剪切板
 */
Utils.text2Copy = function(text2copy){
	
	// 检测是否Flash10
	var checkFlashVer = function(){
		var plugin = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ?
		navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
		if (plugin) {
			var words = navigator.plugins["Shockwave Flash"].description.split(" ");
			for (var i = 0; i < words.length; ++i) {
				if (isNaN(parseInt(words[i], 10))){
					continue;
				} 
				var MM_PluginVersion = words[i];
			}
			return MM_PluginVersion >= 10;
		}else if ($IE){
			try{	
				new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10");
				return true;
			}catch(e){
				return false;
			}
		}
	};
	
			
	// IE6 直接使用clipboardData对象
	if (window.clipboardData && $IE6) {
		window.clipboardData.clearData();
		return window.clipboardData.setData("Text", text2copy);
	} else {
		if (checkFlashVer()) {
			if($IE){
				try{
			        	window.clipboardData.clearData();
					return window.clipboardData.setData("Text", text2copy);				
				}catch(e){
					return false;
				}
			}
			// FF下针对FlashPlayer10处理 (有安全提示)
			try {
		                netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		                var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		                if (!clip) {
					return;
				}
		                var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		                if (!trans){
					return;
				} 
		                trans.addDataFlavor('text/unicode');
		                var str = {};
		                var len = {};
		                str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		                var copytext = text2copy;
		                str.data = copytext;
		                trans.setTransferData("text/unicode", str, copytext.length * 2);
		                var clipid = Components.interfaces.nsIClipboard;
		                if (!clip){
					return false;
				} 
		                clip.setData(trans, null, clipid.kGlobalClipboard);
		
						return true;
			}catch(e){ 	return false; }
		}else{
			// 其他情况使用FlashCopy
			var flashcopier = 'flashcopier';
			if(!$E(flashcopier)) {
			var divholder = $C('div');
			divholder.id = flashcopier;
			document.body.appendChild(divholder);
			}
				text2copy = text2copy.replace(/%/g,escape('%')).replace(/&/g,escape('&'));
			var divinfo = '<embed src="http://simg.sinajs.cn/blog7common/clipboard.swf" FlashVars="clipboard='+text2copy+'" width="0" height="0" type="application/x-shockwave-flash"></embed>'; //这里是关键
			//var divinfo = '<embed src="http://simg.sinajs.cn/blog7common/clipboard.swf" FlashVars="clipboard=' + text2copy.replace(/%/g,escape('%')).replace(/&/g,escape('&')) + '" width="0" height="0"	type="application/x-shockwave-flash"></embed>';
			$E(flashcopier).innerHTML = divinfo;
			return true;
		}
	}
};