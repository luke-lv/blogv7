/**
 * @fileoverview 手机订阅
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @created 2009-11-11
 */

$import("lib/jobs.js");
$import("jobs/tray.js");
$import("jobs/phone_check.js");
$import("jobs/phone_attention_cancel.js");
$import("jobs/phone_attention_add.js");
$import("jobs/suda.js");
$import("jobs/baby_headPhoto.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add('suda');
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("phone_attention_add");
	job.add("phone_check");
	job.add("phone_attention_cancel");
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}
