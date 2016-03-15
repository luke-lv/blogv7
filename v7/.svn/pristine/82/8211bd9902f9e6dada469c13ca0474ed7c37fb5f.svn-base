/**
 * @fileoverview
 *	新个人中心——相册评论
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */

$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/commlist.js");
$import('jobs/modifyTitle.js');
$import("jobs/insertDynaMoban.js");
$import("jobs/report_icpPhotoComment.js");

$import("jobs/modify_tip.js");
$import("jobs/templateClone.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");

$import("jobs/msg_panel.js");
$import("jobs/msg_comment.js");

//取消关注的tag
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

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
	job.add("commlist");
	job.add("insertDynaMoban");
	job.add("report_icpPhotoComment");
	job.add("render_push");
	job.add("index");
	job.add("modify_tip");
	job.add("templateClone", 3);
	job.add("msg_panel");
	job.add("msg_comment");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	//育儿博客相框头图
	job.add("baby_headPhoto");
	
	job.start();
}
