/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("lib/listener.js");
$import("jobs/checkAccount.js");
$import("jobs/editor/editor.js");
$import("jobs/editor/editor_mjtag.js");
$import("jobs/editor/editor_catedialog.js");
$import("jobs/editor/editor_init.js");
$import("jobs/editor/init_right_menu.js");
$import("jobs/editor/editor_articlecate.js");
$import("jobs/editor/send_article_page_init.js");
// $import("jobs/editor/editor_cate.js");
$import("jobs/editor/editor_videoinsert.js");
$import("jobs/editor/editor_imginsert.js");
$import("jobs/editor/format_title.js");
$import("jobs/editor/insert_to_editor.js");
$import("jobs/editor/editor_face.js");
$import("jobs/tray.js");
$import('jobs/rssLog.js');
$import('jobs/channelType.js');
$import("jobs/miniBlogAttention.js");
$import("jobs/SinglesDay.js");
$import("jobs/editor/timed_publish.js");

$import("jobs/editor/bindToTSina.js");
$import("jobs/editor/bindTomsn.js");
$import("jobs/editor/bindWeibo_auto.js");
$import("jobs/loginStatus.js");
$import("lib/sendLog.js");
//图片博主验证
$import("jobs/editor/checkImgBlogger.js");
$import('jobs/newEditor/new_editor_guidelayer.js');

//uatrack布码
$import("jobs/uatrack.js");
//积分签到
$import("jobs/jfCheckIn.js");

if(window!=parent){parent.location.href=window.location.href} //防止发布页被iframe

function main(){
	v7sendLog('42_01_16');
    var job = new Jobs({
		onEnd	: function (){
			var err = job.errorMsg; // 如果 Job 有任何错误，就立即投放错误日志到服务器s
			if(err.length > 0){
				var params="&type=7&msg=" + encodeURI(job.errorMsg.join("|"));
				//var blog_id=window.location.href.match(/blog_id=\w*/);
				var blog_id="blog_id="+window.location.href;
				if(blog_id){
//					params+="&"+blog_id[0];
					params+="&"+blog_id;
				}
				scope && scope.crtIfm && scope.crtIfm(params);
			}
		}
	});

	job.add("suda");

	job.add("checkAccount");
	job.add("tray");
    job.add("checkImgBlogger");
    job.add("jfCheckIn");//积分签到
	job.add("editor_init");
    
	job.add("format_title");
	job.add("editor_face");
	// job.add("editor_cate");
    
	job.add("editor_mjtag");
    
	job.add("editor_articlecate");
	job.add("init_right_menu");
	job.add("send_article_page_init");
	job.add("editor_video");
	job.add("editor_img");
	job.add("editor_catedialog");
	job.add("insert_to_editor");
    //定时发布
    job.add("timed_publish");
	
	job.add('bindWeibo_auto');
	job.add('bindToTSina');
	job.add('bindTomsn');
	
	job.add('rssLog');
	job.add('channelType');
	//关注"博客头条"的微博
	job.add("miniBlogAttention");
	//点击光棍节链接自动加关注
	job.add("SinglesDay");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
   	job.add('new_editor_guidelayer');

    job.add("uatrack");
    job.start();
}
