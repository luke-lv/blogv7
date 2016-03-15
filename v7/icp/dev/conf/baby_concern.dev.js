// JavaScript Document
$import("lib/jobs.js");
$import("jobs/baby_concern.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main(){
	var job = new Jobs();
	job.add("baby_concern");
	job.add("suda");
    job.add("loginStatus");
	job.start();	
	
}