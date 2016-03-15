/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 博客用户赞助功能测试邀请页
 * @author jiangwei5@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/testInvite.js");
$import("jobs/suda.js");

function main(){
	var job = new Jobs();
	job.add("suda");
	job.add("testInvite");
	
    job.start();
}