// JavaScript Document
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/baby_open.js");
$import("jobs/baby_info.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("suda");
	job.add("baby_open");
	job.add("baby_info");
    job.add("loginStatus");
	job.start();	
};