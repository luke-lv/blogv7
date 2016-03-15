/**
 * @fileoverview 广告分成项目绑定银行卡
 * @author Edwin | zhihang1@staff.sina.com.cn
 * @created 2014-04-16
 */
$import("sina/sina.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkRegExp.js");
$import("lib/login/loginPost.js");
$import("sina/core/array/foreach.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/addClass.js");
$import("sina/core/dom/removeClass.js");

$registJob('bankcardbind',function(){
	// 后台接口
	var iProfit = new Interface('http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/profit/userProfit.php', 'ajax');
	// 第一步验证用户登录账号
	var checkUser = function (){
		var that = {},
			_this = {};
		
		var nodes = {
			name : $E('login_name_bonus'),
			namevalue : $E('login_name_value_bonus'),
			pass : $E('login_pass_bonus'),
			tip : $E('login_tip_bonus'),
			submit : $E('login_btn_bonus'),
			vcode : $E('vcode_bonus'),
			vcodeimg : $E('vcode_img_bonus'),
			vcodebtn : $E('vcode_btn_bonus'),
			vcodeinput : $E('vcode_input_bonus'),
			step : $E('step_bonus'),
			loginbox : $E('login_box_bonus'),
			bankbox : $E('bank_box_bonus'),
			contractbox : $E('contract_box_bonus'),
			vsnf : $E('vsnf_bonus'),
			vsnfinput : $E('vsnf_input_bonus'),
			title : $E('title_bonus')
		};
		// 初始化
		that.init = function (){			
			var callback = _this.parse;
			_this.request = new Lib.Login.LoginPost(callback);
			_this.setName();
			_this.initEvent();
		};

		_this.initEvent = function (){			
			Core.Events.addEvent(nodes.submit, _this.doLogin,'click');

			//用户名输入框回车后触发登录事件 
			Core.Events.addEvent(nodes.name, _this.pressEnter, 'keydown');			
			//密码输入框回车后触发登录事件 
			Core.Events.addEvent(nodes.pass, _this.pressEnter, 'keydown');
			//验证码输入框回车后触发登录事件 
			Core.Events.addEvent(nodes.vcodeinput, _this.pressEnter, 'keydown');
			//威盾码输入框回车后触发登录事件 
			Core.Events.addEvent(nodes.vsnfinput, _this.pressEnter, 'keydown');

			//刷新验证码事件
            Core.Events.addEvent(nodes.vcodebtn, function(){
                nodes.vcodeimg.src = 'http://login.sina.com.cn/cgi/pin.php?r='+ Core.Math.getUniqueId() +'&s=0';
                nodes.vcodeinput.value = '';
                _this.error('');
            },'click');
		};

		_this.setName = function(){
			if(window.sinaSSOController){
				var userDate = window.sinaSSOController.getSinaCookie();
				if(userDate){
					var name = userDate.name;
					nodes.namevalue.value = name;
					var n = name.indexOf('@');
					if(n > -1){
						var mailfront = name.slice(0,n),
							mailback = name.slice(n);
						if(mailfront.length > 3){
							mailfront = _this.scryptName(mailfront);
						}
						nodes.name.value = mailfront + mailback;
					}else{
						nodes.name.value = _this.scryptName(name);
					}
				}
				
			}
		};

		_this.scryptName = function(str){
			var s2 = str.slice(0,2),
				s1 = str.slice(-1),
				len = str.slice(2,-1).length,
				star = '';
			for(var i = 0; i<len; i++){
				star += '*';
			}
			return s2 + star + s1;
		};

		_this.doLogin = function(){
			// Core.Events.stopEvent(); // 作用未知，可能是阻止冒泡
			var username = nodes.namevalue.value;
			var password = nodes.pass.value;
			
			username = Core.String.trim(username);
			password = password;
			if(username == ''){
				_this.error('请输入登录名');
				return false;
			}
			if(password == ''){
				_this.error('请输入密码');
				return false;
			}

			//有验证码的情况
			if (typeof sinaSSOController != 'undefined' && typeof sinaSSOController.loginExtraQuery != 'undefined'){
				// 开启威盾验证功能
				sinaSSOController.loginExtraQuery.vsnf = 1;
				// 威盾验证
				if(nodes.vsnf.style.display != 'none'){
					var vsnf = nodes.vsnfinput.value;
					sinaSSOController.loginExtraQuery.vsnval = vsnf || 1;
				}
				// 验证码验证
				else if (nodes.vcode.style.display != 'none'){
					var vcode = nodes.vcodeinput.value;
					sinaSSOController.loginExtraQuery.door = vcode || 1;
				}
			}

			_this.request.login(username, password,60);
			// return false; // 这里取消默认行为还有意义吗？
		};

		_this.pressEnter = function(e){
			var code = e.keyCode;
			if (code == 13) {	//Enter
				_this.doLogin();
			}
		};

		var parsed = true; //登录成功后只执行一次
		_this.parse = function(loginStatus){
			if(loginStatus.result && parsed){
				_this.nextStep();
				parsed = false;
			}else{
				switch (loginStatus.errno){
					case '5024': // 威盾验证					
						nodes.vsnf.style.display = '';
						nodes.vsnfinput.value = '';
						nodes.vsnfinput.focus();
						_this.error(loginStatus.reason);
						break;
					
					case '5025': //威盾验证码出错
						sinaSSOController.loginExtraQuery = {}; //清空威盾码
						_this.error(loginStatus.reason);
						break;
					
					case '4049': //异地登陆，验证码验证	                 
		                nodes.vcode.style.display = '';
		                nodes.vcodeinput.value = '';
		                nodes.vcodeinput.focus();
		                nodes.vcodeimg.src = 'http://login.sina.com.cn/cgi/pin.php?r='+ Core.Math.getUniqueId() +'&s=0';               
		                _this.error(loginStatus.reason);
		            	break;

		            case '2070': //验证码出错
		            	sinaSSOController.loginExtraQuery = {}; //清空验证码
		                Core.Events.fireEvent(nodes.vcodebtn, 'click');
		                _this.error(loginStatus.reason);
		            	break;

		            case '101': //登录名或密码错误
		                _this.error(loginStatus.reason);
		            	break;

		            case '4047': //帐号被锁定
		                _this.error(loginStatus.reason);
		            	break;

		            case '4057': //帐号有异常
		                _this.error(loginStatus.reason);
		            	break;

		            case '4040':
		                _this.error(loginStatus.reason);
		            	break;
				}
				
			}
		};

		_this.error = function(msg){
			nodes.tip.innerHTML = msg;
			_this.focus();
		};

		_this.focus = function(){
			if(nodes.name.value == ''){
				nodes.name.focus();
			}else if(nodes.pass.value == ''){
				nodes.pass.focus();
			}
		};

		_this.nextStep = function(){
			Core.Dom.removeClass(nodes.step, 'cps_step1');
			Core.Dom.addClass(nodes.step, 'cps_step2');
			nodes.loginbox.style.display = 'none';
			nodes.title.innerHTML = '请输入详细资料和银行卡信息，我们将根据博客广告合作协议为您付款';
			var agree = window.scope.$contract;
			if(agree != 1){ // 是否跳到广告分成协议页面的标示
				nodes.contractbox.style.display = '';
				var signContractStep = signContract();
				signContractStep.init();
			}else{
				nodes.bankbox.style.display = '';
				var bindUserStep = bindUser();
				bindUserStep.init();
			}			
		};

		return that;
	};

	// 第二步签订广告分成协议
	var signContract = function(){
		var that = {},
			_this = {};
		
		var nodes = {
			read : $E('read_bonus'),
			submit : $E('contract_btn_bonus'),
			title : $E('title_bonus'),
			contractbox : $E('contract_box_bonus'),
			bankbox : $E('bank_box_bonus')
		};

		that.init = function(){
			_this.initEvent();
		};

		_this.initEvent = function(){
			Core.Events.addEvent(nodes.submit,_this.doSign,'click');
		};

		_this.doSign = function(){
			if(nodes.read.checked){
				var agreeDate = {
					uid : window.scope.$uid,
					action : 'profit_agree'
				}
				iProfit.request({
					GET : agreeDate,
					onSuccess : function(result){
						_this.nextStep();
					},
					onError : function(result){
						winDialog.alert(result.data.message);
					}
				});
			}else{
				winDialog.alert('请先点选我已阅读选项。');
			}
		};

		_this.nextStep = function(){
			nodes.contractbox.style.display = 'none';
			nodes.bankbox.style.display = '';
			var bindUserStep = bindUser();
			bindUserStep.init();
		};

		return that;
	};

	// 第三步绑定用户支付宝账号
	var bindUser = function(){
		var that = {},
			_this = {};
		
		var nodes = {
			realname : $E('real_name_bonus'),
			phonenum : $E('phone_num_bonus'),
			identitytype : $E('identity_type_bonus'),
			identitynum : $E('identity_num_bonus'),
			bankname : $E('bank_name_bonus'),
			account : $E('account_bonus'),
			accountagain : $E('account_again_bonus'),			
			province : $E('province_bonus'),
			citytype : $E('city_type_bonus'),
			city : $E('city_bonus'),
			imgfront : $E('img_front_bonus'),
			imgback : $E('img_back_bonus'),
			imgfrontname : $E('img_front_name_bonus'),
			imgbackname : $E('img_back_name_bonus'),
			imgfrontform : $E('img_front_form_bonus'),
			imgbackform : $E('img_back_form_bonus'),
			imgfrontframe : $E('img_front_frame'),
			imgbackframe : $E('img_back_frame'),
			tip : $E('bank_tip_bonus'),
			submit : $E('bank_btn_bonus'),
			step : $E('step_bonus'),
			title : $E('title_bonus'),
			bankbox : $E('bank_box_bonus'),
			sucbox : $E('suc_box_bonus')
		};

		that.init = function(){
			_this.initEvent();
			var signDate = {
				uid : window.scope.$uid,
				action : 'profit_sign'
			}
			iProfit.request({
				GET : signDate,
				onSuccess : function(result){
					_this.createInput('uid', window.scope.$uid);
					for(var k in result){
						_this.createInput(k, result[k]);
					}
					_this.ticket = result;
				},
				onError : function(result){
					_this.error(result.data.message);
				}
			});
		};

		_this.createInput = function(name, value){
			var inputFront = $C('input');
			inputFront.type = 'hidden';
			inputFront.name = name;
			inputFront.value = value;
			nodes.imgfrontform.appendChild(inputFront);
			var inputBack = $C('input');
			inputBack.type = 'hidden';
			inputBack.name = name;
			inputBack.value = value;
			nodes.imgbackform.appendChild(inputBack);
		};

		_this.initEvent = function(){
			Core.Events.addEvent(nodes.submit,_this.doBind,'click');
			Core.Events.addEvent($T(nodes.imgfrontname,'a')[0],function(){
				nodes.imgfrontname.style.display = 'none';
				_this.resetFile(nodes.imgfront, nodes.imgfrontform, 'imgfront', 'img_front_bonus');
			},'click');
			Core.Events.addEvent($T(nodes.imgbackname,'a')[0],function(){
				nodes.imgbackname.style.display = 'none';
				_this.resetFile(nodes.imgback, nodes.imgbackform, 'imgback', 'img_back_bonus');
			},'click');
			Core.Events.addEvent(nodes.imgfront,function(){
				var imgfront = nodes.imgfront.value;
				if(imgfront != ''){
					nodes.imgfrontform.submit();
				}				
			},'change');
			Core.Events.addEvent(nodes.imgback,function(){
				var imgback = nodes.imgback.value;
				if(imgback != ''){
					nodes.imgbackform.submit();
				}				
			},'change');

			// 上传身份证正面回调
			window.imgFrontCallBack = function(result){
				if(result.code == 'A00006'){
					var imgfront = _this.getImgName(nodes.imgfront.value);
					$T(nodes.imgfrontname,'div')[0].innerHTML = imgfront;
					nodes.imgfrontname.style.display = '';			
				}else{
					_this.error(decodeURIComponent(result.data.message));
				}				
			};

			// 上传身份证背面回调
			window.imgBackCallBack = function(result){
				if(result.code == 'A00006'){
					var imgback = _this.getImgName(nodes.imgback.value);
					$T(nodes.imgbackname,'div')[0].innerHTML = imgback;
					nodes.imgbackname.style.display = '';
				}else{
					_this.error(decodeURIComponent(result.data.message));
				}				
			};
		};

		_this.resetFile = function(ele, form, name, str){
			var parent = ele.parentNode;
			var input = $C('input');
			input.type = 'file';
			input.className = 'file';
			input.name = str;
			input.id = str;
			parent.removeChild(ele);
			parent.appendChild(input);
			nodes[name] = input;
			Core.Events.addEvent(nodes[name],function(){
				var imgvalue = ele.value;
				if(imgvalue != ''){
					form.submit();
				}				
			},'change');
		};

		_this.getImgName = function(name){
			var n = name.lastIndexOf('\\');
			return n > -1?name.slice(n+1):name;
		}

		_this.doBind = function(){
			if(!_this.hasClass(nodes.submit,'pro_btn_on')){
				var accountData = _this.verify();
				if(accountData != false){
					winDialog.confirm('提交个人资料及银行卡信息后，我们将按此信息给您打款，请您确认信息无误。',{
						funcOk : function(){
							Core.Dom.addClass(nodes.submit,'pro_btn_on');
							iProfit.request({
								POST : accountData,
								onSuccess : function(result){
									_this.error('');
									_this.nextStep();
								},
								onError : function(result){
									_this.error(result.data.message);
									Core.Dom.removeClass(nodes.submit,'pro_btn_on');
								}
							});
						}
					});				
					
				}
			}
		};

		_this.hasClass = function(dom, clz){
			if(!dom){ return false; }
			var reg = new RegExp("( +|^)" + clz + "(?=( |$))", "ig");
			return reg.test(dom.className);
		};

		_this.verify = function(){
			var check = Lib.checkRegExp,
				realname = Core.String.trim(nodes.realname.value),
				phonenum = Core.String.trim(nodes.phonenum.value),
				types = $T(nodes.identitytype,'input'),
				identitynum = Core.String.trim(nodes.identitynum.value),
				bankname = Core.String.trim(nodes.bankname.value),
				account = Core.String.trim(nodes.account.value),
				accountagain = Core.String.trim(nodes.accountagain.value),
				province = nodes.province.value,
				citytype = nodes.citytype.value,
				city = Core.String.trim(nodes.city.value),
				imgfront = _this.getImgName(nodes.imgfront.value),
				imgback = _this.getImgName(nodes.imgback.value),
				identitytype;

			Core.Array.foreach(types,function(ele){
				if(ele.checked){
					identitytype =  ele.value;
				}
			});
			
			if(!check.empty(realname) || !check.realName(realname)){
				_this.error('真实姓名为空或格式不正确');
				nodes.realname.focus();
				return false;
			}
			if(!check.mobile(phonenum)){
				_this.error('手机号码为空或格式不正确');
				nodes.phonenum.focus();
				return false;
			}
			if(identitytype == '1' && !check.cardID(identitynum)){
				_this.error('身份证号为空或格式不正确');
				nodes.identitynum.focus();
				return false;
			}
			if(!check.empty(identitynum)){
				_this.error('证件号码不能为空');
				nodes.identitynum.focus();
				return false;
			}
			if(!check.empty(bankname) || !check.realName(bankname)){
				_this.error('开户银行为空或格式不正确');
				nodes.bankname.focus();
				return false;
			}
			if(!/^\d{11,}$/.test(account)){
				_this.error('银行卡号为空或格式不正确');
				nodes.account.focus();
				return false;
			}
			if(accountagain != account){
				_this.error('银行卡号两次输入不一致，请检查修改');
				nodes.accountagain.focus();
				return false;
			}
			if(province === '请选择省份'){
				_this.error('请选择省份');
				nodes.province.focus();
				return false;
			}			
			if(!new RegExp(province).test('北京天津重庆上海香港澳门')){
				if(citytype === '市或县'){
					_this.error('请选择市或县');
					nodes.citytype.focus();
					return false;
				}
				if(!check.empty(city) || !check.realName(city)){
					_this.error('市或县名称为空或格式不正确');
					nodes.city.focus();
					return false;
				}
			}
			if(!check.imgURI(imgfront)){
				_this.error('身份证正面图片为空或格式不正确');
				return false;
			}

			var accountDate = {
				uid : window.scope.$uid,
				action : 'profit_accbind',
				identity_num_bonus : identitynum,
				real_name_bonus : realname,
				phone_num_bonus : phonenum,
				type_bonus : identitytype,
				bank_name_bonus : bankname,
				account_bonus : account,
				province_bonus : province
			}

			if(!new RegExp(province).test('北京天津重庆上海香港澳门')){
				accountDate.city_type_bonus = citytype;
				accountDate.city_bonus = city;
			}
			
			for(var k in _this.ticket){
				accountDate[k] = _this.ticket[k];
			}
			return accountDate;

		};

		_this.error = function(msg){
			nodes.tip.innerHTML = msg;
		};

		_this.nextStep = function(){
			Core.Dom.removeClass(nodes.step, 'cps_step2');
			Core.Dom.addClass(nodes.step, 'cps_step3');
			nodes.bankbox.style.display = 'none';
			nodes.sucbox.style.display = '';			
			nodes.title.innerHTML = '您已成功提交个人资料和银行卡信息，我们将按此信息付款';
			var bindSucStep = bindSuc();
			bindSucStep.init();			
		}

		return that;
	};

	// 第四步绑定完成
	var bindSuc = function(){
		var that = {},
			_this = {};
		
		var nodes = {
			account : $E('account_bonus'),
			accountsuc : $E('account_suc_bonus'),
			checklog : $E('suc_btn_bonus'),
			step : $E('step_bonus'),
			bankbox : $E('bank_box_bonus')
		};

		that.init = function(){
			_this.getAccount();
		};

		_this.getAccount = function(){
			var account = _this.scryptAccount(nodes.account.value);			
			nodes.accountsuc.innerHTML = account;
		};

		_this.scryptAccount = function(account){
			if(typeof account === 'string' && account.length > 10){
				var s8 = account.slice(0,8),
					s2 = account.slice(-2),
					len = account.slice(8,-2).length,
					star = '';
				for(var i = 0; i<len; i++){
					star += '*';
				}
				return s8 + star + s2;
			}else {
				return account;
			}			
		};

		return that;
	};

	var checkUserStep = checkUser();
	checkUserStep.init();
});
