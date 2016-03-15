/**
 * @fileoverview 外域邮箱注册
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/jobs.js");
$import("jobs/reg/outerDomain.js");

function main(){
	var job = new Jobs();
	job.add("outerDomain");
	job.start();
}