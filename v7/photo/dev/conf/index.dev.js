/**
 * @author shaomin | shaomin@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/tray.js");
$import("jobs/write.js");
$import("jobs/list4Left.js");
$import("jobs/renderIndex.js");
$import("jobs/recordVisitor.js");
// $import("jobs/Comp_render_index.js");
$import("jobs/templateClone.js");
$import("jobs/getTplNum.js");
$import("jobs/loadPv.js");
$import("jobs/templateClone.js");

$import('jobs/subscribe.js');
$import('jobs/sendLog.js');
$import("jobs/baby_headPhoto.js");

$import("jobs/shareImgList.js");
//$import("jobs/meilaTrayAd.js");
//Qing推荐博文
$import("jobs/qingRecommend.js");
$import("lib/component/blog365/templateCanlendar.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
$import("lib/sendLog.js");
$import("jobs/diYuanXin.js");
$import("jobs/indexTaobaoAd.js");
//商业化我买网
$import("jobs/shangyehuawomai.js");
$import("jobs/blogAppAd.js");

function main(){
	v7sendLog('42_01_19');
    var job = new Jobs();
    job.add("list4Left");
    job.add("getTplNum");
    job.add("renderIndex");
    job.add("recordVisitor");
    //下线访客组件 因为目前Comp_render只加载了访客这一个组件，所以直接在这里注掉
    // job.add("Comp_render");
    job.add("tray");
    job.add("suda");
    job.add("loginStatus");
    job.add("write");
	job.add("loadPv");
	job.add("templateClone");
	
	job.add('subscribe');
	job.add('indexTaobaoAd');
	job.add("sendLog");
    job.add("qingRecommend",3);
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	
	//分享相册 首页图片到微博
	job.add("shareImgList");
	//job.add("meilaTrayAd");
	job.add("diYuanXin");
	job.add("shangyehuawomai");
	job.add("blogAppAd");
    job.start();
}