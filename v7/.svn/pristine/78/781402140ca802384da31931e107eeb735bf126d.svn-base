$import("lib/jobs.js");
$import("lib/lazyload.js");
$import("lib/sendLog.js");

$registJob("articleReadingPercent", function(){
	// 文章页打开
	v7sendLog('31_01_01');
	
	// 看到文章结尾
	Lib.LazyLoad([$E("article_comment_list")], {
		callback	: function () {
			v7sendLog('31_01_02');
		}
	});
});