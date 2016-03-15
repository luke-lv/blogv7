/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 文章页 读取评论数/阅读书/收藏数，根据数字产生翻页
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("lib/checkAuthor.js");

$import("component/include/getArticlesDetailNumber.js");
$import("component/include/getArticlesFavoriteNumber.js");
$import("comment/paging.js");


$registJob('articleNumber', function(){
	// Modified by L.Ming @2009.10.22 如果是私密博文，且是访客访问的时候，就不读取数字
	Lib.checkAuthor();
	if(scope.$pn_x_rank == "1" && !$isAdmin){
		return false;
	}
    var uid = scope.$uid;
    var articleid = picInfo.pic_id;
    App.getArticlesDetailNumber(articleid);
	
	//匿名评论开关
	if (scope['private'].hidecms == 1) {
		try { //如果是加密的,则没有匿名勾选框
			$E('anonymity_cont').style.display = 'none';
		} 
		catch (e) {
		}
	}
	//收藏数读取
/*
    var favmd5 = eval('(' + $E("articlebody").getAttribute("favMD5") + ')');
    
    App.getArticlesFavoriteNumber(favmd5, function(data){
        for (var k in favmd5) {
            if (data["1_url_" + favmd5[k]] != null) {
                $E("f_" + scope.$articleid ).innerHTML = '(' + data["1_url_" + favmd5[k]] + ')';
            }
			else{
				$E("f_" + scope.$articleid ).innerHTML = '(0)';
			}
        }
    });
*/
});
