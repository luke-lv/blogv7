
$import("lib/jobs.js");
$import("jobs/baihe/iGo.js");
$import("jobs/baihe/pageLogin.js");
$import("jobs/baihe/index_luckyBtn.js");
$import("jobs/baihe/openBlog.js");
$import("jobs/baihe/shareDialog.js");
$import("jobs/baihe/index_slide.js");
$import("jobs/baihe/pageUserChange.js");
$import("jobs/baihe/forceHappy.js");
$import("jobs/baihe/offlineAlert.js");

function main(){
	var job = new Jobs();
	job.add("offlineAlert");
	job.add("detectUserChange");
	job.add("iGo");
	job.add("openBlog");
	// job.add("pageLogin");
	job.add("luckyBtn");
	// job.add("shareDialog");
	// job.add("index_slide");
	job.add("forceHappy");
	
	job.start();
}


