/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 博客正文页（登录）JOB 配置
 * @author stan | chaoliang@staff.sina.com.cn
 * @modified xy  xinyu@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/articleComp.js");
// $import("jobs/articleComment.js");
/*************消息系统——评论改造**************/
$import("jobs/articleCommentV2.js");
$import("jobs/articleNumberV2.js");
$import("jobs/articleCommentPostV2.js");
/*************消息系统——评论改造**************/
// $import("jobs/articleNumber.js");
// $import("jobs/articleCommentPost.js");
$import("jobs/tray.js");
$import("jobs/login.js");
// $import("jobs/articleCommentManager.js");
$import("jobs/articleShare.js");

$import("jobs/articleCommentV2.js");

$import("jobs/audioCheck.js");
$import("jobs/write.js");
$import("jobs/randomScroll.js");
$import('jobs/modifyTitle.js');
$import('jobs/updownurl.js');
$import("jobs/advertise.js");
$import("jobs/templateClone.js");
$import("jobs/getTplNum.js");
$import("jobs/quote_list.js");
//$import('jobs/readNumPlus.js');
$import("vote/dynamicVoteView.js");
$import("vote/initCookie.js");
$import("articleManage/ArticleManageFactory.js");
$import('article/fontSize.js');
$import("jobs/stylefix.js");
// $import("jobs/report_blogComment.js");
$import("jobs/imageLazyLoad.js");
$import("jobs/flashtemplate.js");
$import("jobs/baby_headPhotoEditorDialog.js");
$import("jobs/baby_babyBarFlashDetect.js");


$import("jobs/modify_tip.js");

$import("worldcup/teams_wc.js");
$import("worldcup/calendar_wc.js");
$import("worldcup/favGames.js");
$import("jobs/digger.js");
$import("jobs/miniBlogAttention.js");
$import("jobs/articleDigger.js");
$import("jobs/suda.js");

$import("jobs/scrollAd.js");
$import("jobs/static.js");
$import("jobs/SinglesDay.js");

$import("jobs/selectionShare.js");

//分享博文中的图片到微博 .
$import("jobs/sharePhoto.js");

//增加测试统计
$import("jobs/zoneStatic.js");
$import("jobs/userResidenceTime.js");

// 博文页广告
$import("jobs/tjAd.js");

$import("jobs/tranVideo.js");
$import("jobs/errorTips.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
//博文转载到Qing
$import("jobs/renderReblogDiv.js");
//Qing推荐博文
// $import("jobs/qingRecommend.js");
// $import("jobs/qingRecomNew.js");

//博客下线模版公告
$import("jobs/adNoticeChannel.js");
$import("jobs/blogNotice.js");

//图片幻灯片
$import("jobs/showSlideBox.js");
$import("jobs/showSlideBtn.js");
$import("jobs/xssDetect.js");
$import("jobs/oslink/osl_article.js");
$import("lib/component/blog365/templateCanlendar.js");
// $import("jobs/myMoreArticleLog.js");
$import("jobs/loginStatus.js");

//pad版本切换
$import("jobs/padSwitch.js");
//促登陆模块
$import("jobs/loginFollow.js");
$import("lib/sendLog.js");

$import("jobs/blogTip.js");
//缔元信布码，第三方的
$import("jobs/diYuanXin.js");

//uatrack布码
$import("jobs/uatrack.js");

// 相关博文广告位
$import("jobs/xgBlogAD.js");
$import("jobs/blogAppAd.js");
// 博客推广app广告 

$import("jobs/godReply.js");//博文页添加神回复
$import("jobs/articleMaxImg.js");

//如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe
// $import("jobs/searchToQing.js");

// 访问文章页进度布码
// 2013-11-25 布码下线
// $import("jobs/articleReadingPercent.js");

// 右侧大家在看浮层
//$import("jobs/rightAD.js");

function main () {
  var isTj = window.location.href.indexOf("tj=1") > -1;
  if(isTj){
    v7sendLog('42_01_07');
  }

  var job = new Jobs();
  job.add("suda");
    job.add("blogTip");
  job.add("tray");
    job.add("trayTipsAd");
  job.add('renderAd');
  job.add("digger");
  job.add("articleDigger");
  
    
  job.add("godReply");//神回复
  job.add('articleCommentV2');
  job.add('articleNumberV2');
  job.add('articleMaxImg');
  job.add("imageLazyLoad");
  job.add("articleComp1");
  // job.add("articleNumber");
  // job.add("articleComment");
  job.add("articleCommentPostV2");
  // job.add("articleCommentManager");
  job.add("dynamicVoteView");
  job.add("quote_list");
  job.add('updownurl');
  job.add("write");
  //分享博文中的图片到微博
  job.add("sharePhoto");
  
  job.add("favGames");
  job.add("articleComp2");
  job.add("teams_wc");
  job.add("calendar_wc");
  
  job.add("templateClone" ,3);
//  job.add('readNumPlus');
  

  job.add('randomScroll',3);
  job.add('modifytitle',3);
  job.add('audioCheck',3);
  job.add("articleShare",3);
  job.add("modify_tip");
  // job.add("report_blogComment");
  job.add("flashtemplate",3);
  
  //关注"博客头条"的微博
  job.add("miniBlogAttention");

  //育儿博客宝宝头图及编辑
  job.add("baby_headPhotoEditorDialog");
  
  //宝宝成长进度条Flash插件检测
  job.add("baby_babyBarFlashDetect");
  job.add("scrollAd");
  
  
  //点击光棍节链接自动加关注
  job.add("SinglesDay");
  job.add("static");
  
  job.add("selectionShare");
  // job.add("qingRecommend",3);
  // job.add("qingRecomNew",3);
  
  //增加测试统计
  job.add("toZoneStatic",3);
  job.add("userResidenceTime"); //统计用户停留时长
  
  job.add("tjAd", 3);       // 必须最后加载，广告套装
  job.add('tranVideo');
  job.add("errorTips");
  
  //博客下线模版公告
  job.add("adNoticeChannel");
  job.add("blogNotice");

  //博文转载到Qing
  job.add("renderReblogDiv");

  job.add("showSlideBox");

  job.add("showSlideBtn");

  // 嵌入iframe和script XSS攻击检查
    job.add("userDetect", 3);
    //外链统计
    job.add("osl_article", 3);
    // job.add("myMoreArticleLog");
    
    // 统计用户登录状态过期
    job.add("loginStatus");

    //pad版本切换
    job.add("padSwitch");
  job.add("loginFollow");


  job.add("uatrack");
    job.add("diYuanXin");

    // 相关博文广告位
    job.add('xgBlogAD');
  // 博客app推广广告位
  job.add("blogAppAd");
  job.add("stylefix",3);
  
  // job.add("articleReadingPercent");

    // job.add("searchToQing", 3);

    // job.add("rightAD");
    
  job.start();
}
