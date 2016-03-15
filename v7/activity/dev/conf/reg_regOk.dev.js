/**
 * @fileoverview 注册成功页面
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/jobs.js");
$import("jobs/reg/regOk.js");

function main(){
	var job = new Jobs();
	job.add("regOk");
	job.start();
}