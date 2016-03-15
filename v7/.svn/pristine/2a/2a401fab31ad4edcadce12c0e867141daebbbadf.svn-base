/**
 * @fileoverview
 *	我常参加的圈子 id=994
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/function/bind2.js");

$import("lib/component/class/registComp.js");
$import("lib/interface.js");

/**
 * 博客个首个人信息组件的呈现
 */
$registComp(994, {
	"load"	: function () {
		var _circleInfo = new Interface("http://blog.sina.com.cn/s/circle_" + scope.$uid + ".html", "ajax");
		_circleInfo.request({
			onSuccess	: Core.Function.bind2(function (sData) {
				this.setContent(sData);
			}, this)
			,onError	: Core.Function.bind2(function (){
				this.setContent("数据读取失败");
			}, this)
			,onFail		: Core.Function.bind2(function (){
				this.setContent("数据读取失败");
			}, this)
		});
	}
});
