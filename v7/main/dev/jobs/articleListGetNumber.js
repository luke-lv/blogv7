/**
 * @fileoverview
 *	博文列表页未登录状态读取评论数/阅读数
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/dom/getElementsByClass.js");

$import("lib/jobs.js");

$import("component/include/getArticlesDetailNumber.js");
$registJob("articleListGetNumber", function () {
	var list = Core.Dom.getElementsByClass(document.body, "span", "atc_data");
	var len = list.length;
	var articleIds = [];
	if(len > 0){
		// 获取当前页的文章 ID 数组
		Core.Array.foreach(list, function (oItem) {
			articleIds.push(oItem.id.substr(6));
		});
		// 因为阅读数评论数接口一次最多 35 条，所以在列表页，必须拆成两次读取
		// 新接口不需要分两次读取 modified by gaolei 2013-4-1
		// var articlesList = articleIds.slice(0, 35);
		
		var render = function(data){
				// 回写数字
				for(var key in data){
					if($E("count_" + key)){
						$E("count_" + key).innerHTML = '(<span title="评论数">' +  data[key].c + '</span>/<span title="阅读数">' +  data[key].r +  '</span>)';
					}
				}
				// 如果有没读取到的，默认置为 0
				Core.Array.foreach(articleIds, function (item) {
					if($E("count_" + item) && $E("count_" + item).innerHTML == ""){
						$E("count_" + item).innerHTML = '(<span title="评论数">0</span>/<span title="阅读数">0</span>)';
					}
				});
		};
		
		// 读取数字，并回写
		App.getArticlesDetailNumber(scope.$uid, articleIds, render);
		
/* 		if(articleIds.length > 35){新接口不需要分两次读取 modified by gaolei 2013-4-1
			articlesList = articleIds.slice(35, 50);
			App.getArticlesDetailNumber(scope.$uid, articlesList, render);
		} */
	}
});
