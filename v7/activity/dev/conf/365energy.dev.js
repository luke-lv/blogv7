$import("lib/jobs.js");
$import("lib/sendLog.js");
$import("jobs/tray.js");
$import("jobs/suda.js");
$import("jobs/shareWeibo.js");
$import("jobs/scrollTop.js");

/**
 * @fileoverview 365正能量
 * @url http://blog.sina.com.cn/lm/i365day1.html
 * @create 2012-12-12
 * @author gaolei
 */
function main(){
    var pack_test = 'pack_test_1';
    var job = new Jobs();
	// 页面展示次数
	v7sendLog("42_01_34");
	job.add("tray");
	job.add("shareWeibo");
	job.add("scrollTop");
    job.add("suda");
    job.start();
}
