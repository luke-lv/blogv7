$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/importV.js");
$import("jobs/loginStatus.js");
/**
 * @fileoverview 文件说明
 *
 * @create ${date} ${time}
 * @author Qiangyee
 */
function main (){
    var job = new Jobs();
    job.add("tray");
    job.add("suda");
    job.add("importV");
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.start();
}
