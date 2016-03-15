/**
 * @fileoverview
 *  配置博客首页未登录状态所需要的 Job 列表
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/Comp_render_index.js");
$import("jobs/Comp_clone.js");
$import("jobs/recordVisitor.js");
$import('jobs/subscribe.js');
$import("jobs/randomScroll.js");
$import("jobs/advertise.js");
$import("jobs/getTplNum.js");
$import("jobs/templateClone.js");
$import('jobs/readNumPlus.js');
$import("jobs/phone_attention_add.js");
$import("jobs/fensi.js");
$import("jobs/680job.js");
$import("jobs/report_article.js");
$import("jobs/flashtemplate.js");
$import("jobs/imageLazyLoad.js");
$import("jobs/widgetLazyLoad.js");
$import("jobs/quote_list_index.js");
$import("jobs/quote_index.js");
$import("jobs/renderReblogDiv.js");

$import("jobs/imageLazyLoad.js");
$import("jobs/widgetLazyLoad.js");
$import("jobs/miniBlogAttention.js");
$import("jobs/baby_headPhoto.js");

$import("jobs/stylefix.js");
$import("jobs/toolbar.js");
$import("jobs/rssLog.js");
$import("jobs/digger.js");
$import("jobs/static.js");
$import("jobs/baikeComponentCount.js");

//分享 博客首页图片到微博
$import("jobs/sharePhoto.js");
//自动加官博关注
$import("jobs/SinglesDay.js");

//博客下线模版公告
$import("jobs/adNoticeChannel.js");
$import("jobs/blogNotice.js");

//显示MSN FEED回流用户浮层
//$import("jobs/msnFeedFloatLayer.js");

//增加测试统计
$import("jobs/zoneStatic.js");
$import("jobs/tranVideo.js");
$import("jobs/errorTips.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
//图片幻灯片
$import("jobs/showSlideBox.js");
$import("jobs/oslink/osl_index.js");
$import("lib/component/blog365/templateCanlendar.js");
$import("jobs/loginStatus.js");
$import("lib/sendLog.js");
$import("jobs/diYuanXin.js");
//pad版本切换
$import("jobs/padSwitch.js");

//如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe
// $import("jobs/searchToQing.js");

//用户赞助功能
//$import("jobs/userSponsor.js");
$import("jobs/blogAppAd.js");
$import("jobs/articleMaxImg.js");

//增加博客十周年入口
$import("jobs/article_10years_suda.js");

function main(){
  v7sendLog('42_01_10');
  var job = new Jobs();
  job.add("tray");
  job.add('suda');
    job.add("trayTipsAd");
  job.add('renderAd');
  job.add("digger");
  
  job.add('articleMaxImg');
  job.add("imageLazyLoad");
  job.add("widgetLazyLoad");
  job.add("phone_attention_add");
  job.add("getTplNum");
  job.add("recordVisitor");
    job.add("renderReblogDiv");
  //徽章
  job.add("Comp_render");
  job.add("Comp_clone");
  job.add("quote_list_index");
  job.add("quote_index");

  //分享博文中的图片到微博
  job.add("sharePhoto");
  
  job.add('subscribe',3);
  job.add('randomScroll',3);
  job.add("templateClone", 3);
  job.add('readNumPlus');
  job.add("fensi",3);
  job.add("680job");
  job.add("toolbar");
  job.add("report_article");
  job.add("flashtemplate",3);
  job.add("stylefix",3);
  job.add("rssLog");
  
  //关注"博客头条"的微博
  job.add("miniBlogAttention");
  //百科组建出现次数布码
  job.add("baikeComponentCount");
  
  //育儿博客相框头图显示
  job.add("baby_headPhoto");
  
  //博客用户赞助功能 wjw 赞助下线 2014-04-28
    // job.add("userSponsor");
    
  //博客下线模版公告
  job.add("adNoticeChannel");
  job.add("blogNotice");
  
  //统计用户行为布码
  job.add("static");
  
  //自动加官博关注
  job.add("SinglesDay");
  
  //点MSN FEED回流用户 显示浮层
  //job.add("msnFeedFloatLayer");

  //增加测试统计
  job.add("toZoneStatic",3);
  
  job.add("errorTips");
  job.add("tranVideo");
    job.add("showSlideBox");
    //外链统计
    job.add("osl_index", 3);
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.add("diYuanXin");
    //pad版本切换
    job.add("padSwitch");
  job.add("blogAppAd");

    // job.add("searchToQing", 3);
  //十周年
  job.add('article_10years_suda');
  job.start();
}
