/**
 * 
 * @author Administrator
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
//$import("sina/module/login/init_loginUI.js");
//$import("jobs/pageSet.js");
$import("jobs/loginStatus.js");
function main(){
	var job = new Jobs();
	job.add("suda");
    job.add("loginStatus");
//	job.add("init_loginUI");
//	job.add("pageSet");
	job.start();
}
