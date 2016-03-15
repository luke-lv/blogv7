/**
 * @author shaomin | shaomin@staff.sina.com.cn
 * @desc 专辑列表页面
 */
$import("sina/sina.js");
$import("lib/jobs.js");
$import("sina/core/class/define.js");
$import("jobs/list4Left.js");
$import("jobs/renderCategory.js");
$import("action/checkKey.js");
$import("jobs/recordVisitor.js");
$import("jobs/Comp_render_index.js");
$import("jobs/tray.js");
$import("jobs/write.js");
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

	job.add("getTplNum");
	job.add("renderCtg");
	job.add("recordVisitor");
	job.add("Comp_render");
	job.add("tray");
	job.add("suda");
    job.add("loginStatus");
	job.add("write");
	job.add("templateClone");
	
	job.add('subscribe');
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
    //job.add("meilaTrayAd");
    job.add("diYuanXin");
    job.add("shangyehuawomai");
    
	job.start();
}