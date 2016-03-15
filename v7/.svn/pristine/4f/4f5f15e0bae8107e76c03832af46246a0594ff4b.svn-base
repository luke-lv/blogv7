/**
 * @fileoverview
 * 	msn connect页面
 * @author Rui Luo || luorui1@staff.sina.com.cn
 */

$import("lib/jobs.js");
$import("lib/sendLog.js");
$import("jobs/tray.js");
$import("jobs/getTplNum.js");
$import("jobs/flashtemplate.js");
$import("jobs/navFolding.js");
// $import("jobs/write.js");
$import("jobs/connectMsn.js");
$import("jobs/Comp_render_push.js");
//取消关注的tag
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");
//为msn connect页面添加创建msn搬家引导浮层button
//$import("jobs/msnGuideButtonForMSNConnect.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main(){
	var job = new Jobs();
	job.add("tray");
    job.add("trayTipsAd");
    job.add("suda");
    job.add("loginStatus");
	job.add("getTplNum");
	// job.add("write");
	job.add("navFolding");
	job.add("flashtemplate",3);
	job.add("render_push");
	//为msn connect页面添加创建msn搬家引导浮层button
	//job.add("msnGuideButtonForMSNConnect");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	job.start();
}