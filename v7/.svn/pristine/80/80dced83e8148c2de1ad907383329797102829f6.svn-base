/**
 * zhihan@staff.sina.com.cn
 * 新页面注册
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("lib/sysmsg.js");
$import("jobs/sLogin.js");
$import("jobs/sSignup.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add('suda');
	job.add('sSignup');
	job.add('sLogin');
    
    // 统计用户登录状态过期
    job.add("loginStatus");
	
	job.start();
}