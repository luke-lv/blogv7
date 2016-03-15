/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 博客乐库合作项目 - 我的音乐收藏
 * @author Luo Rui | luorui1@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");

Editor.Plugins.MatchMusic = Core.Class.create();
Editor.Plugins.MatchMusic.prototype = {
	initialize:function() {
		this.renderHtml();
		this.id = Core.Math.getUniqueId();
		this.initEvent();
		this.initInterface();
	},
	all_data:[],
	select:[],
	initInterface:function() {
		//this._interface = new Interface("http://tap.sina.com.cn/blogrelated/blog2music_v2.php", "jsload");
		this._interface = new Interface("http://control.blog.sina.com.cn/admin/article/musicmatchtag.php", "ajax");

	},
	initEvent:function() {
		scope.musicOperate.matchInsert = this.replace.bind2(this);
		scope.musicOperate.matchSelectAll = this.selectAll.bind2(this);
	},
	replace:function(func) {
		var select_data = [];
		var len = this.all_data.length;
		var content = editor.getContentHtml();
		var matchFlag = false;
		for (var i = 0; i < len; i++) {
			for(var n=0,m=this.all_data[i]['list'].length;n<m;n++){
				if (Core.Array.findit(this.select, this.all_data[i]['list'][n].id) != -1) {
					matchFlag = true;
					var reg = new RegExp('<a.*?>(.*?)</a>', "gi");
					var me = this;
					content = content.replace(reg, function(matched) {
						var reg2 = new RegExp('<img.*?>(.*)<\/a>', "gi");
						var result = reg2.exec(matched);
						if (result){
							if (result[1] == me.all_data[i].name) {
								return me.all_data[i].name;
							}
						}
						return matched;
					});
					replaceContent(this.all_data[i]['list'][n]);
				}
			}
		}
		//修复ie6下只能插入一个编辑器问题。
		editor.iframeDocument.body.innerHTML = '';
		editor.insertHTML(content);
		var content = "";
		if (typeof func == 'function' && select_data.length > 0) {

			func();
		}

		function replaceContent(r_data) {
			var u_str;

			if (r_data.type == "s") {
				u_str = '<a target="_blank" href="http://music.sina.com.cn/yueku/s/' + r_data.id + '.html">';

			} else {
				u_str = '<a target="w_yuekuplayer" href="http://music.sina.com.cn/yueku/m/' + r_data.id + '.html"><img align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/editor/play.gif" title="点击播放"/>';
			}

			var str;
			if (r_data.name == "*") {
				str = "(<[^>]+>)?(\\" + r_data.name + ")"
			} else {
				str = "(<[^>]+>)?(" + r_data.name + ")"
			}

			var reg = new RegExp(str, "gi");
			//content=content.replace(reg,'<a target="_blank" href="'+u_str+r_data.id+'.html">'+r_data.name+'</a>');
			var x = 1;
			try {
				var arrLen = content.match(reg).length;
			} catch(e) {
				return false;
			}
			content = content.replace(reg, function(a, b, c) {
				if (arrLen == 1 || arrLen == x) {
					x++;
					if (!b) {
						b = "";
					}
					return b + u_str + c + '</a>';
				} else {
					x++;
					return a
				}
				;
			});
		}
	},
	loadData:function() {
		var param = {
			c:"utf-8"
		};
		//		alert(editor.getContentText());
		//	    alert(encodeURI(editor.getContentText()).replace(/%c2%a0/gi,"%20"));
		var text = encodeURIComponent(editor.getContentText()).replace(/%c2%a0/gi,"%20");
		//var text = editor.getContentText().replace(/[\r\n]/gi, "1");
		//		alert(text)
		if (text != "") {
			param.b = text;
			param.num = 500;
		}
		this._interface.request({
			POST: param,
			onSuccess: function(_data) {
				this.all_data = [];
				this.initList(this.format(_data));
				if (this.format(_data).length == 0){
					$E("im_lists").innerHTML = '<li>'+$SYSMSG['B89012']+'</li>';
					$E('mol1').disabled = "disabled";
				}else{
					$E('mol1').disabled = "";
				}
			}.bind2(this),
			onError: function(_data) {
				if (_data.code == 'B89001' || _data.code == 'B89004'){
					_data.code = 'B89012';
				};
				$E("im_lists").innerHTML = '<li>'+$SYSMSG[_data.code]+'</li>';
				$E('mol1').disabled = "disabled";
			}.bind2(this),
			onFail: function(_data) {
				trace("onFail");
			}
		});
	},
	format: function (data){
		for (var n=0; n < data.length; n++){
			if (data[n].id == 's' || parseInt(data[n].name) < 100){
				data.splice(n,1);
				n--;
			}
		}
		var tmp = {};
		for (var n=0; n < data.length; n++){
			var name = data[n].name;
			if (!tmp[name]){
				tmp[name] = {'name':name, 'list':[{'singer': data[n].auth,'id': data[n].id, 'name': data[n].name}]};
			}else{
				tmp[name]['list'].push({'singer': data[n].auth,'id': data[n].id, 'name': data[n].name});
			}
		}
		var arr = [];
		for (var key in tmp){
			arr.push(tmp[key]);
		}
		return arr;

	},
	initList:function(_data, page) {
		var list_data = [];
		var allsel = true;
		var temp = '<li>\
					   <div class="muOpt"><input class="checkbox" #{checked} onclick="Editor.Plugins.MatchMusic.prototype.selectItem(\'#{id}\')" type="checkbox" id="mb_#{id}" /><em>#{index}.</em></div>\
					   <div class="muPlay"><img height="15" width="15" align="absmiddle" class="#{playIcon}" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" title="音乐播放操作状态" onclick="scope.musicOperate.play(this)" id="sm_play_#{id}"></div>\
					   <div class="muName"><a href="javascript:void 0"><label for="mb_#{id}">#{name}</label></a></div>\
					   <div class="muStarName" style="overflow:visible;"><span style="float:left;color:#666;padding-right:8px">#{auth}</span><a href="javascript:void 0" #{au} #{unique}>#{more}</a>\
						<div class="muStarLink">\
						   #{singerlist}\
						 </div>\
					   </div>\
					</li>';
		var len = list_data.length;
		var html = '<li class="title">\
						<div class="muOpt">&nbsp;</div>\
						<div class="muPlay"><img height="15" width="15" align="absmiddle" class="SG_icon SG_icon27" src="http://simg.sinajs.cn/blog7style/images/common/sg_icon.png" style="visibility:hidden"></div>\
						<div class="muName">歌曲名</div>\
						<div class="muStarName">歌手名</div>\
					</li>';
		var singerTpl ='<ul id="{0}" class="muStarNameL" style="display:none;">{1}</ul>';
		var singerLiTpl = '<li {2}><a musicid="{0}" href="javascript:void 0" onclick="scope.musicOperate.matchChangeSinger(this)">{1}</a></li>';
		var pagesize = 10;
		var page = page || 1;
		var start = (page - 1) * pagesize;
		var end = Math.min(start + pagesize, _data.length);
		var sel = scope.musicOperate.matchWrap.select || this.select;
		var bindArr = [];
		var pauseFlag = false;

		for (var i = start; i < end; i++) {
			var index = 0;
			for (var j = 0, k = _data[i]['list'].length; j < k; j++){
				var tmp = _data[i]['list'][j].id;
				if (Core.Array.findit(sel, tmp) > -1 || scope.musicOperate.playNow == tmp){
					index = j;
				}
			}

			var unique = parseInt(Math.random()*10000) + +new Date();
			bindArr.push(unique);
			list_data[i] = {
				id:_data[i]['list'][index].id,
				index:i+1
			}
			if (_data[i].type == "i") {
				list_data[i].name = '<img class="SG_icon SG_icon28" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="" align="absmiddle" />' + _data[i].name;
			} else {
				list_data[i].name = _data[i].name;
				list_data[i].auth = _data[i]['list'][index].singer;
			}
			if (Core.Array.findit(sel, _data[i]['list'][index].id) > -1){
				list_data[i].checked = 'checked="checked"';
			} else {
				list_data[i].checked = '';
				allsel = false;
			}
			if (Core.Array.findit(this.all_data, _data[i]) < 0){
				this.all_data.push(_data[i]);
			}
			if (_data[i]['list'].length > 1){
				var liTpl = '';
				for(var n=0,m=_data[i]['list'].length;n<m;n++){
					liTpl += singerLiTpl.format(_data[i]['list'][n].id, _data[i]['list'][n].singer, n==m-1?'style="border-bottom:none"':'');
				}
				list_data[i].singerlist = singerTpl.format('mu_' + unique, liTpl);
				list_data[i].unique = 'unique="'+unique+'"';
				list_data[i].au = 'id="au_'+unique+'"';
				list_data[i].more = ' »';
			}else{
				list_data[i].singerlist = '';
				list_data[i].unique = '';
				list_data[i].au = '';
				list_data[i].more = '';
			}
			if (scope.musicOperate.playNow == _data[i]['list'][index].id){
				list_data[i].playIcon = 'SG_icon SG_icon29';
				pauseFlag = list_data[i].id;
			}else{
				list_data[i].playIcon = 'SG_icon SG_icon27';
			}
			//this.select.push(_data[i].id);
			html += new Ui.Template(temp).evaluate(list_data[i]);
			$E('mol1').checked = allsel;
		}
		$E("im_lists").innerHTML = html;
		if (pauseFlag){
			$E('sm_play_'+pauseFlag).playing = true;
		}

		scope.musicOperate.matchUniqueArr = bindArr;
		for (var n = 0, m = bindArr.length; n < m; n++){
			try{
				//$E('mu_' + bindArr[n]).onmouseout = scope.musicOperate.matchListHide;
				$E('au_' + bindArr[n]).onclick = function(){
					var me = this;
					me.blur();
					setTimeout(function(){scope.musicOperate.matchListShow.call(me)}, 0);
				}
			}catch(e){}
		};
		$E("im_lists").parentNode.parentNode.onclick = function(){
			scope.musicOperate.matchListHideAll();
		}


		var func = arguments.callee;
		var me = this;
		Ui.Pagination.init({
			"pageNode" : "matchMusic_pagination",			// 用于写入分页的节点,class="XX_page"的div
			"nodeClassNamePrefix" :"SG",						// CSS 样式前缀
			"curPage" : page,								// 当前页码
			"maxPage" : Math.ceil(_data.length / pagesize),								// 最大页码数
			"showTotal": true,
			"pageTpl" : function(page) {
				func.call(me, _data, page)
			}	// 跳转的页面规则
		}).show();

		scope.musicOperate.matchWrap = this;
	},
	selectItem:function(m_id) {
		var ele = $E("mb_" + m_id);
		var sel = scope.musicOperate.matchWrap.select;
		if (ele.checked) {
			sel.push(m_id);
			if (checkAllSel()){
				$E('mol1').checked = true;
			}
		} else {
			sel = Core.Array.ArrayWithout(sel, m_id);
			$E('mol1').checked = false;
		}
		scope.musicOperate.matchWrap.select = sel;

		function checkAllSel() {
			var list = $T($E('im_lists'), 'input');
			for (var n = 0, m = list.length; n < m; n++) {
				if (!list[n].checked) {
					return false;
				}
			}
			return true;
		}
	},
	selectAll: function(){
		//im_lists
		var b = $E('mol1').checked;
		var list = $T($E('im_lists'), 'input');
		for (var n = 0, m = list.length; n < m; n++){
			if (list[n].checked != b){
				list[n].click();
			}
		}
	},

	show: function() {
		if (scope.musicOperate.matchCache) return;
		$E("im_lists").innerHTML = this.titleHtml + '<li><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"> 加载中…</li>';
		$E("matchMusic_pagination").innerHTML = '';
		this.all_data = [];
		this.select = [];
		this.loadData();
		scope.musicOperate.matchCache = true;
	},
	titleHtml: '<li class="title">\
					<div class="muOpt">&nbsp;</div>\
					<div class="muName">歌曲名</div>\
					<div class="muStarName">歌手名</div>\
				</li>',
	renderHtml:function() {

		var html = '<ul id="im_lists" class="musicList">\
				</ul>\
				<div id="matchMusic_pagination" class="SG_page">\
				</div>\
				<ul class="musicOptList">\
				  <li><input name="" onclick="scope.musicOperate.matchSelectAll();" type="checkbox" value="" id="mol1" /> <label for="mol1">全选/全不选</label></li>\
				</ul>';

		Core.Dom.addHTML($E(scope.musicHash.match_container), html);
	}
};