

/**
 * @fileInfo	
 * @author		chengwei1@staff.sina.com.cn
 * @update		2010 - 01 - 25
 */
$import("sina/sina.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/shorten.js");
$import("sina/core/string/trim.js");
$import("lib/interface.js");
$import("lib/uic.js");

$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/function/bind3.js");

$import("lib/dialogConfig.js");

/**
 * @fileoverview
 *	登录用户名输入自动匹配，从 Blog V5 移植
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 */

/**
 * 登录用户名输入自动匹配，从blog6移植修改
 * @author Random | YangHao@staff.sina.com.cn
 * @version 1.1
 * @create 2009-09-18
 */

$import("sina/sina.js");
$import("sina/core/system/br.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("lib/lib.js");

(function () {

	/**
		初始化的一些变量
		@author FlashSoft | fangchao@staff.sina.com.cn
	*/
	var _inputNode;
	var _rndID = parseInt(Math.random() * 100);
	/** 当前显示的菜单集合 */
	var _showMenuItems = [];
	/** 当前显示的菜单索引 */
	var _selectMenuIndex = -1;
	/** 被选中行的文字 */
	var _selectMenuText = "";
	/** 相关CSS */
	
	//修改 sinaNote border 色为 FFA13B。原来 CCCCCC。添加透明 css。
	var _css = '#userPosition {padding: 0;margin: 0;border: 0;position: absolute;z-index: 999;}\
				#sinaNote {position: absolute;z-index: 999999;width: auto;overflow: hidden;padding: 0;margin: 0;\
				border: 1px solid #FFA13B; background: #ffffff;text-align:left;   filter:alpha(opacity=85);opacity:0.85;}\
				#sinaNote li {font-size: 12px;list-style: none;margin: 0 1px;height: 20px;padding: 0 5px;clear: both;\
				line-height: 20px;cursor: pointer;color: #999999;}\
				#sinaNote li.note {text-align: left;color: #999999;}';
				
	var _viewWindow = window;
	var passcardOBJ = {
		// 鼠标经过背景颜色
		overfcolor: "#999",
		// 鼠标经过背景颜色
		overbgcolor: "#e8f4fc",
		// 鼠标离开字体颜色
		outfcolor: "#000000",
		// 鼠标离开背景颜色
		outbgcolor: "",
		menuStatus: {
			// 是否显示Sina邮箱
			"sina.com": true,
			// 是否显示VIP邮箱 
			"vip.sina.com": true,
			// 是否显示Sina.cn邮箱
			"sina.cn": true,
			// 是否显示外域邮箱
			"非新浪邮箱": true
		}
	};
	/**
	 * 动态生成提示框
	 * add by xs @ 2008-3-4
	 */
	passcardOBJ.createNode = function(){
		var d = _viewWindow.document;
		var div = d.createElement('div');
		div.innerHTML = '<ul id="sinaNote" style="display:none;"></ul>';
		var obj = d.createElement("style");
		obj.setAttribute("type", "text/css");
		try{
			if ($IE) {
				obj.styleSheet.cssText = _css;
			}
			else{
				if(/chrome|safari/.test(navigator.userAgent.toLowerCase())){		//chrome 和 safari 的问题
					obj.textContent = _css;
				}else{
					obj.innerHTML = _css;
				}
			}
		}catch(e){
			//trace(e.message);
		}
		var total = d.createElement("div");
		total.appendChild(div);
		total.appendChild(obj);
		//d.body.appendChild(total);	//没有使用 registJob，则 document.body.appendChild 会报错。
		d.body.insertBefore(total, document.body.firstChild);
		//setTimeout();
		//window.onload = function(){ d.body.appendChild(total); }
	};
	/**
		快捷键选择菜单
		@author FlashSoft | fangchao@staff.sina.com.cn
	*/
	passcardOBJ.arrowKey = function (keyCodeNum) {
		if(keyCodeNum == 38) {// --
			if (_selectMenuIndex <= 0) {_selectMenuIndex = _showMenuItems.length;}
			_selectMenuIndex --;
			passcardOBJ.selectLi(_selectMenuIndex);
		}
		if(keyCodeNum == 40) {// ++
			if (_selectMenuIndex >= _showMenuItems.length - 1) {_selectMenuIndex = -1;}
			_selectMenuIndex ++;

			passcardOBJ.selectLi(_selectMenuIndex);
		}
	};
	passcardOBJ.showList = function(e)//显示列表
	{
		_selectMenuText = "";
		var keyCodeNum = Core.Events.getEvent().keyCode;
		if(keyCodeNum == 38 || keyCodeNum == 40)  {
			passcardOBJ.arrowKey(keyCodeNum);
			return false;
		}
		if(keyCodeNum == 13){
			this.hideList();
			passcardOBJ.afterSelect();
			return false;
		}
		if (!$E('sinaNote')) {passcardOBJ.createNode();}
		var username = $E(e).value;
		var menuList = {};
		var atIndex = username.indexOf("@");
		var InputCase = "";
		var InputStr = "";
		if(atIndex > -1) {
			InputCase = username.substr(atIndex + 1);
			InputStr = username.substr(0, atIndex);
		}
		_showMenuItems = [];
		_selectMenuIndex = 0;
		_showMenuItems[_showMenuItems.length] = "sinaNote_MenuItem_Title_" + _rndID;
		for(var key in this.menuStatus) {
			this.menuStatus[key] = true;
			if(InputCase != "" && InputCase != key.substr(0, InputCase.length)) {
				this.menuStatus[key] = false;
			}
			else {
				_showMenuItems[_showMenuItems.length] = "sinaNote_MenuItem_" + key + "_" + _rndID;
			}
		}
		var listcontent = '<li class="note">请选择登录类型</li>';
		listcontent += '<li id="sinaNote_MenuItem_Title_'+_rndID+'">' + username + '</li>';
		var itemLabel;
		for(var mykey in this.menuStatus) {
			if(this.menuStatus[mykey] == true) {
				if(InputStr == "") {
					itemLabel = username + "@" + mykey;
				}
				else {
					itemLabel = InputStr + "@" + mykey;
				}
				listcontent += '<li id="sinaNote_MenuItem_' + mykey + '_' + _rndID + '" title="' + itemLabel + '">' + itemLabel + '</li>';
			}
		}
		$E("sinaNote").innerHTML = listcontent;
		for (var i = 0; i < username.length; i ++) {
			if (username.charCodeAt(i) < 0xA0) {
				$E("sinaNote").style.display = "";
				this.selectList(e);
			}
			else {
				this.hideList();
			}
		}
		/**
		 * 自动适应文本框的位置，及宽度
		 * add by xs @ 2008-3-3
		 */
		var el = $E(e);
		var note = $E("sinaNote");
		/**
			Iframe在父窗体的位置
			@author FlashSoft | fangchao@staff.sina.com.cn
		*/
		var frameLeft = 0;
		var frameTop = 0;
		var framePos;
		if(_viewWindow != window) {
			framePos = Core.Dom.getXY(window.frameElement);
			frameLeft = framePos[0];
			frameTop = framePos[1];
		}
		var inputWidth = el.offsetWidth;
		if(inputWidth < 185) {				//修改宽度。默认 200px。
			inputWidth = 185;
		}
		note.style.width = inputWidth - 2 + 'px';
		var inputXY = Core.Dom.getXY(el);
		//note.style.left = (inputXY[0] - ($IE ? 2 : -1) + frameLeft) + 'px';
		note.style.left = (inputXY[0] - ($IE ? 2 : -1) + frameLeft -6) + 'px';				//修改位置。
		note.style.top = (inputXY[1] + el.offsetHeight - ($IE ? 2 : -1) + frameTop) + 'px';
	};
	passcardOBJ.selectList = function(e)//选择列表
	{
		var unames = $E("sinaNote").getElementsByTagName("li");
		for (var i = 1; i < unames.length; i++) {
				unames[1].style.backgroundColor = passcardOBJ.overbgcolor;
				unames[1].style.color = passcardOBJ.outfcolor;//鼠标经过字体颜色
				unames[i].onmousedown = function(){
					var temp = this.innerHTML;
					if(temp.indexOf("非新浪邮箱")>-1){
						var pos=temp.split("@");
						$E(e).value=pos[0];
					}else{
						$E(e).value = this.innerHTML;
					}
					if (Core.Events.getEvent() != null) {
						Core.Events.stopEvent();
					}
					passcardOBJ.afterSelect();
				};
				unames[i].onmouseover = function(){
					if (i != 1) {
							unames[1].style.backgroundColor = passcardOBJ.outbgcolor;
							unames[1].style.color = passcardOBJ.overfcolor;//鼠标经过字体颜色
					}
					this.style.backgroundColor = passcardOBJ.overbgcolor;//鼠标经过背景颜色
					this.style.color = passcardOBJ.outfcolor;//鼠标经过字体颜色
				};
				unames[i].onmouseout = function(){
					this.style.backgroundColor = passcardOBJ.outbgcolor;//鼠标离开背景颜色
					this.style.color = passcardOBJ.overfcolor;//鼠标离开字体颜色
					unames[1].style.backgroundColor = passcardOBJ.overbgcolor;//鼠标经过背景颜色
					unames[1].style.color = passcardOBJ.outfcolor;//鼠标经过字体颜色
				};
		}
	};
	/**
		选中指定ID的li
		@author | fangchao@staff.sina.com.cn
	*/
	passcardOBJ.selectLi = function (nIndex) {
		var menuNode;
		$E("sinaNote_MenuItem_Title_"+_rndID).style.backgroundColor = passcardOBJ.outbgcolor;//鼠标离开背景颜色
		$E("sinaNote_MenuItem_Title_"+_rndID).style.color = passcardOBJ.overfcolor;//鼠标离开字体颜色
		for(var i = 0; i < _showMenuItems.length; i ++ ) {
			menuNode = $E(_showMenuItems[i]);
			menuNode.style.backgroundColor = passcardOBJ.outbgcolor;//鼠标离开背景颜色
			menuNode.style.color = passcardOBJ.overfcolor;//鼠标离开字体颜色
		}
		$E(_showMenuItems[nIndex]).style.backgroundColor = passcardOBJ.overbgcolor;//鼠标经过背景颜色
		$E(_showMenuItems[nIndex]).style.color = passcardOBJ.outfcolor;//鼠标经过字体颜色
		_selectMenuText = $E(_showMenuItems[nIndex]).innerHTML;
	};
	passcardOBJ.hideList = function()//隐藏列表
	{
		/**
		 * 如果没有找到页面中相应的对象，则自动创建
		 * add by xs @ 2008-3-3
		 */
		if(!$E('sinaNote')) { passcardOBJ.createNode(); }
		$E("sinaNote").style.display = "none";
	};
	passcardOBJ.init = function (oNode, oColors, oFocusNode, oWindowTarget, afterSelect) {
		oWindowTarget = oWindowTarget || window;
		this.afterSelect = afterSelect || function(){};
		if(oWindowTarget.document.body == null){
			setTimeout(Core.Function.bind3(function () {
				this.init(oNode, oColors, oFocusNode, oWindowTarget);
			},this), 100);
		}
		for(var key in oColors) {
			this[key] = oColors[key];
		}
		Core.Events.addEvent(document, passcardOBJ.hideList, "click");
		Core.Events.addEvent(oNode, passcardOBJ.hideList, "blur");
		Core.Events.addEvent(oNode, Core.Function.bind3(passcardOBJ.showList,this, [oNode]), "keyup");
		Core.Events.addEvent(oNode, function (e) {
			var keyCodeNum = Core.Events.getEvent().keyCode;
			var isSinaMail;
			if(keyCodeNum == 13 || keyCodeNum == 9) {
				if(_selectMenuText != "") {
						var temp = _selectMenuText;
							if(temp.indexOf("非新浪邮箱") > -1){
								var pos = temp.split("@");
								oNode.value=pos[0]+"@";
								isSinaMail=false;
							}else{
								oNode.value = _selectMenuText;
								isSinaMail=true;
							}
				}
				if (isSinaMail) {
					if (oFocusNode != null) {
						oFocusNode.focus();
					}
				}else{
					if(oNode){
						oNode.focus();
					}
				}
				//Core.Events.stopEvent();
			}
		}, "keydown");
		if (oWindowTarget) {_viewWindow = oWindowTarget;}
	};
	Lib.passcardOBJ = passcardOBJ;
})();



//------------------------------
var $BlogLogin = (function(){
	var uniInst = null;
	
	function loginConstruct(loginOpt){
		loginOpt = loginOpt || {};
		loginOpt = {		//for in 不好设默认。
			nickLen : loginOpt.nickLen || 16,
			sucCallback : loginOpt.sucCallback || function(){},
			customFunc : loginOpt.customFunc || "",
			suggestColor : loginOpt.suggestColor || {		//默认灰 style。
				border : "#CCCCCC",
				msover : "#E8F4FC"
			}
		};
		//undefined 是 var 过了的。var 过就不会报错。

		//基本登录功能：用户名、密码、记住、登录钮、退出、用户名、博客地址、内错误。8 个 id。
		//登录前、登录后 2 个 id，共 10 个。
		var loginDone = $E("loginDone");
		var userNickName = $E("userNickName");
		var logout = $E("logout");
		var blogEntrance = $E("blogEntrance");
		
		var notLogin = $E("notLogin");
		var loginName = $E("loginName");
		var loginPass = $E("loginPass");
		var loginError = $E("loginError");
		var loginSave = $E("loginSave");
		var loginButton = $E("loginButton");
		
		//常量	
		var blogLink = "http://blog.sina.com.cn/u/";
		//var messagesLink = "http://profile.blog.sina.com.cn/index.php?uid=";
		var unreadLink = "http://control.blog.sina.com.cn/riaapi/profile/unread.php";
	
		//同步量，写全，不同情况由各自方法各自定义。
		var nickOk, infoOk;
		function loadingDone(){
			if(nickOk && infoOk){ showDone(); }
		}
	
		//功能逻辑
		function showLoad(){
		}
		function showDone(){
			loginDone.style.display = "";
			notLogin.style.display = "none";
		}
		function showNot(){
			loginDone.style.display = "none";
			notLogin.style.display = "";
		}
		function tabkey(){
		}
		function showInfo(uid){
			infoOk = true;
			blogEntrance.href = blogLink + uid + "";
			Lib.Uic.getNickName([uid], function(res){
				if(Core.String.byteLength(res[uid]) > loginOpt.nickLen){
					res[uid] = Core.String.shorten(res[uid], loginOpt.nickLen - 2);
				}
				userNickName.innerHTML = res[uid];
				userNickName.href = blogLink + uid + "";
				nickOk = true;
				loadingDone();
			});
		}
		function showErr(errMsg){
			loginError.innerHTML = errMsg;
			loginError.style.display = "";
		}
		function suggestInit(){
		}
		
		
		
		//功能选择。初始化 2。都是对上面 function 的覆写。所以不用担心顺序错误。
		//登录前的自动补全。
		if(loginOpt.customFunc.indexOf("suggest") > -1){
			var suggestTrue = false;
			var suggestInit = function(){
				if(!suggestTrue){
					Lib.passcardOBJ.init(			//suggest
						loginNameInput,
						{
							overfcolor: "#999",			// 鼠标经过字体颜色
							overbgcolor: loginOpt.suggestColor.msover,	// 鼠标经过背景颜色 #E8F4FC
							outfcolor: "#000000",		// 鼠标离开字体颜色
							outbgcolor: ""				// 鼠标离开背景颜色
						},
						null,
						null,
						function(){						//afterSelect;
							loginPassInput.focus();
						}
					);
					suggestTrue = true;
				}
			};
			var styleNode = $C("style");
			styleNode.setAttribute("type", "text/css");			//IE 必须。
			var sinaNoteStyle = "#sinaNote{border-color:"+ loginOpt.suggestColor.border +"}";
			if($IE){
				styleNode.styleSheet.cssText = sinaNoteStyle;
			}
			else{
				if(/chrome/.test(navigator.userAgent.toLowerCase())){		//chrome 问题
					styleNode.textContent = sinaNoteStyle;
				}else{
					styleNode.innerHTML = sinaNoteStyle;
				}
			}
			document.body.insertBefore(styleNode, document.body.firstChild);
		}
		//登录中，浮层。OK
		if(loginOpt.customFunc.indexOf("loading") > -1){
			var loginLoad = $E("loginLoad");
			var showNot = function(){
				loginLoad.style.display = "none";
				loginDone.style.display = "none";
				notLogin.style.display = "";
			};
			var showDone = function(){
				loginLoad.style.display = "none";
				loginDone.style.display = "";
				notLogin.style.display = "none";
			};
			var showLoad = function(){
				loginLoad.style.display = "";
				loginDone.style.display = "none";
				notLogin.style.display = "none";
			};
		}
		//登录后的用户数据显示。纸条、通知、评论、头像。OK
		if(loginOpt.customFunc.indexOf("userData") > -1){
			var scrips = $E("scrips");
			var notices = $E("notices");
			var comments = $E("comments");
			var userHead = $E("userHead");
			var userHeadImg = $T(userHead, "img")[0];
			
			//请求并显示用户登录数据，相关链接、昵称、评论数之类……
			var showInfo = function(uid){
				var unread = new Interface(unreadLink, "jsload");
				var nickLen = loginOpt.nickLen;
				blogEntrance.href = blogLink + uid + "";
				//messages.href = messages2.href = messagesLink+uid+"#module_942";
				//"http://portrait" + ((1 * uid) % 8 +1) +".sinaimg.cn/" + uid + "/blog/180"
				
				userHead.href = blogLink + uid + "";
				userHeadImg.src = "http://portrait" + ((1 * uid) % 8 +1) +".sinaimg.cn/" + uid + "/blog/180";
				
				Lib.Uic.getNickName([uid], function(res){
					if(Core.String.byteLength(res[uid]) > nickLen){
						res[uid] = Core.String.shorten(res[uid], nickLen - 2);
					}
					userNickName.innerHTML = res[uid];
					nickOk = true;
					loadingDone();
				});
				
				unread.request({
					GET : {
						product : "blog",
						version : 7,
						uid : uid
					},
					onSuccess : function(res){
						if (typeof res.gbook === "undefined")
                            res.gbook = 0;
						if (typeof res.notice === "undefined")
                            res.notice = 0;
						if (typeof res.blogcomment === "undefined")
                            res.blogcomment = 0;
						
						notices.innerHTML = res.notice;
						scrips.innerHTML = res.message;
						comments.innerHTML = res.blogcomment;
						
						infoOk = true;
						loadingDone();
					},
					onError : function(res){
					}
				});
			};
		}
		//登录前的 tabindex 功能。OK
		if(loginOpt.customFunc.indexOf("tabkey") > -1){
			var tabIndex = {
				init : function (oOption){
					var fNode;
					oOption = oOption || {};
					oOption.form = $E(oOption.form) || document.forms[oOption.form];
					if(oOption.form == null || isNaN(oOption.max)){
						return false;
					}
					Core.Events.addEvent(oOption.form, Core.Function.bind3(this.resetCursor, this, [oOption.form, oOption.max]), "keydown");
					
					if(typeof oOption.focusNode == "string"){
						fNode = $E(oOption.focusNode);
					}else{
						fNode = oOption.focusNode;
					}
					if(fNode){ fNode.focus(); }
				},
				resetCursor : function (sForm, nMax){
					evt = Core.Events.getEvent();
					var target = evt.srcElement || evt.target;
					var key = evt.which || evt.keyCode;
					if (key == 9 && target.tabIndex >= nMax) {
						($E(sForm) || document.forms[sForm]).focus();
					}
				}
			};
			var tabkey = function(){
				tabIndex.init({
					form : $E("loginFormTab") || $E("notLogin"),
					max : 10
				});
			};
		}
		//错误提示方式。
		if(loginOpt.customFunc.indexOf("dialogErr") > -1){
			var showErr = function(errMsg){
				winDialog.alert(errMsg);
			};
		}
		//是否输入框高亮。
		if(loginOpt.customFunc.indexOf("highlight") > -1){
			var loginNameInput = $T(loginName, "input")[0];
			var loginPassInput = $T(loginPass, "input")[0];
		}else{
			loginNameInput = loginName;			//为了页面只有一个 id。
			loginPassInput = loginPass;
		}
		
		//登录设置。
		sinaSSOConfig = {
			entry : "blog",
			setDomain : true,
			customLoginCallBack : function(res){
				if(res.result){
					var uid = res.userinfo.uniqueid;
					showInfo(uid);					//没有此模块自动为空就好。
					loginOpt.sucCallback(uid);		//登录成功后执行。
				}else{
					showNot();
					var errMsg = "";
					switch(res.errno){
						case "5":
						case "2091":
						case "80":
						case "101": errMsg = "登录名和密码不匹配，请重试。"; break;
						case "4010": errMsg = "账户尚未确认，请先在邮箱确认"; break;
						default: errMsg = "登录失败，请重试。"; break;
					}
					showErr(errMsg);
					loginPassInput.value = "";			//登录失败清除密码。
				}
			},
			customLogoutCallBack : function(res){
				showNot();
				loginPassInput.value = "";
				suggestInit();
				loginNameInput.focus();
			}
		};
		//初始化一下，把 sinaSSOConfig 的东西传入登录对象。
		sinaSSOController.init();
	
	
	
	////////////////////////////////////
	
		//tabIndex
		tabkey();
		
		//注册事件。
		loginButton.onclick = userLogin;
		loginButton.onkeydown = loginPassInput.onkeydown = keyLogin;			//去掉 nameInput 的登录事件。
		function keyLogin(event){
			var key;
			event = event || window.event;
			key = event.keyCode || event.which;
			if(key == 13){
				userLogin();
			}
		}
		logout.onclick = function(){
			showLoad();
			sinaSSOController.logout();
			return false;
		};
		loginNameInput.onfocus = function(){
			loginNameInput.select();
			addClass(loginName, "selected");
		};
		loginPassInput.onfocus = function(){
			loginPassInput.select();
			addClass(loginPass, "selected");
		};
		loginNameInput.onblur = function(){
			delClass(loginName, "selected");
		};
		loginPassInput.onblur = function(){
			delClass(loginPass, "selected");
		};
		if(/chrome/.test(navigator.userAgent.toLowerCase())){
			loginPassInput.onmouseup = loginNameInput.onmouseup = function(){ return false; };		//chrome 的 focus cancel 行为。
		}
		
		//自动登录。
		sinaSSOController.autoLogin(function(coki){
			//通过 cookie 判断显示哪个 div，并渲染加载时数据。
			if(coki){
				showInfo(coki.uid);			//uic.js 会查缓存。
				loginOpt.sucCallback(coki.uid);		//登录成功后执行。
			}else{
				showNot();
				suggestInit();
				//loginNameInput.focus();		//此事件引发，会导致一个 document.body.appendChild() 的终止异常。
			}
		});
		
	///////////////////////////////	
		
		//登录动作。		//不变动的函数。
		function userLogin(){
			var stat = 0;
			nickOk = infoOk = false;
			//loginError.style.display = "none";		//貌似不需要。
			
			if(!loginNameInput.value){
				showErr("请输入登录名");
				return false;
			}
			if(!loginPassInput.value){
				showErr("请输入密码");
				return false;
			}
			showLoad();					//判断完毕再 load
			if(loginSave.checked){
				stat = 30;
			}
			sinaSSOController.login(loginNameInput.value, loginPassInput.value, stat);
			return false;
		}
	
		function addClass(dom, clz){		//有则不加。class 唯一。
			if(!dom) return false;
			if(!hasClass(dom, clz)){
				dom.className = Core.String.trim(dom.className.concat(" " + clz));
			}
		}
		function delClass(dom, clz){		//全删，再次保证 class 唯一。	//( +|^)clz(?=( |$))
			if(!dom) return false;
			var reg = new RegExp("(?: +|^)" + clz + "(?=( |$))", "ig");
			dom.className = Core.String.trim(dom.className.replace(reg, ""));
		}
		function hasClass(dom, clz){		//不能用 indexOf。
			if(!dom) return false;
			var reg = new RegExp("(?: +|^)" + clz + "(?=( |$))", "ig");
			return reg.test(dom.className);
		}
	}
	return {
		init : function(loginOpt){
			if(!uniInst){
				uniInst = loginConstruct(loginOpt);
			}
			return uniInst;
		}
	}
})();

