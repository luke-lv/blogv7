/**
 * @desc	百合开通博客浮层
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("comps/baihe/activeBlog.js");

$registJob("openBlog", function(){
	Lib.checkAuthor();
	trace("open_"+(+scope.$user_noopen));
	if($isLogin){
		if(+scope.$user_noopen){			// 1 表示没有开通
			Baihe.activeBlog();
		}
	}
});



