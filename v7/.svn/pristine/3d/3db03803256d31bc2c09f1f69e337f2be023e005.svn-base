/**
 * @fileoverview 博主分成项目活动
 * @author Edwin | zhihang1@staff.sina.com.cn
 * @created 2014-10-20
 */

$import("lib/jobs.js");
$import("lib/sendLog.js");
$import("jobs/tray.js");
//推广链接广告
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
// 主要逻辑代码
$import("jobs/adapply.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("loginStatus");
	// 以上是以前加入的必要代码，以下为主要逻辑代码
	job.add("adapply");
	job.start();
}