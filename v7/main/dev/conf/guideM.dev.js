/**
 * @fileoverview 用户向导的main文件
 * @author xinyu@staff.sina.com.cn
 * @date 2009-10-19
 */
$import("lib/jobs.js");
$import('jobs/suda.js');
$import("jobs/tray.js");
$import("jobs/guideM.js");
$import('jobs/dragComponentsJob.js');
$import("jobs/Comp_render_pageset.js");
$import("jobs/editor/editor_imginsert.js");
$import("jobs/insertMoban.js");
$import('jobs/modifyTitle.js');
$import('jobs/readNumPlus.js');
$import("jobs/dragTitandNv.js");
$import("jobs/imageLazyLoad.js");
$import("jobs/widgetLazyLoad.js");

$import("jobs/modify_tip.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("guideM");
	job.add("tray");
	job.add("suda");
	job.add("imageLazyLoad");
	job.add("widgetLazyLoad");
	job.add('dragComponentsJob');
	job.add("Comp_render");
	job.add('modifytitle');
	job.add("editor_img");
	job.add("insertMoban");
	job.add('readNumPlus');
	job.add("modify_tip");
	job.add('dragTitandNv',3);
    
    // 统计用户登录状态过期
    job.add("loginStatus");
	job.start();
}
