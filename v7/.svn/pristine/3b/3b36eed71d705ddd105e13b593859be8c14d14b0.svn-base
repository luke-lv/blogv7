/**
 * @author shaomin | shaomin@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/collection_list.js");
$import("jobs/tray.js");
$import("jobs/getTplNum.js");
//$import("randomStroll.js");

$import('jobs/subscribe.js');
$import("jobs/baby_headPhoto.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main(){
	var job = new Jobs();
	job.add("collectionList");
	job.add("tray");
	job.add("suda");
    job.add("loginStatus");

    job.add("getTplNum");
	
	job.add('subscribe');
//	job.add("randomStroll");

	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}