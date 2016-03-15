/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 博客乐库合作项目
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import('sina/core/function/bind3.js');
$import("sina/ui/renderer/simpleRenderer.js");
$import("editor/plugins/music/MusicHash.js");
$import("editor/plugins/music/StoreMusic.js");
$import("editor/plugins/music/InsertToEditor.js");
$import("editor/plugins/music/WebMusic.js");
$import("editor/plugins/music/FavoriteMusic.js");
$import("editor/plugins/music/MatchMusic.js");
$import("editor/plugins/music/ScopeOperate.js");
$import("editor/plugins/music/SelectList.js");
$import("editor/plugins/music/flashUtilsConfig.js");

Editor.Plugins.MusicMain = Core.Class.create();
Editor.Plugins.MusicMain.prototype = {
	initialize:function(){
		this.initDialog();
		this.initTab();
		scope.musicOperate.sm=new Editor.Plugins.StoreMusic();
		scope.musicOperate.im=new Editor.Plugins.InsertToEditor();
		scope.musicOperate.list=new Editor.Plugins.SelectList(scope.musicHash.list_container);
		var webMusic=new Editor.Plugins.WebMusic();

		var favoriteMusic=new Editor.Plugins.FavoriteMusic();
		scope.musicOperate.favGetList = function(){favoriteMusic.favGetList.apply(favoriteMusic, arguments);};
		scope.musicOperate.favShowList = function(){favoriteMusic.favShowList.apply(favoriteMusic, arguments);};
		scope.musicOperate.favReset = function(){favoriteMusic.resetFav.apply(favoriteMusic, arguments);};
		scope.musicOperate.favClearCache = function(){favoriteMusic.clearCache.apply(favoriteMusic, arguments);};
		scope.musicOperate.favMarkSong = favoriteMusic.favMarkSong;
		scope.musicOperate.favInsert= favoriteMusic.insert;

		var matchMusic=new Editor.Plugins.MatchMusic();
		scope.musicOperate.matchShow = function(){matchMusic.show.apply(matchMusic, arguments);};

		scope.musicOperate.showStore = function(){
			var me = window.inserMusic;
			me.tabManage.swapTags(me.storeTab);
		};
		Editor.Plugins.flashUtils.init();
	},
	/**
	 * 初始化弹出层
	 */
	initDialog:function(){
		var tpl = ['<table id="#{entity}" class="CP_w">',
			'<thead id="#{titleBar}">',
			'<tr>',
			'<th class="tLeft"><span></span></th>',
			'<th class="tMid">',
			'<div class="bLyTop">',
			'<strong id="#{titleName}"></strong>',
			'<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;" onclick="return false">关闭</a></cite>',
			'</div>',
			'</th>',
			'<th class="tRight"><span></span></th>',
			'</tr>',
			'</thead>',
			'<tfoot>',
			'<tr>',
			'<td class="tLeft"><span/></td>',
			'<td class="tMid"><span></span></td>',
			'<td class="tRight"><span></span></td>',
			'</tr>',
			'</tfoot>',
			'<tbody>',
			'<tr>',
			'<td class="tLeft"><span></span></td>',
			'<td class="tMid">',
			'<div id="#{content}">',
			'</div>', 
			'</td>',
			'<td class="tRight"><span></span></td>',
			'</tr>',
			'</tbody>',
			'</table>'].join("");
        this.dialog = winDialog.createCustomsDialog({
            tpl: tpl,
            title: "插入音乐",
            content: this.getContainerHtml(),
			renderer:Ui.SimpleRenderer,
            width: 600
        }, "music");
        this.dialog
			.setAreaLocked(true)
			.addEventListener("beforeShow",function(){
				 this.setMiddle();
			});
		Core.Events.addEvent(this.dialog.nodes.btnClose,function(){
			if (scope.musicOperate.playNow) {
				scope.musicOperate.stop();
			}
		},"click");
	},
	/**
	 * 显示
	 */
	show:function(){
		if(scope.musicOperate.im.checkPlayers()){
			this.resetAll();
			this.tabManage.swapTags(this.storeTab);
			this.dialog.show();
		}
	
	},
	resetAll:function(){
		scope.musicOperate.favReset();
		scope.musicOperate.sm.reset();
		scope.musicOperate.list.reset();
		scope.musicOperate.favClearCache();
		scope.musicOperate.matchClearCache();
	},
	/**
	 * 关闭
	 */
	hide:function(){
		this.dialog.hidden();
		if(scope.musicOperate.playNow){
			scope.musicOperate.stop();	
		}
		
	},
	/**
	 * 初始化标签
	 */
	initTab: function(){
		//创建tab
        this.tabManage = new Tabs($E(scope.musicHash.tab_container), {});
        this.storeTab = new Tab('<div><em>微音乐</em></div>', {
            isFocus: true,
            className: "cur"
        });
       this.favoriteTab = new Tab('<div><em>我的音乐收藏</em></div>', {
            isFocus: false,
            className: "cur"
        });
        this.webTab = new Tab('<div><em>网络链接</em></div>', {
            isFocus: false,
            className: "cur"
        });
		// this.matchTab = new Tab('<div><em>按博文内容匹配试听</em></div>', {
  //           isFocus: false,
  //           className: "cur"
  //       });
		
		//添加tab失去焦点是的回调函数隐藏相应的内容
		this.storeTab.addOnAbort(Core.Function.bind3(this.swapTab, this, [scope.musicHash.store_container, "hidden"]));
		this.favoriteTab.addOnAbort(Core.Function.bind3(this.swapTab, this, [scope.musicHash.favorite_container, "hidden"]));
		this.webTab.addOnAbort(Core.Function.bind3(this.swapTab, this, [scope.musicHash.web_container, "hidden"]));
		// this.matchTab.addOnAbort(Core.Function.bind3(this.swapTab, this, [scope.musicHash.match_container, "hidden"]));
		//添加tab获得焦点是的回调函数显示相应的内容
		this.storeTab.addOnFocus(Core.Function.bind3(this.swapTab, this, [scope.musicHash.store_container]));
		this.favoriteTab.addOnFocus(Core.Function.bind3(this.swapTab, this, [scope.musicHash.favorite_container]));
		this.webTab.addOnFocus(Core.Function.bind3(this.swapTab, this, [scope.musicHash.web_container]));
		// this.matchTab.addOnFocus(Core.Function.bind3(this.swapTab, this, [scope.musicHash.match_container]));
		//向tabManage中添加tab
        this.tabManage.add(this.storeTab);
        this.tabManage.add(this.favoriteTab);
		this.tabManage.add(this.webTab);
        // this.tabManage.add(this.matchTab);

    },
	/**
	 * 切换tab时显示|隐藏想要
	 * @param {String} tabContentId 每个tab对应的内容id
	 * @param {String} type 显示或隐藏 默认为显示  x
	 */
	swapTab:function(tabContentId,type){
		scope.musicOperate.matchMode = false;
		if (type && type == "hidden") {
			$E(tabContentId).style.display = "none";
		} else {
			$E(tabContentId).style.display = "";
			if (tabContentId != scope.musicHash.store_container) {
				scope.musicOperate.im.show();
			}
			if (tabContentId == scope.musicHash.favorite_container) {
				scope.musicOperate.favGetList();
			}
			if (tabContentId == scope.musicHash.web_container) {
				scope.musicOperate.resetTip();
			}
			if (tabContentId == scope.musicHash.match_container) {
				scope.musicOperate.matchMode = true;
				$E('musicOptList').style.display = 'none';
				$E('mm_list_con').style.display = 'none';
				scope.musicOperate.matchShow();
			}else{
				$E('musicOptList').style.display = '';
				$E('mm_list_con').style.display = '';
			}
			this.swapInsertType(tabContentId);

		}
	},
	swapInsertType:function(tabContentId){
		var btn = '<cite>插入音乐</cite>';
		var linkhtml = '<p id="updateLink" class="CP_w_btns_Mid" style="margin: 5px;"><a target="_blank" href="http://blog.sina.com.cn/s/blog_4b0f52990102dzu6.html">产品服务更新升级中，暂停使用</a></p>';
		var disabledBtn = '<cite>插入音乐</cite><a style="margin-left:15px;" onclick="window.open(\'http://blog.sina.com.cn/s/blog_4b0f52990102dzu6.html\')" target="_blank" href="javascript:void(0);">产品服务更新升级中，暂停使用</a>';
		
		switch(tabContentId) {
			case scope.musicHash.store_container:
				scope.musicOperate.tabType="store";
				//插入音乐可用
				$E(scope.musicHash.insertButton).className = 'SG_aBtn SG_aBtnB';
				$E(scope.musicHash.insertButton).setAttribute('available', '1');
				if($E('updateLink')) {
					Core.Dom.removeNode($E('updateLink'));
				}
				break;
			case scope.musicHash.favorite_container:
				scope.musicOperate.tabType="favorite";
				//收藏插入音乐不可用
				$E(scope.musicHash.insertButton).className = 'SG_aBtn SG_aBtnH';
				$E(scope.musicHash.insertButton).setAttribute('available', '0');
				Core.Dom.insertHTML($E(scope.musicHash.insert_container), linkhtml, 'BeforeEnd');
				break;
			case scope.musicHash.web_container:
				scope.musicOperate.tabType="web";
				//插入音乐可用
				$E(scope.musicHash.insertButton).className = 'SG_aBtn SG_aBtnB';
				$E(scope.musicHash.insertButton).setAttribute('available', '1');
				if($E('updateLink')) {
					Core.Dom.removeNode($E('updateLink'));
				}
				break;
			case scope.musicHash.match_container:
				scope.musicOperate.tabType="match";
				break;
		}
	},
	/**
	 * 初始化最外层的html
	 */
	getContainerHtml:function(){
		var html='<div class="CP_layercon7 editMusic">\
			  <div class="CP_w_tag">\
			    <div class="title">音乐来源：</div>\
			    <div id="'+scope.musicHash.tab_container+'">\
			    </div>\
			  </div>\
			  <div id="'+scope.musicHash.store_container+'"></div>\
			  <div id="'+scope.musicHash.favorite_container+'" style="display:none"></div>\
			  <div id="'+scope.musicHash.web_container+'" style="display:none"></div>\
			  <div id="'+scope.musicHash.match_container+'" style="display:none"></div>\
			   <div id="'+scope.musicHash.list_container+'" class="alreadyMus"><h3>已选歌曲</h3><ul></ul></div>\
			  <div id="'+scope.musicHash.insert_container+'"></div>\
			</div>';
		return html;
	}
};
