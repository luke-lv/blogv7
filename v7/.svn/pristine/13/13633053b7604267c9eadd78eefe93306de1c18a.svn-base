/**
 * @fileoverview 圈子页(未登录)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-24
 */

$import("lib/jobs.js");
$import("jobs/tray.js");
$import("jobs/Comp_render_other.js");
$import("jobs/subscribe.js");
$import("jobs/templateClone.js");

$import("jobs/getTplNum.js");
$import("jobs/suda.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add('suda');
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("subscribe");
	job.add("Comp_render");
	job.add("getTplNum");
	job.add("templateClone");
	
	job.start();
}
