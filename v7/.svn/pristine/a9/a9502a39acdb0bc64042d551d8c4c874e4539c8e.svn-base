/**
 * @fileoverview
 *	给博文列表页增加文章删除等操作，由JS动态绑定事件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @modified dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/events/addEvent.js");

$import("lib/jobs.js");
$import("lib/checkAuthor.js");

$import("articleManage/ArticleManageFactory.js");
$import("sina/core/events/stopBubble.js");

scope.outOfArticleList = {};
scope.outOfArticleListTimmer = {};

$registJob("addManageToArticleList", function () {
	Lib.checkAuthor();
	var list = scope.$blogArticleSortArticleids;
	var cateId = scope.$blogArticleCategoryids;
    var __addEvent = Core.Events.addEvent, __bind3 = Core.Function.bind3;
	// 取得文章列表，并遍历文章列表，判断节点存在，绑定不同的事件
	if($isAdmin && list != null){
		Core.Array.foreach(list, function (sAid, i){
			if($E("a_normal_del_" + sAid)){
				__addEvent("a_normal_del_" + sAid, __bind3($articleManage, null, [sAid, 1]));
			}
			if($E("a_draft_del_" + sAid)){
				__addEvent("a_draft_del_" + sAid, __bind3($articleManage, null, [sAid, 2]));
			}
			if($E("a_recyle_del_" + sAid)){
				__addEvent("a_recyle_del_" + sAid, __bind3($articleManage, null, [sAid, 3]));
			}
			if($E("a_recycle_back_" + sAid)){
				__addEvent("a_recycle_back_" + sAid, __bind3($articleManage, null, [sAid, 4]));
			}
			if($E("a_add_top_" + sAid)){
				__addEvent("a_add_top_" + sAid, __bind3($articleManage, null, [sAid, 7]));
			}
			if($E("a_replace_top_" + sAid)){
				__addEvent("a_replace_top_" + sAid, __bind3($articleManage, null, [sAid, 8]));
			}
			if($E("a_cancel_top_" + sAid)){
				__addEvent("a_cancel_top_" + sAid, __bind3($articleManage, null, [sAid, 9]));
			}
			
			//added by dcw1123
			if($E("a_more_" + sAid)){
				scope.outOfArticleList[sAid] = true;
				//__addEvent(document, __bind3($articleManage, null, [sAid, 10]));
				__addEvent("a_more_" + sAid, function(){
					scope.outOfArticleListTimmer[sAid] = setTimeout(function(){
						if(!scope.outOfArticleList[sAid]) {
							(__bind3($articleManage, null, [sAid, 10]))();
						}
						scope.outOfArticleListTimmer[sAid] = 0;
					},600);
					scope.outOfArticleList[sAid] = false;
				},'mouseover');
				__addEvent("a_more_" + sAid, function(){
					Core.Events.stopBubble();
					if(scope.outOfArticleListTimmer[sAid] !== 0) {
						clearTimeout(scope.outOfArticleListTimmer[sAid]);
						scope.outOfArticleListTimmer[sAid] = 0;
					}
					var layer = $E("a_layer_"+sAid);
					if(layer.style.display) {
						(__bind3($articleManage, null, [sAid, 10]))();
					} else {
						layer.style.display = 'none';
					}
				},'click');
				
				__addEvent("a_more_" + sAid, function(e){
					e = e || window.event;
					//var src = e.target || e.srcElement;
					var src = e.relatedTarget || e.toElement;
					var ele = $E("a_more_" + sAid);
					if($FF) {
						if(!isChildNodes(ele,src)) {
							scope.outOfArticleList[sAid] = true;
						}
					} else {
						if(!ele.contains(src)) {
							scope.outOfArticleList[sAid] = true;
						}
					}
				},'mouseout');
			}
			if($E("a_modify_cate_" + sAid)){
				__addEvent("a_modify_cate_" + sAid, __bind3($articleManage, null, [ sAid, 11, {"cateId":cateId[i]} ]));
			}
			if($E("a_hidden_"+sAid)){
				__addEvent("a_hidden_"+sAid, __bind3($articleManage, null, [ sAid, 12, null ]));
			}
			if($E("a_return_"+sAid)){
				__addEvent("a_return_"+sAid, __bind3($articleManage, null, [ sAid, 13, null ]));
			}
            if($E("a_clockpub_del_" + sAid)){
				__addEvent("a_clockpub_del_" + sAid, __bind3($articleManage, null, [sAid, 14]));
			}
            if($E("a_clockpub_send_" + sAid)){
				__addEvent("a_clockpub_send_" + sAid, __bind3($articleManage, null, [sAid, 15]));
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
		});
	}
});

