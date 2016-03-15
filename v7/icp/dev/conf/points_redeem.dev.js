/**
 * @author darkty2009
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
//推广链接广告
$import("jobs/trayTipsAd.js")
//取消关注的tag
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");
$import("jobs/loginStatus.js");
$import("jobs/pointsRedeem.js");

function main() {
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
    
    job.add("pointsRedeem");
    
	job.add("render_push");
	job.add("index");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	job.start();
}