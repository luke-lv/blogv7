/**
 * @fileoverview
 *	文章列表页--特色博文之影视博文 未登录状态
 * @author wujian | wujian@staff.sina.com.cn
 *
 */
$import("lib/jobs.js");
$import("jobs/suda.js");

$import("jobs/tray.js");
$import("jobs/login.js");
$import("jobs/Comp_render_articlelist.js");
$import("jobs/articleListGetNumber.js");
$import("jobs/recordVisitor.js");
$import("jobs/randomScroll.js");
$import("jobs/getTplNum.js");
$import("jobs/templateClone.js");
$import("jobs/searchbox_Limit.js");
$import("jobs/subscribe.js");
$import('jobs/readNumPlus.js');
$import("jobs/phone_attention_add.js");
$import("jobs/flashtemplate.js");
$import("jobs/baby_headPhoto.js");

$import("jobs/stylefix.js");
$import("jobs/static.js");
$import("lib/component/blog365/templateCanlendar.js");
$import("jobs/loginStatus.js");
//缔元信布码，第三方的
$import("jobs/diYuanXin.js");

function main () {
	var job = new Jobs();
	job.add('suda');
	job.add("tray");
	job.add("getTplNum");
	job.add("login");
	job.add("phone_attention_add");
	job.add("recordVisitor");
	job.add("Comp_render");
	job.add("articleListGetNumber");
	job.add('randomScroll',3);
	job.add("templateClone",3);
	job.add("searchbox_Limit");
	job.add("subscribe",3);
	job.add('readNumPlus');
	job.add("flashtemplate",3);
	job.add("stylefix",3);
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	
	//统计用户行为布码
	job.add("static");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.add("diYuanXin");
    
	job.start();
}