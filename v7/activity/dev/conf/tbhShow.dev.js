$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/taobohui/showCover.js");
$import("jobs/loginStatus.js");
$import("lib/sendLog.js");
/**
 * @fileoverview 文件说明
 *
 * @create 2012-12-12
 * @author Qiangyee
 */
function main(){
	v7sendLog('42_01_22');
    var job = new Jobs();
    job.add("showCover");
    job.add("suda");
    job.add("loginStatus",3);
    job.start();
}
