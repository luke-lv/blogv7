/**
 * @fileoverview
 *  配置博客首页登录状态所需要的 Job 列表
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/templatePreview.js");
$import("jobs/tray.js");
$import("jobs/write.js");
$import("jobs/Comp_render_index.js");
$import("jobs/articleCategory.js");
$import("jobs/localManager.js");
$import('jobs/modifyTitle.js');
$import('jobs/subscribe.js');
$import("jobs/randomScroll.js");
$import("jobs/editCustomComp.js");
$import("jobs/advertise.js");
$import("jobs/getTplNum.js");
$import("jobs/templateClone.js");
$import("jobs/editor/editor_imginsert.js");
$import('jobs/readNumPlus.js');
$import("jobs/fensi.js");
$import("jobs/680job.js");
$import("jobs/report_article.js");
$import("jobs/flashtemplate.js");
$import("jobs/quote_list_index.js");
$import("jobs/imageLazyLoad.js");
$import("jobs/widgetLazyLoad.js");
$import("jobs/miniBlogAttention.js");
$import("jobs/baby_headPhotoEditorDialog.js");

$import("jobs/modify_tip.js");
$import("jobs/rssLog.js");
$import("jobs/digger.js");
$import("jobs/baike.js");
$import("jobs/static.js");
$import("jobs/weicaopanLayer.js");

$import("jobs/baikeComponentCount.js");

$import("jobs/yueku.js");

$import("jobs/tranVideo.js");

//分享 博客首页图片到微博
$import("jobs/sharePhoto.js");

//msn搬家引导
//$import("jobs/msnGuide.js");

//增加测试统计
$import("jobs/zoneStatic.js");

$import("jobs/errorTips.js");
//推广链接广告
$import("jobs/trayTipsAd.js");

//博客下线模版公告
$import("jobs/adNoticeChannel.js");
$import("jobs/blogNotice.js");
//博文转载到Qing
$import("jobs/renderReblogDiv.js");
//图片幻灯片
$import("jobs/showSlideBox.js");
$import("jobs/oslink/osl_index.js");
$import("lib/component/blog365/templateCanlendar.js");
$import("jobs/loginStatus.js");
$import("lib/sendLog.js");
$import("jobs/diYuanXin.js");
//pad版本切换
$import("jobs/padSwitch.js");
$import("jobs/blogAppAd.js");
$import("jobs/articleMaxImg.js");

//如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe
// $import("jobs/searchToQing.js");

//增加博客十周年入口
$import("jobs/article_10years_suda.js");

function main(){
  v7sendLog('42_01_10');
  var job = new Jobs();
    job.add("templatePreview");
  job.add("tray");
  job.add('suda');
    job.add("trayTipsAd");

  job.add('renderAd');
  job.add("digger");
  
  job.add('articleMaxImg');
  job.add("imageLazyLoad");
  job.add("widgetLazyLoad");
  job.add("getTplNum");
  job.add("write");
  job.add("Comp_render");
  job.add("article_catedialog");
  job.add("localManagerDialog");
  job.add("quote_list_index");

  //分享博文中的图片到微博
  job.add("sharePhoto");
  
  job.add('modifytitle',3);
  job.add('subscribe',3);
  job.add('randomScroll',3);
  job.add("templateClone", 3);
  job.add('editCustomComp');
  job.add("editor_img");
  job.add('readNumPlus');
  job.add("fensi",3);
  job.add("680job");
  job.add("modify_tip");
  job.add("report_article");
  job.add("flashtemplate",3);
  job.add("rssLog");
    //微操盘浮层
  job.add("weicaopanLayer");
  
  //关注"博客头条"的微博
  job.add("miniBlogAttention");
  
  //育儿博客宝宝头图及编辑
  job.add("baby_headPhotoEditorDialog");
  
  //提醒部分名人使用百科组件
  job.add("baike");
  //百科组建出现次数布码
  job.add("baikeComponentCount");
  
  //新音乐组件
  job.add("yueku");
  
  //统计用户行为布码
  job.add("static");
  
  //msn搬家引导
  //job.add("msnGuide");

  //增加测试统计
  job.add("toZoneStatic",3);
  
  job.add("errorTips");
  job.add('tranVideo');

  //博文转载到Qing
  job.add("renderReblogDiv");

  //博客下线模版公告
  job.add("adNoticeChannel");
  job.add("blogNotice");
  
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
