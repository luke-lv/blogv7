/**
 * @author fuqiang3@staff.sina.com.cn
 * @fileoverview 博客推广app广告位
 * @date 20140425
 */
$import("lib/jobs.js");
$import("lib/blogAppAd.js");

$registJob('blogAppAd', function() {
	Lib.blogAppAd.init('sinablogbody');
});
