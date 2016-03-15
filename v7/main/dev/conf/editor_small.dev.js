$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/editor/small_editor.js");
$import("jobs/loginStatus.js");

function main(){
    var job = new Jobs();
	job.add("small_editor");
    job.add("suda");
    // 统计用户登录状态过期
    job.add("loginStatus");

    job.start();

}

function exeute(){
   	var job = new Jobs();

	job.start();
}
