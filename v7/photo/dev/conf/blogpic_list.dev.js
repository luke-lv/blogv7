/**
 * @author Jay Chan | chenjie@staff.sina.com.cn
 * @autohor shaomin | shaomin@staff.sina.com.cn
 * @desc forp平台1.1改版
 */
$import("lib/jobs.js");
$import("msg/transcode.js");
//$import("randomStroll.js");
$import("jobs/tray.js");
$import("jobs/write.js");
$import("jobs/list4Left.js");
$import("jobs/getTplNum.js");
$import("jobs/templateClone.js");

$import('jobs/subscribe.js');
$import("jobs/baby_headPhoto.js");
//$import("jobs/meilaTrayAd.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
$import("jobs/diYuanXin.js");
//商业化我买网
$import("jobs/shangyehuawomai.js");

 function main(){
	var job = new Jobs();
	job.add("list4Left");
	job.add("tray");
	job.add("suda");
    job.add("loginStatus");

	job.add("write");
	job.add("getTplNum");
	job.add("templateClone");
	
	job.add('subscribe');
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
    //job.add("meilaTrayAd");
    job.add("diYuanXin");
    job.add("shangyehuawomai");
	job.start();
 }

