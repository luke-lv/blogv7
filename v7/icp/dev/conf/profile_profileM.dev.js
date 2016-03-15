/**
 * @fileoverview 个人资料页(登录状态)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-12
 */
$import("lib/jobs.js");
$import("jobs/personal.js");
$import("jobs/tray.js");
$import("jobs/Comp_render_myprofile.js");
$import("jobs/subscribe.js");
// $import("jobs/write.js");

$import("jobs/getTplNum.js");
$import("jobs/flashtemplate.js");
$import('jobs/modifyTitle.js');
$import("jobs/modify_tip.js");
$import("jobs/spEdit_dire.js");
$import("jobs/templateClone.js");
$import("jobs/babyProfile.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

//推广链接广告
$import("jobs/trayTipsAd.js");

$import("jobs/cancelImportV.js");

$import("jobs/importV.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("babyProfile");
	job.add("subscribe");
	// job.add("write");
	job.add("personal");
	job.add("Comp_render");
	job.add("getTplNum");
	
	job.add("flashtemplate",3);
	job.add('modifytitle',3);
	job.add("templateClone", 3);
	job.add("modify_tip");
	job.add('spEdit');
	job.add("render_push");
	job.add("index");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	
	//育儿博客相框头图
	job.add("baby_headPhoto");

    job.add("cancelImportV", 3);
    job.add("importV", 3);
	job.start();
}