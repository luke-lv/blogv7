/**
 * @fileoverview 个人动态
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-09-02
 */

$import("sina/sina.js");

$import("product/myFeed/feed.js");


$registJob("personalFeed", function(){
	var personalFeed=new scope.Feed("personal");
	personalFeed.totalCount=$pagecount;
	personalFeed.eachPageCount=20;
	personalFeed.render();
});
