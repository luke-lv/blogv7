/**
 * @fileoverview 博客首页的转载列表
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-03-11
 */

$import("sina/sina.js");
$import("lib/jobs.js");
$import("article/quote_list.js");

$registJob("quote_list_index", function () {
	!scope.article_quoteList && (scope.article_quoteList=new QuoteList());
	!scope.article_quote && (scope.article_quote=new Quote());
	var article_quoteList_index=new QuoteList();
	scope.articleQuoteShow=function(blogID){
		var pageCount;
		if ($E("num_quote_" + blogID)) {
			pageCount = +$E("num_quote_" + blogID).innerHTML;
			scope.article_quoteList.onDeleted = function(){
				$E("num_quote_" + blogID).innerHTML = +($E("num_quote_" + blogID).innerHTML) - 1;
			};
			
		}
		else if ($E("quote_sign_" + blogID)) {
			pageCount = +$E("quote_sign_" + blogID).innerHTML.match(/\d+/g)[0];
			scope.article_quoteList.onDeleted = function(){
				$E("quote_sign_" + blogID).innerHTML = "("+($E("quote_sign_" + blogID).innerHTML.match(/\d+/g)[0]) - 1+")";
			};
		}
		
		blogID && article_quoteList_index.show(blogID, "ff_" + blogID, pageCount);
	};
	
});