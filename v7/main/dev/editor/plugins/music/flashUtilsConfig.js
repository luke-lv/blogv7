/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 博客乐库合作项目-乐库提供预览播放的js
 * @modify dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");

Editor.Plugins.flashUtils=function(){
	var tobj;
	var obj;
	var mpwindw;
	var createObj= function(){
			//obj=flashUtils.getFlashObj("musicUtils");
			if (typeof (obj)!== 'undefined'){
				clearInterval(tobj); 
				return true;
			}
			else{
				obj=Editor.Plugins.flashUtils.getFlashObj("musicUtils_blog");
				return false;
			}
		};
	return {
		writeFlash:function(){
			//需要跟1象素播放器做互斥的播放器产品（互斥接口字符串，以","分割。）如MPW的接口为"_mpwLc"
			var flashArgs="_mpwLc";
			var musicStr="";
			musicStr+='<div id="musicPlayer" style="display:block; z-index:1024; padding:0px; margin:0px; width:1px; height:1px;bottom:0px; left:0px;overflow:hidden;position:fixed;*position:absolute;">';
			musicStr+='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="100%" height="100%" id="musicUtils_blog" align="middle">';
			musicStr+='<param name="allowScriptAccess" value="always" />';
			musicStr+='<param name="wmode" value="window" />';
			musicStr+='<param name="movie" value="http://music.sina.com.cn/yueku/js/mwp/musicUtils.swf" />';
			musicStr+='<param name="quality" value="high" />';
			musicStr+='<param name="bgcolor" value="#FFFFFF" />';
			musicStr+='<param name="FlashVars" value="lcClient='+flashArgs+'" />';
			musicStr+='<embed src="http://music.sina.com.cn/yueku/js/mwp/musicUtils.swf"  FlashVars="lcClient='+flashArgs+'" quality="high" bgcolor="#FFFFFF"  height="100%" width="100%" wmode="window" name="musicUtils_blog" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
			musicStr+='</object>';
			musicStr+='</div>';
			Core.Dom.addHTML(document.body,musicStr);
		},
		getFlashObj:function(flash_id){
			if (navigator.appName.indexOf("Microsoft") != -1) {
				return window[flash_id];
			}else {
				return document[flash_id];
			}
		},
		setPlayMode:function(num){
			obj.setPlayMode(num);
		},
		insertSong:function(ary){
			obj.insertSong(ary);
		},
		playSong:function(){
			obj.playSong();
		},
		pauseSong:function(){
			obj.pauseSong();
		},
		stopSong:function(){
			obj.stopSong();
		},
		setVolume:function(num){
			obj.setVolume(num);
		},
		seekSong:function(num){
			obj.seekSong(num);
		},
		addListChangeListener:function(str){
			obj.addListChangeListener(str);
		},
		delListChangeListener:function(){
			obj.delListChangeListener();
		},
		addStartListener:function(str){
			obj.addStartListener(str);
		},
		delStartListener:function(){
			obj.delStartListener();
		},
		addProgressListener:function(str){
			obj.addProgressListener(str);
		},
		delProgressListener:function(){
			obj.delProgressListener();
		},
		addFinishListener:function(str){
			obj.addFinishListener(str);
		},
		delFinishListener:function(){
			obj.delFinishListener();
		},
		nextSong:function(){
			obj.nextSong();
		},
		preveSong:function(str){
			obj.preveSong();
		},
		getCurrentSong:function(){
			return obj.getCurrentSong();
		},
		getPlayList:function(){
			return obj.getPlayList();
		},
		setCookie:function(name,value,time){
			obj.setCookie(name,value,time);
		},
		getCookie:function(name){
			return obj.getCookie(name);
		},
		playSongsToMpw:function(ary,flag){
			if (this.checkIpad()){
				var str='';
				//var url ="http://music.sina.com.cn/yueku/ipad.php?songid=";
				var url ="http://music.sina.com.cn/yueku/ipad.php";
				var aryLength = ary.length;
				for (i=0;i<aryLength;i++){
					str += ary[i]+',';
				}
				str = str.substring(0,str.length-1);
				//url+=str;
				//window.open(url,"ipad");
				var tempHtml;
				 	tempHtml  ='<FORM id="tempform" method="get" target="ipad" action="http://music.sina.com.cn/yueku/ipad.php" style="display:none;">';
					tempHtml +='<input type="hidden" name="songid" value="'+str+'"/>';
					tempHtml +='<input type="submit" value="提交"/>';
					tempHtml +='</form>';
				var oDiv=document.createElement("DIV");
				document.body.appendChild(oDiv);
				oDiv.innerHTML = tempHtml;
				var frm = document.getElementById("tempform");
				frm.submit();
				oDiv.removeChild(frm);
			}
			else{
				obj.playSongsToMpw(ary,flag);
			}
			if(Editor.Plugins.flashUtils.mpwindw){
				Editor.Plugins.flashUtils.mpwindw.focus();
			}
		},
		playRecSongToMpw:function(songid,sinaId,recId,flag){
			obj.playRecSongToMpw(songid,sinaId,recId,flag);
			if(Editor.Plugins.flashUtils.mpwindw){
				Editor.Plugins.flashUtils.mpwindw.focus();
			}
		},
		playAlbumToMpw:function(str,flag){
			obj.playAlbumToMpw(str,flag);
			if(Editor.Plugins.flashUtils.mpwindw){
				Editor.Plugins.flashUtils.mpwindw.focus();
			}
		},
		//微博播放接口
		/**
		 *	url		mp3地址
		 *	sinaid
		 *	sinanick
		 *	content	微博内容  事例：刘德华-今天-<sina:link src="hibAP" name="hibAP" type="2"/>
		 */
		playWeiboSongsToMpw:function(url,sinaid,sinanick,content,flag){
			obj.playWeiboSongsToMpw(url,sinaid,sinanick,content,flag);
			if(Editor.Plugins.flashUtils.mpwindw){
				Editor.Plugins.flashUtils.mpwindw.focus();
			}
		},
		openMpw:function(str){
			var sw = screen.availWidth;
			var sh=screen.availHeight;
			var w=629,h=595;
			var wleft = (sw>w)?((sw-w)/2):0;
			var wtop = (sh>h)?((sh-h)/2):0;
			Editor.Plugins.flashUtils.mpwindw = window.open(str,"w_yuekuplayer",'width=629,height=595,top='+wtop+',left='+wleft+',toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
			if(Editor.Plugins.flashUtils.mpwindw){
				Editor.Plugins.flashUtils.mpwindw.focus();
			}
		},
		checkIpad:function(){
			var isiPad = navigator.userAgent.match(/iPad/i) != null;
			//return isiPad;
			return false;
		},
		init:function(){
			this.writeFlash();
			createObj();
			tobj = setInterval(createObj,10);
		}
	};
}();

