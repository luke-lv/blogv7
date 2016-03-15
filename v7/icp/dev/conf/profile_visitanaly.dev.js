/**
 * @fileoverview 访问统计页面
 * @author 武建 zouwujian@sina.com 
 * @created 2010-5-5
 */
$import("lib/jobs.js");
$import("jobs/tray.js");
$import("jobs/insertDynaMoban.js");
$import('jobs/modifyTitle.js');
$import("jobs/autoBlog.js");
$import("jobs/modify_tip.js");
$import("jobs/visite_count.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("autoBlog");
	job.add("insertDynaMoban");
	job.add('modifytitle',3);
	job.add("modify_tip");
	job.add("visite_count");
	job.add("render_push");
	job.add("index");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}
