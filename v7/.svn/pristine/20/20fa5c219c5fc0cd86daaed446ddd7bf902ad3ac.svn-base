/** 
 * @fileoverview 新浪游戏频道添加顶托
 * @author yifei2@staff.sina.com.cn
 * @date 2013.10
 */
$import("lib/jobs.js");
$import("lib/listener.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/errorTips.js");

$import("jobs/adNoticeChannel.js");
$import("jobs/blogNotice.js");
$import("jobs/trashPv.js");

function main(){
	
    // 注册消息
    var listener = Lib.Listener;
    // 销售广告消息
    listener.add("tray-ad-tips");

	var job = new Jobs();
	job.add("suda");
	job.add("tray");
	job.add("errorTips");

	job.add("blogNotice");
	job.add("trashPv");
	job.add("adNoticeChannel");
	
    job.start();
}