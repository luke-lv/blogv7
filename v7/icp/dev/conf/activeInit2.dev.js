/**
 * chengwei1@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/activeInit2.js");
function main(){
	var job = new Jobs();
	job.add("suda");
	job.start();
}


