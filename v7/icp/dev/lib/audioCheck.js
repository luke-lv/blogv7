/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 评论用 语音验证码
 * @author stan | chaoliang@staff.sina.com.cn
 */
 $import("sina/core/system/br.js");
Lib.AudioCheck = {};
/**
 * 所用flash地址
 * 是否为control使用不同的flash地址
 */
var random="";
		
if(window.$Maxthon||window.$360||window.$TT){
	random="?t="+new Date().getTime();
}
Lib.AudioCheck.swfUrl = $_GLOBAL.flashBasicURL + "mp3.swf"+random;
/**
 * flash取得声音文件的地址
 * 由于各产品使用的接口地址不一样。故使用参数进行配置
 */
Lib.AudioCheck.soundUrl = "http://interface.blog.sina.com.cn/riaapi/cksound/cksound.php";
/**
 * 向指定容器添加语音验证码功能
 * @param {Object} target 容器id
 */
Lib.AudioCheck.render = function(target, soundUrl){
    $E(target).innerHTML = '\
		<a style="margin-left:3px;" id="comment_get_vcode" href="javascript:;" onclick="Lib.AudioCheck.callAudioCheck();return false;">收听验证码</a>\
		<img id="play_img" name="play_img" src="http://image2.sina.com.cn/blog/tmpl/v3/images/blank.gif" align="absmiddle" style="margin-right:2px;" height="15">\
		<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width="0" height="0" id="mp3_player" align="middle">\
		<param name="allowScriptAccess" value="always" />\
		<param name="movie" value="' + this.swfUrl + '" />\
		<param name="quality" value="high" />\
		<param name="bgcolor" value="#ffffff" />\
		<param name="FlashVars" value="mp3URL=' +
    soundUrl +
    '" />\
		<embed src="' +
    this.swfUrl +
    '" FlashVars="mp3URL=' +
    soundUrl +
    '" quality="high" bgcolor="#ffffff" width="0" height="0" name="mp3_player" swLiveConnect="true" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"/>\
		</object>\
	';
};

Lib.AudioCheck.callAudioCheck = function(){
    setTimeout(function(){
        $E('play_img').src = 'http://blogimg.sinajs.cn/v5images/play_img.gif';
        window.document.mp3_player.SetVariable("isPlay", "1");
        $E('login_check').value = '';
        $E('login_check').focus();
    }, 500);

	// var url = "http://hits.blog.sina.com.cn/hits?act=3&uid=00000203";
    var url = "http://comet.blog.sina.com.cn/api?maintype=hits&act=3&uid=00000203";
	Utils.Io.JsLoad.request(url, {
		onComplete: function(){
		}
	});
};
