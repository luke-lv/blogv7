/**
 * @fileoverview
 *	发生错误，重定向文件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");

$import("lib/jobs.js");
$registJob("errorRedirect", function () {
	
	var homepage = 'http://blog.sina.com.cn';
	var sCurrentUrl = window.location.href;
	var aResult = sCurrentUrl.match(/uid=([0-9]{5,10})/);
	if (aResult)
	{
		homepage += '/u/' + aResult[1];
	}
//	numView(homepage);
	var numSpan = $E("numspan");
	var i = 5;
	var interval = window.setInterval(function () {
			if (i >= 1) {
				numSpan.innerHTML = --i ;
			}else{
				location.href = homepage;
				window.clearInterval(interval);
			}
		}, 1000);
});
