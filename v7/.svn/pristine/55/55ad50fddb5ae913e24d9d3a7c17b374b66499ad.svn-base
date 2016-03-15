/**
 * @author xy xinyu@staff.sina.com.cn
 */

$import("lib/jobs.js");
$import("jobs/exh.js");
$import("jobs/tuiguang.js");
$import("jobs/exhperson.js");

$import('jobs/blogLogin.js');
$import('jobs/adBLog.js');
$import("jobs/loginStatus.js");

function main(){
    var job = new Jobs();
    job.add("adBlog");
    job.add("exh");
	job.add("tuiguang");
	job.add("exhperson");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.start();
}