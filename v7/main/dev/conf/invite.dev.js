/**
 * @author darkty2009
 * 邀请好友
 */

// source file
$import('lib/jobs.js');

// job file
$import('jobs/suda.js');
$import('jobs/invite.js');
$import("jobs/loginStatus.js");

// main
function main() {
	var job = new Jobs();
	job.add("invite");
    job.add("suda");
    // 统计用户登录状态过期
    job.add("loginStatus");
	job.start();
}
