/**
 * @author shaomin | shaomin@staff.sina.com.cn
 * @desc 专辑列表页面
 */


$import("lib/jobs.js");
$import("jobs/list4Left.js");
$import("jobs/renderIndex.js");
$import("jobs/renderCategory.js");
$import("jobs/recordVisitor.js");
$import("jobs/Comp_render_category.js");
$import("jobs/tray.js");
$import("jobs/write.js");
$import("jobs/getTplNum.js");
$import("jobs/loadPv.js");
$import("jobs/templateClone.js");


$import('jobs/subscribe.js');
$import('jobs/sendLog.js');
$import('jobs/digger.js');
$import('jobs/articleDigger2.js');
$import("jobs/baby_headPhoto.js");

//分享相册列表图片到微博
$import("jobs/shareImgList.js");
$import("jobs/shareCategory.js");
//$import("jobs/meilaTrayAd.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
$import("jobs/diYuanXin.js");
//商业化我买网
$import("jobs/shangyehuawomai.js");

function main(){
    var job = new Jobs();
    job.add("list4Left");

    job.add("getTplNum");
    job.add("renderIndex");
    job.add("renderCtg");
    job.add("recordVisitor");
    job.add("tray");
    job.add("suda");
    job.add("loginStatus");
	job.add("digger");
	job.add("articleDigger");
    job.add("loadPv");
	job.add("templateClone");
    job.add("Comp_render");
    job.add("write");
	
	job.add('subscribe');
	job.add("sendLog");
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	
	//分享相册列表图片到微博
	job.add("shareImgList");
	job.add("shareCategory");
	//job.add("meilaTrayAd");
	job.add("diYuanXin");
	job.add("shangyehuawomai");
	
    job.start();
}

