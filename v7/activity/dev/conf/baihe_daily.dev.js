$import("lib/jobs.js");
$import("jobs/baihe/pageUserChange.js");
$import("jobs/baihe/pageLogin.js");
$import("jobs/baihe/nine_grid.js");
$import("jobs/baihe/shareDialog.js");
$import("jobs/baihe/openBlog.js");
$import("jobs/baihe/forceHappy.js");
$import("jobs/baihe/changeMoudle.js");


function main(){
	var job = new Jobs();
	job.add("detectUserChange");
	// job.add("pageLogin");
	job.add("nineGrid");
	// job.add("shareDialog");
	job.add("openBlog");
	job.add("forceHappy");
	job.add("changeMoudle");
	job.start();
}


