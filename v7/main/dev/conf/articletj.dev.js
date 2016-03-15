/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 博客正文页（未登录）JOB 配置
 * @author stan | chaoliang@staff.sina.com.cn
 * @modified xy  xinyu@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/articleTj680.js");
$import("jobs/articleTjComp.js");
$import("jobs/articleComment.js");
$import("jobs/articleNumber.js");
$import("jobs/articleCommentPost.js");
$import("jobs/tray.js");
$import("jobs/login.js");
$import("jobs/getTplNum.js");
$import("jobs/articleCommentManager.js");
$import("jobs/articleShare.js");
$import("jobs/recordVisitor.js");
$import('jobs/subscribe.js');
$import('jobs/updownurl.js');
$import('jobs/audioCheck.js');
//$import("jobs/randomScroll.js");
$import("jobs/advertise.js");
$import("jobs/templateClone.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/baby_babyBarFlashDetect.js");
$import("jobs/phone_attention_add.js");
$import("jobs/quote.js");
$import("jobs/quote_list.js");
$import("vote/dynamicVoteView.js");
$import("vote/initCookie.js");
$import("articleManage/ArticleManageFactory.js");
$import('article/fontSize.js');
$import("jobs/report_blogComment.js");
$import("jobs/report_bodyArticle.js");
$import("jobs/flashtemplate.js");
$import("jobs/imageLazyLoad.js");

$import("jobs/digger.js");
$import("jobs/stylefix.js");
$import("jobs/articleDigger.js");
$import("jobs/miniBlogAttention.js");
$import("jobs/suda.js");

$import("jobs/scrollAd.js");
$import("jobs/SinglesDay.js");
$import("jobs/static.js");

//分享博文中的图片到微博.
$import("jobs/sharePhoto.js");
//自动加官博关注
$import("jobs/SinglesDay.js");

$import("jobs/selectionShare.js");

//显示MSN FEED回流用户浮层
//$import("jobs/msnFeedFloatLayer.js");

//增加测试统计
$import("jobs/zoneStatic.js");
$import("jobs/userResidenceTime.js");

// 博文页广告
$import("jobs/tjAd.js");
$import("jobs/tranVideo.js");
$import("jobs/errorTips.js");
$import("jobs/renderReblogDiv.js");
//如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe
// $import("jobs/searchToQing.js");
//推广链接广告
$import("jobs/adNoticeChannel.js");
$import("jobs/trayTipsAd.js");

$import("jobs/tjLoadBlogerInfo.js");

$import("jobs/tjSendLog.js");
$import("jobs/oslink/osl_article.js");
$import("jobs/xingqu.js");
$import("jobs/loginStatus.js");
//缔元信布码，第三方的
$import("jobs/diYuanXin.js");

$import("lib/sendLog.js");

// 相关博文广告位
$import("jobs/xgBlogAD.js");

// 右侧大家在看浮层
// $import("jobs/rightAD.js");

//用户赞助功能
//$import("jobs/userSponsor.js");
$import("jobs/blogAppAd.js");
//tj 新模版样式修复
$import("jobs/tj_newFix.js");
// 相关阅读
$import("jobs/newEditor/relatedBlogArticles.js");
$import("jobs/gotoTop.js");
//微博打赏
//$import("jobs/dashang.js");

function main(){
    
    var url = encodeURIComponent(window.location.href);
    var refer = encodeURIComponent(document.referrer);
    Lib.checkAuthor();
    var ISTJ;
    if(!$isLogin){
        ISTJ = '42_01_04_' + new Date().getTime() + "_" + url + "_" + refer;
    }else{
        ISTJ = '42_01_04_' + $UID + '_' + new Date().getTime() + "_" + url + "_" + refer;
    }
    v7sendLog(ISTJ);

    var job = new Jobs();
    job.add("suda");
    job.add("tray");
    //博客用户赞助功能 赞助下线 2014-04-28
    // job.add("userSponsor");
    job.add("adNoticeChannel");
    job.add("trayTipsAd");
    job.add("tjLoadBlogerInfo");
    job.add('renderAd');
    job.add("digger");
    job.add("articleDigger");
    job.add("recordVisitor");
    job.add("renderReblogDiv");
    //分享博文中的图片到微博
    job.add("sharePhoto");
    
    job.add("imageLazyLoad");
    job.add("articleTjComp");
    job.add("articleNumber");
    job.add("articleComment");
    job.add("articleCommentPost");
    job.add("articleCommentManager");
    job.add("quote");
    job.add("quote_list");
    job.add("dynamicVoteView");
    job.add('updownurl');

    job.add("templateClone", 3);
    job.add("favGames");
    job.add("teams_wc");
    job.add("calendar_wc");
    job.add("phone_attention_add", 3);
    // job.add('randomScroll',3);
    job.add('audioCheck',3);
    job.add('subscribe',3);
    job.add("articleShare",3);
    job.add("report_blogComment");
    job.add("report_bodyArticle");
    job.add("flashtemplate",3);
    job.add("stylefix",3);
    job.add("tjAd",3);     //广告套装
    job.add("articleTj680");
    //关注"博客头条"的微博
    job.add("miniBlogAttention");
    
    //育儿博客相框头图
    job.add("baby_headPhoto");
    
    //宝宝成长进度条Flash插件检测
    job.add("baby_babyBarFlashDetect");
    job.add("scrollAd");
    
    //统计用户行为布码
    job.add("static");
	job.add("userResidenceTime"); //统计用户停留时长
    
    //点击光棍节链接自动加关注
    //job.add("SinglesDay");
    
    //自动加官博关注
    job.add("SinglesDay");
    
    job.add("selectionShare");
    
    //点MSN FEED回流用户 显示浮层
    //job.add("msnFeedFloatLayer");
    
    job.add('tranVideo');
    job.add("errorTips");
    
    //增加测试统计
    job.add("toZoneStatic",3);
    
    //如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe
    //此job依赖tjAd job
    // job.add("searchToQing", 3);

    job.add("tjSendLog");
    //外链统计
    job.add("osl_article", 3);

    job.add("xingqu", 3);
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.add("diYuanXin");
    
    // 相关博文广告位
    job.add('xgBlogAD');
    job.add("blogAppAd");
    job.add("tj_newFix");

    // 相关阅读
    job.add('relatedBlogArticles');
    job.add('gotoTop');

    // job.add("rightAD");
    
    //job.add('dashang');

    job.start();
}
