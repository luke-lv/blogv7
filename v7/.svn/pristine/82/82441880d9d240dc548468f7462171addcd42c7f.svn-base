/**
 * @fileoverview 影视博客app 好友的电影
 * @author wujian wujian@staff.sina.com.cn
 * @create 2010-12-27
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/Comp_render_push.js");
$import("jobs/Comp_clone.js");
$import("jobs/insertDynaMoban.js");
$import("jobs/modifyTitle.js");
// $import("jobs/addWeibo.js");
$import("jobs/templateClone.js");
$import("jobs/modify_tip.js");
$import("jobs/dynaRecomm.js");
$import("jobs/baby_headPhoto.js");

//左侧 导航折叠
$import('jobs/navFolding.js');
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");

$import("jobs/filmBlog/search.js");
$import("jobs/filmBlog/getFrdFilmList.js");
$import("jobs/filmBlog/addFrd.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("suda");
	job.add("tray");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add('modifytitle',3);
	job.add("dynaRecomm");
	//左侧导航 折叠
	job.add("navFolding");
	
	//job.add("addAttention");
	job.add("render_push");
	job.add("insertDynaMoban");
	// job.add("addWeibo");
	job.add("templateClone", 3);
	job.add("modify_tip");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	
	job.add("search");
	job.add("getFrdFilmList");
	job.add("addFrd");
	job.start();
}