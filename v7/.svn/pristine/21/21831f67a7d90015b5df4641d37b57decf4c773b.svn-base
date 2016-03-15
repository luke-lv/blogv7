/**
 * @author xs | zhenhau1@staff.sina.com.cn
 * @desc 
 */
//- source file -
$import("lib/jobs.js");
$import("jobs/editor/write_v.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
//- main -
function main(){
	var indexJob = new Jobs();
	indexJob.add("initClass");
	indexJob.add("initElements");
	indexJob.add("initEvents");
	indexJob.add("suda");
    // 统计用户登录状态过期
    indexJob.add("loginStatus");

	indexJob.start();
}