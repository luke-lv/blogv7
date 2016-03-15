/**
 * @author darkty2009
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/profile_attention.js");
$import("jobs/addAttention.js");
$import("jobs/phone_attention_add.js");
$import("jobs/phone_attention_cancel.js");
// $import("jobs/write.js");
$import("jobs/insertDynaMoban.js");
$import('jobs/modifyTitle.js');
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
$import("jobs/delAttentionTags.js");

$import("jobs/modify_tip.js");
$import("jobs/templateClone.js");
$import("jobs/baby_headPhoto.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");
$import("jobs/attenBlogerRank.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("attention");
	job.add("addAttention");
	job.add("phone_attention_add");
	job.add('modifytitle',3);
	job.add("templateClone", 3);
	job.add("phone_attention_cancel");
	// job.add("write");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	job.add("insertDynaMoban");
	job.add("modify_tip");
	job.add("render_push");
	job.add("index");
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}
