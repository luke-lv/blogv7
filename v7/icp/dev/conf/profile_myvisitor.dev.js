/**
 * @fileoverview 我的访客页面
 * @author zhihan | zhihan@staff.sina.com.cn
 * @created 2010-5-5
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
// $import("jobs/write.js");
$import("jobs/insertDynaMoban.js");
$import('jobs/modifyTitle.js');
$import("jobs/autoBlog.js");
$import("jobs/modify_tip.js");
$import("jobs/visitor_tip.js");
$import("lib/component/deleteVisitByUid.js");
$import("jobs/addAttention.js");
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
	job.add("autoBlog");
	// job.add("write");
	job.add("insertDynaMoban");
	job.add('modifytitle',3);
	job.add("modify_tip");
	job.add("visitor_tip");
	job.add("addAttention");
	job.add("render_push");
	job.add("index");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}
