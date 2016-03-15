/**
 * @fileoverview
 *	登录绑定百度账号
 * @author Liu Xiaoyue | weixiao909@gmail.com
 * @version 1.0
 * @Date 2011-12-29
 * @history
 *
 */
$import("lib/jobs.js");
$import("jobs/bindBaidu.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main() {
	var job = new Jobs();
	job.add("bindBaidu");
    job.add("suda");
    // 统计用户登录状态过期
    job.add("loginStatus");
	job.start();
}
