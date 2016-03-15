/**
 * @auth	dcw1123
 * @desc	msn 登录
 */
$import("jobs/msnLogin.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
function main(){
	var job = new Jobs();
	job.add("msnLogin");
    job.add("suda");
    // 统计用户登录状态过期
    job.add("loginStatus");
	
	job.start();
}

