/**
 * @fileoverview
 *	取得特定 UID 的指定文章的收藏数
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/array/foreach.js");
$import("sina/utils/io/jsload.js");

$import("lib/app.js");
$import("lib/interface.js");
/**
 * 取得指定文章的收藏数
 * @param {Array} aArticleLists
 * @param {Function} fCallBack
 * @return {JsonObject}	以文章 ID 为 Key 的 JSON 对象
 * @example
	App.getArticlesFavoriteNumber(["53d96fe300eo5f","53d96fe300dzb5","53d96fe300dt4v"]
				, function(data){
							Debug.dir(data);
				});
 */
$import('lib/getUidhex.js');
App.getArticlesFavoriteNumber = function (aArticleLists, fCallBack){
	if(aArticleLists == null || aArticleLists.length == 0){
		fCallBack({});
	}
	var i_getFavoriteNumber = "http://collect.sinajs.cn/collect?key=";
	// 整理文章 ID 数据
	var aids = [];
	for(var key in aArticleLists){
//		trace(">>>>>>>>>"+aArticleLists[key]+"<<<<<<<<<<,");
		aids.push("1_url_" + aArticleLists[key]);
	}
	var rs = "rs" + Math.ceil(Math.random()* 19999);
	i_getFavoriteNumber += aids.join(",") + "&var=" + rs;
	Utils.Io.JsLoad.request(i_getFavoriteNumber, {
		onComplete	: function () {
			fCallBack(window[rs]);
		}
		,onException: function () {
			fCallBack({});
		}
	});
};