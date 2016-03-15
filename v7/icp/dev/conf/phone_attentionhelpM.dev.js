/**
 * @fileoverview 手机绑定开通帮助页(登录状态)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("lib/jobs.js");
$import("jobs/tray.js");
$import("jobs/phone_check2.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main(){
	var job = new Jobs();
	job.add("tray");
    job.add("trayTipsAd");
    job.add("suda");
    job.add("loginStatus");
	job.add("phone_check2");
	job.start();
}
