/** 
 * @fileoverview 九宫格博客 页面配置
 * @author zhihan | zhihan@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/checkAccount.js");
$import("jobs/tray.js");
$import("jobs/nineGrid/changeMoudle.js");
$import("jobs/nineGrid/nineGrid.js");
$import("jobs/filmBlog/editor_initOptions.js");
$import("jobs/editor/editor_tag.js");
$import("jobs/editor/editor_catedialog.js");
$import("jobs/editor/editor_articlecate.js");
$import("jobs/editor/editor_cate.js");
$import("jobs/filmBlog/editor_fun.js");
$import("jobs/nineGrid/editor_initSendArticle.js");
$import("jobs/loginStatus.js");

function main(){
    var job = new Jobs();
    job.add("checkAccount");
	job.add("tray");
	job.add("suda");
	//模板选择
    job.add("changeMoudle");
	//九宫格博客主体功能
	job.add("nineGrid");
	//下面的高级选项
	job.add("editor_initOptions");
	
	job.add("publicFunc");
	
	job.add("editor_cate");	//投稿到排行榜
	job.add("editor_tag");//# 标签面板
	job.add("editor_articlecate");// 分类回调		

	job.add("editor_catedialog");// 文章分类管理 弹出面板		
	job.add("editor_initSendArticle");//处理发博文  处理高级选项的接口、以及其他接口
    
    // 统计用户登录状态过期
    job.add("loginStatus");	
	
    job.start();
}
