/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @author wujian | wujian@staff.sina.com.cn
 * @fileoverview 影视博客 影评编辑页面
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/editor/editor.js");
$import("jobs/editor/editor_tag.js");
$import("jobs/editor/editor_catedialog.js");
$import("jobs/editor/editor_articlecate.js");
$import("jobs/editor/editor_cate.js");
$import("jobs/tray.js");
$import("jobs/filmBlog/editor_fun.js");
$import("jobs/filmBlog/editor_pageInit.js");
$import("jobs/filmBlog/editor_initOptions.js");
$import("jobs/filmBlog/editor_initSendArticle.js");
$import("jobs/loginStatus.js");

if(window!=parent){parent.location.href=window.location.href} //防止发布页被iframe
function main(){
	var job=new Jobs();
	job.add("tray");
	job.add("suda");
	job.add("publicFunc");
	job.add("editor_pageInit");//页面初始化 对url参数进行处理等	
	
	job.add("editor_initOptions");// 初始化 高级选项  并向外提供 处理正常的接口	
	//二期要加上 编辑器的 所以……
	
	job.add("editor_initSendArticle");//处理发博文  处理高级选项的接口、以及其他接口	
	job.add("editor_cate");	//投稿到排行榜
	job.add("editor_tag");//# 标签面板
	job.add("editor_articlecate");// 分类回调		

	job.add("editor_catedialog");// 文章分类管理 弹出面板	
    
    // 统计用户登录状态过期
    job.add("loginStatus");	

    job.start();
}