/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/checkAccount.js");
$import("jobs/rssLog.js");
$import("jobs/tray.js");
$import('jobs/weibo/pubTab.js');
$import("jobs/weibo/login.js");
$import("jobs/editor/format_title.js");
$import("jobs/editor/editor_videoinsert.js");
$import("jobs/editor/editor_imginsert.js");
$import("jobs/editor/insert_to_editor.js");
//weibo下
$import("jobs/weibo/quickSave.js");
$import("jobs/weibo/editor_init.js");
$import("jobs/editor/editor_face.js");
$import("jobs/weibo/pasteUrl.js");
$import("jobs/weibo/writeBlog.js");
$import("jobs/loginStatus.js");

if(window!=parent){parent.location.href=window.location.href} //防止发布页被iframe
function main(){
    var job = new Jobs();
    job.add("checkAccount");
	job.add("tray");
    job.add("suda");
	job.add("pubTab");
    job.add("login");

	//编辑器相关
    job.add("format_title");
	job.add("editor_init");

	job.add("editor_face");
	job.add("editor_video");
	job.add("editor_img");
	job.add("insert_to_editor");
    job.add("quickSave");
    
    job.add("pasteUrl");
    job.add("writeBlog");
    
    job.add("rssLog");
    
    // 统计用户登录状态过期
    job.add("loginStatus");

    job.start();
}