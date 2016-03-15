/**
 * @fileoverview
 *	搬家页面 Job 列表
 * @author Luorui | luorui1@staff.sina.com.cn
 * @updated dcw1123 | chengwei1@staff.sina.com.cn
 * @version 1.1
 * @history
 *
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/blogMoveUpfile.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/sysmsg.js");
$import("lib/msg/systemMSG.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add('suda');
	job.add("tray");
	job.add("blogMoveUpfile");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
	job.start();
}

