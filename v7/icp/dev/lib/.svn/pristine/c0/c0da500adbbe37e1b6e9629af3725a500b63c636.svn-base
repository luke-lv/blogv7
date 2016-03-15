/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 初始化login界面
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/stopEvent.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/core/system/br.js");
$import("sina/core/string/format.js");
$import("sina/core/math/getUniqueId.js");

$import("lib/login/_login.js");
$import("lib/login/info.js");
$import("lib/dialogConfig.js");
$import("lib/login/loginPost.js");
$import("lib/checkAuthor.js");
$import("lib/suggest.js");

$import("sina/core/system/keyValue.js");
$import("lib/login/info.js");

/**
 * @example 
	$import("lib/login/ui.js");
	// - -
	var Login = new Lib.Login.Ui();
	Core.Events.addEvent("login_button", function(){
		Login.login(function(){
			alert("callback!");
		})
	});
 */
 
Lib.Login.Ui = Core.Class.create();

var msnRefreshTimer = 0;
function msnrefreshWindow(){
	var setCookie = Utils.Cookie.setCookie;			// 适配
	var getCookie = Utils.Cookie.getCookie;
	
	clearTimeout(msnRefreshTimer);
	var reg_token = getCookie('reg_token');
	if(reg_token){
		trace("token find out...");
		setCookie('reg_token', '', '', '/', '.blog.sina.com.cn');
	}else{
		trace("no token...");
		msnRefreshTimer = setTimeout(msnrefreshWindow , 1000);
		return;
	}
	
	var cookieArr;
	var cid;
	var code;
	var c_cid = getCookie('c_uid');
	var CBcookie = getCookie('msnLinkCB');
	var altReg = getCookie('AlT');
	
	setCookie("msnLoginComeFrom", window.location.href, 1, "/", ".blog.sina.com.cn");
	if(CBcookie){
		cookieArr = CBcookie.split('_');
		cid = cookieArr[0];
		code = cookieArr[1];
	}
	if(c_cid != cid) return;
	
	// 非 login 域名来的才做此判断
	switch(code){
		case 'noCid':
			break;
		case 'loginError':
			break;
		case 'unlink':
			deleteCookie('msnLinkCB');
			funcNoAccount(reg_token);			// msn登录成功，但没绑定
			break;
		case 'done':
			deleteCookie('msnLinkCB');
			setCookie("loginFromMsn", 'msn', 24, "/", ".blog.sina.com.cn");
			funcSuccess(altReg, reg_token);		// msn已经绑定过了，并成功登录
			break;
		case 'pass':
			break;
	}
	
	// MSN 绑定流程中添加的方法，供 iframe 引用。
	function funcSuccess(arg, reg_tk){
		trace("has Account");
		if(arg){
			trace('alt:' + arg);
			var iframe = $C('iframe');
			iframe.setAttribute('height',0);
			iframe.setAttribute('width',0);
			document.body.appendChild(iframe);
			iframe.src = 'https://login.sina.com.cn/sso/login.php?entry=blogmsn&service=blogmsn&alt='+encodeURIComponent(arg)+'&savestate=7&returntype=TEXT';
			(function(){
				var me = arguments.callee;
				if(!me.count) me.count = 0;
				if(me.count++ > 10){
					trace('放弃获取SUP');
					iframe.parentNode.removeChild(iframe);
					return;
				}
				trace('尝试获取SUP, count:' + me.count);
				if(getCookie('SUP')){
					trace("获取到 SUP"+getCookie("SUP"));
					window.location.reload();
					return;
				}
				setTimeout(me, 1000);
			})();
		}else{
			window.location.reload();
		}
	}
	function funcNoAccount(){
		trace("noAccount");
		window.location.href = "http://blog.sina.com.cn/blog_rebuild/msn/interface/connect_user_confirm.php";
	}
	function deleteCookie(name){
		var Then = new Date();
		Then.setTime(Then.getTime() - 1);
		document.cookie = name + "=_pass;path=/;domain=.blog.sina.com.cn;expires=" + Then.toGMTString();
	}
	function jsonDecode(str){
		if(!str || str == ""){
			return null;
		}
		try{
			return window.eval("(" + str + ")");
		}catch(e){
			return null;
		}
	}
}


