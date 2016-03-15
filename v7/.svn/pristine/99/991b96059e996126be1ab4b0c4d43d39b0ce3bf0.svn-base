/**
 * @desc	活动站登录浮层
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/login/loginPost.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/events/addEvent.js");
$import("lib/suggest.js");
$import("lib/checkAuthor.js");
$import("comps/5years/stylishDialog.js");

$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");

(function(){
	
	var username = $E("username");
	var userpass = $E("userpass");
	var saveStatus = $E("saveStatus");
	var loginBtn = $E("loginBtn");
	var loginQuit = $E("loginQuit");
	
	// 支持修改 class？往后再说。时间超级赶。
	var entity = "";
	
	var loginEntity;
	
	// 登录界面
	if(username){
		
		// 初始化必须清除密码框。
		var mem_name = Utils.Cookie.getCookie("remberloginname");
		username.value = mem_name;
		userpass.value = "";
		if(mem_name){
			saveStatus.checked = true;
		}else{
			saveStatus.checked = false;
		}
		
		// suggest
		Lib.passcardOBJ.init(
			username,
			{
				overfcolor: "#999",		// 鼠标经过字体颜色
				overbgcolor: "#e8f4fc",	// 鼠标经过背景颜色
				outfcolor: "#000000",	// 鼠标离开字体颜色
				outbgcolor: ""			// 鼠标离开背景颜色
			},
			userpass
		);
		
		// 登录提交
		Core.Events.addEvent(loginBtn, function(){
			var n = Core.String.trim(username.value);
			var p = userpass.value;				// 密码不需要，好险
			username.value = n;
			
			if(!validatoin({
				name: n,
				pass: p
			})){
				return;
			}
			loginEntity = new Lib.Login.LoginPost(loginCallback);				// 必须重新初始化，否则 ssoconfig 可能会被另一个 login 覆盖
			loginEntity.login(n, p, saveStatus.checked ? 30 : undefined);		// 如果勾选记住登录 30 天
			
		}, "click");
		
		
		Core.Events.addEvent(userpass, function(evt){
			var key;
			evt = evt || window.event;
			key = evt.keyCode || evt.which;
			if(key == 13){
				Core.Events.fireEvent(loginBtn, "click");
			}
		}, "keydown");			// 不能 keypress 和 keyup，focus 冲突
		
		
		Core.Events.addEvent(username, function(){
			username.select();
		}, "focus");
		
	}
	
	
	// 退出登录界面
	if(loginQuit){
		
		
		
	}
	
	
	
	// 校验用户基本输入
	function validatoin(oDat){
		var name = oDat.name;
		var pass = oDat.pass;
		
		if(!name){
			Comps.stylishDialog.alert("用户名不能为空", {
				funcOk:function(){
					userpass.value = "";
					userpass.focus();
				}
			}, "login");
			return false;
		}
		
		if(!pass){
			Comps.stylishDialog.alert("密码不能为空", {
				funcOk:function(){
					userpass.value = "";
					userpass.focus();
				}
			}, "login");
			return false;
		}
		
		return true;
	}
	
	
	// 登录回调
	function loginCallback(res){
		// res.result = 1;			// 测试用
		if(res.result){
			if(saveStatus.checked){
				Utils.Cookie.setCookie(
					"remberloginname",
					escape(username.value),
					2400,
					"/",
					".blog.sina.com.cn"
				);
			}else{
				Utils.Cookie.setCookie(
					"remberloginname",
					"",
					2400,
					"/",
					".blog.sina.com.cn"
				);
			}
			
			// 暂时刷页面
			window.location.reload();
			
		}else{
			var errMsg = "";
			switch(res.errno){
				case "5":
				case "2091":
				case "80":
				case "101": errMsg = "登录名和密码不匹配，请重试。"; break;
				case "4010": errMsg = "账户尚未确认，请先在邮箱确认"; break;
				default: errMsg = "登录失败，请重试。"; break;
			}
			Comps.stylishDialog.alert(errMsg, {
				icon:"err",
				funcOk:function(){
					userpass.value = "";
					userpass.focus();
				}
			}, "login");
		}
	}
	
	
})();



