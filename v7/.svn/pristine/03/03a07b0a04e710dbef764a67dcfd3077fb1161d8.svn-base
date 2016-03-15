/**
 * @fileoverview
 * 	msn绑定的页面
 * @author xy xinyu@staff.sina.com.cn
 * @date 2010-06-10 
 */

$import("lib/jobs.js");
$import("lib/sendLog.js");
$import("jobs/tray.js");
$import("jobs/getTplNum.js");
$import("jobs/flashtemplate.js");
$import("jobs/navFolding.js");
$import("jobs/bindmsn.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("loginStatus");
	job.add("getTplNum");
	job.add("bindmsn");
	job.add("navFolding");
	job.add("flashtemplate",3);
	job.start();
}

