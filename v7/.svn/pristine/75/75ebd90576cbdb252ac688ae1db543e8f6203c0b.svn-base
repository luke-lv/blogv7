/**
 * @desc	MSN Space 搬家，第三步
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 * @update	luorui | luorui1@staff.sina.com.cn 时间短，改的乱。。。
 * @update	dcw1123 | chengwei1@staff.sina.com.cn 大改…… 2010.12.02
 */
$import("lib/jobs.js");
$import("msg/sregMsg.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/login/loginPost.js");
$import("lib/suggest.js");
$import("lib/checkAuthor.js");

$import("sina/core/dom/insertAfter.js");
$import("sina/core/system/br.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/j2o.js");

$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");

$import("comps/jsload_2.js");
$import("comps/ijax_2.js");


$registJob("msnLogin", function(){
	
	
	// 页面刷新时，focus 提醒一下
	window.focus();
	if(!$IE){
		window.blur();
	}
	
	// 跳转 Enum
	var TO_UNLOGIN = 0;
	var TO_IS_LOGIN = 1;
	var TO_MSN_NO_OCCUPY = 2;
	var TO_MSN_OCCUPY = 3;
	var TO_OCCUPY_BUT_AUTO_FAIL = 4;
	
	var TIMEOUT_VAL = 15000;
	
	
	////////////////
	// LOADING
	////////////////
	function createNode(txt){
		var _box = $C("div");
		var _node;
		_box.innerHTML = txt;
		_node = _box.childNodes[0];
		return _node;
	}
	function Loading(relNode){
		var layer = createNode('<span class="move_cheking" style="display:none"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"> 加载中…</span>');
		Core.Dom.insertAfter(layer, relNode || document.body);
		
		return {
			afterBy:function(relNode){
				Core.Dom.insertAfter(layer, relNode || document.body);
			},
			hide:function(){
				layer.style.display = "none";
			},
			show:function(){
				layer.style.display = "";
			}
		};
	}
	
	
	/////////////////////////////
	// 未登录的视图
	/////////////////////////////
	var unLogin = {
		name:			"unLogin",
		isInited:		false,
		inProgress:		false,
		isBlogMoved:	undefined,
		loginObj:		null,
		loading:		null,		// 统一名字。如果有多个 loading，可以做一个 loading 管理器，统一名字。
		
		layer:			$E("sina_unlogin"),
		loginName:		$E("loginName"),
		loginPass:		$E("loginPass"),
		loginBtn:		$E("loginBtn"),
		
		init: function(){
			setBackLink();
			if(this.isInited) return;
			this.isInited = true;
			
			var _this = this;
			this.loading = new Loading(this.loginBtn);
			
			// 检测是否可以按，这个会一直执行
			var fixLoginFunc = _this.login.bind2(unLogin);
			setInterval(function(){			// 非匿名的函数，addEvent 多次没有关系
				if(_this.checkInput()){
					Core.Events.addEvent(_this.loginBtn, fixLoginFunc, "click");
					_this.loginBtn.className = "move_btn027";		// 27 亮，22 暗
				}else{
					Core.Events.removeEvent(_this.loginBtn, fixLoginFunc, "click");
					_this.loginBtn.className = "move_btn022";		// 27 亮，22 暗
				}
			}, 200);
			
			Core.Events.addEvent(this.loginName, function(evt){
				var keyCode;
				evt = window.event || evt;
				keyCode = evt.which || evt.keyCode;
				if(keyCode == 13){
					_this.loginPass.focus();
				}
			}, "keypress");
			
			Core.Events.addEvent(this.loginPass, function(evt){
				var keyCode;
				evt = window.event || evt;
				keyCode = evt.which || evt.keyCode;
				if(keyCode == 13){
					Core.Events.fireEvent(_this.loginBtn, "click");
				}
			}, "keypress");
			
			// suggest
			Lib.passcardOBJ.init(
				this.loginName, 
				{
					overfcolor:		"#999",		// 鼠标经过字体颜色
					overbgcolor:	"#e8f4fc",	// 鼠标经过背景颜色
					outfcolor:		"#000000",	// 鼠标离开字体颜色
					outbgcolor:		""			// 鼠标离开背景颜色
				},
				this.loginPass
			);
			
			// loginObj 初始化
			if(isMoved == 1){					// 已经 MSN 搬家过了的
				this.loginObj = new Lib.Login.LoginPost(function(res){
					if(res.result){
						var matchLoginName = getUserLoginName();			// 从 cookie 获取登录名。
						
						// 检测当前登录的博客是否已经搬过家
						Utils.Io.JsLoad_2.request("http://move.blog.sina.com.cn/blog_rebuild/msn/api/checkMoved.php", {
							timeout: TIMEOUT_VAL,
							onComplete:function(res){
								if(res.code == "A00006"){									// 博客帐号未搬家过，所以 checkbox 不用显示。
									isLogin.moveCommetToo.checked = false;					// checkbox 不显示，取消打勾。
									isLogin.moveCommetToo.parentNode.parentNode.style.display = "none";		// 父节点消失
									isLogin.movingBtn_ihave.className = "move_btn021";		// 按钮变绿。
									
									_this.isBlogMoved = false;
									setDirection(TO_IS_LOGIN);
								}
								else{
									if(res.code == "A0088" || res.code == "A0089"){			// 博客帐号已被搬家过，相对的，msn 帐号也有搬过，只是输出在页面了。
										isLogin.moveCommetToo.checked = false;				// checkbox 显示，并默认不上勾。
										isLogin.moveCommetToo.parentNode.parentNode.style.display = "";
										isLogin.moveCommetToo.onclick = function(){
											if(isLogin.moveCommetToo.checked){
												isLogin.movingBtn_ihave.className = "move_btn021";
												isLogin.clickCheck.style.display = "none";
											}else{
												isLogin.movingBtn_ihave.className = "move_btn026";
											}
										};
										_this.isBlogMoved = true;
										setDirection(TO_IS_LOGIN);
									}else{
										onRegistOrMsnBindingError(res, unLogin);
									}
								}
								
								_this.progressOver();
							},
							onException:function(res){
								if(res == "timeout"){
									systemBusyAlert();
									Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/riaapi/msn/apinote.php", {		// 超时日志
										GET:{
											api:"checkMoved_unlogin",
											uid:getUserUID()
										}
									});
								}else{
									winDialog.alert("失败！");
								}
								
								_this.progressOver();
							}
						});
						
						isLogin.hotmail_name_l.innerHTML = matchLoginName;		// 另两个视图的邮箱名称提示。
						
						_this.loginName.value = "";			// 应清空表单。
						_this.loginPass.value = "";
						
						// 种上一个 cookie，取用 msn 和 blog 两个帐号，表示是本页面登录的，可以刷新。否则强制用户重新登录。
						// 页面退出时，删除本 cookie！12 分钟有效。
						Utils.Cookie.setCookie("curPageLoginMark", (userHotmail+"|"+matchLoginName), 0.2, "/", ".blog.sina.com.cn");
						
						// 单独种一个 uid cookie，用于跳转管制
						Utils.Cookie.setCookie("redirectRestrict", getUserUID(), 0.2, "/", ".blog.sina.com.cn");
					}else{
						winDialog.alert(res.reason, {
							funcOk: function(){
								_this.loginPass.value = "";		// 应清空密码
								setTimeout(function(){
									_this.loginPass.focus();
								}, 0);
							}
						});
						_this.progressOver();
					}
				});
			}
			
			else{								// 未 MSN 搬家过的。直接进行 banding
				this.loginObj = new Lib.Login.LoginPost(function(res){
					if(res.result){
						var matchLoginName = getUserLoginName();
						
						// 种上一个 cookie，取用 msn 和 blog 两个帐号，表示是本页面登录的，可以刷新。否则强制用户重新登录。
						// 页面退出时，删除本 cookie！12 分钟有效。
						Utils.Cookie.setCookie("curPageLoginMark", (userHotmail+"|"+matchLoginName), 0.2, "/", ".blog.sina.com.cn");
						
						// 单独种一个 uid cookie，用于跳转管制
						Utils.Cookie.setCookie("redirectRestrict", getUserUID(), 0.2, "/", ".blog.sina.com.cn");
						
						msnBinding(unLogin);
					}else{
						winDialog.alert(res.reason, {			// 登录失败
							funcOk: function(){
								_this.loginPass.value = "";		// 清空密码
								setTimeout(function(){
									_this.loginPass.focus();
								}, 0);
							}
						});
						_this.progressOver();
					}
				});
			}
		},
		
		progressStart:function(){
			this.inProgress = true;
			this.loading.show();
		},
		
		progressOver:function(){
			this.inProgress = false;
			this.loading.hide();
		},
		
		checkInput: function(){
			return (Core.String.trim(this.loginName.value) && Core.String.trim(this.loginPass.value));
		},
		
		login: function(){
			if(this.inProgress) return;
			this.progressStart();
			
			var _name = this.loginName.value;
			var _pass = this.loginPass.value;
			var _name_trim = Core.String.trim(_name);
			
			this.loginObj.login(_name_trim, _pass, 15);
		}
	};
	
	
	/////////////////////////////
	// 已登录的视图
	/////////////////////////////
	var isLogin = {
		name:				"isLogin",
		isInited:			false,
		inProgress:			false,
		
		layer:				$E("sina_islogin"),
		hotmail_name_l:		$E("hotmail_name_l"),
		changeIdBtn:		$E("changeIdBtn"),
		movingBtn_ihave:	$E("movingBtn_ihave"),
		moveCommetToo:		$E("moveCommetToo"),
		clickCheck:			$E("click_check"),
		loading:			null,
		
		
		init:function(){
			setBackLink();
			if(this.isInited) return;
			this.isInited = true;
			
			this.loading = new Loading(this.movingBtn_ihave);
			
			// 搬家确认
			Core.Events.addEvent(this.movingBtn_ihave, this.submit.bind2(isLogin));
			
			// 从 cookie 获取登录名。
			var matchLoginName = getUserLoginName();
			isLogin.hotmail_name_l.innerHTML = matchLoginName;		// 另两个视图的邮箱名称提示。
			msnNoOccupy.hotmail_name_r && (msnNoOccupy.hotmail_name_r.innerHTML = matchLoginName);		// 不一定会初始化这个
			
			// 检测当前登录的博客是否已经搬过家
			Utils.Io.JsLoad_2.request("http://move.blog.sina.com.cn/blog_rebuild/msn/api/checkMoved.php", {
				timeout: TIMEOUT_VAL,
				onComplete:function(res){
					if(res.code == "A00006"){												// 博客帐号未搬家过，所以 checkbox 不用显示。
						isLogin.moveCommetToo.checked = false;								// checkbox 不显示，取消打勾。
						isLogin.movingBtn_ihave.className = "move_btn021";					// 按钮变绿
						isLogin.moveCommetToo.parentNode.parentNode.style.display = "none";	// 父节点消失
					}
					else{
						if(res.code == "A0088" || res.code == "A0089"){	// 博客帐号已被搬家过，相对的，msn 帐号也有搬过，只是输出在页面了。
							isLogin.moveCommetToo.checked = false;					// checkbox 显示，并默认不上勾。
							isLogin.moveCommetToo.parentNode.parentNode.style.display = "";		// 是一个 tr
							isLogin.moveCommetToo.onclick = function(){
								if(isLogin.moveCommetToo.checked){
									isLogin.movingBtn_ihave.className = "move_btn021";
									isLogin.clickCheck.style.display = "none";
								}else{
									isLogin.movingBtn_ihave.className = "move_btn026";
								}
							};
						}else{
							isLogin.moveCommetToo.checked = false;						// checkbox 不显示，取消打勾。
							isLogin.moveCommetToo.parentNode.parentNode.style.display = "none";	// 父节点消失
							isLogin.movingBtn_ihave.className = "move_btn021";			// 按钮变绿
						}
					}
				},
				onException:function(res){
					if(res == "timeout"){
						systemBusyAlert();
						Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/riaapi/msn/apinote.php", {		// 超时日志
							GET:{
								api:"checkMoved_login",
								uid:getUserUID()
							}
						});
					}else{
						winDialog.alert("失败！");
					}
				}
			});
		},
		
		progressStart:function(){
			this.inProgress = true;
			this.loading.show();
		},
		
		progressOver:function(){
			this.inProgress = false;
			this.loading.hide();
		},
		
		submit: function(){
			if(this.inProgress) return;
			this.progressStart();
			
			// 显示 checkbox 并且未勾选
			if(this.moveCommetToo.parentNode.parentNode.style.display != "none" && !this.moveCommetToo.checked){
				this.clickCheck.style.display = "";
				this.progressOver();
				return;
			}
			
			var _hotmail_name = this.hotmail_name_l.innerHTML;
			var _this = this;
			
			Lib.checkAuthor();
			
			if($isLogin){
				if(testBind == "linked"){					// 如果在 msn 有绑定的前提下
					var cur_uid = getRestrictUID();			// 获取本页登录且依然登录有效的 uid。
					if(cur_uid){
						
						// 需要查看是否本次 博客帐号 和 msn 帐号 是否已绑定
						Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/checkLink.php", {
							timeout: TIMEOUT_VAL,
							onComplete:function(res){
								if(res.code == "A00006"){				// msn 和 blog 是绑定关系，直接跳转。
									msnBinding(isLogin);
								}
								else{									// msn 和 当前登录 blog 不是绑定关系。
									onRegistOrMsnBindingError(res, isLogin);
								}
							},
							onException:function(res){
								if(res == "timeout"){
									systemBusyAlert();
									Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/riaapi/msn/apinote.php", {		// 超时日志
										GET:{
											api:"checkLink",
											uid:getUserUID()
										}
									});
								}else{
									winDialog.alert("失败！");
								}
								_this.progressOver();
							}
						});
					}else{
						winDialog.alert("登录失效，请重新登录", {		// 搬家流程的，必须跳到第一页。
							funcOk:function(){
								window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";	// 跳转第一步。
							},
							funcClose:function(){
								window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";	// 跳转第一步。
							}
						});
						_this.progressOver();
					}
				}else{							// msn 帐号未绑定过，直接上接口绑定
					msnBinding(isLogin);
				}
				
			}else{		// 未登录
				setDirection(TO_UNLOGIN);
				_this.progressOver();			// 按键激活。
			}
		}
	};
	
	
	/////////////////////////////
	// 新帐号搬家，且 hotmail 名在新浪未被占用的确认搬家视图, 只会出现在MSN名未占用情况下
	/////////////////////////////
	var msnNoOccupy = {
		name:				"msnNoOccupy",
		isInited:			false,
		inProgress:			false,
		
		layer:				$E("hotmail_moving_confirm"),
		hotmail_name_r:		$E("hotmail_name_r"),
		count_pass:			$E("count_pass"),
		confirm_count_pass:	$E("confirm_count_pass"),
		movingBtn_isnew:	$E("movingBtn_isnew"),
		passok:				false,
		passok2:			false,
		loading:			null,
		
		init:function(){
			$E('nameTip').style.display = 'none';
			this.count_pass.value = '';
			this.confirm_count_pass.value = '';
			verifyMsg('tips4');
			verifyMsg('tips5');
			setBackLink(0);
			
			if(this.isInited) return;
			this.isInited = true;
			
			this.loading = new Loading(this.movingBtn_isnew);
			
			// 提交按钮视觉变化
			var _this = this;
			var fixedSubmit = this.submit.bind2(msnNoOccupy);
			setInterval(function(){					// 非匿名的函数，addEvent 多次没有关系
				if(_this.checkInput()){
					_this.movingBtn_isnew.className = "move_btn021";
					Core.Events.addEvent(_this.movingBtn_isnew, fixedSubmit, "click");			// 搬家确认
				}else{
					_this.movingBtn_isnew.className = "move_btn026";
					Core.Events.removeEvent(_this.movingBtn_isnew, fixedSubmit, "click");		// 搬家确认
				}
			}, 200);
			
			// 第二次密码回车，提交
			Core.Events.addEvent(this.confirm_count_pass, function(evt){
				var keyCode;
				evt = window.event || evt;
				keyCode = evt.which || evt.keyCode;
				if(evt.keyCode == 13){
					_this.movingBtn_isnew.blur();
					Core.Events.fireEvent(_this.movingBtn_isnew, "click");
				}
			}, "keypress");
			
			// 第一次密码
			var keypressTimer1 = 0;
			Core.Events.addEvent(this.count_pass, function(){
				_this.checkPass(0);
			}, 'blur');
			Core.Events.addEvent(this.count_pass, function(){
				clearTimeout(keypressTimer1);
				keypressTimer1 = setTimeout(function(){
					_this.checkPass(0);
				}, 500);
			}, 'keypress');
			
			// 第二次密码
			var keypressTimer2 = 0;
			Core.Events.addEvent(this.confirm_count_pass, function(){
				_this.checkPass(1);
			}, 'blur');
			Core.Events.addEvent(this.confirm_count_pass, function(){
				clearTimeout(keypressTimer2);
				keypressTimer2 = setTimeout(function(){
					_this.checkPass(1);
				}, 500);
			}, 'keypress');
		},
		
		progressStart:function(){
			this.inProgress = true;
			this.loading.show();
		},
		
		progressOver:function(){
			this.inProgress = false;
			this.loading.hide();
		},
		
		checkInput: function(){
			var checkboxObj=$E("isAgreeCheckbox");
			return this.passok && this.passok2 && checkboxObj && checkboxObj.checked;
		},
		
		checkPass: function(mode){
			var _count_pass = this.count_pass.value;
			var _confirm_count_pass = this.confirm_count_pass.value;
			var _this = this;
			
			// 密码校验，四个
			if(mode == 0){
				if(!_count_pass){
					verifyMsg('tips4', 48, ' 请输入密码');
					this.progressOver();
					this.passok = false;
					return;
				}else if(/[^\x21-\x7e]/.test(_count_pass)){
					verifyMsg('tips4', 48, ' 密码只能由数字、字母和符号组成');
					this.progressOver();
					this.passok = false;
					return;
				}else if(_count_pass.length < 6){
					verifyMsg('tips4', 48, ' 太短了，至少6位密码');
					this.progressOver();
					this.passok = false;
					return;
				}
				
				verifyMsg('tips4', 49);
				_this.checkPass(1);
				this.passok = true;
				
			}else if(mode == 1){
				if(_confirm_count_pass !== _count_pass){
					verifyMsg('tips5', 48, _confirm_count_pass.length>0?' 两次输入的密码不同':'请再次输入密码');
					this.progressOver();
					this.passok2 = false;
					return;
				}
				
				if(_confirm_count_pass && _count_pass){
					verifyMsg('tips5', 49);
				}
				this.passok2 = true;
				return true;
			}
		},
		
		hasToken:function(){
			if(regToken){
				return true;
			}else{
				winDialog.alert("您的操作可能已经失效，请点击确定返回第一步", {
					funcOk:function(){
						window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";
					},
					funcClose:function(){
						window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";
					}
				});
				return false;
			}
		},
		
		submit: function(){
			if(this.inProgress) return;
			this.progressStart();
			
			var _count_pass = this.count_pass.value;
			var _confirm_count_pass = this.confirm_count_pass.value;
			var _hotmail_name = this.hotmail_name_r.innerHTML;
			var _regnick = _hotmail_name.indexOf("@")>-1 ? _hotmail_name.slice(0, _hotmail_name.indexOf("@")) : _hotmail_name;
			var _this = this;
			
			if(!this.hasToken()){
				this.progressOver();
				return;
			}
			
			// 提交注册
			if(this.passok && this.passok2){
				
				Utils.Io.Ijax_2.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/sina_Reg.php?move=true&view="+this.name, {
					timeout: TIMEOUT_VAL,
					GET:{
						t:			new Date().getTime().toString().slice(-5)
					},
					POST:{
						regname:	_hotmail_name,
						regnick:	_regnick,
						token:		regToken,
						regpwd:		_count_pass
					},
					onComplete:function(res){
						if(res.code == "A00006"){
							toMsnLive(msnNoOccupy);
						}
						else{
							onRegistOrMsnBindingError(res, msnNoOccupy);
						}
					},
					onException:function(res){
						if(res == "timeout"){
							systemBusyAlert();
							Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/riaapi/msn/apinote.php", {		// 超时日志
								GET:{
									api:"sinaReg_noOcc",
									uid:getUserUID()
								}
							});
						}else{
							winDialog.alert("失败！");
						}
						_this.progressOver();
					}
				});
				
			}else{
				this.progressOver();
			}
		}
	};
	
	/////////////////////////////
	// 新帐号搬家，且 hotmail 名在新浪被占用, 且自动生成失败的视图
	/////////////////////////////
	var msnOccupyButAutoFail = {
		name:				"msnOccupyButAutoFail",
		isInited:			false,
		inProgress:			false,
		loading:			null,
		
		layer:					$E("hotmail_custom"),
		hotmail_custom_name:	$E("hotmail_custom_name"),
		count_custom_pass:		$E("count_custom_pass"),
		confirm_custom_pass:	$E("confirm_custom_pass"),
		movingBtn_custom:		$E("movingBtn_custom"),
		
		userok:			false,
		passok:			false,
		passok2:		false,
		
		init:function(){
			var _this = this;
			
			$E('nameTip').style.display = 'none';
			this.count_custom_pass.value = '';
			this.confirm_custom_pass.value = '';
			verifyMsg('tips2');
			verifyMsg('tips3');
			setBackLink(0);
			
			if(this.isInited) return;
			this.isInited = true;
			
			// 提交按钮视觉变化
			var fixedSubmit = this.submit.bind2(msnOccupyButAutoFail);
			setInterval(function(){																// 非匿名的函数，addEvent 多次没有关系
				if(_this.checkInput()){															// 亮
					Core.Events.addEvent(_this.movingBtn_custom, fixedSubmit, "click");			// 搬家确认
					_this.movingBtn_custom.className = "move_btn021";							// 21 亮，26 暗
				}else{
					Core.Events.removeEvent(_this.movingBtn_custom, fixedSubmit, "click");
					_this.movingBtn_custom.className = "move_btn026";							// 21 亮，26 暗
				}
			}, 200);
			
			this.loading = new Loading(this.movingBtn_custom);
			this.hotmail_custom_name.value = userHotmail.split('@')[0];
			
			// 第二次密码回车，提交接口
			Core.Events.addEvent(this.confirm_custom_pass, function(evt){
				var keyCode;
				evt = window.event || evt;
				keyCode = evt.which || evt.keyCode;
				if(evt.keyCode == 13){
					_this.movingBtn_custom.blur();
					Core.Events.fireEvent(_this.movingBtn_custom, "click");
				}
			}, "keypress");
			
			// 用户输入栏需要聚焦后消失提示
			Core.Events.addEvent(this.hotmail_custom_name, function(){
				verifyMsg("tips1");
			}, "focus");
			
			// 用户名输入验证
			Core.Events.addEvent(this.hotmail_custom_name, function(){
				var value = _this.hotmail_custom_name.value;
				value = Core.String.trim(value);
				if(!value){
					verifyMsg('tips1', 48, ' 请填写邮箱名');
					this.progressOver();
					this.userok = false;
					return;
				}else if(/[^a-z0-9_]/.test(value)){
					verifyMsg('tips1', 48, ' 请用英文小写、数字、下划线');
					this.progressOver();
					this.userok = false;
					return;
				}else if(!/^[^_].*[^_]$/.test(value)){
					verifyMsg('tips1', 48, ' 首尾不能是下划线');
					this.progressOver();
					this.userok = false;
					return;
				}else if(value.replace(/[\d]/g, '').length == 0){
					verifyMsg('tips1', 48, ' 不能全是数字');
					this.progressOver();
					this.userok = false;
					return;
				}else if(value.length > 16){
					verifyMsg('tips1', 48, ' 邮箱名必须 4-16 个字符');
					this.progressOver();
					this.userok = false;
					return;
				}
				_this.checkUser(function(){});
			}, 'blur');
			
			// 第一次密码验证
			var keypressTimer1 = 0;
			Core.Events.addEvent(this.count_custom_pass, function(){
				_this.checkPass(0);
			}, 'blur');
			Core.Events.addEvent(this.count_custom_pass, function(){
				clearTimeout(keypressTimer1);
				keypressTimer1 = setTimeout(function(){
					_this.checkPass(0);
				}, 500);
			}, 'keypress');
			
			// 第二次密码验证
			var keypressTimer2 = 0;
			Core.Events.addEvent(this.confirm_custom_pass, function(){
				_this.checkPass(1);
			}, 'blur');
			Core.Events.addEvent(this.confirm_custom_pass, function(){
				clearTimeout(keypressTimer2);
				keypressTimer2 = setTimeout(function(){
					_this.checkPass(1);
				}, 500);
			}, 'keypress');
		},
		
		progressStart:function(){
			this.inProgress = true;
			this.loading.show();
		},
		
		progressOver:function(){
			this.inProgress = false;
			this.loading.hide();
		},
		
		checkInput: function(){
			var checkboxObj=$E("isAgreeCheckbox1");
			return this.userok && this.passok && this.passok2 && checkboxObj && checkboxObj.checked;
		},

		checkUser: function(callback){
			var _this = this;
			_this.userok = false;			// 不能等接口回来再赋值，先杜绝。
			
			Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/checkUser.php", {
				timeout: TIMEOUT_VAL,
				GET: {
					name:		_this.hotmail_custom_name.value,
					from:		'cnmail',
					t:			+new Date()
				},
				onComplete: function(res){
					if(res.code == "A00006"){
						if(res.data == 'yes'){
							_this.userok = false;
							verifyMsg('tips1', '48', ' 该邮箱地址已被占用');
						}else{
							_this.userok = true;
							verifyMsg('tips1', '49', '');
							callback();
						}
					}
					else{
						
					}
				},
				onException: function(res){
					if(res == "timeout"){
						systemBusyAlert();
						Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/riaapi/msn/apinote.php", {		// 超时日志
							GET:{
								api:"checkUser",
								uid:getUserUID()
							}
						});
					}else{
						winDialog.alert("失败！");
					}
				}
			});
		},
		
		checkPass: function(mode){
			var _count_pass = this.count_custom_pass.value;
			var _confirm_count_pass = this.confirm_custom_pass.value;
			var _this = this;

			// 密码校验，四个
			if(mode == 0){
				if(!_count_pass){
					verifyMsg('tips2', 48, ' 请输入密码');
					this.progressOver();
					this.passok = false;
					return;
				}else if(/[^\x21-\x7e]/.test(_count_pass)){
					verifyMsg('tips2', 48, ' 密码只能由数字、字母和符号组成');
					this.progressOver();
					this.passok = false;
					return;
				}else if(_count_pass.length < 6){
					verifyMsg('tips2', 48, ' 太短了，至少6位密码');
					this.progressOver();
					this.passok = false;
					return;
				}
				
				verifyMsg('tips2', 49);
				_this.checkPass(1);				// 重复验证一次
				this.passok = true;
				
			}else if(mode == 1){
				if(_confirm_count_pass !== _count_pass){
					verifyMsg('tips3', 48, _confirm_count_pass.length>0 ? ' 两次输入的密码不同' : '请再次输入密码');
					this.progressOver();
					this.passok2 = false;
					return;
				}
				
				if(_confirm_count_pass && _count_pass){
					verifyMsg('tips3', 49);
				}
				this.passok2 = true;
				return true;
			}
		},
		
		hasToken:function(){
			if(regToken){
				return true;
			}else{
				winDialog.alert("您的操作可能已经失效，请点击确定返回第一步", {
					funcOk:function(){
						window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";
					},
					funcClose:function(){
						window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";
					}
				});
				return false;
			}
		},
		
		submit: function(){
			if(this.inProgress) return;
			this.progressStart();
			
			if(!this.hasToken()){
				this.progressOver();
				return;
			}
			
			var _count_pass = this.count_custom_pass.value;
			var _confirm_count_pass = this.confirm_custom_pass.value;
			var _hotmail_name = this.hotmail_custom_name.value;
			var _regnick = _hotmail_name.indexOf("@")>-1 ? _hotmail_name.slice(0, _hotmail_name.indexOf("@")) : _hotmail_name;
			var _this = this;
			
			if(this.userok && this.passok && this.passok2){		// 提交注册
				
				Utils.Io.Ijax_2.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/sina_Reg.php?move=true&view="+this.name, {
					timeout: TIMEOUT_VAL,
					GET: {
						t:			new Date().getTime().toString().slice(-5)
					},
					POST:{
						regname:	this.hotmail_custom_name.value + '@sina.cn',
						regnick:	_regnick,
						token:		regToken,
						regpwd:		_count_pass
					},
					onComplete: function(res){
						if(res.code == "A00006"){
							toMsnLive(msnOccupyButAutoFail);
						}
						else{
							onRegistOrMsnBindingError(res, msnOccupyButAutoFail);
						}
					},
					onException: function(res){
						if(res == "timeout"){
							systemBusyAlert();
							Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/riaapi/msn/apinote.php", {		// 超时日志
								GET:{
									api:"sinaReg_occ",
									uid:getUserUID()
								}
							});
						}else{
							winDialog.alert("失败！");
						}
						_this.progressOver();
					}
				});
				
			}else{
				this.progressOver();
			}
		}
	};
	
	
	/////////////////////////////
	// 一些公用方法
	/////////////////////////////
	
	// 视图跳转
	function setDirection(direction){
		switch(direction){
			case TO_UNLOGIN:
				unLogin.init();
				leftColumn && (leftColumn.style.display = "none");
				leftColumn = unLogin.layer;
				unLogin.layer.style.display = "";
				break;
				
			case TO_IS_LOGIN:
				isLogin.init();
				leftColumn && (leftColumn.style.display = "none");
				leftColumn = isLogin.layer;
				isLogin.layer.style.display = "";
				rightColumn.style.display = "none";
				$E("hotmail_occupied").style.display = "none";
				break;
				
			case TO_MSN_NO_OCCUPY:
				msnNoOccupy.init();
				rightColumn.style.display = "none";
				rightColumn = msnNoOccupy.layer;
				msnNoOccupy.layer.style.display = "";
				leftColumn.style.display = "none";
				break;
				
			case TO_MSN_OCCUPY:
				msnOccupy.init();
				rightColumn.style.display = "none";
				rightColumn = msnOccupy.layer;
				msnOccupy.layer.style.display = "";
				break;

			case TO_OCCUPY_BUT_AUTO_FAIL:
				msnOccupyButAutoFail.init();
				setTimeout(function(){
					$E("hotmail_custom_name").focus();
				}, 50);
				$E('start_login').style.display="none";
				rightColumn.style.display = "none";
				rightColumn = msnOccupyButAutoFail.layer;
				msnOccupyButAutoFail.layer.style.display = "";
				leftColumn.style.display = "none";
				break;
			
			default:
				break;
		}
	}

	// 博客 MSN 绑定
	function msnBinding(view){
		var cur_uid = getRestrictUID();			// 获取本页登录且依然登录有效的 uid。
		if(cur_uid){
			
			// 区分统计日志。
			if(!regToken){
				winDialog.alert("您的操作可能已经失效，请点击确定返回第一步", {
					funcOk:function(){
						window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";
					},
					funcClose:function(){
						window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";
					}
				});
				view.progressOver();
				return;
			}
			
			Utils.Io.Ijax_2.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/setLink.php?move=true&view="+(view?view.name:""), {
				timeout: TIMEOUT_VAL,
				POST:{
					token: 			regToken,
					moveCommetToo:	(unLogin.isBlogMoved == undefined ? "" : (unLogin.isBlogMoved == true ? 1 : 0))		// 勾选为1
				},
				onComplete:function(res){
					if(res.code == "A00006"){
						toMsnLive(view);
					}
					else{
						onRegistOrMsnBindingError(res, view);
					}
				},
				onException:function(res){
					if(res == "timeout"){
						systemBusyAlert();
						Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/riaapi/msn/apinote.php", {		// 超时日志
							GET:{
								api:"setLink",
								uid:getUserUID()
							}
						});
					}else{
						winDialog.alert("失败！");
					}
					view.progressOver();
				}
			});
		}else{
			winDialog.alert("登录失效，请重新登录", {						// 搬家流程的，必须跳到第一页。
				funcOk:function(){
					window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";	// 跳转第一步。
				},
				funcClose:function(){
					window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";	// 跳转第一步。
				}
			});
			view.progressOver();
		}
	}
	
	// 2、携带公参，跳转 msn live，搬家的
	function toMsnLive(view){				// 前期拦截，保证这 uid 是本页登录并且依然登录有效的 uid。
		var rp = Utils.Cookie.getCookie("msn_return_arr");
		var uid;							// 必须这里定义，function immeToSpace 会使用
		var _modifiedCookie;
		rp = decodeURIComponent(rp);
		
		if(rp){
			rp = Core.String.j2o(rp);
			uid = getUserUID();
			
			if(typeof rp == "object"){
				
				// 判断博主是否被 TJ 过
				Utils.Io.JsLoad_2.request("http://move.blog.sina.com.cn/riaapi/msn/check_tj.php", {
					timeout: TIMEOUT_VAL,
					onComplete:function(res){
						if(res.code == "A00006"){
							immeToSpace();
						}
						else{
							var ieEvt = "onchange";
							if($IE) ieEvt = "onclick";
							_modifiedCookie = decodeURIComponent(Utils.Cookie.getCookie("msn_return_arr"));
							var _grant_stat = (rp["public"] == "True") ? true : false;
							var _grant_dialog = winDialog.createCustomsDialog({
								content: [
									'<div class="CP_layercon3 blogManageItem">',
										'<h3>请选择您搬家后的新浪博客访问权限：</h3>',
										'<p>',
											'<input type="radio" id="#{rdo1}" value="public" name="rdo1" '+(_grant_stat?"checked":"")+'/><label for="#{rdo1}">公开，所有人可见&nbsp;&nbsp;&nbsp;&nbsp;</label>',
											'<input type="radio" id="#{rdo2}" value="private" name="rdo1" '+(!_grant_stat?"checked":"")+'/><label for="#{rdo2}">私密，仅自己可见</label>',
										'</p>',
										'<div class="btn"><a class="SG_aBtn SG_aBtnB" href="#" onclick="return false;" id="#{sure}"><cite>确定</cite></a></div>',
									'</div>'].join(""),
								title: '博客访问权限'
							});
							_grant_dialog.setMiddle();
							
							// 不需要 if 耶。IE 无效！
							// _grant_dialog.nodes.rdo1.checked = _grant_stat;
							// _grant_dialog.nodes.rdo2.checked = !_grant_stat;
							
							// 点击对话框的 radio，修改 cookie
							_grant_dialog.nodes.rdo1[ieEvt] = whenRadioIsChecked;
							_grant_dialog.nodes.rdo2[ieEvt] = whenRadioIsChecked;
							
							// 点击确定和关闭，都执行统一操作。
							_grant_dialog.nodes.sure.onclick = function(){
								_grant_dialog.hidden();
								immeToSpace();
							};
							_grant_dialog.nodes.btnClose.onclick = function(){
								_grant_dialog.hidden();
								immeToSpace();
							};
							_grant_dialog.show();
						}
						view.progressOver();
					},
					onException:function(res){
						if(res == "timeout"){
							systemBusyAlert();
							Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/riaapi/msn/apinote.php", {		// 超时日志
								GET:{
									api:"check_tj",
									uid:getUserUID()
								}
							});
						}else{
							winDialog.alert("失败！");
						}
						view.progressOver();
					}
				});
			}
			else{
				view.progressOver();
			}
		}else{								// 新刚 Cookie 失效
			winDialog.alert("数据错误，现将跳转第一步", {
				funcOk:function(){
					window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";	// 跳转第一步。
				},
				funcClose:function(){
					window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";	// 跳转第一步。
				}
			});
			
			// 定时跳转
			setTimeout(function(){
				window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";	// 跳转第一步。
			}, 3000);
			
			view.progressOver();
		}
		
		// radio 点击的事件处理
		function whenRadioIsChecked(evt){
			var curRadioVal = this.value;
			var radioStat = (curRadioVal == "public" ? true : false);
			var _ck = _modifiedCookie.replace(/"public":"([A-Z]+?)"/i, function(match, f1){				// $1 undefined 和 null 都没关系
				if(match){
					return match.replace(f1, (radioStat ? "True" : "False"));
				}else{
					return match;			// 原封
				}
			});
			Utils.Cookie.setCookie("msn_return_arr", _ck, 3, "/", ".move.blog.sina.com.cn");
		}
		
		// rp == object 才会调用这个函数
		function immeToSpace(){
			new Interface("http://move.blog.sina.com.cn/msnmove/mark.php", "jsload").request({
				GET:{
					uid:	uid,
					cid:	rp.cid
				},
				onSuccess:function(res){
					window.location.href = "http://spaces.live.com/WPAccountCreated.aspx?canary="+rp.canary+"&wlid="+rp.cid+"&wpid="+uid+"&mc=true&partner=sina";
				},
				onError:function(res){
					window.location.href = "http://spaces.live.com/WPAccountCreated.aspx?canary="+rp.canary+"&wlid="+rp.cid+"&wpid="+uid+"&mc=true&partner=sina";
				},
				onFail:function(){
					window.location.href = "http://spaces.live.com/WPAccountCreated.aspx?canary="+rp.canary+"&wlid="+rp.cid+"&wpid="+uid+"&mc=true&partner=sina";
				}
			});
		}
	}
	
	// 绑定、注册错误的统一处理
	function onRegistOrMsnBindingError(res, view){
		if(res.code == "A2004" || res.code == "A0090"){		// token 失效 / MSN 未登录
			winDialog.alert($SYSMSG[res.code], {
				funcOk:function(){
					window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";
				},
				funcClose:function(){
					window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";
				}
			});
			view.progressOver();
		}else if(res.code == "A0091"){						// 博客未登录。
			winDialog.alert($SYSMSG[res.code], {
				funcOk:function(){
					setDirection(TO_UNLOGIN);
				},
				funcClose:function(){
					setDirection(TO_UNLOGIN);
				}
			});
			view.progressOver();
		}else if(res.code == "A0092"){						// MSN 已绑定过新浪博客，但非当前登录的博客帐号
			winDialog.alert($SYSMSG[res.code], {
				funcOk: function(){
					msnBinding(view);
				},
				funcClose:function(){
					msnBinding(view);
				}
			});
		}else if(res.code == "A0099"){						// 搬家进程重复
			winDialog.alert($SYSMSG[res.code]);
			view.progressOver();
		}else{												// 其他情况
			winDialog.alert($SYSMSG[res.code] || "注册失败，请重试");
			setDirection(TO_OCCUPY_BUT_AUTO_FAIL);
			view.progressOver();
		}
	}
	
	// 通过 SUP Cookie 获取用户 UID
	function getUserUID(){
		var SUPCookie = Utils.Cookie.getCookie("SUP");
		var transed_SUPCookie = decodeURIComponent(decodeURIComponent(SUPCookie));
		var matchCookie = transed_SUPCookie.match(/uid=([\x20-\x7e]+?)&user/);			// null / Array
		var uid = matchCookie && matchCookie.length && matchCookie[1];
		return uid;
	}
	
	// 通过 SUP Cookie 获取用户登录名
	function getUserLoginName(){
		var SUPCookie = Utils.Cookie.getCookie("SUP");
		var transed_SUPCookie = decodeURIComponent(decodeURIComponent(SUPCookie));
		var matchCookie = transed_SUPCookie.match(/name=([\x20-\x7e]+?)&nick/);
		var matchLoginName = matchCookie && matchCookie.length && matchCookie[1];
		return matchLoginName;
	}
	
	// 验证是否是在本页登录的，且当前也是登录的
	function isCurPageLogin(){							// 从 cookie 获取登录名。
		var SUPCookie = Utils.Cookie.getCookie("SUP");
		var transed_SUPCookie;
		var matchCookie;
		var matchLoginName;
		
		if(SUPCookie){		// 有 cookie 则是登录状态
			transed_SUPCookie = decodeURIComponent(decodeURIComponent(SUPCookie));
			matchCookie = transed_SUPCookie.match(/name=([\x20-\x7e]+?)&nick/);
			matchLoginName = matchCookie.length && matchCookie[1];
			
			// 如果跟记录的cookie登录一样，证明是原用户当页刷新而已，页面将显示登录状态
			if((userHotmail+"|"+matchLoginName) == decodeURIComponent(Utils.Cookie.getCookie("curPageLoginMark"))){
				return true;
			}else{
				return false;
			}
		}else{				// 没有 cookie 肯定不是登录状态。
			return false;
		}
	}
	
	// 跳转管制！获取本页登录且依然登录有效的 uid。
	// null 一概视为：本页未登录。
	function getRestrictUID(){
		var uid = getUserUID();										// 获取博客 uid。退出登录也能获取到 _uid。没办法～统一会员的。
		var _uid = Utils.Cookie.getCookie("redirectRestrict");		// 当页登录的 uid。
		if(uid == _uid){
			return uid;
		}else{
			return null;
		}
	}
	
	// 
	function setBackLink(view){
		var node = $E('backLink');
		var node1 = $E("backLink1");
		var node2 = $E("backLink2");
		var nodes = [node, node1, node2];
		
		// 全部显示。不管了。
		for(var i=nodes.length-1; i>=0; i--){
			if(nodes[i]){
				nodes[i].style.display = "";
				nodes[i].onclick = function(){ backTo(); };
			}
		}
		return;
		
		if(view != undefined){
			for(var i=nodes.length; i!=0; i--){
				if(nodes[i]){
					nodes[i].style.display = "";
					nodes[i].onclick = function(){ backTo(); };
				}
			}
		}else{
			for(var i=nodes.length; i!=0; i--){
				if(nodes[i]){
					nodes[i].style.display = 'none';
					nodes[i].onclick = function(){};
				}
			}
		}
	}
	
	// 
	function backTo(){
		try{
			$E('nameTip').style.display = '';
			$E('hotmail_custom').style.display = 'none';
			$E('hotmail_moving_confirm').style.display = 'none';
			$E('start_login').style.display='';
		}catch(e){}
		setDirection(TO_UNLOGIN);
		if (testOccupy == 'unoccupied'){
			$E("hotmail_isnew").style.display = "";
		}else{
			$E("hotmail_occupied").style.display = '';
			$E("hotmail_movmov").style.display = "";
		}
	}
	
	// 
	function verifyMsg(loc, icon, str){
		if(str || icon){
			str = str || '';
			$E(loc).style.display = '';
			$E(loc).innerHTML = '<img class="SG_icon SG_icon' + (icon||'48') + '" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" align="absmiddle" />' + str + '</span>';
		}else{
			$E(loc).style.display = 'none';
			$E(loc).innerHTML = '';
		}
	}
	
	// 
	function systemBusyAlert(){
		winDialog.alert("系统繁忙，请稍候再试 ...", {
			funcOk:function(){
				if($MOZ){
					window.location.reload();
				}
			},
			funcClose:function(){
				if($MOZ){
					window.location.reload();
				}
			}
		});
	}
	
	
	// 事实上，已经把这个函数当一个视图来操作了。
	function createRandomBlog(targNode){
		if(createRandomBlog.inProgress) return;
		
		if(!createRandomBlog.inited){
			if(targNode){
				createRandomBlog.loading = new Loading(targNode.parentNode);
			}else{
				createRandomBlog.loading = {show:function(){}, hide:function(){}};
			}
			createRandomBlog.inited = true;
		}
		
		winDialog.confirm('是否随机注册一个博客账号？', {
			textOk:		"是",
			textCancel:	"否",
			defaultButton: 1, 
			title:		"提示",
			funcOk:function(){
				submitRandomCreate();
			},
			funcCancel:function(){
				
			}
		}, "createRandomBlog");
		
		function submitRandomCreate(){
			if(createRandomBlog.inProgress) return;
			createRandomBlog.progressStart();
			
			// 提交注册
			var _hotmail_name = userHotmail;
			var _regnick = _hotmail_name.indexOf("@")>-1 ? _hotmail_name.slice(0, _hotmail_name.indexOf("@")) : _hotmail_name;
			var _this = this;
			
			// 区分统计日志
			if(!regToken){
				winDialog.alert("您的操作可能已经失效，请点击确定返回第一步", {
					funcOk:function(){
						window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";
					},
					funcClose:function(){
						window.location.href = "http://move.blog.sina.com.cn/msnmove/msn_move_entrance.php";
					}
				});
				createRandomBlog.progressOver();
				return;
			}
			
			Utils.Io.Ijax_2.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/sina_Reg.php?move=true&view=skip", {
				timeout: TIMEOUT_VAL,
				POST:{
					regnick:	_regnick,
					token:		regToken
				},
				onComplete:function(res){
					if(res.code == "A00006"){
						toMsnLive(createRandomBlog);
					}
					else{
						onRegistOrMsnBindingError(res, createRandomBlog);
					}
				},
				onException:function(res){
					if(res == "timeout"){
						systemBusyAlert();
						Utils.Io.JsLoad_2.request("http://control.blog.sina.com.cn/riaapi/msn/apinote.php", {		// 超时日志
							GET:{
								api:"sinaReg_skip",
								uid:getUserUID()
							}
						});
					}else{
						winDialog.alert("失败！");
					}
					createRandomBlog.progressOver();
				}
			});
		}
	}
	createRandomBlog.inited = false;
	createRandomBlog.inProgress = false;
	createRandomBlog.name = "createRandomBlog";
	createRandomBlog.progressStart = function(){
		createRandomBlog.inProgress = true;
		createRandomBlog.loading.show();
	};
	createRandomBlog.progressOver = function(){
		createRandomBlog.inProgress = false;
		createRandomBlog.loading.hide();
	};
	
	
	/////////////
	// main 逻辑
	/////////////
	
	// 一个标志位
	var testOccupy = $E("isOccupy").value;
	var testBind = $E("isLink").value;
	var userHotmail = $E("hotMail").value;
	var regToken = $E("regToken").value;
	
	// 如果已经搬过家了。
	var isMoved = +$E("isMoved").value;
	
	// 左右栏的当前显示节点
	var leftColumn = unLogin.layer;			// 初始状态。
	var rightColumn;
	
	$E('msn_tip').style.cssText = 'display:none';

	//创建一个随机的账号
	scope.$createRandomBlog = createRandomBlog;

	// 是否帐号被占用了
	if(testOccupy == "unoccupied"){
		$E("hotmail_isnew").style.display = "";
		
		rightColumn = $E("hotmail_isnew");
		
		if(testBind == "linked"){		// 帐号已有绑定时，点击先警示，ok 再出现 form。
			Core.Events.addEvent($E("hotmail_moving_btn"), function(){
				winDialog.alert("你的 MSN 帐号已经绑定过新浪博客帐号，继续此操作将撤销你之前的绑定！", {
					funcOk: function(){
						$E("hotmail_isnew").style.display = "none";
						setDirection(TO_MSN_NO_OCCUPY);
					}
				});
			});
		}else{				// 未绑过，则点击直接出现 form。
			Core.Events.addEvent($E("hotmail_moving_btn"), function(){
				$E("hotmail_isnew").style.display = "none";
				setDirection(TO_MSN_NO_OCCUPY);
			});
		}
	}else{
		rightColumn = $E("hotmail_occupied");
		Core.Events.addEvent($E("hotmail_movmov"), function(){
			$E("hotmail_occupied").style.display = 'none';
			setDirection(TO_OCCUPY_BUT_AUTO_FAIL);
		});
	}
	
	// 是否本页面登录的。预防用户刷新依然要重新登录！
	if(isCurPageLogin()){
		setDirection(TO_IS_LOGIN);
	}else{
		setDirection(TO_UNLOGIN);
	}
	
	//增加用户协议勾选框
	function appendCheckbox(){
		var t=document.createElement("tr");
		var thObj=document.createElement("th");
		var tdObj=document.createElement("td");
		tdObj.style.paddingBottom="0px";
		tdObj.style.color="#666666";
		tdObj.innerHTML='<input id="isAgreeCheckbox" type="checkbox" checked=\'true\' />我已经看过并同意<a target="_blank" href="http://login.sina.com.cn/signupagreement.html">《新浪网络服务使用协议》</a>和<a target="_blank" href="http://login.sina.com.cn/signupagreement_freemail.html">《新浪免费邮箱服务条款》</a>';
		t.appendChild(thObj);
		t.appendChild(tdObj);
		var table1=$E("hotmail_moving_confirm").getElementsByTagName("table")[0];
		var trs=table1.getElementsByTagName("tr");
		table1.getElementsByTagName("tbody")[0].insertBefore(t,trs[trs.length-1]);
		
		
		var t1=document.createElement("tr");
		var thObj1=document.createElement("th");
		var tdObj1=document.createElement("td");
		tdObj1.style.paddingBottom="0px";
		tdObj1.style.color="#666666";
		tdObj1.innerHTML='<input id="isAgreeCheckbox1" type="checkbox" checked=\'true\' />我已经看过并同意<a target="_blank" href="http://login.sina.com.cn/signupagreement.html">《新浪网络服务使用协议》</a>和<a target="_blank" href="http://login.sina.com.cn/signupagreement_freemail.html">《新浪免费邮箱服务条款》</a>';
		t1.appendChild(thObj1);
		t1.appendChild(tdObj1);
		var table2=$E("hotmail_moving_confirm_1").getElementsByTagName("table")[0];
		var trs1=table2.getElementsByTagName("tr");
		table2.getElementsByTagName("tbody")[0].insertBefore(t1,trs1[trs1.length-1]);
	}
	
	appendCheckbox();
	
});



