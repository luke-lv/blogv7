
$import("lib/jobs.js");
$import("jobs/baihe/runTest.js");
$import("jobs/baihe/pageLogin.js");
$import("jobs/baihe/shareDialog.js");
$import("jobs/baihe/result_toReg.js");
$import("jobs/baihe/openBlog.js");
$import("jobs/baihe/share.js");
$import("jobs/baihe/pageUserChange.js");
$import("jobs/baihe/forceHappy.js");

function main(){
	var job = new Jobs();
	job.add("detectUserChange");
	job.add("pageLogin");
	job.add("openBlog");
	job.add("runTest");
	job.add("shareDialog");
	job.add("result_toReg");
	job.add("share");
	job.add("forceHappy");
	
	job.start();
}

