/**
 * @fileoverview 此文件是应用于关注tag页面
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created     2012-08-10
 * @vertion 0.01
 */
$import("lib/jobs.js");
$import("jobs/tray.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
//推广链接广告
$import("jobs/trayTipsAd.js")
//取消关注的tag
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main() {
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("index");
	job.add("render_push");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	
	job.start();
}