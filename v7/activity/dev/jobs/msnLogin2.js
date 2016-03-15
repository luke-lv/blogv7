/**
 * @desc	MSN Space 连接
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

$registJob("msnLogin2", function(){
	
	
	// 每个视图都应该实现自一个接口，容易统一方法
	
	
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
	
	/////////////////////////////
	// 未登录的视图
	/////////////////////////////
	var unLogin = {
		isInited:		false,
		inProgress:		false,
		loading:		null,
		
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
			
			Core.Events.addEvent(this.loginBtn, this.login.bind2(unLogin));
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
		},
		
		progressStart:function(){
			this.inProgress = true;
			this.loading.show();
		},
		
		progressOver:function(){
			this.inProgress = false;
			this.loading.hide();
		},
		
		login: function(){
			if(this.inProgress) return;
			this.progressStart();
			
			var _name = this.loginName.value;
			var _pass = this.loginPass.value;
			var _name_trim = Core.String.trim(_name);
			var _login;
			var _this = this;
			
			if(!_name_trim){
				winDialog.alert("用户名不能为空", {
					funcOk:function(){
						_this.loginName.value = "";
						setTimeout(function(){
							_this.loginName.focus();
						}, 0);
					}
				});
				this.progressOver();
				return;
			}else if(!_pass){
				winDialog.alert("密码不能为空", {
					funcOk:function(){
						_this.loginPass.value = "";
						setTimeout(function(){					// 要不然会多次弹框。
							_this.loginPass.focus();
						}, 0);
					}
				});
				this.progressOver();
				return;
			}
			
			_login = new Lib.Login.LoginPost(function(res){
				var matchLoginName = getUserLoginName();		// 从 cookie 获取登录名。
				if(res.result){
					setDirection(TO_IS_LOGIN);
					$E('movingBtn_ihave').style.display = 'none';
					$E('changeIdBtn').style.display = 'none';
					
					isLogin.hotmail_name_l.innerHTML = matchLoginName;		// 另两个视图的邮箱名称提示。
					msnNoOccupy.hotmail_name_r && (msnNoOccupy.hotmail_name_r.innerHTML = matchLoginName);		// 不一定会初始化这个
					
					_this.loginName.value = "";			// 应清空表单。
					_this.loginPass.value = "";
					
					// 种上一个 cookie，取用 msn 和 blog 两个帐号，表示是本页面登录的，可以刷新。否则强制用户重新登录。
					// 页面退出时，删除本 cookie！12 分钟有效。
					Utils.Cookie.setCookie("curPageLoginMark", (userHotmail+"|"+matchLoginName), 0.2, "/", ".blog.sina.com.cn");
					
					// 单独种一个 uid cookie，用于跳转管制
					Utils.Cookie.setCookie("redirectRestrict", getUserUID(), 0.2, "/", ".blog.sina.com.cn");
					
					// 登录成功后直接触发事件，这个方法能够处理 unlogin 的 inProgress
					(function(){
						if(!isLogin.fireSubmit(unLogin)){			// 不一定能 fire 上，所以 setTimeout
							setTimeout(arguments.callee, 200);
						}
					})();
				}else{
					winDialog.alert(res.reason, {
						funcOk: function(){
							_this.loginPass.value = "";	// 应清空密码
							setTimeout(function(){
								_this.loginPass.focus();
							}, 0);
						}
					});
					_this.progressOver();
				}
			});
			_login.login(_name_trim, _pass, 15);
		}
	};
	
	
	/////////////////////////////
	// 已登录的视图
	/////////////////////////////
	var isLogin = {
		isInited:			false,
		inProgress:			false,
		loading:			null,
		
		layer:				$E("sina_islogin"),
		hotmail_name_l:		$E("hotmail_name_l"),
		changeIdBtn:		$E("changeIdBtn"),
		movingBtn_ihave:	$E("movingBtn_ihave"),
		
		movBtnFiredByView:	null,
		
		init:function(){
			setBackLink();
			if(this.isInited) return;
			this.isInited = true;
			
			this.loading = new Loading(this.movingBtn_ihave);
			
			Core.Events.addEvent(this.changeIdBtn, function(){
				setDirection(TO_UNLOGIN);			// 当作退出登录。
				// window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+window.location.href;		// 刷新没事。
			});
			
			// 搬家确认
			Core.Events.addEvent(this.movingBtn_ihave, this.submit.bind2(isLogin));
			
			// 从 cookie 获取登录名。
			var matchLoginName = getUserLoginName();
			isLogin.hotmail_name_l.innerHTML = matchLoginName;		// 另两个视图的邮箱名称提示。
			msnNoOccupy.hotmail_name_r && (msnNoOccupy.hotmail_name_r.innerHTML = matchLoginName);		// 不一定会初始化这个
		},
		
		progressStart:function(){
			this.inProgress = true;
			this.loading.show();
		},
		
		progressOver:function(){
			this.inProgress = false;
			this.loading.hide();
			this.handleOtherView();				// 处理其他视图的 inProgress
		},
		
		// 供其他视图调用，并记录
		fireSubmit:function(view){
			if(!view){
				throw new Error("isLogin::fireSubmit(): param view must exist");
			}
			if(this.inProgress){				// submit 非提交中，才能被 fire。
				return false;
			}else{
				Core.Events.fireEvent(this.movingBtn_ihave, 'click');
				this.movBtnFiredByView = view;
				return true;
			}
		},
		
		// 处理其它视图的 inProgress
		handleOtherView:function(){				// submit 保证绝对单线程
			if(!movBtnFiredByView) return;
			this.movBtnFiredByView.progressOver();
			this.movBtnFiredByView = null;
		},
		
		submit: function(){
			if(this.inProgress) return;
			this.progressStart();
			
			var _hotmail_name = this.hotmail_name_l.innerHTML;
			var _token = regToken;
			var _this = this;
			
			Lib.checkAuthor();
			
			if($isLogin){
				if(testBind == "linked"){					// 如果在 msn 有绑定的前提下
					var cur_uid = getRestrictUID();			// 获取本页登录且依然登录有效的 uid。
					if(cur_uid){
						// 需要查看是否本次 博客帐号 和 msn 帐号 是否已绑定
						new Interface("http://control.blog.sina.com.cn/blog_rebuild/msn/api/checkLink.php", "jsload").request({
							onSuccess:function(res){			// msn 和 blog 是绑定关系，直接跳转。
								toMsnLive();
								_this.progressOver();
							},
							onError:function(res){				// msn 和 当前登录 blog 不是绑定关系。
								onRegistOrMsnBindingError(res, isLogin);
							}
						});
					}else{
						winDialog.alert("登录失效，请重新登录", {						// 搬家流程的，必须跳到第一页。
							funcOk:function(){
								window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+window.location.href;
							},
							funcClose:function(){
								window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+window.location.href;
							}
						});
						_this.progressOver();
					}
				}else{							// msn 帐号未绑定过，直接上接口绑定
					msnBinding(isLogin);
				}
			}else{		// 未登录
				setDirection(TO_UNLOGIN);
				_this.progressOver();
			}
		}
	};
	
	
	/////////////////////////////
	// 新帐号搬家，且 hotmail 名在新浪未被占用的确认搬家视图, 只会出现在MSN名未占用情况下
	/////////////////////////////
	var msnNoOccupy = {
		isInited:			false,
		inProgress:			false,
		loading:			null,
		
		layer:				$E("hotmail_moving_confirm"),
		hotmail_name_r:		$E("hotmail_name_r"),
		count_pass:			$E("count_pass"),
		confirm_count_pass:	$E("confirm_count_pass"),
		movingBtn_isnew:	$E("movingBtn_isnew"),
		
		passok:				false,
		passok2:			false,
		
		init:function(){
			$E('nameTip').style.display = 'none';
			this.count_pass.value = '';
			this.confirm_count_pass.value = '';
			verifyMsg('tips4');
			verifyMsg('tips5');
			setBackLink(0);
			
			if(this.isInited) return;
			this.isInited = true;
			
			var _this = this;
			this.loading = new Loading(this.movingBtn_isnew);
			
			Core.Events.addEvent(this.confirm_count_pass, function(evt){
				var keyCode;
				evt = window.event || evt;
				keyCode = evt.which || evt.keyCode;
				if(evt.keyCode == 13){
					_this.movingBtn_isnew.blur();
					Core.Events.fireEvent(_this.movingBtn_isnew, "click");
				}
			}, "keypress");
			
			// 搬家确认
			Core.Events.addEvent(this.movingBtn_isnew, this.submit.bind2(msnNoOccupy));

			Core.Events.addEvent(this.count_pass, function(){
				_this.checkPass(0);
			}, 'blur');
			Core.Events.addEvent(this.confirm_count_pass, function(){
				_this.checkPass(1);
			}, 'blur');
		},
		
		progressStart:function(){
			this.inProgress = true;
			this.loading.show();
		},
		
		progressOver:function(){
			this.inProgress = false;
			this.loading.hide();
		},

		checkPass: function(mode){
			var _count_pass = this.count_pass.value;
			var _confirm_count_pass = this.confirm_count_pass.value;
			var _this = this;

			// 密码校验，四个
			if(mode == 0){
				verifyMsg('tips5');
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
				}else if(_count_pass.length > 16){
					verifyMsg('tips4', 48, ' 太长了，密码不能超过16位');
					this.progressOver();
					this.passok = false;
					return;
				}
				verifyMsg('tips4', 49);
				_this.checkPass(1);
				this.passok = true;
			}
			
			else if(mode == 1){
				if(_confirm_count_pass !== _count_pass){
					verifyMsg('tips5', 48, _confirm_count_pass.length>0?' 两次输入的密码不同':'请再次输入密码');
					this.progressOver();
					this.passok2 = false;
					return;
				}
				if (_confirm_count_pass && _count_pass) {
					verifyMsg('tips5', 49);
				}
				this.passok2 = true;
				return true;
			}
		},

		submit: function(){
			if(this.inProgress) return;
			this.progressStart();
			
			var _count_pass = this.count_pass.value;
			var _confirm_count_pass = this.confirm_count_pass.value;
			var _hotmail_name = this.hotmail_name_r.innerHTML;
			var _regnick = _hotmail_name.indexOf("@")>-1 ? _hotmail_name.slice(0, _hotmail_name.indexOf("@")) : _hotmail_name;
			var _token = regToken;
			var _this = this;
			
			// 提交注册
			if (this.passok && this.passok2){
				new Interface("http://control.blog.sina.com.cn/blog_rebuild/msn/api/sina_Reg.php", "ijax").request({
					GET:{
						t:			new Date().getTime().toString().slice(-5)
					},
					POST:{
						regname:	_hotmail_name,
						regnick:	_regnick,
						token:		_token,
						regpwd:		_count_pass
					},
					onSuccess:function(res){			// 注册成功，直接跳转新刚
						toMsnLive();
						_this.progressOver();
					},
					onError:function(res){
						onRegistOrMsnBindingError(res, msnNoOccupy);
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
		isInited:			false,
		inProgress:			false,
		loading:			null,

		layer:				$E("hotmail_custom"),
		hotmail_custom_name:		$E("hotmail_custom_name"),
		count_custom_pass:			$E("count_custom_pass"),
		confirm_custom_pass:	$E("confirm_custom_pass"),
		movingBtn_custom:	$E("movingBtn_custom"),
		myinterface: new Interface('http://control.blog.sina.com.cn/blog_rebuild/msn/api/checkUser.php', 'jsload'),
		userok: false,
		passok: false,
		passok2: false,

		init:function(){
			$E('nameTip').style.display = 'none';
			this.count_custom_pass.value = '';
			this.confirm_custom_pass.value = '';
			verifyMsg('tips2');
			verifyMsg('tips3');
			setBackLink(0);
			
			if(this.isInited) return;
			this.isInited = true;
			
			this.loading = new Loading(this.movingBtn_custom);
			var _this = this;

			this.hotmail_custom_name.value = userHotmail.split('@')[0];
			Core.Events.addEvent(this.confirm_custom_pass, function(evt){
				var keyCode;
				evt = window.event || evt;
				keyCode = evt.which || evt.keyCode;
				if(evt.keyCode == 13){
					_this.movingBtn_custom.blur();
					Core.Events.fireEvent(_this.movingBtn_custom, "click");
				}
			}, "keypress");

			Core.Events.addEvent(this.hotmail_custom_name, function(){
				var value = _this.hotmail_custom_name.value;
				if (/[^a-zA-Z0-9_]/.test(value)){
					verifyMsg('tips1', 48, ' 请用英文小写、数字、下划线。');
					this.progressOver();
					this.passok = false;
				}else{
					if (!/^[^_].*[^_]$/.test(value)){
						verifyMsg('tips1', 48, ' 首尾不能是下划线。');
						this.progressOver();
						this.passok = false;
						return;
					}else if(value.replace(/[\d]/g, '').length == 0){
						verifyMsg('tips1', 48, ' 不能全是数字。');
						this.progressOver();
						this.passok = false;
						return;
					}
					_this.checkUser(function(){});
				}
			},'blur');

			// 搬家确认
			Core.Events.addEvent(this.movingBtn_custom, function(){
				_this.submit.bind2(msnOccupyButAutoFail)();
			});

			Core.Events.addEvent(this.count_custom_pass, function(){
				_this.checkPass(0);
			}, 'blur');
			Core.Events.addEvent(this.confirm_custom_pass, function(){
				_this.checkPass(1);
			}, 'blur');
		},
		
		progressStart:function(){
			this.inProgress = true;
			this.loading.show();
		},
		
		progressOver:function(){
			this.inProgress = false;
			this.loading.hide();
		},

		checkUser: function(callback){
			var _this = this;
			this.myinterface.request({
				GET: {
					name: _this.hotmail_custom_name.value,
					from: 'cnmail',
					timeStamp: +new Date()
				},
				onSuccess: function(ret){
					if (ret =='yes'){
						_this.userok = false;
						verifyMsg('tips1', '48', ' 该邮箱地址已被占用，<a id="o_login" href="#">登录？</a>');
						$E('o_login').onclick = function(){
							backTo();
						}
					}else{
						_this.userok = true;
						verifyMsg('tips1', '49', '');
						callback();
					}
				}
			});
		},

		checkPass: function(mode){
			var _count_pass = this.count_custom_pass.value;
			var _confirm_count_pass = this.confirm_custom_pass.value;
			var _this = this;

			// 密码校验，四个
			if (mode == 0){
				verifyMsg('tips3');
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
				}else if(_count_pass.length > 16){
					verifyMsg('tips2', 48, ' 太长了，密码不能超过16位');
					this.progressOver();
					this.passok = false;
					return;
				}
				verifyMsg('tips2', 49);
				_this.checkPass(1);
				this.passok = true;
			}else if (mode == 1){
				if(_confirm_count_pass !== _count_pass){
					verifyMsg('tips3', 48, _confirm_count_pass.length>0?' 两次输入的密码不同':'请再次输入密码');
					this.progressOver();
					this.passok2 = false;
					return;
				}
				if (_confirm_count_pass && _count_pass) {
					verifyMsg('tips3', 49);
				}
				this.passok2 = true;
				return true;
			}
		},

		submit: function(){
			if(this.inProgress) return;
			this.progressStart();

			var _count_pass = this.count_custom_pass.value;
			var _confirm_count_pass = this.confirm_custom_pass.value;
			var _hotmail_name = this.hotmail_custom_name.value;
			var _regnick = _hotmail_name.indexOf("@")>-1 ? _hotmail_name.slice(0, _hotmail_name.indexOf("@")) : _hotmail_name;
			trace([this.userok, this.passok , this.passok2 ]);
			var _token = regToken;
			var _this = this;
			if (this.userok && this.passok && this.passok2){
				// 提交注册
				new Interface("http://control.blog.sina.com.cn/blog_rebuild/msn/api/sina_Reg.php", "ijax").request({
					GET:{
						t:			new Date().getTime().toString().slice(-5)
					},
					POST:{
						regname:	this.hotmail_custom_name.value + '@sina.cn',
						regnick:	_regnick,
						token:		_token,
						regpwd:		_count_pass
					},
					onSuccess:function(res){
						// 注册成功，直接跳转新刚
						toMsnLive();
						_this.progressOver();
					},
					onError:function(res){
						onRegistOrMsnBindingError(res, msnOccupyButAutoFail);
					}
				});
			}else{
				this.progressOver();
			}
		}
	};
	
	
	/////////////////////////////
	// 新帐号搬家，且 hotmail 名在新浪被占用的视图， 只会出现在MSN名被占用的情况下
	/////////////////////////////
	var msnOccupy = {
		isInited:	false,
		inProgress:	false,
		
		layer:		$E("hotmail_occupied"),
		movmov:		$E("hotmail_movmov"),
		
		init: function(){
			if(this.isInited) return;
			this.isInited = true;
			
			// 搬家确认
			Core.Events.addEvent(this.movmov, this.submit.bind2(msnOccupy));
		},
		
		submit: function(){
			var _this = this;
			if(testBind == "linked"){			// msn 已绑过。
				winDialog.alert("你的 MSN 帐号已经绑定过新浪博客帐号，继续此操作将撤销你之前的绑定！", {
					funcOk: function(){
						setDirection(TO_OCCUPY_BUT_AUTO_FAIL);
					}
				});
			}else{			// msn 未绑过，直接上接口
				setDirection(TO_OCCUPY_BUT_AUTO_FAIL);
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
				showMSNTip('');
				leftColumn && (leftColumn.style.display = "none");
				leftColumn = unLogin.layer;
				unLogin.layer.style.display = "";

				break;
				
			case TO_IS_LOGIN:
				isLogin.init();
				showMSNTip('');
				leftColumn && (leftColumn.style.display = "none");
				leftColumn = isLogin.layer;
				isLogin.layer.style.display = "";
				break;
				
			case TO_MSN_NO_OCCUPY:
				msnNoOccupy.init();
				showMSNTip('您正在使用MSN账号注册“新浪博客”，以后您可以用您的MSN账号或新注册的账号来登录您的博客。 <a href="javascript:;" id="skipCustomCreate" onclick="scope.$createRandomBlog()" title="随机生成一个博客">跳过此设置</a>');
				rightColumn.style.display = "none";
				rightColumn = msnNoOccupy.layer;
				msnNoOccupy.layer.style.display = "";
				leftColumn.style.display = "none";
				break;
				
			case TO_MSN_OCCUPY:
				msnOccupy.init();
				showMSNTip('');
				rightColumn.style.display = "none";
				rightColumn = msnOccupy.layer;
				msnOccupy.layer.style.display = "";
				break;

			case TO_OCCUPY_BUT_AUTO_FAIL:
				msnOccupyButAutoFail.init();
				/*setTimeout(function(){
					$E("hotmail_custom_name").focus();
				}, 50);*/
				showMSNTip('您正在使用MSN账号连接新浪博客，以后您可以用您的MSN账号或新注册的账号来登录您的博客。 <a href="javascript:;" id="skipCustomCreate" onclick="scope.$createRandomBlog()" title="随机生成一个博客">跳过此设置</a>');
				rightColumn.style.display = "none";
				rightColumn = msnOccupyButAutoFail.layer;
				msnOccupyButAutoFail.layer.style.display = "";
				leftColumn.style.display = "none";
				break;
			
			default:
				traceError("wrong directions selected!");
				break;
		}
	}
	
	// 
	function showMSNTip(str){
		var node = $E('msn_tip');
		node.style.width = '60%';
		if (str){
			node.style.cssText = 'display:block;padding:0.8em;margin-bottom:1em;width:80%;border:1px solid #cc9;background-color:#ffc;margin:2px auto;font-size:14px;';
		}else{
			node.style.cssText = 'display:none';
		}
		$E('msn_tip').innerHTML = str;
	}
	
	// 成功了，要么绑定，要么跳转。
	function msnBinding(view){
		var cur_uid = getRestrictUID();			// 获取本页登录且依然登录有效的 uid。
		if(cur_uid){
			new Interface("http://control.blog.sina.com.cn/blog_rebuild/msn/api/setLink.php", "ijax").request({
				POST:{
					token: 			regToken,
					moveCommetToo:	(unLogin.isBlogMoved == undefined ? "" : (unLogin.isBlogMoved == true ? 1 : 0))		// 勾选为1
				},
				onSuccess:function(res){		// 绑定成功，跳转新刚那边
					toMsnLive();
					view.progressOver();
				},
				onError:function(res){			// 绑定错误。
					onRegistOrMsnBindingError(res, view);
				}
			});
		}else{
			winDialog.alert("登录失效，请重新登录", {						// 搬家流程的，必须跳到第一页。
				funcOk:function(){
					window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+window.location.href;
				},
				funcClose:function(){
					window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+window.location.href;
				}
			});
			view.progressOver();
		}
	}
	
	// 2、不搬家的不再跳 msn live 了，跳个首
	// sina_Reg 接口也适用了本函数，但其一气呵成，很难中途改登录，所以可以适用。
	function toMsnLive(res){
		var msnLoginComeFrom = Utils.Cookie.getCookie("msnLoginComeFrom");
		winDialog.alert("MSN账号已成功连接到新浪博客账号!", {
			icon:		"03",
			funcOk:		__toMsnLive,
			funcClose:	__toMsnLive
		});
		function __toMsnLive(){
			if(msnLoginComeFrom){
				msnLoginComeFrom = decodeURIComponent(msnLoginComeFrom);
				window.location.href = msnLoginComeFrom;				// 从哪儿来跳哪儿去
			}else{
				window.location.href = "http://blog.sina.com.cn/";		// 取不到地址，就去大博首。
			}
		}
	}
	
	// 绑定、注册错误的统一处理
	function onRegistOrMsnBindingError(res, view){
		if(res.code == "A2004" || res.code == "A0090"){		// token 失效 / MSN 未登录
			winDialog.alert($SYSMSG[res.code], {
				funcOk:function(){
					window.location.href = "http://blog.sina.com.cn/";		// 跳大博首。
				}
			});
			view.progressOver();
		}else if(res.code == "A0091"){						// 博客未登录。
			winDialog.alert($SYSMSG[res.code], {
				funcOk:function(){
					setDirection(TO_UNLOGIN);
				}
			});
			view.progressOver();
		}else if(res.code == "A0092"){						// MSN 已绑定过新浪博客，但非当前登录的博客帐号
			winDialog.alert($SYSMSG[res.code], {
				funcOk: function(){
					msnBinding(view);
				}
			});
		}else{												// 其他情况
			winDialog.alert('你输入的账号已经被占用，请重新输入！');
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
	function isCurPageLogin(){
		
		// 从 cookie 获取登录名。
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

	function setBackLink(view){
		var node = $E('backLink');
		if (view != undefined){
			node.style.cssText = 'float:right';
			node.innerHTML = '<a href="javascript:void 0"><< 返回上一步</a>';
			node.onclick = function(){
				backTo();
			};
		}else{
			node.innerHTML = '';
		}
	}

	function backTo(){
		try{
			$E('nameTip').style.display = '';
			$E('hotmail_custom').style.display = 'none';
			$E('hotmail_moving_confirm').style.display = 'none';
		}catch(e){}
		setDirection(TO_UNLOGIN);
		if (testOccupy == 'unoccupied'){
			$E("hotmail_isnew").style.display = "";
		}else{
			$E("hotmail_occupied").style.display = '';
			$E("hotmail_movmov").style.display = "";
		}
	}

	function verifyMsg(loc, icon, str){
		if (str || icon){
			str = str || '';
			$E(loc).style.display = '';
			$E(loc).innerHTML = '<img class="SG_icon SG_icon' + (icon||'48') + '" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" align="absmiddle" />' + str + '</span>';
		}else{
			$E(loc).style.display = 'none';
			$E(loc).innerHTML = '';
		}
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
			icon:		"03",
			funcOk: function(){
				submitRandomCreate();
			}.bind2(this),
			funcCancel: function(){
				
			}
		}, "createRandomBlog");
		
		function submitRandomCreate(){				// 提交注册
			if(createRandomBlog.inProgress) return;
			createRandomBlog.progressStart();
			
			var _token = regToken;
			var _hotmail_name = userHotmail;
			var _regnick = _hotmail_name.indexOf("@")>-1 ? _hotmail_name.slice(0, _hotmail_name.indexOf("@")) : _hotmail_name;
			var _this = this;
			
			new Interface("http://control.blog.sina.com.cn/blog_rebuild/msn/api/sina_Reg.php", "ijax").request({
				POST:{
					regnick:	_regnick,
					token:		_token
				},
				onSuccess:function(res){			// 注册成功，直接跳转新刚
					toMsnLive();
					createRandomBlog.progressOver();
				},
				onError:function(res){
					onRegistOrMsnBindingError(res, createRandomBlog);
				}
			});
		}
	}
	createRandomBlog.inited = false;
	createRandomBlog.inProgress = false;
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
	
	// 左右栏的当前显示节点
	var leftColumn = unLogin.layer;			// 初始状态。
	var rightColumn;
	
	// 是否本页面登录的。预防用户刷新依然要重新登录！
	if(isCurPageLogin()){
		setDirection(TO_IS_LOGIN);
	}else{
		setDirection(TO_UNLOGIN);
	}

	$E('msn_tip').style.cssText = 'display:none';
	
	//创建一个随机的账号
	scope.$createRandomBlog = createRandomBlog;

	// 是否帐号被占用了
	if(testOccupy == "unoccupied"){
		$E("hotmail_isnew").style.display = "";
		$E('hotmail_name_r').parentNode.innerHTML += ' <span style="float:none">使用新浪账号<a id="reg_link" href="javascript:void 0">注册</a></span>';
		rightColumn = $E("hotmail_isnew");
		$E('reg_link').onclick = function(){
			setDirection(TO_OCCUPY_BUT_AUTO_FAIL);
		}
		
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
	
	
	
});