Lib.Login.Ui.prototype = {
	dialog: null,
	/**
	 * 是否初始化
	 */
	isInit: false,
	request: null,
	callback: null,
	initialize: function(){
	},
	/**
	 * 登陆方法 
	 * @param callback
	 */
	login: function(callback,clearDomain,from){
		this.callback = callback || null;
		this.clearDomain=clearDomain||false;
		this.from = from||null;
		this.initDom();
        
		this.initEvent();
		this.dialog.show();
		this.dialog.setAreaLocked(true);
		this.reloadName();
		this.onShow();
		this.focus();
		if(scope.$pageid === 'blogMove') {
			$E('login_move_tip').style.display = '';
		}
		if($IE6){
			this.initAD();
		}
		
		// msn 登录的 iframe
		// var msnlogin_ifm = $E("msnlogin_ifm");
		// if(msnlogin_ifm){
		// 	msnlogin_ifm.src = "http://control.blog.sina.com.cn/blog_rebuild/msn/msnButton.php";
		// }
		
		Lib.passcardOBJ.init($E("login_name_d"),{
				overfcolor: "#999",		// 鼠标经过字体颜色
				overbgcolor: "#e8f4fc",	// 鼠标经过背景颜色
				outfcolor: "#000000",	// 鼠标离开字体颜色
				outbgcolor: ""			// 鼠标离开背景颜色
			},
			$E("login_pass_d")
		);
	},
	reloadName : function() {
        var userInfo = Lib.Login.info();
		var defaultName = userInfo.ln;
		if(defaultName){
			$E("login_name_d").value = defaultName;
		}
		var alf = Utils.Cookie.getCookie("ALF");
		if (alf!=""&&$E("login_save")) {
            $E("login_save").checked = true;
            $E('login_save_tips').style.display="none";
		}
		alf = Utils.Cookie.getCookie("LiRe");
		if (alf!=""&&$E("login_save")) {
            $E("login_save").checked = true;
            $E('login_save_tips').style.display="none";
		}
	},
	initDom: function(){
		var me=this;
		this.dialog = winDialog.createCustomsDialog({
			tpl:me.tpl
		});
		this.dialog.addEventListener("hidden",function(){
			this.destroy();
		});
		this.dialog.setContent(this.struc);
		this.dialog.setTitle("登录新浪博客");
		this.dialog.setMiddle();
	},
	initEvent: function(){
		var callback = this.parse.bind2(this);
		this.request = new Lib.Login.LoginPost(callback, this.clearDomain, this.from);			//添加统计点参数 from。
		Core.Events.addEvent("login_button", this.doLogin.bind2(this));
		
		//用户名输入框回车后触发登录事件 
		Core.Events.addEvent("login_name_d", function(e){
			var code = e.keyCode;
			if (code == 13) {	//Enter
				this.doLogin();
			}
		}.bind2(this), "keydown");
		
		//密码输入框回车后触发登录事件 
		Core.Events.addEvent("login_pass_d", function(e){
			var code = e.keyCode;
			if (code == 13) {	//Enter
				this.doLogin();
			}
		}.bind2(this), "keydown");
		var cancelStatus = 1;
		Core.Events.addEvent("login_save",function(){
			if($E('login_save').checked){
				$E('login_save_tips').style.display="";
			}else{
				$E('login_save_tips').style.display="none";
			}
            
            if (cancelStatus) {
                var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/padblog/padInfo.php?ck_login=A00001&rnd="+Math.random();
                Utils.Io.JsLoad.request(url,{
                    onComplete : function(){}
                    ,onException : function(){}
                });
                cancelStatus = null; 
            }
		});
	},
	doLogin: function(){
		Core.Events.stopEvent();
		var username = $E("login_name_d").value;
		var password = $E("login_pass_d").value;
		
		username = Core.String.trim(username);
		password = password;
		if(username == ""){
			this.error("请输入登录名");
			return false;
		}
		if(password == ""){
			this.error("请输入密码");
			return false;
		}
		
		//有验证码的情况
		if (typeof sinaSSOController != 'undefined' && typeof sinaSSOController.loginExtraQuery != 'undefined'){
			if (typeof sinaSSOController.loginExtraQuery.door != 'undefined'){
				var vcode = $E("login_vcode").value;
				sinaSSOController.loginExtraQuery.door = vcode || 1;
			}
		}
		if ($E("login_save").checked) {
			v7sendLog('48_01_38_1');
			this.request.login(username, password,60);
		}else{
			v7sendLog('48_01_38_0');
			this.request.login(username, password);
		}
		return false;
	},
	/**
	 * 解析登录状态
	 * @param {Object} loginStatus 状态object
	 * result: 
		成功时：
		{"result":true,"ticket":ST-XXXX,"userinfo":{"uniqueid":"1234567890"}}
		失败时：
		{"result":false,"reason":"错误描述"}
		 */
	 parse: function(loginStatus){
			if (loginStatus.result) {
				
				//登陆成功
				Lib.checkAuthor();

            if ($E('login_save').checked) {
                //整个博客 cookie 域统一。
                //Utils.Cookie.setCookie("remberloginname", escape($E("login_name_d").value), 2400, "/", ".blog.sina.com.cn");
                Utils.Cookie.setCookie("LiRe",true,2400,"/",".blog.sina.com.cn");
            } else {
                //Utils.Cookie.setCookie("remberloginname", "", 2400, "/", ".blog.sina.com.cn");
                Utils.Cookie.setCookie("LiRe","",2400,"/",".blog.sina.com.cn");
            }
			
			// 促登陆项目，设置一个新Cookie，记录登陆用户的uid和登录时间。保持30天(720小时)
			// time： 登录当天的24点。在time之后，显示促登陆项目
			// var onceloggedonblog = unescape(Utils.Cookie.getCookie("onceloggedonblog"));
			var date = new Date(),y = date.getFullYear(),m = date.getMonth(),d = date.getDate();
			var time = new Date(y,m,d,24).getTime();
			// var cookieStr = "&uid="+$UID+"&time="+time;
			Utils.Cookie.setCookie("onceloggedonblog", time, 720, "/", ".blog.sina.com.cn");
			
            //执行回调或重加载页面
            var me = this;
            function cbreload(){
                if (this.callback) {
                    try {
                        $tray.renderLogin();
                    } catch(e) {
                    }
                    this.callback.call();//重新加载页面
                } else {
                    window.location = window.location.toString().replace(/#.*/, "");
                }
            }

            //请求用户是否绑定邮箱，如果还没有绑定邮箱则调用scope.$bindEmailAlert，提示用户绑定邮箱。
            var cbed = false; //
            Utils.Io.JsLoad.request("http://login.sina.com.cn/bindmail/checkmailuser.php?entry=blog&name=" + encodeURIComponent($E("login_name_d").value) + "&utf82gbk=1&callback=scope.$bindEmailAlert", {
                noreturn: true,
                timeout: 5000,
                //如果超时或发生异常，直接回调刷新
                onException:function(){
                    //这里没有按照预料的方式执行,无论成功与否超时后都会触发onException, 所以使用cbed标记是否回调了。
                    if (!cbed){
                        cbreload.call(me);
                    }

                }
            });

            //绑定邮箱的回调
            scope.$bindEmailAlert = function(data) {
                cbed = true;
                if ((data.ret != 'y' && data.errcode != 'not_verify') || Utils.Cookie.getCookie("sbr_noTBE") == 1) {//已绑定邮箱(或设置了不提醒)，直接回调刷新
                    cbreload.call(me);
                } else {//提示用户绑定邮箱
                    var dialog = winDialog.createCustomsDialog({
                        content : ['<div id="#{entityID} style="width:358px;height:144px" class="CP_layercon2 unilayer">',
                                '<div id="#{contentID}" class="CP_prompt">',
                                '<img height="50" align="absmiddle" width="50" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon201">',
                                '<table class="CP_w_ttl"><tbody><tr><td>经检测您的帐号存在一定的安全隐患！<br>建议绑定邮箱</td></tr></tbody></table>',
                                '<p class="CP_w_btns_Mid"><a href="javascript:;" class="SG_aBtn SG_aBtnB" id="#{bindit}" target="_blank"><cite> 绑定 </cite></a>&nbsp;&nbsp;<a href="javascript:;" class="SG_aBtn SG_aBtnB" id="#{nobind}"><cite> 暂不绑定 </cite></a></p>',
                                '</div>',
                                '<div class="unilayerB SG_j_linedot1">',
                                    '<p class="SG_txtb"><input type="checkbox" id="#{noalertbind}"><label for="#{noalertbind}">一周内不提醒</label></p>',
                                '</div>',
                                '</div>'].join(''),
                        shadow: 1
                    },'bindEmail');
                    dialog.setMiddle();
                    dialog.show();
                    dialog.nodes['btnClose'].onclick = function() {
                        cbreload.call(me);
                        dialog.hidden();
                    };
                    dialog.nodes['nobind'].onclick = function() {
                        //不知为什么ie请求会出现abort，只有这么干了。
                        setTimeout(function(){
                            cbreload.call(me);
                            dialog.hidden();
                        }, 100);
                    };
                    dialog.nodes['bindit'].href = 'http://login.sina.com.cn/bindmail/bindmail.php?entry=blog';
                    dialog.nodes['bindit'].onclick = function(){
                        cbreload.call(me);
                    };
                    dialog.nodes['noalertbind'].onclick = function(){
                        if (this.checked){
                            Utils.Cookie.setCookie("sbr_noTBE", "1", 24*7, "/", ".blog.sina.com.cn");
                        }else{
                            Utils.Cookie.setCookie("sbr_noTBE", "", 0, "/", ".blog.sina.com.cn");
                        }
                    };
                }
            }
            
            //关闭登陆对话框
            this.dialog.hidden();
        }
        else {
            if (loginStatus.errno === '4049'){ //异地登陆，弹出验证码
                sinaSSOController.loginExtraQuery = { door : 0 } //初始化vcode
                $E('login_ckimg').style.display = '';
                $E('login_vcode').value = '';
                $E('checkImg').src = 'http://login.sina.com.cn/cgi/pin.php?r='+ Core.Math.getUniqueId() +'&s=0';
                //bind reload code
                Core.Events.addEvent($E('reloadCode'), function(){
                    $E('checkImg').src = 'http://login.sina.com.cn/cgi/pin.php?r='+ Core.Math.getUniqueId() +'&s=0';
                    $E('login_vcode').value = '';
                    $E('login_div_error').innerHTML = '';
                });
                
                this.error('');
                return;
            }

            if (loginStatus.errno === '2070'){ //验证码出错
                Core.Events.fireEvent($E('reloadCode'), 'click');
                this.error(loginStatus.reason);
                return;
            }

            if(loginStatus.errno == '4047'){ //帐号被锁定
                this.error(loginStatus.reason);
                return;
            }

            else if(loginStatus.errno == '4057'){ //帐号有异常
                this.error(loginStatus.reason);
                return;
            }

            else if(loginStatus.errno == '4040'){
                this.error(loginStatus.reason);
                return;
            }
            //登陆失败
            //下线人性化错误提示
            //this.error(this.friendlyTip(loginStatus.reason));
            this.error('登录名或密码错误');
            $E('checkImg').src = 'http://login.sina.com.cn/cgi/pin.php?r='+ Core.Math.getUniqueId() +'&s=0';
            $E('login_vcode').value = '';
        }
	},
	/**
	 * 更人性化的错误提示
	 * @author Luo Rui luorui1@staff.sina.com.cn
	 * @created 2010-04-12
	 */
	friendlyTip: function(reason){
		var ret = reason;
		var node = $E("login_name_d");
		var name = node.value;
		var me = this;
		if (!/[\u0391-\uFFE5]+/.test(name) && !/^\d+$/.test(name) && !/^@/.test(name)) { //非数字,非中文,非@打头
			var str = '你的登录名可能是 ';
			var linkTpl = '<a href="#" class="underline" onclick="$_RENAME(/@.*/, \'{1}\');return false">{0}{1}</a>';
			var linkArr = ['@sina.com', '@sina.cn'];
			var finalLink = '';
			if (/@sina\.cn$/.test(name)){
				finalLink = linkTpl.format('{0}', linkArr[0]);
			}else if (/@sina\.com$/.test(name)){
				finalLink = linkTpl.format('{0}', linkArr[1]);
			}else{
				finalLink = linkTpl.format('{0}', linkArr[0]) + ' 或 ' +linkTpl.format('{0}', linkArr[1]);
			}
			ret = (str + finalLink).format(name.replace(/@.*/, ''));
		}
		return ret;
	},
	/**
	 * 重命名登录名
	 * @author Luo Rui luorui1@staff.sina.com.cn
	 * @created 2010-04-12
	 */
	rename: (function(){
		window.$_RENAME = function(reg, suf){
			var node = $E("login_name_d");
			node.value = node.value.replace(reg, '') + suf;
			$E("login_pass_d").focus();
			$E("login_div_error").innerHTML = '';
		};
		return window.$_RENAME;
	})(),
	/**
	 * 让登录框获取焦点
	 * @author Random | Yanghao@staff.sina.com.cn
	 * @created 2009-09-17
	 */
	focus:function(){
        
        var nameEl = $E("login_name_d");
        
		if (nameEl.value == "") {
			nameEl.focus();
		} else {
			$E("login_pass_d").focus();
		}
	},
	
	// <iframe id="msnlogin_ifm" scrolling="no" height="24" frameborder="0" width="77" style="vertical-align: middle;" allowtransparency="yes"></iframe>\
	/**
	 * 初始化底部广告(防止在IE6下会被Aborted)
	 * @author Random | Yanghao@staff.sina.com.cn
	 * @created 2009-09-17
	 */
	initAD:function(){
		$E("login_ad").src="http://blog.sina.com.cn/lm/iframe/71/2008/0731/21.html";
	},
	/**
	 * 显示时触发
	 * @author Random | Yanghao@staff.sina.com.cn
	 * @created 2009-09-17
	 */
	onShow:function(){
		
	},
	error : function(msg){
		$E("login_div_error").innerHTML = msg;
		$E("login_pass_d").value="";
		this.focus();
	},
	tpl:['<table id="#{panel}" class="CP_w">',
		'<thead id="#{titleBar}">',
			'<tr>',
				'<th class="tLeft"><span></span></th>',
				'<th class="tMid">',
					'<div class="bLyTop">',
						'<strong id="#{titleName}">提示标题</strong>',
						'<cite><a id="#{btnClose}" href="#" onclick="return false;" class="CP_w_shut" title="关闭">关闭</a></cite>',
					'</div>',
				'</th>',
				'<th class="tRight"><span></span></th>',
			'</tr>',
		'</thead>',
		'<tfoot>',
			'<tr>',
				'<td class="tLeft"><span></span></td>',
				'<td class="tMid"><span></span></td>',
				'<td class="tRight"><span></span></td>',
			'</tr>',
		'</tfoot>',
		'<tbody>',
			'<tr>',
				'<td class="tLeft"><span></span></td>',
				'<td class="tMid" id="#{content}">',
				'</td>',
				'<td class="tRight"><span></span></td>',
			'</tr>',
		'</tbody>',
	'</table>'].join(""),
	struc: '\
		<div class="CP_layercon2 passLoginItem">\
			<div>\
				<div id="login_move_tip" style="display:none;margin-bottom:12px">可以使用新浪微博、邮箱、通行证的帐号进行登录</div>\
				<div class="boxA">登录名：\
					<input tabIndex="201" type="text" class="fm1" style="width:215px;" name="login_name" id="login_name_d" tabIndex=1/>  <a style="font-size: 12px;" href="http://login.sina.com.cn/signup/signupmail.php?entry=blog&srcuid='+scope.$uid+'&src=blogicp" target="_blank">立即注册</a>\
				</div>\
				<div class="boxA">密　码：\
					<input tabIndex="202" type="password" class="fm1" style="width:215px;" name="login_pass" maxlength="16" id="login_pass_d" tabIndex=2/>  <a style="font-size: 12px;" href="http://login.sina.com.cn/getpass.html" target="_blank">找回密码</a>\
				</div>\
				<div id="login_ckimg" class="boxA" style="display:none"> <p class="p_img">验证码：\
                  	<input type="text" id="login_vcode" name="login_vcode" class="fm1" size="10" maxlength="5" /> \
                 	<img width="100" align="absmiddle" id="checkImg" src="http://login.sina.com.cn/cgi/pin.php?r='+ Core.Math.getUniqueId() +'&s=0" /> <a href="javascript:;" onclick="return false;" style="font-size: 12px;"><span id="reloadCode">换一换</span></a></p> \
			    </div>\
				<div class="ErrTips" id="login_div_error"></div>\
				<div class="boxB"><p><input tabIndex="203" type="checkbox" value="" id="login_save" checked="checked" /><label for="login_save"> 记住登录状态</label></p><p id="login_save_tips" style="color:#999;display:none;">建议在网吧/公用电脑上取消该选项</p><p style="margin-top: 8px;"><a id="login_button" class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="javascript:;" tabIndex=204><cite>登录<input type="text"/></cite></a> </p></div>\
			</div>\
			<div class="connect_msn" id="connect_msn" style="position:relative;">\
				<span>使用 MSN 帐号登录博客</span>\
				<a href="#" onclick="Lib.checkAuthor();v7sendLog(\'48_01_36\'); window.open(\'https://login.live.com/oauth20_authorize.srf?client_id=0000000040046F08&redirect_uri=http%3A%2F%2Fcontrol.blog.sina.com.cn%2Fblog_rebuild%2Fmsn%2FmsnLoginCallBack.php&response_type=code&scope=wl.basic%20wl.signin%20wl.offline_access%20wl.share%20wl.emails\',\'neww\',\'left='+(screen.width-440)/2+',top='+(screen.height-400)/2+',height=400,width=440\');msnrefreshWindow();" style="background:transparent url(http://simg.sinajs.cn/blog7style/images/msn_login01.gif) no-repeat left top; width:70px; height:22px; line-height:22px; display:inline-block; text-align:left; text-indent:2em; text-decoration:none; color:white; font-weight:bold; font-size:14px;">登录</a>\
			</div>\
			<a href="http://blog.sina.com.cn/s/blog_4b0f52990100miil.html" target="_blank"style="left:308px;position:relative;top:-24px;">如何登录？</a>\
			<div class="CP_lg_ad SG_j_linedot1">\
				<iframe id="login_ad" src="http://blog.sina.com.cn/lm/iframe/71/2008/0731/21.html" frameborder="0" scrolling="no" height="25" width="auto"></iframe>\
			</div>\
		</div>'
};
