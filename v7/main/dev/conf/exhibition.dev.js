/**
 * @author xy xinyu@staff.sina.com.cn
 */

$import("lib/jobs.js");
$import('jobs/suda.js');
$import("jobs/exhibition.js");
$import("jobs/loginStatus.js");

function main(){
    var job = new Jobs();
    job.add("exhibition");
    job.add("suda");
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.start();
}
