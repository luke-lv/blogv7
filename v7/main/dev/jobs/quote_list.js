/**
 * @fileoverview
 *	转载
 * @author dg.liu | dongguang@staff.sina.com.cn
 *
 */
$import("sina/sina.js");
$import("lib/jobs.js");
$import("article/quote_list.js");

$registJob("quote_list", function () {
	var node=$E("z_"+scope.$articleid);
	if($E("quote_sign")){
		scope.article_quoteList=new QuoteList("quote_sign","blog_quote");
	}else if(node){
		scope.article_quoteList=new QuoteList("z_"+scope.$articleid,"blog_quote");
		node.innerHTML=="(0)" && (node.style.display="none");
	}
});
