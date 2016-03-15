$import("lib/jobs.js");
$import("jobs/blogapp.js");

function main(){
	var job = new Jobs();
	job.add("blogapp");
	job.start();
}
