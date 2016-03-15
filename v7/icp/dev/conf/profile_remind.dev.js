
/** 
 * @fileoverview 转载/收藏消息页面
 * @author springwang | wangyue1208@gmail.com

 */
$import("lib/jobs.js");
$import("jobs/tray.js");
$import("jobs/index.js");
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
	job.add("index");
    job.start();
}

