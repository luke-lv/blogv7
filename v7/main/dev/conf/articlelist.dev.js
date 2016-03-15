/**
 * @fileoverview
 *	文章列表页登录状态
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
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

//博客下线模版公告
$import("jobs/adNoticeChannel.js");
$import("jobs/blogNotice.js");

$import("jobs/stylefix.js");
$import("jobs/suda.js");

$import("jobs/static.js");
$import("jobs/errorTips.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/blog365/calendarHover.js");
$import("jobs/xssDetect.js");
$import("lib/component/blog365/templateCanlendar.js");
$import("jobs/loginStatus.js");
$import("jobs/bloglistTaobaoAd.js");
//缔元信布码，第三方的
$import("jobs/diYuanXin.js");
$import("jobs/blogAppAd.js");


function main () {
	var job = new Jobs();
	job.add("suda");
	job.add("tray");
    job.add("trayTipsAd");
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
	job.add('bloglistTaobaoAd');
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	
	//博客下线模版公告
	job.add("adNoticeChannel");
	job.add("blogNotice");
	
    job.add("errorTips");
	//统计用户行为布码
	job.add("static");
	// 博客365日历hover效果
	job.add("calendarHover");
    // 嵌入iframe和script XSS攻击检查
    job.add("userDetect", 3);
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.add("diYuanXin");    
	job.add("blogAppAd");
	job.start();
}