/**
 * @fileoverview 广告分成项目绑定银行卡
 * @author Edwin | zhihang1@staff.sina.com.cn
 * @created 2014-04-16
 */

$import("lib/jobs.js");
$import("lib/sendLog.js");
$import("jobs/tray.js");
$import("jobs/getTplNum.js");
$import("jobs/flashtemplate.js");
$import("jobs/navFolding.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/Comp_render_push.js");
//取消关注的tag
$import("jobs/delAttentionTags.js");
$import("jobs/attenBlogerRank.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
// 主要逻辑代码
$import("jobs/bankcardbind.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("getTplNum");
	job.add("delAttentionTags");
	job.add("attenBlogerRank");	
	job.add("render_push");
	job.add("navFolding");
	job.add("flashtemplate",3);
	// 以上是以前加入的必要代码，以下为主要逻辑代码
	job.add("bankcardbind");
	job.start();
}
