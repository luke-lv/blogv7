/**
 * @fileoverview 修改密码页(登录状态)
 * @author L.Ming | liming1@staff.sina.com.cn
 * @created 2009-11-18
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/getTplNum.js");
$import("jobs/tray.js");

$import("jobs/modifyPassword.js");
$import('jobs/modifyTitle.js');
$import("jobs/flashtemplate.js");
$import('jobs/navFolding.js');
$import("jobs/modify_tip.js");
$import("jobs/templateClone.js");
$import("jobs/baby_headPhoto.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("getTplNum");
	job.add("modifyPassword");
	
	job.add("flashtemplate",3);
	job.add('modifytitle',3);
	job.add("modify_tip");
	job.add("navFolding");
	job.add("templateClone", 3);
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}