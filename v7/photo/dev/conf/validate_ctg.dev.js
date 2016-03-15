/**
 * @author shaomin | shaomin@staff.sina.com.cn
 */
$import("lib/jobs.js");
//$import("sina/module/login/init_loginUI.js");
//$import("jobs/pageSet.js");
$import("jobs/tray.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("loginStatus");

//	job.add("init_loginUI");
//	job.add("pageSet");
	job.start();
}
