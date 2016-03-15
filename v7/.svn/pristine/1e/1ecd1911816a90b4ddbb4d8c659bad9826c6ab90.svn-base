/**
 * @author changchuan@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/cloneBaike.js");
$import("jobs/Comp_render_push.js");
$import("jobs/index.js");
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

$import("jobs/noteManage.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("tray");
    job.add("trayTipsAd");
    job.add("suda");
    job.add("loginStatus");
	job.add("noteManage");
	job.add("render_push");
	job.add("index");
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	
	//名人用户试用百科组件
	job.add("cloneBaike");
	job.start();
}