/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 博客乐库合作项目
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import("editor/plugins/music/Suggest.js");


Editor.Plugins.StoreMusic = Core.Class.create();

Editor.Plugins.StoreMusic.prototype = {
	//“最热歌手”读取数据接口
    hot_url: "http://music.sina.com.cn/shequ/port/sinablog/blog_ajax_recommendsingers.php",
	//搜素接口地址
	search_url:"http://music.sina.com.cn/shequ/port/sinablog/blog_ajax_search.php",
	//“最热歌手”列表的html结构
    hot_html: '<li><a href="#" onclick="scope.musicOperate.search(\'#{name}\',\'song\');return false">#{name}</a></li>',
	//搜索结果列表
	searchList:"sm_sh_list",
	//搜索结果列表分页
	listPageId:"sm_li_page",
	//搜素按钮id
	searchButton:"sm_sh_but",
	errorTipId:"sm_er_tip",
    initialize: function(){
        this.renderHtml();
        this.loadHot();
        this.initSuggest();
		Core.Events.addEvent($E(this.searchButton),this.search.bind2(this));
    },
	/**
	 * 读取搜素列表数据
	 * @param {String} txt 搜素关键字
	 */
	loadSearch:function(_page){
		var page = _page || 1;
		var param = {
            start: (page-1)*10,
            limit: 10,
			// type:$E(scope.musicHash.searchSelect).value,
			type : 'wpp_song',
			charset:"utf-8",
			query:this.searchTxt
        };
        if (!this.search_interface) {
            this.search_interface = new Interface(this.search_url, "jsload");
        }
        this.search_interface.request({
            GET: param,
            onSuccess: function(_data){
				if(_data.info.length>0){
					this.setErrorTip();
				}else{
					this.setErrorTip(true);
					return;
				}
				 
				scope.musicOperate.saveData(_data.info);
			    this.renderSList(_data.type,_data.info);
				this.selectByCache(_data.type);
         	    this.listPage(page,_data.total);
            }.bind2(this)            ,
            onError: function(_data){
				this.setErrorTip(true);
            }.bind2(this),
            onFail: function(){
            }
        });
	},
	setErrorTip:function(isError){
		var tipEle=$E(this.errorTipId);
		var listEle=$E(this.searchList); 
		var pageEle=$E(this.listPageId); 
		
		if(isError){
			tipEle.style.display="";
			listEle.style.display="none";
			pageEle.style.display="none";
			
		}else{
			tipEle.style.display="none";
			listEle.style.display="";	
			pageEle.style.display="";
		}
		
	},
	reset:function(){
		$E(this.searchList).innerHTML="";
		$E(this.listPageId).innerHTML="";
		$E(scope.musicHash.searchInput).value=scope.musicOperate.searchTip;
		
		// $E(scope.musicHash.searchSelect).value="song";
		$E(scope.musicHash.hotItem).style.display="";
		scope.musicOperate.selectAlbumKey=false;
		this.setErrorTip();
	},
	
	/**
	 * 根据输入内容或选择内容搜素结果
	 * @param {Event} e
	 * @param {String} type 搜素内容来源 输入框(input)|选择(select) 
	 */
	search:function(e,type){
		var ele=Core.Events.getEventTarget();
//		Core.Events.stopEvent();
		var _type=type||"input";
		var txt;
		if(_type=="select"){
			txt=ele.innerHTML;
			$E(scope.musicHash.searchInput).value=txt;
		}else{
			txt=$E(scope.musicHash.searchInput).value;
			if(txt==scope.musicOperate.searchTip || txt==""){
				showError("B89009");
				return false;
			}
		}
		this.searchTxt=txt;
		this.loadSearch();
	},
	
	serchByType:function(value,type){
		$E(scope.musicHash.searchInput).value=value;
		// $E(scope.musicHash.searchSelect).value=type;
		this.searchTxt=value;
		this.loadSearch();
	},
	selectByCache:function(type){
		if(type=="song"){
			var lst=scope.musicOperate.list.list;
			for(name in lst){
				if(lst[name]){
					var ele=$E(scope.musicHash.song_checkbox+name);
					if(ele){
						ele.checked=true;
					}
				}
			}
		}else{
			var ele=$E(scope.musicHash.album_checkbox+scope.musicOperate.selectAlbumKey);
			if(ele){
				ele.checked=true;
			}
			
		}
	},
	/**
	 * 渲染搜索结果列表
	 * @param {String} type 所搜类型
	 */
	renderSList:function(type,rData){
		//flashUtils.stopSong();
		//scope.musicOperate.stop();
		if(!this.song_temp){
			this.initListTemp();
		}
		var len=rData.length,html;
		if (type == "wpp_song") {
			html = '<li class="title"><div class="muOpt">&nbsp;</div><div class="muPlay">&nbsp;</div> <div class="muName">歌曲名</div><div class="muStarName">歌手名</div> </li>';
		}else{
			html='<li class="title"><div class="muOpt">&nbsp;</div><div class="muName">专辑名</div><div class="muStarName">歌手名</div></li>';
		}
		var pauseFlag = false;
		for (var i=0; i<len; i++) {
			var sName=this.replaceName(rData[i].SONGNAME);
			var aName=this.replaceName(rData[i].ALBUMNAME);
			if (scope.musicOperate.playNow == rData[i].SONGID){
				var playIcon = 'SG_icon SG_icon29';
				pauseFlag = rData[i].SONGID;
			}else{
				var playIcon = 'SG_icon SG_icon27';
			}
			var lDate={
				sId:rData[i].SONGID,
				at:i+1,
				sName:sName,
				rsName:this.replaceHotTxt(scope.musicOperate.shorten(sName)),
				aId:rData[i].ALBUMID,
				aName:aName,
				raName:this.replaceHotTxt(scope.musicOperate.shorten(aName)),
				sgId:rData[i].SINGERID,
				sgName:this.replaceName(rData[i].SINGERNAME),
				playIcon: playIcon
			};
			if(type=="wpp_song"){
				lDate.aId=rData[i].ALBUMID;
				lDate.aName=this.replaceName(rData[i].ALBUMNAME);
				html+=this.song_temp.evaluate(lDate);
			}else{
				html+=this.album_temp.evaluate(lDate);
			}
		}
		
		$E(this.searchList).innerHTML=html;
		if (pauseFlag){
			$E('sm_play_'+pauseFlag).playing = true;
		}

		//隐藏“最热歌手”
		$E(scope.musicHash.hotItem).style.display="none";
		//显示“插入音乐”按钮
		scope.musicOperate.im.show();
		
	},
	replaceHotTxt:function(name){
		if (name) {
			return name.replace(new RegExp(this.searchTxt,"i"),'<span class="spe">'+this.searchTxt+'</span>');
		}
	},
	replaceName:function(name){
		if(name){
			return name.replace(/['"]?/gi,"");
		}
	},
	/**
     * 分页
     */
    listPage: function(pageNum, count){
        var pageCount = 10;
        var maxPage = Math.ceil(count / pageCount, pageCount);
        if (maxPage > 1) {
            Ui.Pagination.init({
                "pageNode":this.listPageId,
                "nodeClassNamePrefix": "SG",
                "curPage": pageNum, // 当前所在页码
                "maxPage": maxPage,
                "pageTpl": this.loadSearch.bind2(this),
                "type": 1 // 指定类型为小区域翻页
            }).show();
        }
        else {
            $E(this.listPageId).innerHTML = '';
        }
    },
	/**
	 * “最热歌手”读取数据并渲染
	 */
    loadHot: function(){
        var param = {
            start: 0,
            limit: 16
        };
        if (!this.hot_interface) {
            this.hot_interface = new Interface(this.hot_url, "jsload");
        }
        this.hot_interface.request({
            GET: param,
            onSuccess: function(_data){
         	   this.renderHot(_data);
            }.bind2(this)            ,
            onError: function(_data){
            },
            onFail: function(){
            }
        });
    },
	/**
	 * //根据数据渲染“最热歌手”列表
	 * @param {Object} hData 数据
	 */
    renderHot: function(hData){
        if (!this.hot_template) {
            this.hot_template = new Ui.Template(this.hot_html);
        }
        var html = "";
        for (var i = 0; i < hData.length; i++) {
            var lData = {
                hId: hData[i].SINGERID,
                name: hData[i].SINGERNAME
            };
            html += this.hot_template.evaluate(lData);
        }
		var hotEle=$E(scope.musicHash.hotItem);
		var hotUl=hotEle.getElementsByTagName("ul")[0];
		hotUl.innerHTML=html;
    },
	/**
	 * 初始化搜素提示
	 */
    initSuggest: function(){
        new Editor.Plugins.Suggest();
    },
	/**
	 * 初始化html
	 */
    renderHtml: function(){
        var html = '<div class="searchCondi" id="' + scope.musicHash.searchItem + '">\
					<input id="' + scope.musicHash.searchInput +'" type="text" class="inputMusic" value="'+scope.musicOperate.searchTip+'" maxlength="50">\
					<div id="' +  scope.musicHash.searchSuggest + '" class="sclist" style="display:none"><ul></ul></div>\
					<select style="display:none;" class="select" id="' + scope.musicHash.searchSelect +'"><option selected="selected" value="song">歌曲</option><option value="album">专辑</option></select>\
					<a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="#" onclick="return false" id="'+this.searchButton+'"><cite>搜索</cite></a>\
				 </div>\
				 <ul class="musicList" id="' + this.searchList + '"></ul>\
				 <div class="searchNote" id="' + this.errorTipId + '" style="display:none">\
				    <ul>\
					  <li class="title">抱歉！没有搜索到相关结果</li>\
					  <li>您可以尝试以下方式重新搜索：</li>\
					  <li>1、检查输入的关键字是否有误</li>\
					  <li>2、简化关键字或用其他意思相近的关键字</li>\
					</ul>\
				</div>\
				 <div  id="' + this.listPageId + '" class="SG_page"></div>\
				 <div class="searchBottom"  id="' +scope.musicHash.hotItem + '">\
				    <p class="title">最热歌手：</p>\
					<ul></ul>\
				</div>';
        Core.Dom.addHTML($E(scope.musicHash.store_container), html);
    },
	initListTemp:function(){
		var song_html='<li>\
		  <div class="muOpt">\
		    <input onclick="scope.musicOperate.select(\'store\',\'#{sId}\',\'#{sName}\',\'song\');" type="checkbox" value="" class="checkbox" id="'+scope.musicHash.song_checkbox+'#{sId}">\
		    <em>#{at}.</em>\
		  </div>\
		  <div class="muPlay">\
		  	<img height="15" align="absmiddle" width="15" id="'+scope.musicHash.music_play+'#{sId}" onclick="scope.musicOperate.play(this)" title="音乐播放操作状态" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="#{playIcon}">\
		  </div>\
		  <div class="muName"><a target="_blank" href="http://music.sina.com.cn/yueku/m.php?id=#{sId}"></a><label for="'+scope.musicHash.song_checkbox+'#{sId}" title="#{sName}">#{rsName}</label></div>\
		  <div class="muStarName"><a  href="#" onclick="scope.musicOperate.search(\'#{sgName}\',\'song\');return false">#{sgName}</a></div>\
		  <div class="muSpe"><a href="#" onclick="scope.musicOperate.search(\'#{aName}\',\'album\');return false">#{aName}</a></div>\
		</li>';
		var album_html='\<li> <div class="muOpt">\
		    <input onclick="scope.musicOperate.select(\'store\',\'#{aId}\',\'#{aName}\',\'album\');" type="radio" value="#{aId}" name="album_radio" class="checkbox" id="'+scope.musicHash.album_checkbox+'#{aId}">\
		  </div><div class="muSpe"><label for="'+scope.musicHash.album_checkbox+'#{aId}" title="#{aName}"\>#{raName}</label></div><div class="muStarName"><a  href="#" onclick="scope.musicOperate.search(\'#{sgName}\',\'song\');return false">#{sgName}</a></div></li>';
		this.song_temp = new Ui.Template(song_html);
		this.album_temp = new Ui.Template(album_html);

	}
};
