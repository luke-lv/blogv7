/**
 * @fileoverview
 *	配置博客未开通也所需要的 Job 列表
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
$import('jobs/suda.js');
$import("jobs/tray.js");
$import("jobs/Comp_render_other.js");
$import("jobs/fakeIndexTitle.js");
$import('jobs/readNumPlus.js');
$import("jobs/imageLazyLoad.js");
$import("jobs/openBlogPage.js");
//$import("jobs/qingDiscover.js");
// $import("jobs/qingTagRec.js");
//推广链接广告
$import("jobs/adNoticeChannel.js");
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
	job.add("adNoticeChannel");
    job.add("trayTipsAd");
    
	job.add('openBlogPage');
	job.add("imageLazyLoad");
	job.add("Comp_render");
	job.add("fakeIndexTitle");
	job.add('readNumPlus');
	//job.add("qingDiscover");
	// job.add("qingTagRec");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
	job.start();
}
