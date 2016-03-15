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
$import("jobs/articleComp_new.js");
// $import("jobs/articleComment.js");
/*************消息系统——评论改造**************/
$import("jobs/articleCommentV2_new.js");
$import("jobs/articleNumberV2.js");
$import("jobs/articleCommentPostV2_new.js");
/*************消息系统——评论改造**************/
$import("jobs/tray_new.js");
$import("jobs/login.js");
$import("jobs/getTplNum.js");
// $import("jobs/articleCommentManager.js");
$import("jobs/articleShare.js");

$import("jobs/recordVisitor.js");

$import("jobs/quote_new.js");
$import("jobs/quote_list.js");

$import("articleManage/ArticleManageFactory.js");

$import("jobs/report_bodyArticle.js");
$import("jobs/imageLazyLoad.js");

$import("jobs/digger.js");
$import("jobs/stylefix.js");
$import("jobs/articleDigger_new.js");

$import("jobs/suda.js");

$import("jobs/static.js");

//增加测试统计
$import("jobs/userResidenceTime.js");

$import("jobs/tranVideo.js");
$import("jobs/errorTips_new.js");
$import("jobs/renderReblogDiv.js");

//图片幻灯片
$import("jobs/showSlideBox.js");
$import("jobs/showSlideBtn.js");

$import("jobs/xingqu.js");
$import("jobs/oslink/osl_article.js");
//统计布码
$import("jobs/loginStatus.js");

//评论审核模块
$import("jobs/commentforcheck.js");
//缔元信布码，第三方的
$import("jobs/diYuanXin.js");
//公告
$import("jobs/adNoticeChannel.js");
$import("jobs/blogNotice.js");
//新浮层重写
$import("jobs/dialogNewTemplate.js");

// 博文页广告
//右侧淘宝广告
$import("jobs/showTB680_new.js");
//右侧热卖商品广告  推荐商讯广告
$import("jobs/hotAdvertise_new.js");
$import("jobs/blogAppAd.js");
$import("jobs/scrollAd.js");
$import("jobs/tjAd_new.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
// // 相关博文广告位
$import("jobs/xgBlogAD.js");
$import("jobs/newEditor/relatedBlogArticles.js");
$import("jobs/gotoTop.js");
//打赏
//$import("jobs/dashang.js");
function main(){

  var listener = Lib.Listener;
  var job = new Jobs();
  //头部托盘
  job.add("tray_new");
  job.add("suda");
  //正文下方喜欢按钮
  job.add("digger");
  job.add("articleDigger_new");
  //懒加载
  job.add("imageLazyLoad");
  //组件初始化
  job.add("articleComp_new");
  //评论列表
  job.add('articleCommentV2_new');
  //评论发布器
  job.add("articleCommentPostV2_new");
  //评论上方数字统计
  job.add("articleNumberV2");
  //转载
  job.add("quote_new");
  //举报
  job.add("report_bodyArticle");
  //转载功能，顶部菜单
  job.add("renderReblogDiv");
  //正文页幻灯片
  job.add("showSlideBox", 3);
  job.add("showSlideBtn",3);
  //微米分享
  job.add("articleShare");
  //留脚印
  job.add("recordVisitor");
  //用户行为统计
  job.add("static");
  job.add("userResidenceTime"); //统计用户停留时长
  //转换视频
  job.add('tranVideo');
  //托盘系统通知
  job.add("errorTips_new");
  //收集兴趣
  job.add("xingqu", 3);
  //手机正文链接
  job.add('osl_article');
  //统计用户登录状态
  job.add('loginStatus');
  //统计第三方
  job.add('diYuanXin');
  //评论审核
  job.add("commentforcheck");
  job.add("adNoticeChannel");
  job.add("blogNotice");
  job.add("stylefix",3);
  // 广告
  job.add("showTB680_new");
  job.add('hotAdvertise_new');
  job.add("blogAppAd");
  job.add("scrollAd");
  job.add("tjAd_new", 3);   // 必须最后加载，广告套装
  job.add("trayTipsAd");
  // 相关博文广告位
  job.add('xgBlogAD');
  job.add('relatedBlogArticles');
  job.add('gotoTop');

 // job.add('dashang');
  job.start();
}
