/**
 * @fileoverview
 *	文章列表页登录状态
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
$import("jobs/tray.js");
$import("jobs/Comp_render_articlelistM.js");
$import("jobs/articleCategory.js");
$import('jobs/modifyTitle.js');
$import("jobs/write.js");
$import("jobs/randomScroll.js");
$import("jobs/addManageToModule7.js");
$import("jobs/addManageToArticleList.js");
$import("jobs/getTplNum.js");

$import("jobs/searchbox_Limit.js");
$import('jobs/readNumPlus.js');
$import("jobs/flashtemplate.js");
$import("jobs/templateClone.js");
$import("jobs/blogListCancelMore.js");
$import("jobs/baby_headPhotoEditorDialog.js");

$import("jobs/modify_tip.js");
$import("jobs/suda.js");

$import("jobs/static.js");
$import("jobs/errorTips.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/blog365/calendarHover.js");
$import("jobs/xssDetect.js");
$import("lib/component/blog365/templateCanlendar.js");
$import("jobs/bloglistTaobaoAd.js");
//博客下线模版公告
$import("jobs/adNoticeChannel.js");
$import("jobs/blogNotice.js");
//缔元信布码，第三方的
$import("jobs/diYuanXin.js");

$import("jobs/loginStatus.js");
$import("jobs/blogAppAd.js");

//如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe
// $import("jobs/searchToQing.js");

function main () {
	var job = new Jobs();
	job.add('suda');
	job.add("tray");
    job.add("trayTipsAd");
	job.add("getTplNum");
	job.add("Comp_render");
	job.add("article_catedialog");
	job.add('modifytitle',3);
    job.add("write");
	job.add('randomScroll',3);
	job.add("templateClone" ,3);
	job.add("addManageToModule7");
	job.add("addManageToArticleList");
	job.add("blogListCancelMore");
	job.add("searchbox_Limit");
	job.add('readNumPlus');
	job.add("modify_tip");
	job.add("flashtemplate",3);
	job.add('bloglistTaobaoAd');
	
	//育儿博客宝宝头图及编辑
	job.add("baby_headPhotoEditorDialog");
    job.add("errorTips");
	//统计用户行为布码
	job.add("static");
    // 博客365日历hover效果
	job.add("calendarHover");
	//博客下线模版公告
	job.add("adNoticeChannel");
	job.add("blogNotice");
	
    // 嵌入iframe和script XSS攻击检查
    job.add("userDetect", 3);
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.add("diYuanXin");
	job.add("blogAppAd");

    // job.add("searchToQing", 3);
    
	job.start();
}
