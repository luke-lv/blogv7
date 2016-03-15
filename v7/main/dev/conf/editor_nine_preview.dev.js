/** 
 * @fileoverview 九宫格博客 页面配置
 * @author zhihan | zhihan@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("jobs/suda.js");
$import("jobs/tray.js");
$import("jobs/nineGrid/previewPost.js");
$import("jobs/loginStatus.js");

function main(){
    var job = new Jobs();
    job.add("suda");
	job.add("tray");
	job.add("previewPost");
    
    // 统计用户登录状态过期
    job.add("loginStatus");
    job.start();
}
