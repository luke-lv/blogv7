/**
 * @fileoverview
 *	取得特定 UID 的指定文章的阅读数、评论数、收藏数
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/array/foreach.js");

$import("lib/app.js");
$import("lib/interface.js");
/**
 * 取得特定 UID 的指定文章的阅读数、评论数、收藏数
 * @param {String|Number} sUid
 * @param {Array} aArticleLists
 * @param {Function} fCallBack
 * @return {JsonObject}	以文章 ID 为 Key 的 JSON 对象
 * @example
	App.getArticlesDetailNumber(1406758883
				, ["53d96fe300eo5f","53d96fe300dzb5","53d96fe300dt4v"]
				, function(data){
							Debug.dir(data);
				});
 */

$SetCommentsNum = function(arr){
    var articleid = picInfo.pic_id;
    $E("c_" + articleid).innerHTML = "(" + arr[0] + ")";
	var num = parseInt(arr[0]);
	if (isNaN(num)) {
		num = 0;
	}
    scope.$total_comment = num;
    Comment.paging(num,1);
}

App.getArticlesDetailNumber = function (articleid){
	if(articleid == null || articleid == 0){
		return;
	}

	/*
	 * Jsload 无法请求文章评论数阅读数接口，C接口，因此参数格式乃至顺序都不能变
	 * 所以只有临时处理创建一个 JS，原谅我吧，第二次这样干了，都是 C 接口闹的
	 */
	var js = $C("script");
	js.src = "http://blogtj.sinajs.cn/api/cms_num.php?cms_id=" + articleid + '&blogerid='+scope.$uid;
	js.charset = "utf-8";
	js.onload = js.onerror = js.onreadystatechange = Core.Function.bind2(function () {
		if (js && js.readyState && js.readyState != "loaded" && js.readyState != "complete") {
			return;
		}
		//清理script标记
		js.onload = js.onreadystatechange = js.onerror = null;
		js.src = "";
		js.parentNode.removeChild(js);
		js = null; 
	}, this);
	document.getElementsByTagName("head")[0].appendChild(js);
};
