/**
 * @fileoverview 升级页面
 * @author xy xinyu@staff.sina.com.cn
 */


$import("lib/jobs.js");
$import("jobs/gradeswap.js");
$import("jobs/suda.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add('gradeswap');
     job.add("suda");
    // 统计用户登录状态过期
    job.add("loginStatus");
	job.start();
}