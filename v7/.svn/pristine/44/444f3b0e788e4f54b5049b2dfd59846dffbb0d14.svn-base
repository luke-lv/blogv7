/**
 * @auth	dcw1123
 * @desc	msn 登录（这个 job 带绑定流程）
 */
$import("jobs/msnLogin2.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
function main(){
	var job = new Jobs();
	job.add("msnLogin2");
    job.add("suda");
    // 统计用户登录状态过期
    job.add("loginStatus");
	
	job.start();
}

