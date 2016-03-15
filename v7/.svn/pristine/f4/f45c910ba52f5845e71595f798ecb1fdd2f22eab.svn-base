/**
 * @fileoverview
 *	未开通及封杀用户假页的标题
 	http://blog.sina.com.cn/riaapi/blog_notopen.php?uid=用户UID
 		不带&	表示用户博客未开通
 		&x 		表示用户被封杀
 		&y 		表示用户相册未开通
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
$import("lib/uic.js");
$registJob("fakeIndexTitle", function (){
	if(!$E("txtBlogTitle")) return;
	Lib.Uic.getNickName([scope.$uid], Core.Function.bind2(function(oResult){
		var isClose = (/&[xy]$/.test(window.location.href));
		var nickname = isClose ? "新浪博客" : (oResult[scope.$uid] || "新浪网友") + "的博客";
		$E("txtBlogTitle").innerHTML = '<div class="blogtitle">' + nickname + '</div>'
				+ (isClose ? '' : '<div class="bloglink">http://blog.sina.com.cn/u/' + scope.$uid + '</div>');
	}, this));
});
