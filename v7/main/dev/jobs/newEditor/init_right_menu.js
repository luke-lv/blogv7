/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器上传图片
 */
$import("sina/ui/tab/tabs.js");
$import("editor/plugins/RightMenu.js");
$import("editor/plugins/EditorTabs.js");
$import("editor/plugins/Activity.js");
$import("editor/plugins/ArticleAssociate.js");
$import("editor/plugins/InsertStock.js");
$import("editor/plugins/InsertOther.js");
$import("editor/plugins/InsertTemplate.js");
// $import("editor/plugins/ReleaseWares.js");
$import("baby/editor/plugins/InsertYuerProgressbar.js");
$import("editor/plugins/insert_mb.js");
$import("sina/core/dom/insertHTML.js");
$import("editor/plugins/music/MusicMain.js");
$import("vote/vote.js");
$import("msg/voteMsg.js");

$registJob("init_right_menu", function() {
	//trace("job:init_right_menu");
	window.editorTabs = new Editor.Plugins.EditorTabs("addWrap");
	var shortMenu = new Editor.Plugins.RightMenu("shortcut", "shortcut_content");

	window.activity = new Editor.Plugins.Activity();
	activity.addToMenuFunc(shortMenu.addItem.bind2(shortMenu));
	activity.addTabFunc(initActivity);

	//    shortMenu.addItem("http://simg.sinajs.cn/blog7style/images/common/editor/typeset_left.gif", "图片居左混排", function(){
	//        inserArticleTemplate("left")
	//    });
	//    shortMenu.addItem("http://simg.sinajs.cn/blog7style/images/common/editor/typeset_right.gif", "图片居右混排", function(){
	//        inserArticleTemplate("right")
	//    });
	shortMenu.addItem("http://simg.sinajs.cn/blog7style/images/common/editor/element_music.gif", "插入音乐", initRM);
	shortMenu.addItem("http://simg.sinajs.cn/blog7style/images/common/editor/element_vote.gif", "插入投票", initVote);
	shortMenu.addItem("http://simg.sinajs.cn/blog7style/images/common/editor/element_finance.gif", "股票走势", initStock);
	shortMenu.addItem("http://simg.sinajs.cn/blog7style/images/common/editor/element_artical.gif", "相关博文", initArticle);
    
    //xiaoyue3 @modified  淘博会下线 20140115
    // if (1 == scope.$private.tbh_status) {
    //     shortMenu.addItem("http://simg.sinajs.cn/blog7style/images/common/editor/element_shop.gif", "发商品", initWares);
    // }
    

	shortMenu.addItem("http://simg.sinajs.cn/blog7style/images/common/editor/element_tblog.gif", "微博条目", initMb);
	shortMenu.addItem("http://simg.sinajs.cn/blog7style/images/common/editor/typeset_module.gif", "插入模板", initTemplate);
	
	
	if(scope.$user_channel && scope.$user_channel == 2) {
		if(!window.insertYuerProgressbar) {
			window.insertYuerProgressbar = new Editor.Plugins.InsertYuerProgressbar();
		}
		shortMenu.addItem("http://simg.sinajs.cn/blog7style/images/common/editor/element_baby.gif", "宝宝生日", initYuerProgressbar);
	}
	shortMenu.initSwap([
		{title:"insert_template",content:"insert_template_content"}
	]);

	//    templateMenu.initSwap([{title:"shortcut",content:"shortcut_content"}]);

	function initArticle() {
		initTabs();
		editorTabs.addTab({
			name: "article",
			title: "相关博文",
			contentId: "article_associate"
		});
		if (!window.articleAssociate) {
			window.articleAssociate = new Editor.Plugins.ArticleAssociate("article_associate", articleEditorCFG.articleStatus);
			//window.articleAssociate.initSelectbyCookie();
			window.articleAssociate.initList();
			editorTabs.addCloseCallbackFunc("article",
                articleAssociate.del.bind2(articleAssociate));
		}
	}
    
  //   // 发商品
  //   function initWares() {
  //       initTabs();
		// editorTabs.addTab({
		// 	name: "releaseWares",
		// 	title: "发商品",
		// 	contentId: "article_releaseWares"
		// });
		// if (!window.articleReleaseWares) {
		// 	window.articleReleaseWares = new Editor.Plugins.ReleaseWares("article_releaseWares", articleEditorCFG.articleStatus);
		// 	editorTabs.addCloseCallbackFunc("releaseWares", 
  //               articleReleaseWares.del.bind2(articleReleaseWares));
		// }

  //   }

	function initVote() {
		initTabs();
		editorTabs.addTab({
			name: "vote",
			title: "投票",
			contentId: "addVote",
			callVote: {
				"remove": removeVote,
				"show": showVote
			}
		});
		if (!window.insertVote) {
			window.insertVote = new Vote();
			window.vote_status = 'new';
		}
	}

	function initActivity() {
		if (!$E("tab_content_activity")) {
			Core.Dom.insertHTML($E("article_associate"), "<div class='myActive' id='tab_content_activity'></div>", "AfterEnd");
		}
		//var activity=new Activity();
		initTabs();
		editorTabs.addTab({
			name: "activity",
			title: "征文活动",
			contentId: "tab_content_activity"
		});
		if (activity.state != "finish") {
			editorTabs.addCloseCallbackFunc("activity", activity.del.bind2(activity));
		}

		activity.setConHtml("tab_content_activity");

	}

	function initStock() {
		window.editor.blur();
		if (!window.insertStock) {
			window.isertStockIsReady = function() {
				if (window.insertStock) {
					return true;
				}
				else {
					return false;
				}
			}
			window.insertStock = new Editor.Plugins.InsertStock();
		}
		else {

			window.insertStock.setTopView();
			window.insertStock.show();

		}
	}

	function initQuiz() {
		if (!window.insertQuiz) {
			var html = ' <embed width="450" height="258" align="middle" pluginspage="http://www.adobe.com/go/getflashplayer" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="samedomain" name="sharepad" bgcolor="#FFFFFF" quality="high" src="http://cache.mars.sina.com.cn/nd/allvic//200903widget/b5/63/20090526143908-1-68711.swf"/>';
			window.insertQuiz = new Editor.Plugins.InsertOther(html);
		}
		window.insertQuiz.insert();
	}

	function initMb() {
		if (!window.insertMb) {
			window.insertMb = new Editor.Plugins.InsertMB();
		}
		window.insertMb.show();
	}

	function initTemplate() {
		if (!window.insertTemplate) {
			window.insertTemplate = new Editor.Plugins.InsertTemplate();
		}
		window.insertTemplate.show();
	}
	
	/**
	 * 育儿博客话题插入
	 */
	function initYuerProgressbar() {
		window.insertYuerProgressbar.show();
	}

	function initRM() {
		if (!window.inserMusic) {
			window.inserMusic = new Editor.Plugins.MusicMain();
		}
		window.inserMusic.show();
	}


	
	function initTabs() {
		if (!editorTabs.isShow) {
			editorTabs.show();
		}
		if (window.location.href.indexOf("#addWra") == -1) {
			window.location.href += "#addWrap";
		}
		else {
			window.location.href = window.location.href;
		}

	}

	// 涵涵修改，2010-1-20，添加参数，过来就直接初始化投票
	var location = window.location.toString();
	if (location.indexOf('#voteadd') > 0) {
		initVote();
		window.location.href = window.location.href.replace("#voteadd", "");
		trace(window.location.href);
	}
});

