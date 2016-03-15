/**
 * @fileoverview
 *	配置搜人首页登录状态所需要的 Job 列表
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/spCompPush.js");
$import("jobs/spSearch.js");
$import("jobs/spSubscribe.js");
$import("jobs/addAttention.js");
$import("jobs/spSearchOpt.js");
$import("jobs/spIfNoBasicProfile.js");
$import("jobs/loginStatus.js");


// $import("jobs/templatePreview.js");
// $import("jobs/write.js");
// $import("jobs/Comp_render_index.js");
// $import("jobs/articleCategory.js");
// $import("jobs/localManager.js");
// $import('jobs/modifyTitle.js');
// $import('jobs/subscribe.js');
// $import("jobs/randomScroll.js");
// $import("jobs/editCustomComp.js");
// $import("jobs/advertise.js");
// $import("jobs/getTplNum.js");
// $import("jobs/editor/editor_imginsert.js");
// $import('jobs/readNumPlus.js');
// $import("jobs/fensi.js");
// $import("jobs/report_article.js");
// $import("jobs/flashtemplate.js");
// $import("jobs/quote_list_index.js");
// $import("jobs/imageLazyLoad.js");
// $import("jobs/widgetLazyLoad.js");
// $import("jobs/autoBlog.js");
// $import("jobs/timePad.js");
// $import("jobs/modify_tip.js");


function main(){
	var job = new Jobs();
	//job.add("templatePreview");
	job.add("tray");
	job.add('suda');
	job.add("spCompPush");
	job.add("spSearchOpt");
	job.add("spSearch");
	job.add("spSubscribe");
	job.add("addAttention");
	job.add("spIfNoBasicProfile");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
	//job.add("timePad");
	//job.add("autoBlog");
	//job.add("imageLazyLoad");
	//job.add("widgetLazyLoad");
	//job.add("getTplNum");
	//job.add("write");
	//job.add("Comp_render");
	//job.add("article_catedialog");
	//job.add("localManagerDialog");

	//job.add("quote_list_index");
	//job.add('modifytitle',3);
	//job.add('subscribe',3);
	//job.add('randomScroll',3);
	//job.add('editCustomComp');
	//job.add('renderAd');
	//job.add("editor_img");
	//job.add('readNumPlus');
	//job.add("fensi",3);
	//job.add("modify_tip");
	//job.add("report_article");
	//job.add("flashtemplate",3);
	job.start();
}