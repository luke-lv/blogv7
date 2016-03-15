/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 博客乐库合作项目 - 我的音乐收藏
 * @author Luo Rui | luorui1@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import('sina/core/string/shorten.js');

Editor.Plugins.FavoriteMusic = Core.Class.create();
Editor.Plugins.FavoriteMusic.prototype = {
	initialize:function(){
		this.renderHtml();
	},
	//音乐分类接口
	IfavMusic: new Interface('http://music.sina.com.cn/shequ/port/sinablog/blog_ajax_useralbums.php?varname=albumlist', 'jsload'),
	//音乐分类缓存
	IfavMusicCache: null,
	//音乐列表接口(有分类)
	IfavList : new Interface('http://music.sina.com.cn/shequ/port/sinablog/blog_ajax_useralbumsongs.php?varname=songlist', 'jsload'),
	//音乐列表接口(无分类，全部音乐）
	IfavListAll : new Interface('http://music.sina.com.cn/shequ/port/sinablog/blog_ajax_userallsongs.php?varname=songlist', 'jsload'),
	//音乐列表缓存
	IfavListCache: {
		allSong: {}
	},
	clearCache: function(){
		this.IfavMusicCache = null;
		this.IfavListCache = {allSong: {}};
	},
	/*
	复位音乐收藏列表
	*/
	resetFav:function(){
		if($E(scope.musicHash.insertText)){
			scope.musicOperate.favSelected = {}; //清空收藏列表的已选择歌曲
			$E(scope.musicHash.insertText).checked = ''; //复位复选框
			$E(scope.musicHash.appendToLast).checked = '';
			$E('favMusic_songList').innerHTML = '<li><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"> 加载中…</li>';
		}
	},
	/**
	 * 读取收藏分类
	 */
	favGetList:function(pierceCache){
		var _this = this;
		if (this.IfavMusicCache && !pierceCache){
			//trace('cache');
			_successFunc(this.IfavMusicCache);
		}else{
			this.IfavMusic.request({
				 GET: {
					 uid: (scope.$uid)
				 },
				 onSuccess: function(oData){
					_this.IfavMusicCache = oData;
					 _successFunc(oData);
				 },
				 onError: function(){
					 winDialog.alert('抱歉，数据加载异常，请刷新再试。');
				 }
			});
		}
		/**
		 * private 得到收藏分类成功回调函数
		 * @param oData
		 */
		function _successFunc(oData){
			if (oData.total == 0){
				$E('favMusic_favList').innerHTML = '<li>暂无收藏分类</li>';
				$E('favMusic_songList').innerHTML = '<li>暂无歌曲</li>';
				return;
			}
			var str = '<li class="current" id="favMusic_list_all"><a href="#" onclick="scope.musicOperate.favShowList();return false">全部音乐</a></li>';
			for (var n = 0, m = oData.albumlist.length; n < m; n++){
				str += '<li id="favMusic_list_' + oData.albumlist[n].USERALBUMID + '">' +
					   '<a href="#" onclick="scope.musicOperate.favShowList(' + oData.albumlist[n].USERALBUMID + ');return false" title="' + oData.albumlist[n].NAME + '">' +
					   _fmt(oData.albumlist[n].NAME, 10) + '</a></li>';
			}
			$E('favMusic_favList').innerHTML = str;
			scope.musicOperate.favShowList();
		}
		/**
		 * 渲染分类
		 * @param str
		 */
		function _fmt(str, length){
			return Core.String.shorten(str, length || 20);
		}
	},
	/**
	 * 显示音乐列表
	 * @param uaid
	 * @param page
	 */
	favShowList: function(uaid, page, pierceCache){
		$E('favMusic_songList').innerHTML = '<li class="title">\
					<div class="muOpt">&nbsp;</div>\
					<div class="muName">歌曲名</div>\
					<div class="muStarName">歌手名</div>\
				</li>\
			    <li>\
        			<img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"> 加载中…\
       			</li>';
		var _this = this;
		if (uaid){ //如果是某个分类
			if (this.IfavListCache['c_' + uaid] && !pierceCache){ //如果有缓存
				_interfaceSuccess(_this.IfavListCache['c_' + uaid]);
			} else {
				this.IfavList.request({
					GET: {
						uid: (scope.$uid),
						uaid: uaid
					},
					onSuccess: function(oData){
						_this.IfavListCache['c_' + uaid] = oData;
						_interfaceSuccess(oData);
					},
					onError: function(){
						winDialog.alert('抱歉，数据加载异常，请刷新再试。');
					}
				});
			}
		}else{ //如果是全部音乐
			page = page || 1;
			if (this.IfavListCache['allSong_' + page] && !pierceCache) { //如果有缓存
				_interfaceSuccess(_this.IfavListCache['allSong_' + page]);
			} else {
				this.IfavListAll.request({
					GET: {
						uid: (scope.$uid),
						start: page ? (page - 1) * scope.musicOperate.favPagesize : 0
					},
					onSuccess: function(oData) {
						_this.IfavListCache['allSong_' + page] = oData;
						_interfaceSuccess(oData);
					},
					onError: function() {
						winDialog.alert('抱歉，数据加载异常，请刷新再试。');
					}
				});
			}
		}
		function _interfaceSuccess(oData){
			_updateHash(oData.songlist);
			scope.musicOperate.favCount = oData.total;
			_renderList(oData, page);
			scope.musicOperate.saveData(oData.songlist);
		}
		/**
		 * private 渲染音乐列表
		 * @param oData
		 * @param page
		 */
		function _renderList(oData, page){
			if (!oData.songlist || !oData.songlist.length){
				$E('favMusic_songList').innerHTML = '<li>该分类暂无歌曲</li>';
				$E('favMusic_pagination').innerHTML = "";
				_refreshFavList(uaid, page);
				return;
			}
			var page = scope.musicOperate.favPage = (page || 1);
			var pagesize = scope.musicOperate.favPagesize || 10;
			var str = '<li class="title">\
			   <div class="muOpt">&nbsp;</div>\
			   <div class="muName">歌曲名</div>\
			   <div class="muStarName">歌手名</div>\
			</li>';
			var count = 0;
			var mark = '';
			var nstart = (page - 1) * pagesize;
			var nend = oData.songlist.length;
			var bias = 0;
			if (!uaid){
				nstart = 0;
				bias = (page - 1) * scope.musicOperate.favPagesize;
			}
			for (var n = nstart, m = nend; n < m && count < pagesize; n++){
				count++;
//				if (scope.musicOperate.favSelected['s_' + oData.songlist[n].SONGID]){
				if (scope.musicOperate.list.list[oData.songlist[n].SONGID]){
					mark = 'checked = "checked"';
				}else{
					mark = '';
				}
				str += '<li>\
					<div class="muOpt">\
					<input id="cb_fav_' + oData.songlist[n].SONGID + '" ' + mark + ' onclick="scope.musicOperate.select(\'fav\',\'' + oData.songlist[n].SONGID + '\',\'' + _replace(oData.songlist[n].SONGNAME) + '\',\'song\',this)" name="" type="checkbox" class="checkbox" value="" /><em>' + (n+1+bias) + '.</em></div>\
					<div class="muName" title="' + (oData.songlist[n].SONGNAME || '未知') + '"><label for="cb_fav_' + oData.songlist[n].SONGID + '">' + _fmt(oData.songlist[n].SONGNAME || '未知') + '</label></div>\
					<div class="muStarName"><label for="cb_fav_' + oData.songlist[n].SONGID + '" title="' + oData.songlist[n].SINGERNAME + '">' + _fmt(oData.songlist[n].SINGERNAME || '未知', 20) + '</label></div>\
				</li>';
			}
			$E('favMusic_songList').innerHTML = str;
			_refreshFavList(uaid, page);
			_renderPagination();
		}

		function _replace(str){
			str = str.replace(/\'/g,'\\\'').replace(/\"/g,'\\\"');
			return str;
		}

		/**
		 * private 刷新分类
		 * @param uaid
		 * @param page
		 */
		function _refreshFavList(uaid, page){
			var pNode = $E('favMusic_favList');
			var list = $T(pNode, 'li');
			for (var n = 0, m = list.length; n < m; n++){
				list[n].className = '';
			}
			if (uaid){
				$E('favMusic_list_' + uaid).className = 'current';
			}else{
				$E('favMusic_list_all').className = 'current';
			}
		}

		/**
		 * private 渲染分页
		 */
		function _renderPagination() {//
			var maxPage = Math.ceil(scope.musicOperate.favCount / scope.musicOperate.favPagesize);
			var curPage = scope.musicOperate.favPage = (scope.musicOperate.favPage || 1);
			if (maxPage <= 1) {
				$E('favMusic_pagination').innerHTML = "";
			} else {
				Ui.Pagination.init({
					"pageNode" : "favMusic_pagination",			// 用于写入分页的节点,class="XX_page"的div
					"nodeClassNamePrefix" :"SG",						// CSS 样式前缀
					"curPage" : curPage,								// 当前页码
					"maxPage" : maxPage,								// 最大页码数
					"showTotal": true,
					"pageTpl" : function(page) {
						scope.musicOperate.favShowList(uaid, page);
					}	// 跳转的页面规则
				}).show();
			}
		}

		/**
		 * 渲染分类
		 * @param str
		 */
		function _fmt(str, length){
			return Core.String.shorten(str, length || 20);
		}

		/**
		 * 歌曲id对应数据的哈希表
		 * @param arrData
		 */
		function _updateHash(arrData){
			var hash = scope.musicOperate.favHash;
			for (var n = 0, m = arrData.length; n < m; n++){
				hash[arrData[n].SONGID] = {
					id: arrData[n].SONGID,
					name: arrData[n].SONGNAME
				};
			}
		}
	},
	/**
	 * 选择、取消音乐条目
	 * @param songid
	 * @param node
	 */
	favMarkSong: function(songid, node){
		if (node.checked){
			if (_getCount() >= scope.musicOperate.favMaxCount){
				winDialog.alert('抱歉！每个播放器最多可插入' + scope.musicOperate.favMaxCount + '首歌曲。', {width:350});
				node.checked = '';
				return;
			}
		 	scope.musicOperate.favSelected['s_' + songid] = {
				id:scope.musicOperate.favHash[songid].id,
				name:scope.musicOperate.favHash[songid].name
			};
			scope.musicOperate.insertType="song";
		}else{
			delete scope.musicOperate.favSelected['s_' + songid]; 
		}
		function _getCount(){
			var oSel = scope.musicOperate.favSelected;
			var count = 0;
			for(key in oSel){
				count++;
			}
			return count;
		}
	},
	/**
	 * 渲染页签
	 */
	renderHtml:function(){
		var html='<div class="MusMenuList">\
			  <ul id="favMusic_favList">\
				<li>\
        			<img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"> 加载中…\
       			</li>\
			  </ul>\
			</div>\
			<ul id="favMusic_songList" class="musicList musicList390">\
			    <li class="title">\
				   <div class="muOpt">&nbsp;</div>\
				   <div class="muName">歌曲名</div>\
				   <div class="muStarName">歌手名</div>\
				</li>\
			    <li>\
        			<img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"> 加载中…\
       			</li>\
			</ul>\
		    <div id="favMusic_pagination" class="SG_page">\
		    </div>';
		Core.Dom.addHTML($E(scope.musicHash.favorite_container),html);
	}
};