/**
 * @fileoverview 文章分类管理
 * @author xs | zhenhau1@staff.sina.com.cn
 * 			xy xinyu@staff.sina.com.cn 2008.09.26
 *  
 */
$import("lib/jobs.js");
$import("lib/dialogConfig.js");
$import("component/categoryM.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");

function main(){
	trace("main is called");
	var job = new Jobs();
	job.add("initClass");		
	job.add("initElements");	
	job.add("initEvents");
 	job.add("suda");
    // 统计用户登录状态过期
    job.add("loginStatus");

	job.start();
}