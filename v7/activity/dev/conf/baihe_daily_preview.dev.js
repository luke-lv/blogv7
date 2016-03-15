$import("lib/jobs.js");
$import("jobs/baihe/pageUserChange.js");
$import("jobs/baihe/pageLogin.js");
$import("jobs/baihe/pubPreview.js");
$import("jobs/baihe/shareDialog.js");
$import("jobs/baihe/openBlog.js");
$import("jobs/baihe/forceHappy.js");

function main(){
	var job = new Jobs();
	job.add("detectUserChange");
	// job.add("pageLogin");
	job.add("pubPreview");
	// job.add("shareDialog");
	job.add("openBlog");
	job.add("forceHappy");
	
	job.start();
}


