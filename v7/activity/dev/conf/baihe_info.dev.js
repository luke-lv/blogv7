
$import("lib/jobs.js");
$import("jobs/baihe/pageLogin.js");
$import("jobs/baihe/shareDialog.js");
$import("jobs/baihe/openBlog.js");
$import("jobs/baihe/info_luckyBtn.js");
$import("jobs/baihe/pageUserChange.js");
$import("jobs/baihe/iGo.js");
$import("jobs/baihe/forceHappy.js");


function main(){
	var job = new Jobs();
	job.add("detectUserChange");
	job.add("pageLogin");
	job.add("shareDialog");
	job.add("openBlog");
	job.add("info_luckyBtn");
	job.add("iGo");
	job.add("forceHappy");
	
	job.start();
}

