/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 博客正文页（未登录）JOB 配置
 * @author stan | chaoliang@staff.sina.com.cn
 * @modified xy  xinyu@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("lib/listener.js");
$import("jobs/articleComp.js");
// $import("jobs/articleComment.js");
/*************消息系统——评论改造**************/
$import("jobs/articleCommentV2.js");
$import("jobs/articleNumberV2.js");
$import("jobs/articleCommentPostV2.js");
/*************消息系统——评论改造**************/
$import("jobs/tray.js");
$import("jobs/login.js");
$import("jobs/getTplNum.js");
// $import("jobs/articleCommentManager.js");
$import("jobs/articleShare.js");
$import("jobs/recordVisitor.js");
$import('jobs/subscribe.js');
$import('jobs/updownurl.js');
$import('jobs/audioCheck.js');
$import("jobs/randomScroll.js");
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
// $import("jobs/report_blogComment.js");
$import("jobs/report_bodyArticle.js");
$import("jobs/flashtemplate.js");
$import("jobs/imageLazyLoad.js");

$import("worldcup/favGames.js");
$import("worldcup/teams_wc.js");
$import("worldcup/calendar_wc.js");
// $import("jobs/sendHongBao.js");

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
$import("jobs/trayTipsAd.js");
// //Qing推荐博文
// $import("jobs/qingRecommend.js");
// $import("jobs/qingRecomNew.js");

//博客下线模版公告
$import("jobs/adNoticeChannel.js");
$import("jobs/blogNotice.js");
$import("jobs/trashPv.js");

//$import("jobs/xssDetect.js");

//图片幻灯片
$import("jobs/showSlideBox.js");

$import("jobs/showSlideBtn.js");
$import("jobs/xingqu.js");
$import("jobs/oslink/osl_article.js");
$import("jobs/blog365/blog365Slide.js");
$import("lib/component/blog365/templateCanlendar.js");
//统计布码
// $import("jobs/myMoreArticleLog.js");
$import("jobs/loginStatus.js");
$import("jobs/showTB680.js");

//pad版本切换
$import("jobs/padSwitch.js");
//促登陆模块
$import("jobs/loginFollow.js");
$import("lib/sendLog.js");

//博客页面提醒
$import("jobs/blogTip.js");

//评论审核模块
$import("jobs/commentforcheck.js");
//缔元信布码，第三方的
$import("jobs/diYuanXin.js");

//uatrack布码
$import("jobs/uatrack.js");

//右侧热卖商品广告  推荐商讯广告
$import("jobs/hotAdvertise.js");

// 相关博文广告位
$import("jobs/xgBlogAD.js");
$import("jobs/blogAppAd.js");

//用户识别
//$import("jobs/userIdentification.js");
//$import("jobs/userIdentificationfingerprint.js");
// $import("jobs/shangyehuawomai.js");
// 访问文章页进度布码
// 2013-11-25 布码下线
// $import("jobs/articleReadingPercent.js");

// 右侧大家在看浮层
// $import("jobs/rightAD.js");

//用户赞助功能
// $import("jobs/userSponsor.js");

$import("jobs/goldPan.js");
$import("jobs/godReply.js");//博文页添加神回复
$import("jobs/wenjuan1.js");
$import("jobs/articleMaxImg.js");
// 文章页点击地图布码
// $import("jobs/articleSuda.js");

//十周年
$import("jobs/article_10years_suda.js");

function main(){
  var isTj = window.location.href.indexOf("tj=1") > -1;
  if(isTj){
    v7sendLog('42_01_07');
  }
  
    // 注册消息
    var listener = Lib.Listener;
    // 销售广告消息
    listener.add("tray-ad-tips");

  var job = new Jobs();
  job.add("suda");
  job.add("tray");
    job.add("trayTipsAd");
  job.add('renderAd');
    job.add("showTB680");
  job.add("digger");
  job.add("articleDigger");
  job.add("recordVisitor");
  job.add("renderReblogDiv");
    
  job.add("godReply");//神回复
  job.add('articleCommentV2');
  
  //博客用户赞助功能
    // job.add("userSponsor");
    
    job.add("goldPan");

  //博客下线模版公告
    job.add("blogNotice");
    job.add("trashPv");
  job.add("adNoticeChannel");

  job.add('articleMaxImg');
  job.add("imageLazyLoad");
  job.add("articleComp1");
  job.add("articleNumberV2");
  // job.add("articleComment");
  job.add("articleCommentPostV2");
  // job.add("articleCommentManager");
  job.add("quote");
  job.add("quote_list");
  job.add("dynamicVoteView");
  job.add('updownurl');
  job.add("articleComp2");
  // job.add("shangyehuawomai");
  
  //分享博文中的图片到微博
  job.add("sharePhoto");
  
  job.add("templateClone", 3);
  job.add("favGames");
  job.add("teams_wc");
  job.add("calendar_wc");
  job.add("phone_attention_add", 3);
  job.add('randomScroll',3);
  job.add('audioCheck',3);
  job.add('subscribe',3);
  job.add("articleShare",3);
  // job.add("report_blogComment");
  job.add("report_bodyArticle");
  job.add("flashtemplate",3);
  job.add("stylefix",3);
  // job.add("sendHongBao");
  
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

  //blog365列表滚动
  job.add("blog365Slide");
  
  //点击光棍节链接自动加关注
  //job.add("SinglesDay");
  
  //自动加官博关注
  job.add("SinglesDay");
  
  job.add("selectionShare");
    // job.add("qingRecommend",3);
    // job.add("qingRecomNew",3);
  
  //点MSN FEED回流用户 显示浮层
  //job.add("msnFeedFloatLayer");
  
  job.add('tranVideo');
  job.add("errorTips");
  
  // job.add("myMoreArticleLog");
  //增加测试统计
  job.add("toZoneStatic",3);
  job.add("tjAd", 3);   // 必须最后加载，广告套装
  //如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe
    //此job依赖tjAd job
  // job.add("searchToQing", 3);

  job.add("showSlideBox", 3);

  job.add("showSlideBtn",3);

    // 嵌入iframe和script XSS攻击检查
    // job.add("userDetect", 3);
    job.add("xingqu", 3);
    //外链统计
    job.add("osl_article", 3);
    //pad版本切换
    job.add("padSwitch");
  job.add("loginFollow");

  job.add('uatrack');
    //博客页面提醒
    job.add('blogTip');
    //评论审核
    job.add('commentForCheck');
    job.add("diYuanXin");

    // 相关博文广告位
    job.add('xgBlogAD');
  job.add("blogAppAd");
  job.add('hotAdvertise');

  // job.add("articleReadingPercent");
  
  // job.add("rightAD");
  
    //用户识别，请让这个job排在最后，它不重要的
    //job.add("userIdentification");
    //job.add("userIdentificationfingerprint");

    // 文章页点击地图布码
    // job.add("articleSuda");
    //十周年入口统计
    job.add('article_10years_suda');

    job.add('wenjuan1');
    job.start();
}
