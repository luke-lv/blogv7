/**
 * @author Jay Chan | chenjie@staff.sina.com.cn
 * @author shaomin | shaomin@staff.sina.com.cn
 * @desc forp平台1.1改版
 */
$import("lib/jobs.js");
$import("msg/transcode.js");
$import("jobs/tray.js");
$import("jobs/write.js");
$import("jobs/list4Left.js");
$import("jobs/getTplNum.js");
$import("jobs/removeCollectionPhoto.js");
$import("jobs/templateClone.js");

$import('jobs/subscribe.js');
$import("jobs/baby_headPhoto.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
$import("jobs/diYuanXin.js");

//$import("jobs/meilaTrayAd.js");

//$import("jobs/loadPv.js");
 function main(){
	var job = new Jobs();
	job.add("list4Left");
	job.add("tray");
	job.add("suda");
    job.add("loginStatus");

	job.add("write");
	job.add("getTplNum");
	job.add("templateClone");
	job.add("removeCollectionPhoto");
	
	job.add('subscribe');
//	job.add("loadPv");

	//育儿博客相框头图
	job.add("baby_headPhoto");
	//job.add("meilaTrayAd");
	job.add("diYuanXin");
	job.start();
 }

