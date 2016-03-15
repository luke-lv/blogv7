/**
 * @fileoverview
 *	文章列表页登录状态 --特色博文之影视博文系列
 * @author wujian | wujian@staff.sina.com.cn
 *
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
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
//$import("jobs/blogListCancelMore.js");
$import("jobs/baby_headPhotoEditorDialog.js");

$import("jobs/modify_tip.js");
$import("jobs/static.js");
//推广链接广告
$import("jobs/adNoticeChannel.js");
$import("jobs/trayTipsAd.js");
$import("lib/component/blog365/templateCanlendar.js");
$import("jobs/loginStatus.js");
//缔元信布码，第三方的
$import("jobs/diYuanXin.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add('suda');
	job.add("adNoticeChannel");
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
	//job.add("blogListCancelMore");
	job.add("searchbox_Limit");
	job.add('readNumPlus');
	job.add("modify_tip");
	job.add("flashtemplate",3);
	
	//育儿博客宝宝头图及编辑
	job.add("baby_headPhotoEditorDialog");
	//统计用户行为布码
	job.add("static");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.add("diYuanXin");
	job.start();
}
