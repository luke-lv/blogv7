/**
 * @author darkty2009
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
//$import("jobs/write.js");
$import("jobs/invitelist.js");
$import("jobs/insertDynaMoban.js");
$import("jobs/report_friend.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

//$import('jobs/navFolding.js');
$import('jobs/modifyTitle.js');
$import("jobs/modify_tip.js");
$import("jobs/templateClone.js");
$import("jobs/baby_headPhoto.js");

$import("lib/component/include/invite.js");
$import("lib/component/include/attention.js");

$import("jobs/msg_sysmsg.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
//	job.add("write");
	job.add("invitelist");
	job.add("insertDynaMoban");
	job.add("modify_tip");
	job.add("templateClone", 3);
	job.add('modifytitle',3);
//	job.add("navFolding");
	job.add("report_friend");
	job.add("render_push");
	job.add("index");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	job.add("msg_sysmsg");
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}