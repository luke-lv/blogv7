/**
 * @fileoverview
 *	给博文列表页增加文章删除等操作，由JS动态绑定事件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @modified dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/login/ui.js");

$import("lib/login/_login.js");
$import("lib/dialogConfig.js");
$import("lib/login/loginPost.js");

$import("sina/utils/io/ajax.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/fireEvent.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");
$import("lib/dialogConfig.js");
$import("lib/login/loginPost.js");
$import("lib/checkAuthor.js");

$registJob("sLogin", function () {
	
	var firstTime = true;
	
	Lib.passcardOBJ.init($E("loginname"),{
			overfcolor: "#999",		// 鼠标经过字体颜色
			overbgcolor: "#e8f4fc",	// 鼠标经过背景颜色
			outfcolor: "#000000",	// 鼠标离开字体颜色
			outbgcolor: ""			// 鼠标离开背景颜色
		},
		$E("loginpwd")
	);
	
	function bindEvent(ele,errEle,event,func) {
		ele[event] = function(){
			func(ele,errEle);
		};
	}
	
	function showError(errEle,msg) {
		if(errEle.className.indexOf('txtc') == -1) {
			errEle.className = 'txtc';
		}
		errEle.innerHTML = msg;
		errEle.style.display = '';
	}
	
	function clearError(errEle) {
		errEle.innerHTML = '';
		errEle.style.display = 'none';
	}
	
	bindEvent($E('loginname'),null,'onclick',function(me,errEle){
		if(firstTime) {
			me.select();
			firstTime = false;
		}
	});
	
	bindEvent($E('a1'),null,'onclick',function(me,errEle){
		if(me.checked) {
			$E('securityTip').style.display='';
		} else {
			$E('securityTip').style.display='none';
		}
	});
	
	Core.Events.addEvent("loginpwd", function(e){
		e = e || window.event;
		var currKey = e.keyCode || e.which || e.charCode;
		if(currKey == 13) {
			Core.Events.fireEvent($E('login'),'click');
		}
	},'keydown');
	
	bindEvent($E('login'),$E('loginerror'),'onclick',function(me,errEle){
		var uname = $E('loginname').value;
		var pwd = $E('loginpwd').value;
		if(!uname) {
			showError(errEle,'请输入用户名');
			$E('loginname').focus();
			return;
		}
		if(!pwd) {
			showError(errEle,'请输入密码');
			$E('loginpwd').focus();
			return;
		}
		clearError(errEle);
		var request = new Lib.Login.LoginPost(function(loginStatus){
			if (loginStatus.result) {
				Lib.checkAuthor();
				//Utils.Cookie.setCookie("remberloginname", escape($E("loginname").value), 2400, "/", ".blog.sina.com.cn");
				window.location = 'http://control.blog.sina.com.cn/blogprofile/index.php';
			}
			else {
				showError(errEle,"登陆失败 ：" + loginStatus.reason);
			}
		}, false);
		if($E('a1').checked) {
			request.login(uname, pwd, 15);
		} else {
			request.login(uname, pwd);
		}
	});
});

