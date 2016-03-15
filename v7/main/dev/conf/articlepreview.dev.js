/**
 * @author Administrator
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/getTplNum.js");
$import("jobs/tray.js");
$import("vote/dynamicVoteView.js");
$import("jobs/articleComp.js");
$import("article/fontSize.js");
$import("jobs/write.js");
$import("jobs/imageLazyLoad.js");
$import("jobs/loginStatus.js");
$import("lib/component/blog365/templateCanlendar.js");

function main(){
	var job = new Jobs();
	job.add("suda");
	job.add("getTplNum");
	job.add("tray");
	job.add("imageLazyLoad");
	job.add("dynamicVoteView");
	job.add("articleComp");
	job.add("write");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
	job.start();
}
