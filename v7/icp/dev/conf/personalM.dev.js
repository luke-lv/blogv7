/**
 * @fileoverview 个人资料页(登录状态)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-12
 */
$import("lib/jobs.js");
$import("jobs/personal.js");
$import("jobs/tray.js");
$import("jobs/Comp_render_myprofile.js");
$import("jobs/guestBook.js");
$import("jobs/subscribe.js");
$import("jobs/writeblog.js");// 发博文

$import('jobs/modifyTitle.js');
$import("jobs/getTplNum.js");
$import("jobs/templateClone.js");
$import("jobs/report_guestBook.js");
$import("jobs/index.js");
$import("jobs/flashtemplate.js");
$import("jobs/modify_tip.js");
$import("jobs/diggerAction.js");
$import("component/include/cloneComponent.js");
$import("jobs/suda.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/clickMore.js");
$import("jobs/imageLazyLoad.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("lib/component/blog365/templateCanlendar.js");
$import("jobs/loginStatus.js");
$import("jobs/diYuanXin.js");

$import("jobs/searchToQing.js");

function main(){
	var job = new Jobs();
	job.add("tray");
    job.add("trayTipsAd");
    job.add('suda');
    job.add("loginStatus");
	job.add("imageLazyLoad");
	job.add("diggerAction");
	job.add("subscribe");
	job.add("writeblog");
	job.add("personal");
	job.add("Comp_render");
	job.add("guestBook");
	job.add("getTplNum");
	
	job.add('modifytitle',3);
	job.add("modify_tip");
	job.add("templateClone", 3);
	job.add("report_guestBook");
	job.add("index");
	job.add("flashtemplate",3);
	job.add('clickMore');
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.add("diYuanXin");

	job.add("searchToQing");

	job.start();
}