$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/editor/add_image.js");
$import("jobs/rssLog.js");
$import("jobs/loginStatus.js");
function main(){
    var job = new Jobs();
    job.add("suda");
	job.add("add_image");
	job.add("rssLog");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.start();

}

function exeute(){
   	var job = new Jobs();

	job.start();
}
