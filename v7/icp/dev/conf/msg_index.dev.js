/**
 * @fileoverview 消息改造
 * @author changchuan@staff.sina.com.cn
 * @created 2010-10-12
 */

$import("lib/jobs.js");
$import("jobs/suda.js");
//$import("jobs/tray.js");
//$import("jobs/Comp_render_other.js");
$import("jobs/msg_index.js");
$import("jobs/msg_panel.js");
/**评论**/
// $import("jobs/report_icpComment.js");
// $import("jobs/msg_comment.js");

//留言
$import("jobs/report_guestBook.js");
$import("jobs/msg_guestBook.js");
$import("jobs/loginStatus.js");


/**纸条**/
// $import("jobs/report_icpPaperlist.js");
// $import("jobs/msg_paper.js");


/**好友邀请 */
  // $import("jobs/report_friend.js");
  // $import("jobs/msg_friend.js");



function main(){
    var job = new Jobs();
    //  job.add("tray");
    //  job.add("Comp_render");
    job.add("suda");
    job.add("msg_index");
    job.add("msg_panel");  
    /**
    job.add("report_icpComment");
    job.add("msg_comment");
    **/
    job.add("report_guestBook");
    job.add("msg_guestBook");
    job.add("loginStatus");
    /**
    job.add("report_icpPaperlist");
    job.add("msg_paper");
   */
    /**
    job.add("report_friend");
    job.add("msg_friend");
   */
    job.start();
}
