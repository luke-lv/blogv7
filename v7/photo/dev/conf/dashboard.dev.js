/**
 * 
 * @author Administrator
 */
$import("lib/jobs.js");
$import("jobs/tray.js");

$import('jobs/subscribe.js');
$import("jobs/baby_headPhoto.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
function main(){
	var job = new Jobs();
	job.add("tray");
    job.add("loginStatus");
    job.add("suda");
	
	job.add('subscribe');
		
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}
