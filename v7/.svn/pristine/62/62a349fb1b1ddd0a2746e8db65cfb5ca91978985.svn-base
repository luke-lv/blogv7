/**
 * @author darkty2009
 */

$import("lib/jobs.js");
$import("lib/sendLog.js");
$import("jobs/tray.js");
$import("jobs/getTplNum.js");
$import("jobs/flashtemplate.js");
$import("jobs/navFolding.js");
// $import("jobs/write.js");
$import("jobs/tbind.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/Comp_render_push.js");
//取消关注的tag
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("getTplNum");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	// job.add("write");
	job.add("tbind");
	job.add("render_push");
	job.add("navFolding");
	job.add("flashtemplate",3);
	job.start();
}
