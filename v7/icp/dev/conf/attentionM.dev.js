/**
 * @fileoverview 关注页(登录状态)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/addAttention.js");
$import("jobs/cancelAttention.js");
$import("jobs/phone_attention_cancel.js");
$import("jobs/removeAttention.js");
$import("jobs/Comp_render_other.js");
$import("jobs/subscribe.js");
//$import("jobs/write.js");
$import("jobs/templateClone.js");

$import("jobs/phone_attention_add.js");
$import("jobs/getTplNum.js");
$import("jobs/baby_headPhoto.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/loginStatus.js");

function main(){
	var job = new Jobs();
	job.add("tray");
	job.add('suda');
    job.add("trayTipsAd");
    job.add("loginStatus");
	job.add("phone_attention_add");
	job.add("subscribe");
	//job.add("write");
	job.add("addAttention");
	job.add("cancelAttention");
	job.add("removeAttention");
	job.add("phone_attention_cancel");
	job.add("Comp_render");
	job.add("getTplNum");
	job.add("templateClone");
	
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	job.start();
}
