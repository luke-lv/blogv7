/**
 * @fileoverview 关注动态(未登录)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-09-02
 */

$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/Comp_render_other.js");
$import("jobs/guestBook.js");
$import("jobs/attentionFeed.js");
$import("jobs/addAttention.js");
$import("jobs/subscribe.js");
$import("jobs/templateClone.js");

$import("jobs/phone_attention_add.js");
$import("jobs/getTplNum.js");
$import("jobs/baby_headPhoto.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add('suda');
	job.add("tray");
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("phone_attention_add");
	job.add("subscribe");
	job.add("Comp_render");
	job.add("attentionFeed");
	job.add("guestBook");
	job.add("addAttention");
	job.add("getTplNum");
	job.add("templateClone");
	
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}
