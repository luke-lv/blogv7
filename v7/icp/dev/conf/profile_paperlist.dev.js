/**
 * @author darkty2009
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/paperlist.js");
//$import("jobs/write.js");
$import('jobs/modifyTitle.js');
$import("jobs/insertDynaMoban.js");
$import("jobs/modify_tip.js");
$import("jobs/templateClone.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/report_icpPaperlist.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");
$import("jobs/msg_panel.js");
$import("jobs/msg_paper.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("suda");
	job.add("tray");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add('modifytitle');
	//job.add("write");
	job.add("paperlist");
	job.add("insertDynaMoban");
	job.add("modify_tip");
	job.add("report_icpPaperlist");
	job.add("templateClone", 3);
	job.add("render_push");
	job.add("index");
	job.add("msg_panel");	
	job.add("msg_paper");  
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}
