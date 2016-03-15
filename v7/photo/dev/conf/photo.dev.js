/**
 * @ author shaomin | shaomin@staff.sina.com.cn
 * @ desc for new requirement of  platform1.1
 */
$import("lib/jobs.js");
//验证码
$import("lib/checkManager.js");

$import("jobs/tray.js");
$import("jobs/write.js");
$import("jobs/jumpPage.js");
$import("jobs/renderPhoto.js");
$import("jobs/getTplNum.js");

//$import("jobs/audioCheck.js");
$import("jobs/templateClone.js");
$import("jobs/loadPv.js");

$import('jobs/subscribe.js');
$import('jobs/sendLog.js');
$import('jobs/digger.js');
$import('jobs/articleDigger.js');
$import("jobs/baby_headPhoto.js");


//迁移博文的评论和举报
$import("jobs/articleComment.js");
$import("jobs/articleNumber.js");
$import("jobs/articleCommentPost.js");
$import("jobs/articleCommentManager.js");
$import("jobs/report_photoComment.js");

//分享 图片到微博 .
$import("jobs/sharePhoto.js");
//$import("jobs/meilaTrayAd.js");
//Qing推荐博文
$import("jobs/qingRecommend.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
$import("jobs/diYuanXin.js");
//商业化我买网
$import("jobs/shangyehuawomai.js");
$import("jobs/blogAppAd.js");

 function main(){
	var job = new Jobs();

	job.add("getTplNum");
	job.add("jumpPage");
	job.add("renderPhoto");
	job.add("write");
	job.add("tray");
	job.add("suda");
    job.add("loginStatus");

	job.add("digger");
	job.add("articleDigger");

	job.add("articleNumber");
	job.add("articleComment");
	job.add("articleCommentPost");
	job.add("articleCommentManager");
	//验证码
	job.add("checkManager");
	//job.add("audioCheck");

	job.add("loadPv");
	job.add("templateClone");

	job.add('subscribe');
	job.add("report_photoComment");

	job.add("sendLog");
    job.add("qingRecommend",3);

	//育儿博客相框头图
	job.add("baby_headPhoto");

	//分享 图片到微博
	job.add("sharePhoto");
	//job.add("meilaTrayAd");
    job.add("diYuanXin");
    job.add("shangyehuawomai");
	job.add("blogAppAd");
	job.start();

 }
