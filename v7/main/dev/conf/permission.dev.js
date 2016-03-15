/**
 * @fileoverview 提示访问权限
 * @author meichun1@staff.sina.com.cn
 * @date 11:10 2010/9/29
 *
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/permission.js");
//推广链接广告
$import("jobs/adNoticeChannel.js");
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("suda");
	job.add("tray");
	job.add("adNoticeChannel");
    job.add("trayTipsAd");
    job.add("permission");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.start();
}
