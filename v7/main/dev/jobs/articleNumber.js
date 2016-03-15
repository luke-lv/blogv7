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
// $import("component/include/getArticlesFavoriteNumber.js"); 全部数据由getArticlesDetailNumber方法提供
$import("comment/paging.js");


$registJob('articleNumber', function(){
    // Modified by L.Ming @2009.10.22 如果是私密博文，且是访客访问的时候，就不读取数字
    Lib.checkAuthor();
    if(scope.$pn_x_rank == "1" && !$isAdmin){
        return false;
    }
    var uid = scope.$uid;
    var articleid = scope.$articleid;
    App.getArticlesDetailNumber(uid, [articleid], function(x){
        var data = x[articleid];
        // delete data.f; 新增收藏数——modified by gaolei 2013-4-1
        for (var i in data) {
            //此处判断tj=tech页 标题上方的评论数加载
            if(scope.$pageid === "articletjTech"){
                if(i === "c"){
                    $E("comment_tj_" + articleid).innerHTML = "评论(" + data[i] + ")";
                }
            }
            if ($E(i + "_" + articleid)){
                $E(i + "_" + articleid).innerHTML = "(" + data[i] + ")";
            }
            if (i === "c") {// tj=2 评论框显示评论数         
                if ($E('blog_comments_num')){
                    var num = (data[i] || 0);
                    num = (num>999) ? '999+' : num;
                    $E('blog_comments_num').innerHTML = num;
                }
            } 
        }

        if(scope.$pageid === "articleM" && data['z'])
        {
            $E("quote_sign_count") && ($E("quote_sign_count").innerHTML =  data['z'] );
        }

        scope.$totle_comment = window.parseInt(data.c);
        Comment.paging(scope.$totle_comment, 1);
    });
    
    //收藏数读取 取消调用旧接口——modified by gaolei 2013-4-1
/*  if(!$E("articlebody")) {
        traceError("Job[articleNumber]：the id 'articlebody' was not found.");
        return false;
    }
    var favmd5 = eval('(' + $E("articlebody").getAttribute("favMD5") + ')');
    App.getArticlesFavoriteNumber(favmd5, function(data){
        for (var k in favmd5) {
            //if (data["1_url_" + favmd5[k]] != null) {
            if (data[k] != null) {
                $E("f_" + scope.$articleid ).innerHTML = '(' + data[k] + ')';
            }
            else{
                $E("f_" + scope.$articleid ).innerHTML = '(0)';
            }
        }
    }); */
});
