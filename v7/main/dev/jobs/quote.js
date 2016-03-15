/**
 * @fileoverview
 *	转载
 * @author dg.liu | dongguang@staff.sina.com.cn
 *
 */
$import("sina/sina.js");
$import("lib/jobs.js");
$import("article/quote.js");

$registJob("quote", function () {
	$E("quote_set_sign") && (scope.article_quote=new Quote("quote_set_sign"));
	$E("quote_set_sign2") && (scope.article_quote=new Quote("quote_set_sign2"));
	
	if(!$E("quote_set_sign") && !$E("quote_set_sign2")){
		!scope.article_quote && (scope.article_quote=new Quote());
		scope.articel_quote_alert=function(articleID){
			scope.article_quote.check(articleID);
		};
	}
});
