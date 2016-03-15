
$import("lib/jobs.js");
$import("jobs/baihe/pageLogin.js");
$import("jobs/baihe/shareDialog.js");
$import("jobs/baihe/happyDialog.js");
$import("jobs/baihe/openBlog.js");
$import("jobs/baihe/lucky_slide.js");
$import("jobs/baihe/pageUserChange.js");
$import("jobs/baihe/forceHappy.js");
$import("jobs/baihe/offlineAlert.js");


function main(){
	var job = new Jobs();
	job.add("offlineAlert");
	job.add("detectUserChange");
	// job.add("pageLogin");
	job.add("openBlog");
	// job.add("shareDialog");
	job.add("happyDialog");		// 含 gladDialog
	job.add("luckySlide");
	job.add("forceHappy");
	
	
	job.start();
}



