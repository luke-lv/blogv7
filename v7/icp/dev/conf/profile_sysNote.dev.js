/**
 * @author darkty2009
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
//$import("jobs/write.js");
$import("jobs/insertDynaMoban.js");
$import('jobs/modifyTitle.js');
$import("jobs/modify_tip.js");
$import("jobs/templateClone.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/cloneBaike.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

$import("jobs/invitelist.js");
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
	//job.add("write");
	job.add("insertDynaMoban");
	job.add("templateClone", 3);
	job.add('modifytitle',3);
	job.add("modify_tip");
	job.add("render_push");
	job.add("index");
	job.add("invitelist");
	job.add("msg_sysmsg");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	//育儿博客相框头图
	job.add("baby_headPhoto");
	
	//名人用户试用百科组件
	job.add("cloneBaike");
	job.start();
}
