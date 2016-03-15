/**
 * @fileoverview
 * 登陆 测试用job，未来的某一天会被删除
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/function/bind2.js");
$import("sina/core/events/addEvent.js");

$import("lib/login/ui.js");
$import("lib/showError.js");



$registJob('login',function(){
	var Login = new Lib.Login.Ui();

	Core.Events.addEvent("loginbtn", function(){
		//showError(123123);
		//return;
		Login.login(function(){
			alert("做一些，登陆之后，做的事情，呵呵！")
		});
	});
});
