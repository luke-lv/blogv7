/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 频道博客正文页（未登录）JOB 配置
 * @author wangqiang1@staff.sina.com.cn xiaoyue3@staff.sina.com.cn
 * @date 2013_03_28
 */
$import("lib/jobs.js");
// $import("jobs/articleTjTech680.js");
$import("jobs/articleComment.js");
$import("jobs/articleNumber.js");
$import("jobs/articleCommentPost.js");
$import("jobs/tray.js");
$import("jobs/articleTjTechComp.js");
$import("jobs/articleTjTechFont.js");
$import("jobs/articleCommentManager.js");
$import("jobs/quote.js");
$import("articleManage/ArticleManageFactory.js");
$import("jobs/report_blogComment.js");
$import("jobs/report_bodyArticle.js");
$import("jobs/imageLazyLoad.js");
$import("jobs/digger.js");
$import("jobs/articleDigger.js");
$import("jobs/suda.js");
// 分享博文中的图片到微博.
$import("jobs/sharePhoto.js");
$import("jobs/selectionShare.js");
//增加测试统计
$import("jobs/zoneStatic.js");
$import("jobs/userResidenceTime.js");

$import("jobs/renderReblogDiv.js");
//如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe
// $import("jobs/searchToQing.js");
//推广链接广告
$import("jobs/adNoticeChannel.js");
$import("jobs/trayTipsAd.js");
//增加测试统计
$import("jobs/tjLoadBlogerInfo.js");
$import("jobs/static.js");
$import("jobs/zoneStatic.js");
$import("jobs/oslink/osl_article.js");
// $import("jobs/xingqu.js");
$import("jobs/loginStatus.js");

$import("jobs/login.js");

$import("jobs/flashtemplate.js");
$import("jobs/stylefix.js");

$import('jobs/audioCheck.js');
$import("jobs/articleTj680.js");
$import("jobs/articleTjTiYuAd.js");

//用户赞助功能
//$import("jobs/userSponsor.js");
$import("jobs/blogAppAd.js");
$import("jobs/tjFinaAd.js");
//tj 新模版样式修复
$import("jobs/tj_newFix.js");

//广告布码
$import("jobs/articleTj_suda.js");

//打赏
//$import("jobs/dashang.js");
function main(){
    // v7sendLog('42_01_04_' + new Date().getTime() + "_" + url + "_" + refer);
    var job = new Jobs();
    job.add("suda");
    job.add("tray");
    //博客用户赞助功能 赞助下线 2014-04-28
    // job.add("userSponsor");
    job.add("adNoticeChannel");
    job.add("trayTipsAd");
    
    job.add("articleTjTechComp");
    job.add("tjLoadBlogerInfo");
    job.add("articleTjTechFont");
    job.add("digger");
    job.add("articleDigger");
    job.add("renderReblogDiv");
    //分享博文中的图片到微博
    job.add("sharePhoto"); 
    job.add("imageLazyLoad");
    
    job.add("articleNumber");
    job.add("articleComment");
    job.add("articleCommentPost");
    job.add("articleCommentManager");
    job.add("quote");
    job.add("articleTj680");
    
    job.add('audioCheck',3);
    
    job.add("report_blogComment");
    job.add("report_bodyArticle");
    job.add("flashtemplate",3);
    job.add("stylefix",3);
    
    //增加测试统计
    job.add("toZoneStatic",3);
	job.add("userResidenceTime"); //统计用户停留时长
    job.add("selectionShare");

     //如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe
    //此job依赖tjAd job
    // job.add("searchToQing", 3);
    // job.add("tjSendLog");
    //外链统计
    job.add("osl_article", 3);
    // 统计用户登录状态过期
    job.add("loginStatus");
    
    job.add("articleTjTiYuAd");
    job.add("blogAppAd");
    job.add("tjFinaAd");
    job.add("tj_newFix");

    //广告布码
    job.add("articleTj_suda");
  
   // job.add('dashang');

    job.start();
}
