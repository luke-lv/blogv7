/**
 * @fileoverview
 *	登录帮助
 * @author Luo Rui | luorui1@staff.sina.com.cn
 *
 */
$import("lib/jobs.js");
$import("jobs/loginHelp.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
function main () {
	var job = new Jobs();
	job.add("loginHelp");
    job.add("suda");
    // 统计用户登录状态过期
    job.add("loginStatus");
	job.start();
}
