/*
 * Copyright (c) 2008, Sina Inc. All rights reserved.
 * @fileoverview Sina Space头像上传的flash封装
 * @author Pjan|peijian@staff.sina.com.cn
 * @modified dcw1123 2010.03.12
 */

$import("sina/sina.js");
$import("sina/core/system/br.js");
$import("lib/include.js");


if(typeof App == "undefined"){
	App = {};
}
App.head4platform = (function(){
	var head={};
	function thisMovie(movieName) {
		if (navigator.appName.indexOf("Microsoft") != -1) {
			//IE可从object元素调用方法，从window[id]直接取得object元素
			return window[movieName];
		}else if(window[movieName].length === 2){
			//webkit只能从embed元素调用方法，从document[id]取不到任何元素，从window[id]取得相同ID的元素数组
			return window[movieName][1];
		}else{
			//FF只能从embed元素调用方法，通过document[id]取得embed元素, 从window[id]取得object
			return document[movieName];
		}
	}
	head.getSwf = function(){
		return thisMovie("HeadCut");
	};
	head.wantC = function(_Name) {
		var Res = eval('/'+_Name+'=([^;]+)/').exec(document.cookie);
		var at=Res==null ? "" : Res[1];
		thisMovie("HeadCut").setC(encodeURIComponent(at));
	};
	head.show = function(uid, option){
		if (!uid){return;}
        if (0 !== option.canModifyHead) {
            option.canModifyHead = 1;
        }
		var op = {
			uid		:	uid,
			flash	:	option.flash?option.flash:"",
			echo	:	option.echo?option.echo:"",
			url		:	option.url?option.url:"",
			nick	:	option.nick?option.nick:"新浪网友",
			cancel	:	option.cancel?option.cancel:"",
			ticket	:	option.ticket || "",
			//用户微博验证等级，0为普通用户，1为黄V，2为蓝V
			vlevel  :   option.vlevel || parseInt(scope.$vlevel, 10) || 0,
            canModifyHead : option.canModifyHead
		};
		
		var _addFlash = function(){
			// V_movie, x_id, X_width, Z_height, v_version, z_bgColor, i_useExpressInstall, c_quality, I_xir, l_redirectUrl, o_detectKey
			var swf = new sinaFlash(		//flash 的地址
				op.flash + '?' + [
					"uid=" + op.uid,
					"canModifyHead=" + op.canModifyHead,
					"picurl=" + op.url,
					"echo=" + op.echo,
					"nick=" + op.nick,
					"cancel=" + op.cancel,
					"__SINAPRO__=123&fuid=" + scope.$uid,
					"vlevel=" + op.vlevel,
					"ticket=" + op.ticket
				].join('&'),
				"HeadCut",						//写入到页面后的 object id。
				"690",							//宽
				"530",							//高
				"9",							//flash 版本
				"#FFFFFF",						//flash 背景色
				false,							//是否使用 flash 快速升级
				"High",							//清晰度
				"http://www.sina.com.cn/",		//快速升级 url
				"http://www.sina.com.cn/",		//快速升级重定向 url
				false							//是否检测flash
			);
			swf.addParam("allowScriptAccess", "always");		//是否允许脚本互访
			swf.addParam("wmode", "transparent");			//透明度，FF 下使用 window 模式。解决输入法问题。
			// - 现在改回transparent，因为window模式的flash，会遮盖js对话框，如果用原生alert，win7下的FF会停止响应
			// edited by liangdong2@staff.sina.com.cn 2011.01.19 18:55
			swf.write("upload_flash");						//写入容器的 id。
		};
		if(typeof sinaFlash == "undefined"){
			Lib.include(["http://i3.sinaimg.cn/home/sinaflash.js"], _addFlash);
		}else{
			_addFlash();
		}
	};
	return head;
})();
