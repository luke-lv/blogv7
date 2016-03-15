/**
 * @fileoverview 统计网络速度
 * @author xy xinyu@staff.sina.com.cn
 * @date 2010-06-18
 */

$import("sina/sina.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/io/ajax.js");

$registJob("statnetspeed", function(){
	scope.testnttime=new Date().getTime();
	Utils.Io.JsLoad.request("http://sjs.sinajs.cn/blog7/testnetwork.js",{
		onComplete:function(){
			var endtime=new Date().getTime();
			Utils.Io.Ajax.request("http://control.blog.sina.com.cn/admin/article/ria_debug.php?uid="+scope.$uid+"&usrAgt="+encodeURIComponent(navigator.userAgent)+"&type=5&time="+(endtime-scope.testnttime),{
				
			});
		},
		onException:function(){
			var endtime=new Date().getTime();
			Utils.Io.Ajax.request("http://control.blog.sina.com.cn/admin/article/ria_debug.php?uid="+scope.$uid+"&usrAgt="+encodeURIComponent(navigator.userAgent)+"&type=6&time="+(endtime-scope.testnttime),{
				
			});
		}
	});
});