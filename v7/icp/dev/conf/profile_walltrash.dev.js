/**
 * @fileoverview 留言垃圾箱
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-12-25
 */

$import("lib/jobs.js");
$import("jobs/tray.js");
// $import("jobs/write.js");
$import("jobs/guestBookSpam.js");
$import('jobs/modifyTitle.js');
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
$import("jobs/insertDynaMoban.js");
$import("jobs/modify_tip.js");
$import("jobs/templateClone.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

$import("jobs/report_guestBook.js");
$import("jobs/msg_panel.js");
$import("jobs/msg_guestBooktrash.js");
$import("jobs/suda.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
	// job.add("write");
	job.add("guestBookSpam");
	job.add("insertDynaMoban");
	job.add('modifytitle',3);
	job.add("render_push");
	job.add("index");
	job.add("modify_tip");
	job.add("templateClone", 3);
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	
	job.add("report_guestBook");
	job.add("msg_panel");
	job.add("msg_guestBooktrash"); 
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	
	job.start();
}
