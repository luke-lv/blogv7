/**
 * @fileoverview
 *	个人中心首页的博文类型 FEED 的评论、转载、分享功能
 
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");

$import("lib/app.js");

$import("product/center/CommentInFeed.js");
$import("product/center/quote.js");
$import("product/center/article_addFavorite.js");
$import("lib/sendLog.js");

App.articleFeedFunction = function () {
	var feed_node = $E("feed_center_span");
	var articleFeed = Core.Dom.getElementsByClass(feed_node, "div", "feed_bottom");

	//var aids = [];
	//var uids = [];
	
	// 遍历所有带评论、转载、分享的节点，分别绑上单击事件
	for(var i = 0, len = articleFeed.length; i < len; i ++){
		var child = articleFeed[i].childNodes;
		var lens = child.length;
		var articleid;

		for(var j = 0; j < lens; j ++){
			if(child[j].id == null){continue;}
			articleid = child[j].id.split("_")[1];			
			if(child[j].tagName.toUpperCase() == "A"){
				var mark = child[j].innerHTML.substr(0, 2);
				switch (mark){
					case "评论":
						articleFeed[i].id = "ctrl_" + articleid;
						var cms_count = child[j].innerHTML.replace(/\D/gi, "");
						Core.Events.addEvent(child[j], Core.Function.bind3(function (articleid, cms_count) {
							Core.Events.stopEvent();
							new App.CommentInFeed(articleid, cms_count);
						}, null, [articleid, cms_count]));
						break;
					case "转载":
					case "原文":
						Core.Events.addEvent(child[j], Core.Function.bind3(function (articleid) {
							Core.Events.stopEvent();
							var quote = new Quote();
							quote.check(articleid);
						}, null, [articleid]));
						break;
					case "喜欢":
						
						/*
						Core.Events.addEvent(child[j], Core.Function.bind3(function (articleid) {
							Core.Events.stopEvent();
							new App.addFavoriteArticle(articleid, {
								callback: function(){
									winDialog.alert($SYSMSG.B03020, {icon : "03"});
								}
							});
						}, null, [articleid]));
						break;
						*/
						if (child[j]) {
							var obj = {};
							obj['ele'] = child[j];
							obj['dx'] = -59;
							obj['dy'] = 14;
							
							var numObj = {};
							numObj['ele'] = child[j];
							numObj['res_id'] = articleid;
							//aids.push(articleid);
							numObj['res_uid'] = child[j].getAttribute('ruid');
							//uids.push(child[j].getAttribute('ruid'));
							
							child[j].onmouseover = (function(opt){
								return function() {
									var num = opt.ele.getAttribute('num') || 0;
									opt.callBack = function(ele) {
										ele.onmouseout = function(e) {
											e = e || window.event;
											var src = e.relatedTarget || e.toElement;
											if($FF) {
												if(!isChildNodes(ele,src)) {
													scope.digger.hiddenLast10();
												}
											} else {
												if(!ele.contains(src)) {
													scope.digger.hiddenLast10();
												}
											}
										}
										var as = ele.getElementsByTagName('a');
										for(var i=0; as[i]; i++) {
											as[i].onclick = (function(tar){
												return function() {
													scope.digger.hiddenLast10();
													v7sendLog('96_01_02_'+scope.$uid,scope.$pageid,'');
												}
											})(as[i]);
										}
									}
									num = parseInt(num);
									if(num !== 0) {
										scope.digger.showLast10(opt);
									}
									/*
									if(!opt.ele.getAttribute('isdigged')) {
										num += 1;
										opt.ele.innerHTML = '顶('+ num +')';
									}
									*/
								}
							})(obj);
							
							/*
							child[j].onmouseout = (function(opt){
								return function() {
									scope.digger.hiddenLast10();
									if(opt.ele.getAttribute('isdigged')) {
										return;
									}
									var val = opt.ele.getAttribute('num') || 0;
									opt.ele.innerHTML = '顶('+val+')';
								}
							})(obj);
							*/
							
							obj.params = {};
							
							obj.params['res_id'] = articleid;
							obj.params['res_uid'] = child[j].getAttribute('ruid');
							obj.params['res_type'] = child[j].getAttribute('type');
							obj.params['ti_title'] = encodeURIComponent(child[j].getAttribute('ti_title'));
							child[j].onclick = (function(opt){
								return function() {
									if(opt.ele.getAttribute('isdigged')) {
										return false;;
									}
									v7sendLog('96_01_01_'+scope.$uid,scope.$pageid,'');
									opt.onSuccess = function(data) {
										var ele = opt.ele;
										var val = parseInt(ele.getAttribute('num') || 0);
										val++;
										ele.setAttribute('isdigged','yes');
										ele.setAttribute('num',val);
										ele.innerHTML = '喜欢('+val+')';
										scope.digger.hiddenLast10();
										setTimeout(function(){
											scope.digger.showLast10(opt);
										},100);
									};
									opt.onError = function(data) {
										var ele = opt.ele;
										if(data.code == 'B00801') {
											winDialog.alert("这篇博文您已经喜欢过啦!", {
												icon: "01"
											});
											ele.setAttribute('isdigged','yes');
											var val = parseInt(ele.getAttribute('num') || 0);
											ele.innerHTML = '喜欢('+val+')';
											scope.digger.hiddenLast10();
											setTimeout(function(){
												scope.digger.showLast10(opt);
											},100);
										} else {
											showError(data.code);
										}
									};
									scope.digger.diggerPost(opt);
									return false;
								}
							})(obj);
						}
						
				}
			}
		}
	}
	
	function isChildNodes(ele,src) {
		if(ele.hasChildNodes()) {
			var children = ele.childNodes;
			for(var i=0; children[i]; i++) {
				if(isChildNodes(children[i],src)) {
					return true;
				}
			}
		}
		return ele == src;
	}
	/*
	var allNumObj = {};
	allNumObj['res_id'] = aids.join(',');
	allNumObj['res_uid'] = uids.join(',');
	
	allNumObj['onSuccess'] = function(_data){
		for(var key in _data) {
			var ele = $E('share_'+key.split('_')[2]);
			if(ele) {
				ele.innerHTML = '顶('+_data[key]+')';
				$E('share_'+key.split('_')[2]).setAttribute('num',_data[key]);
			}
		}
	};
	scope.digger.diggerNums(allNumObj);
	*/
};
