/**
 * @fileoverview
 *	404 页渲染托盘
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/login.js");
$import("jobs/errorRedirect.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
	job.add("login");
	job.add("errorRedirect");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
	job.start();
}