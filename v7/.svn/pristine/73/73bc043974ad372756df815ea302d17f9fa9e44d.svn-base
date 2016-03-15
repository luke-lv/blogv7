/**
 * @fileoverview 博客首页转载功能
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-03-10
 */

$import("sina/sina.js");
$import("lib/jobs.js");
$import("article/quote.js");

$registJob("quote_index", function () {
	!scope.article_quote && (scope.article_quote=new Quote());
	scope.articel_quote_alert=function(articleID){
		scope.article_quote.check(articleID);
	};
});