/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @created 20140714 | fuqiang3@staff.sina.com.cn 新版博客编辑器
 */
$import("lib/jobs.js");
$import("lib/sendLog.js");
$import("jobs/suda.js");

// 新编辑器开始 －－－－－
$import("jobs/newEditor/checkImgBlogger.js");         // 图片博主验证，这个必须加上，会根据接口值，修改scope.$is_photo_vip的值，php给的值已经没用了
$import("jobs/dialogNewTemplate.js");                 // 新浮层模版
$import("jobs/newEditor/editor_init.js");             // 编辑器初始化
$import("jobs/newEditor/editor_focus.js");            // 编辑器的focus和blur事件
$import("jobs/newEditor/article_associate.js");       // 插入相关博文
$import("jobs/newEditor/article_cate.js");            // 选择博文分类功能
$import("jobs/newEditor/editor_mjtag.js");            // 加标签功能
$import("jobs/newEditor/article_permission.js");      // 博文权限处理
$import("jobs/newEditor/send_article_page_init.js");  // 发博文等
$import("jobs/newEditor/newEditorGuideLayer.js");	  // 新编辑器引导
// 新编辑器结束 －－－－－

// 托盘相关开始 －－－－－
$import("jobs/adNoticeChannel.js");
$import("jobs/blogNotice.js");
$import("jobs/tray_new.js");
$import("jobs/login.js");
$import("jobs/getTplNum.js");


// 托盘相关结束 －－－－－

//防止发布页被iframe
function main() {
	if (window != parent) {
		parent.location.href = window.location.href;
	}
	v7sendLog('42_01_16');
	var job = new Jobs();
	job.add("suda");

	// 新编辑器开始 －－－－－
	job.add("checkImgBlogger");
	job.add("editor_init");
	job.add("editor_focus");
	job.add("article_associate");
	job.add("article_cate");
	job.add("editor_mjtag");
	job.add("article_permission");
	job.add("send_article_page_init");
	job.add("newEditorGuideLayer");

	job.add("adNoticeChannel");
	job.add("blogNotice");
	job.add("tray_new");
	job.add("login");
	job.add("getTplNum");



	job.start();
}

