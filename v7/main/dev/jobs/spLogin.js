/**
 * 搜人项目未登录页面的上面的登录
 * @author zhihan | zhihan@staff.sina.com.cn
 * @version 1.0
 * @history
 */
$import("lib/jobs.js");
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
$import("lib/login/info.js");
$import("lib/checkAuthor.js");
$import("sina/core/events/addEvent.js");

$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");

$registJob("spLogin", function () {
	//上面的登录
	var trayLogin = new Lib.Login.Ui();
	Core.Events.addEvent($E("linkTrayLogin"),function(){
		trayLogin.login(null,false,"referer:"+location.hostname+location.pathname+",func:0007");	//添加统计点，托盘，0007
	},"click");
	
	//用户是否有记录用户名
	var userInfo = Lib.Login.info();
	var defaultName = userInfo.ln;
	if(defaultName){
		$E("login_name").value = defaultName;
	}
	
	//下面的登录
	Lib.passcardOBJ.init($E("login_name"),{
			overfcolor: "#999",		// 鼠标经过字体颜色
			overbgcolor: "#e8f4fc",	// 鼠标经过背景颜色
			outfcolor: "#000000",	// 鼠标离开字体颜色
			outbgcolor: ""			// 鼠标离开背景颜色
		},
		$E("login_pass")
	);
	
	function bindEvent(ele,errEle,event,func) {
		ele[event] = function(){
			func(ele,errEle);
		};
	}
	
	function showError(errEle,msg) {
		if(errEle.className.indexOf('ErrTips') == -1) {
			errEle.className = 'ErrTips';
		}
		errEle.innerHTML = msg;
		errEle.style.display = '';
	}
	
	function clearError(errEle) {
		errEle.innerHTML = '';
		errEle.style.display = 'none';
	}
	
	/*
	bindEvent($E('reloadCode'),null,'onclick',function(ele){
		$E('checkImg').src = 'http://space.sina.com.cn/CheckCode.php?type=4&rt='+ +new Date();
	});
	
	bindEvent($E('checkImg'),null,'onclick',function(ele){
		ele.src = 'http://space.sina.com.cn/CheckCode.php?type=4&rt='+ +new Date();
	});
	*/
	
	$E('login_pass').onkeydown = function(e) {
		var e = e || window.event;
		var currKey = e.keyCode || e.which || e.charCode;
		if (currKey == 13) {
			spLogin();
		}
	}
	
	bindEvent($E('submit'),null,'onclick',function(ele){
		spLogin();
	});
	
	var finalloginErro = $E('loginErro');
	function spLogin() {
		var uname = $E('login_name').value;
		var pwd = $E('login_pass').value;
		if(!uname) {
			showError(finalloginErro,'请输入用户名');
			$E('login_name').focus();
			return;
		}
		if(!pwd) {
			showError(finalloginErro,'请输入密码');
			$E('login_pass').focus();
			return;
		}
		clearError(finalloginErro);
		var request = new Lib.Login.LoginPost(function(loginStatus){
			if (loginStatus.result) {
				Lib.checkAuthor();
//				if($E('login_save').checked) {
//					Utils.Cookie.setCookie("remberloginname", escape($E("login_name").value), 2400, "/", ".blog.sina.com.cn");
//				}
				window.location.reload();
			}
			else {
				showError(finalloginErro,"登录失败 ：" + loginStatus.reason);
			}
		}, false);
		
		if ($E("login_save").checked) {
			request.login(uname, pwd, 15);
		}else{
			request.login(uname, pwd);
		}
	}
    
    if ($E("login_save")) {
        var cancelStatus = 1;
        $E("login_save").checked = true;
        $E("login_save").onclick = function () {
            if (cancelStatus) {
                var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/padblog/padInfo.php?ck_login=A00005&rnd="+Math.random();
                Utils.Io.JsLoad.request(url,{
                    onComplete : function(){}
                    ,onException : function(){}
                });
                cancelStatus = null; 
            }
        }
    }
});