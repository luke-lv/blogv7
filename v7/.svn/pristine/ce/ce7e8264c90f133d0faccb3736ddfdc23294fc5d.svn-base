/**
 * @author Administrator
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/getTplNum.js");
$import("jobs/tray_new.js");
$import("jobs/articleComp_new.js");
$import("jobs/imageLazyLoad.js");
$import("jobs/loginStatus.js");
$import("jobs/dialogNewTemplate.js");
$import("jobs/adNoticeChannel.js");
$import("jobs/blogNotice.js");

function main(){
  var job = new Jobs();
  job.add("tray_new");
  job.add("suda");
  job.add("imageLazyLoad");
  job.add("articleComp_new");
  // 统计用户登录状态过期
  job.add("loginStatus");
  job.add("adNoticeChannel");
  job.add("blogNotice");
  job.start();
}
