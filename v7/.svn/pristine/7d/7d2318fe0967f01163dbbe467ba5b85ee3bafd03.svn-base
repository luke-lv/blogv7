/**
 * @author darkty2009
 */

$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
//$import("jobs/write.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
$import("jobs/profile_guestbook.js");
$import("jobs/flashtemplate.js");
$import('jobs/modifyTitle.js');
$import("jobs/modify_tip.js");
$import("jobs/templateClone.js");
$import("jobs/baby_headPhoto.js");
//取消关注的tag
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

$import("jobs/report_guestBook.js");
$import("jobs/msg_panel.js");
$import("jobs/msg_reply.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("suda");
	job.add("tray");
    job.add("trayTipsAd");
    job.add("loginStatus");
	//job.add("write");
	job.add("profile_guestbook");
	job.add("modify_tip");
	job.add("flashtemplate",3);
	job.add("templateClone", 3);
	job.add('modifytitle',3);
	job.add("render_push");
	job.add("index");
	//个人中心改版后取消关注标签
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	
	job.add("report_guestBook");
	job.add("msg_panel");
	job.add("msg_reply"); 
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}
