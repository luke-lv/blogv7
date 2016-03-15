/**
 * @fileoverview
 *	获取用户的积分
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/string/formatNumber.js");
$import("sina/utils/io/jsload.js");

$import("lib/jobs.js");
$registJob("getUserScore", function () {
		Utils.Io.JsLoad.request("http://blogcnfv5.sinajs.cn/blogscr?uid=" + scope.$uid + "&varname=blogScore&.js", {
		onComplete: function(){
			// 如果积分接口出错，输出0，以免JS报错
			if(typeof blogScore != "undefined" || $E("comp_901_score") == null){ 
				// 计算积分
				var _a = blogScore.coefficient.a;
				var _b = blogScore.coefficient.b;
				var _c = blogScore.coefficient.c;
				var _d = blogScore.coefficient.d;
				var _x1 = blogScore.x;
				var _y1 = blogScore.y;
				var _z1 = blogScore.z;
				var _w1 = blogScore.w;
				var _score = _x1 * _a + _y1 * _b + _z1 * _c + _w1 * _d;
				$E("blog_score").innerHTML = '<strong>'
						+ Core.String.formatNumber(_score) + '</strong>';
			}
		},
		noreturn: true
	});
});