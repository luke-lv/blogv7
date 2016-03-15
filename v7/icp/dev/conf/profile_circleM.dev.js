/**
 * @fileoverview 圈子页(登录状态)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-24
 */

$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/cancelGroup.js");
$import("jobs/subscribe.js");
// $import("jobs/write.js");
$import('jobs/modifyTitle.js');

$import("jobs/getTplNum.js");
$import("jobs/flashtemplate.js");
$import("jobs/modify_tip.js");
$import("jobs/templateClone.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("subscribe");
	// job.add("write");
	job.add("cancelGroup");
	job.add("getTplNum");
	job.add("templateClone", 3);
	job.add("modify_tip");
	job.add('modifytitle',3);
	
	job.add("flashtemplate",3);
	job.add("render_push");
	job.add("index");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}
