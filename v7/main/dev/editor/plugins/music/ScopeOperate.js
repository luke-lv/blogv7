/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 对象集合 用于存放某些公用对象或属性
 * @author dg.liu | dongguang@staff.sina.com.cn
 */

$import("sina/core/string/shorten.js");

scope.musicOperate={
	//插入音乐到编辑器对象
	im:null,
	//插入乐库音乐
	sm:null,
	//搜索输入框默认提示
	searchTip:"输入歌曲关键字",
	tabType:"store",
	storeList:{},
	insertType:"song",
	select:function(){}
	/**
	 * 收藏页相关
	 */
	//获取收藏列表
	,favGetList: null
	//显示收藏列表
	,favShowList: null
	//收藏列表当前页
	,favPage: 1
	//收藏列表当列表音乐总数
	,favCount: 1
	//收藏列表pagesize
	,favPagesize: 10
	//已选择的收藏hash表
	,favSelected: {}
	,favMaxCount: 20
	,favHash: {}

	/**
	 * 网络链接
	 */
	,resetTip:function(){}

	/**
	 * 按博文匹配页相关
	 */
	//show
	,matchCache: null
	,matchShow: null
	,matchInsert: function(){}
	,matchWrap: {select:[]}
	,matchUniqueArr: []
	,matchListHide: function(e){
		var e = window.event || e;
		var s = e.toElement || e.relatedTarget;
		if (!s) return;
		if (window.$IE) {
			if (!this.contains(s)) {
				this.style.display = 'none';
			}
		} else {
			var res = this.compareDocumentPosition(s);
			if (! ( res == 20 || res == 0)) {
				this.style.display = 'none';
			}
		}
	}
	,matchListShow: function(){
		var uni = this.getAttribute('unique');
		scope.musicOperate.matchListHideAll();
		$E('mu_' + uni).style.display = 'block';
	}
	,matchListHideAll: function(){
		var arr = scope.musicOperate.matchUniqueArr;
		for (var n = 0,m = arr.length; n < m; n++) {
			try {
				$E('mu_' + arr[n]).style.display = 'none';
			} catch(e) {
			}
		}
	}
	,matchChangeSinger: function(me){
		var musicid = me.getAttribute('musicid');
		var singerNode = $T(me.parentNode.parentNode.parentNode.parentNode, 'span')[0];
		var labelNode = $T(singerNode.parentNode.parentNode, 'label')[0];
		var playNode = $T(singerNode.parentNode.parentNode, 'img')[0];
		var inputNode = $T(singerNode.parentNode.parentNode, 'input')[0];
		var oldid = inputNode.id.replace('mb_', '');
		singerNode.innerHTML = me.innerHTML;
		labelNode.setAttribute('for', 'mb_'+musicid);
		playNode.setAttribute('id', 'sm_play_'+musicid);
		//scope.musicOperate.stop();
		playNode.playing=false;
		inputNode.setAttribute('id', 'mb_'+musicid);
		inputNode.onclick = function() {
			var id = musicid;
			return function() {
				Editor.Plugins.MatchMusic.prototype.selectItem(musicid);
			};
		}();
		//如果以前选择了其他歌手唱的这首歌，更新为当前歌手演唱的
		var loc = Core.Array.findit(scope.musicOperate.matchWrap.select, oldid);
		if (loc > -1){
			scope.musicOperate.matchWrap.select.splice(loc, 1, musicid);
		};
	}
	,matchClearCache: function(){
		scope.musicOperate.matchCache = null;
	}

	,songData:{}
	,saveData:function(data){
		var _data=data;
		var len=_data.length;
		for(var i=0;i<len;i++){
			if(_data[i].SONGID){
				 if(this.songData[_data[i].SONGID]){
				 	continue;
				 }
			}
			this.songData[_data[i].SONGID]=_data[i];
		}
	},
	playList:{},
	playNow: null,
	play:function(ele){
		var _array=ele.id.split("_");
		var key=_array[_array.length-1];
		if(ele.playing){
			scope.musicOperate.stop();
			return;
		}
		if(scope.musicOperate.playNow){
			scope.musicOperate.stop();
		}
		Editor.Plugins.flashUtils.insertSong([key]);
//		Editor.Plugins.flashUtils.playSong();
		ele.className = 'SG_icon SG_icon29';
		ele.playing="yes";
		scope.musicOperate.playNow = key;
	},
	stop:function(ele){
		Editor.Plugins.flashUtils.stopSong();
		var wrap = $E('mm_st_con').parentNode;
		var playIcons = [];
		var tmp = $T(wrap, 'img');
		for (var n = 0, m = tmp.length; n < m; n++){
			if (tmp[n].id.indexOf('sm_play_') > -1){
				playIcons.push(tmp[n]);
			}
		}
		for (var n = 0, m = playIcons.length; n < m; n++){
			playIcons[n].playing = false;
			playIcons[n].className = 'SG_icon SG_icon27';
		}
		scope.musicOperate.playNow = null;
	},
	search:function(value,type){
		var _type=type||"song";
		scope.musicOperate.sm.serchByType(value,_type);
	},
	albumData:{}
	,shorten:function(name,_len){
		var len=_len||20;
		return Core.String.shorten(name,len);
	}

};