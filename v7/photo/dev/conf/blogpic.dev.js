/**
 * @author Jay Chan | chenjie@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("msg/transcode.js");
$import("jobs/jumpPage.js");
$import("jobs/tray.js");
$import("jobs/write.js");
$import("jobs/getTplNum.js");
$import("jobs/templateClone.js");


$import('jobs/subscribe.js');
$import('jobs/sendLog.js');
$import("jobs/baby_headPhoto.js");

//分享 图片到微博 .
$import("jobs/sharePhoto.js");
// $import("jobs/meilaTrayAd.js"); 下线
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
$import("jobs/diYuanXin.js");
//商业化我买网
$import("jobs/shangyehuawomai.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add("suda");
    job.add("loginStatus");

	job.add("jumpPage");
	job.add("write");
	job.add("getTplNum");
	job.add("templateClone");
	
	job.add('subscribe');
	
	job.add("sendLog");
	
	//育儿博客相框头图
	job.add("baby_headPhoto");	
			
	//分享 图片到微博
	job.add("sharePhoto");
	// job.add("meilaTrayAd");
	job.add("diYuanXin");
	job.add("shangyehuawomai");
	job.start();
}
