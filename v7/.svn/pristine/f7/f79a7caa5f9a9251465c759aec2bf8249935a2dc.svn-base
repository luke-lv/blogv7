/**
 * @fileoverview 关注动态
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-09-02
 */

$import("sina/sina.js");

$import("product/myFeed/feed.js");


$registJob("attentionFeed", function(){
	var attentionFeed=new scope.Feed("attention");
	attentionFeed.totalCount=$pagecount;
	attentionFeed.eachPageCount=20;
	attentionFeed.render();
});
