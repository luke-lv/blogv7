/**
 * @fileoverview 个人资料页(未登录)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-12
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/Comp_render_myprofile.js");
$import("jobs/guestBook.js");
$import("jobs/subscribe.js");
$import("jobs/templateClone.js");

$import("jobs/getTplNum.js");
$import("jobs/phone_attention_add.js");
$import("jobs/report_guestBook.js");
$import("jobs/index.js");
$import("jobs/flashtemplate.js");
$import("jobs/diggerAction.js");
$import("component/include/cloneComponent.js");
$import("jobs/baby_headPhoto.js");
$import("jobs/clickMore.js");
$import("jobs/imageLazyLoad.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("lib/component/blog365/templateCanlendar.js");
$import("jobs/loginStatus.js");
$import("jobs/diYuanXin.js");

$import("jobs/searchToQing.js");

//用户赞助功能 下线 2014-04-28
// $import("jobs/userSponsor.js");

function main(){
	var job = new Jobs();
	job.add('suda');
	job.add("tray");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("imageLazyLoad");
	job.add("diggerAction");
	job.add("subscribe");
	job.add("Comp_render");
	job.add("guestBook");
	job.add("getTplNum");
	job.add("templateClone", 3);
	
	job.add("phone_attention_add");
	job.add("report_guestBook");
	job.add("index");
	job.add("flashtemplate",3);
	job.add('clickMore');
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.add("diYuanXin");

	job.add("searchToQing");
	//博客用户赞助功能 wjw 下线 2014-04-28
    // job.add("userSponsor");

	job.start();
}