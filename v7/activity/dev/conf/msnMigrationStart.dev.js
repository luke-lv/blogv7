/**
 * @fileoverview MSN搬家流程第二步统计访问量
 * @author xy xinyu@staff.sina.com.cn 
 * @date 2010-11-19
 */
$import("jobs/statisticUniqueUser.js");

function main(){
	var job = new Jobs();
	job.add("statisticUniqueUser");
	job.start();
}