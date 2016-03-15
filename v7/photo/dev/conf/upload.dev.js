/**
 * @author shaomin | shaomin@staff.sina.com.cn
 * @相册部分图片上传功能
 */

$import("lib/jobs.js");
//$import("jobs/uploadPics.js");
$import("jobs/uploadDialog.js");
$import("jobs/tray.js");
$import("jobs/batchUpload.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/sendLog.js");
$import("msg/upload.js");
$import("lib/showError.js");
$import("jobs/loginStatus.js");
//$import("jobs/meilaTrayAd.js");
$import("jobs/suda.js");

function main(){
    var job = new Jobs();
 //   job.add("uploadPics");
    job.add("tray");
    job.add("suda");
    job.add("loginStatus");

    job.add("initBatchUpload");
    job.add("uploadDialog");
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	
	job.add("sendLog");
    //job.add("meilaTrayAd");
    job.start();
}