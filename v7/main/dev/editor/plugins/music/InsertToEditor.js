/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 博客乐库合作项目-插入音乐到编辑器
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import('sina/core/string/format.js');
$import('sina/core/function/bind3.js');
$import("sina/core/math/getUniqueId.js");

Editor.Plugins.InsertToEditor = Core.Class.create();
Editor.Plugins.InsertToEditor.prototype = {
	album_url:"http://music.sina.com.cn/shequ/port/sinablog/blog_ajax_getalbuminfo.php",
	players:[],
	initialize:function(){
		this.renderHtml();
		this.bindEvent();
		scope.musicOperate.select=this.select.bind2(this);
	},
	setPlayers:function(){
		this.players=[];
		var imgEles=editor.iframeDocument.getElementsByTagName("img");
		var len=imgEles.length;
		for(var i=0;i<len;i++){
			var songList=imgEles[i].getAttribute("songlist");
			if(songList){
				this.players.push(Core.Array.ArrayWithout(songList.split("|"),""));	
			}
		}
	},
	checkPlayers:function(){
		this.setPlayers();
		var len=this.players.length;
		if(len>2){
			showError("B89005");
			return false;
		}
		return true;
	},
	clearEmpty:function(){
		this.players=Core.Array.ArrayWithout(this.players,"");
	},
	/**
	 * 显示
	 */
	show:function(){
		$E(scope.musicHash.insert_container).style.display="";
	},
	/**
	 * 隐藏
	 */
	hidden:function(){
		$E(scope.musicHash.insert_container).style.display="none";
	},
	bindEvent:function(){
		Core.Events.addEvent(scope.musicHash.insertButton,function(){
			this.insert();
		}.bind2(this));
	},
	select:function(tabType,key,name,type,checkEle){
			var _type=type||"song";
			if(tabType=="store"){
				checkEle=$E(scope.musicHash.song_checkbox+key);
			}
			switch(tabType) {
				case "fav":
				case "store":
					if(_type=="song"){
						this.selectSong(key,name,checkEle);
					}else{
						this.selectAlbum(key,name);
					}
					break;
				case "web":
					this.addWebMusic(key);
					break;
			}
	},
	addWebMusic:function(key){
		scope.musicOperate.list.add(key,key,"web");
	},
	selectSong:function(key,name,checkEle){
		if(checkEle.checked){
			scope.musicOperate.list.add(key,name,"store");
		}else{
			scope.musicOperate.list.del(key);
		}
		scope.musicOperate.insertType="song";
	},
	selectAlbum:function(key,name){
		this.setAlbumInfo(key);
		scope.musicOperate.insertType="album";
	},
	setAlbumInfo:function(key){
		var param={
			albumid:key
		};
		if(!this.albumInterface){
			this.albumInterface=new Interface(this.album_url, "jsload");
		}
		scope.musicOperate.list.clearAlbum();
		this.albumInterface.request({
            GET: param,
            onSuccess: function(_data){
         	  	scope.musicOperate.albumData[key]=_data;
				var songList=_data.SONGLIST;
				var len=songList.length;
				for(var i=0;i<len;i++){
					songList[i].SINGERID=_data.SINGERID;
					songList[i].SINGERNAME=_data.SINGERNAME;
					scope.musicOperate.songData[songList[i].SONGID]=songList[i];
					scope.musicOperate.list.add(songList[i].SONGID,songList[i].SONGNAME,"store",true);
				}
				scope.musicOperate.selectAlbumKey=key;
            }.bind2(this),
            onError: function(_data){
            },
            onFail: function(){
            }
        });
	},
	insert:function(){
		//判断插入音乐是否可用
		var insertState = $E(scope.musicHash.insertButton).getAttribute('available');
		if(insertState && insertState == 0) {
			return;
		}
		
		scope.musicOperate.noHide = false;
		//matchMode
		scope.musicOperate.matchInsert(function(){

		});

		//insertType
		var isToLast=$E(scope.musicHash.appendToLast).checked;
		if (this.check(isToLast)) {
			if(isToLast && this.players.length>0){
				this.insertToLast();
			}else{
				this.insertMusic();
			}
			if (scope.musicOperate.insertType != "song") {
				this.insertAlbum();
			}
		}

		if(!scope.musicOperate.selectAlbumKey && scope.musicOperate.list.len<1 && scope.musicOperate.matchWrap.select.length < 1){
			winDialog.alert($SYSMSG["B89011"]);
		}else{
			if (!scope.musicOperate.noHide){
				window.inserMusic.hide();
			}

		}


		
	},
	check:function(isToLast){
		this.setPlayers();
		var allLen,len=this.players.length;
		if(isToLast){
			var songs;
			if(len>0){
				songs=this.players[len-1];	
			}else{
				winDialog.alert($SYSMSG["B89007"], {width:380,icon:"03"});
				return true;
			}
			if(!scope.musicOperate.selectAlbumKey && scope.musicOperate.list.len<1){
				return false;
			}
			if(scope.musicOperate.insertType=="song" || !scope.musicOperate.selectAlbumKey){
				allLen=songs.length+scope.musicOperate.list.len;
			}else{
				allLen=songs.length+scope.musicOperate.albumData[scope.musicOperate.selectAlbumKey].SONGLIST.length;
			}
		}else{
			if(scope.musicOperate.insertType=="song" || !scope.musicOperate.selectAlbumKey){
				allLen=scope.musicOperate.list.len;
			}else{
				allLen=scope.musicOperate.albumData[scope.musicOperate.selectAlbumKey].length;
			}
		}
		//一个播放器的歌曲列表是否超过限制
		if(allLen>20){
			winDialog.alert('抱歉！每个播放器最多可插入 20 首歌曲。<br/>请从已选歌曲中删除 '+(allLen-20)+' 首。', {width:350});
			//showError("B89006");
			scope.musicOperate.noHide = true;
			return false;
		}
		//一篇文章中的播放器个数是否超出个数限制
		if(len>2){
			showError("B89005");
			return false;
		}
		return true;
	},
	insertAlbum:function(){
		if(!this.album_temp){
			this.setAlbumHtml();
		}
		if(!scope.musicOperate.selectAlbumKey){
			return;
		}
		var albumData=scope.musicOperate.albumData[scope.musicOperate.selectAlbumKey];
		var html=this.album_temp.evaluate(albumData);
		var songData=albumData.SONGLIST;
		var len=songData.length;
		html+='<ul>';
		for(var i=0;i<len;i++){
			if(i>19){
				break;
			}
			var s_data={
				a:i+1,
				name:songData[i].SONGNAME
			};
			html+=this.albumSong_temp.evaluate(s_data);
		
		}
		html+='</ul>';
		editor.insertHTML(html);
	},
	insertToLast:function(){
		var imgEles=editor.iframeDocument.getElementsByTagName("img");
		var playerEle,songList;
		var len=imgEles.length;
		for(var i=0;i<len;i++){
			var lst=imgEles[i].getAttribute("songlist");
			if(lst){
				songList=lst;
				playerEle=imgEles[i];
			}
		}
		if($E(scope.musicHash.insertText).checked){
			winDialog.alert($SYSMSG["B89008"], {width:380,icon:"03"});
			window.inserMusic.hide();
		}else{
			winDialog.alert($SYSMSG["B89013"], {width:380,icon:"03"});
		}
		playerEle.setAttribute("songlist",(songList+"|"+scope.musicOperate.list.getAllKey().join("|")).toString());
		
	},
	insertMusic:function(){
		var html="";
		var count=scope.musicOperate.list.len;
		var mid=scope.musicOperate.list.getOneKey();
//		var count = _getFavCount();
		if (count <= 0) {
			return;
		}
		var cis = this.createImageString();
		html = cis.html;
		if ($E(scope.musicHash.insertText).checked){
			if (count > 1 ||$E(scope.musicHash.appendToLast).checked){
				winDialog.alert($SYSMSG["B89008"], {width:380,icon:"03"});
				window.inserMusic.hide(); 
				editor.insertHTML(html,cis.obj);
			}else{
				this.createLyricString(mid, function(slyric) {
					if (slyric || slyric==""){
						editor.insertHTML(html+slyric+'<br/>',cis.obj);
					}
				});
			}
			
		}else{
			editor.insertHTML(html,cis.obj);
		}
	},
	/**
	 * 得到播放器image代码
	 */
	createImageString:function(){
		var id = 'tmp_'+(+new Date());
		var sTpl = '<img id="'+id+'" src="http://simg.sinajs.cn/blog7style/images/common/editor/musicplayer.png" playerid="{0}" type="face" songlist="{1}" albums="{2}" autoplay="{3}"/><br/><br/>';
		var aData = [];
		var oSel = scope.musicOperate.list.list;
		var playerid = 'musicplayer_' + Core.Math.getUniqueId();
		var autoplay = $E(scope.musicHash.autoButton).checked ? 1 : 0;
		this.setAuto(autoplay);
		var i=0;
		for (key in oSel){
			if(i>19){
				break;
			}
			if(oSel[key]){
				aData.push(oSel[key].key);	
			}
			i++;
		}
		return { 
					'html' : sTpl.format(playerid, aData.join('|'), '', autoplay)
					,'obj' : {
						'id' : id
						,'properites' : {
							'playerid' : playerid
							,'songlist' : aData.join('|')
							,'albums' : ''
							,'autoplay' : autoplay
						}
					}
			   };
	},
	setAuto:function(auto){
		var imgEles=editor.iframeDocument.getElementsByTagName("img");
		var len=imgEles.length;
		for (var i = 0; i < len; i++) {
			var autoPlay=imgEles[i].getAttribute("autoplay");
			if(autoPlay){
				imgEles[i].setAttribute("autoplay",auto);
			}
		}
	},
	/**
	 * 得到歌词并执行回调 
	 * @param songid
	 * @param cbFunc
	 */
	createLyricString:function(songid, cbFunc){
		var Ilyric = new Interface('http://music.sina.com.cn/shequ/port/sinablog/blog_ajax_lyric.php?varname=lyric', 'jsload');
		Ilyric.request({
			GET: {
				songid: songid
			},
			onSuccess: function(oData){
				cbFunc(oData.replace(/(\[.*\]|)/g, '').replace(/(\r\n|\n|\r)+/g, '<br/>').replace(/^<br\/>/,''));
			},
			onError: function(){
				winDialog.alert('抱歉，获取歌词失败了！');
				cbFunc();
			}
		});
	},
	/**
	 * 渲染html
	 */
	renderHtml:function(){
		var html='<ul class="musicOptList" id="musicOptList">\
			  <li style="display:none;"><input type="checkbox" id="'+scope.musicHash.insertText+'" value="" name=""> <label for="'+scope.musicHash.insertText+'">同时插入歌词</label></li>\
			  <li><input type="checkbox" id="'+scope.musicHash.autoButton+'" value="" name="" checked="checked"> <label for="'+scope.musicHash.autoButton+'">本博文音乐自动播放</label></li>\
			  <li style="display:none;"><input type="checkbox" id="'+scope.musicHash.appendToLast+'" value="" name=""> <label for="'+scope.musicHash.appendToLast+'">添加至上一个播放器</label></li>\
			</ul>\
			<p class="CP_w_btns_Mid"><a class="SG_aBtn SG_aBtnB" href="#" id="'+scope.musicHash.insertButton+'" onclick="return false"><cite>插入音乐</cite></a> </p>';
		Core.Dom.addHTML($E(scope.musicHash.insert_container),html);
	},
	setAlbumHtml:function(){
		var album_html='<table cellspacing="0" cellpadding="0" border="0">\
		  <tbody><tr>\
		    <td width="100"><a href="#"><img height="80" width="80" src="#{PHOTO}" class="" title="专辑"></a></td>\
		    <td valign="top">\
			    <p style="padding: 3px 0pt; font-weight: bold; font-size: 14px;">#{ALBUMNAME}</p>\
		        <p style="padding: 3px 0pt;">歌手：#{SINGERNAME}</p>\
		        <p style="padding: 3px 0pt;">唱片：雷鬼</p>\
			</td>\
		  </tr>\
		  </tbody>\
		</table>';
		var albumSong_html='<li style="padding: 5px 0pt;"><em>#{at}</em>#{name}</li>';
		this.album_temp=new Ui.Template(album_html);
		this.albumSong_temp=new Ui.Template(albumSong_html);
	}
};