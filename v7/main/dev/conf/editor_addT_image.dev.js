/**
 * @author dg | dongguang@staff.sina.com.cn
 * @desc 插入模版中的上传图片
 */

$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/editor/add_template_image.js");
$import("jobs/rssLog.js");
$import("jobs/loginStatus.js");

function main(){
    var job = new Jobs();
    job.add("suda");
	job.add("add_template_image");
	job.add("rssLog");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.start();

}

function exeute(){
   	var job = new Jobs();

	job.start();
}
