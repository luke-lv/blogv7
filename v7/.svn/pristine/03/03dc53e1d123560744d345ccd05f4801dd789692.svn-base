/**
 * @fileoverview 页面设置的main文件
 * @author xinyu@staff.sina.com.cn
 * @date 2009-08-06
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/checkAccount.js");
$import('jobs/showPageSetJob.js');
$import('jobs/pagesetTabJob.js');
$import("jobs/tray.js");
$import('jobs/dragComponentsJob.js');
$import("jobs/Comp_render_pageset.js");
$import('jobs/modifyTitle.js');
$import("jobs/editor/editor_imginsert.js");
$import("jobs/insertMoban.js");
$import('jobs/readNumPlus.js');
$import("jobs/fensi.js");
$import("jobs/dragTitandNv.js");
$import("jobs/imageLazyLoad.js");
$import("jobs/widgetLazyLoad.js");
$import("jobs/baby_headPhotoEditorDialog.js");

$import("jobs/rssLog.js");
$import("jobs/digger.js");
$import("jobs/static.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("suda");
	job.add('showPageSet');
    job.add("checkAccount");
	job.add("tray");
	job.add("digger");
	job.add("imageLazyLoad");
	job.add("widgetLazyLoad");
	job.add('dragComponentsJob');
	job.add('pagesetTabJob');
	job.add('modifytitle');
	job.add("Comp_render");
	job.add("editor_img");
	job.add("insertMoban");
	job.add('readNumPlus');

	job.add('dragTitandNv',3);
	job.add("fensi",3);
	job.add('rssLog');
	
	//育儿博客宝宝头图及编辑
	job.add("baby_headPhotoEditorDialog");
	
	//统计用户行为布码
	job.add("static");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
	job.start();
}
