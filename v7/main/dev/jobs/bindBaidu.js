/**
 * @fileoverview
 *	登录绑定百度账号
 * @author Liu Xiaoyue | weixiao909@gmail.com
 * @version 1.0
 * @Date 2011-12-29
 * @history
 *
 */

$import("lib/login/loginPost.js");
$import("lib/login/_login.js");
$import("sina/sina.js");
$import("sina/core/events/_events.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/system/br.js");
$import("sina/core/string/format.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/setStyle2.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/math/getUniqueId.js");

$registJob("bindBaidu",function(){
	var inputUserName = $E("bind_userName");
	var inputPassWord = $E("bind_passWord");
	var bindForm = $E("bindForm");
	var errorMsg = $E("errorMsg");
	var submitBtn = $E("bindButton");
	Core.Events.addEvent(inputUserName,function(){
		addClass(inputUserName,"inputFocus");
	},'focus');
	Core.Events.addEvent(inputPassWord,function(){
		addClass(inputPassWord,"inputFocus");
	},'focus');
	Core.Events.addEvent(inputUserName,function(){
		removeClass(inputUserName,"inputFocus");
	},'blur');
	Core.Events.addEvent(inputPassWord,function(){
		removeClass(inputPassWord,"inputFocus");
	},'blur');
	//添加样式
	function hasClass(element, className) {
		var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
		return element.className.match(reg);
	} 
	function addClass(element, className) {
		if (!hasClass(element, className))
		{
			element.className += " "+className;
		}
	}
	//移除样式
	function removeClass(element, className) {
		if (hasClass(element, className)) {
			var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
			element.className = element.className.replace(reg,' ');
		}
	};
	//插入html模板
	function insertTemplate(el, template, where){
		var ids = [], //没有带随机数的原始id
			nodes = {},
			idreg = /#{(\w+)}/g,
			rndNum = "_"+(new Date().getTime().toString()).slice(-5)+Math.floor(Math.random()*1E5);
		
		template = template.replace(idreg, function(match, id){ //将#{test}替换成 test_01234 形式。
			ids.push(id);
			return id+rndNum;
		});
		
		Core.Dom.insertHTML(el, template, where);
		
		for(var i=ids.length, id; i--;){
			id = ids[i];
			nodes[id] = $E(id+rndNum);
		}
		
		return nodes;
	};
	//限制某输入框长度
	function limitMaxLen(el, maxLen, callback){
		var f = callback ? function(){
				callback( maxLen - el.value.length );
			} : function(){
				var v = el.value; //内建的长度计算法得到的长度
				if(v.length>maxLen)el.value = v.substring(0, maxLen);
			};
		Core.Events.addEvent(el, f, "input");
		Core.Events.addEvent(el, f, "propertychange"); //for IE
	};
	var option = {
		css: {
			'z-index': '1500',
			'position': $IE6 ? 'absolute' : 'fixed',
			'top': '50%',
			'left': '50%'
		}
	};
	limitMaxLen(inputUserName, 64);
	//设置弹出层位置
	
	function setPos(obj){
		setTimeout(function(){
			var w = parseInt(obj.offsetWidth, 10),
				h = parseInt(obj.offsetHeight, 10);
			obj.style.marginLeft = w / 2 * (-1) + 'px';
			if($IE6){
				obj.style.top = document.documentElement.scrollTop + parseInt((document.documentElement.offsetHeight - h)/2, 10);
				delete option.css.top;
			}else{
				obj.style.marginTop = h / 2 * (-1) + 'px';
			}
			Core.Dom.setStyle2(obj, option.css);
		},1);
	}
	var __addEvent = Core.Events.addEvent, 
		__trim = Core.String.trim;
	function checkForm(){
		return checkEmail() && checkPassword();
	}
	function checkEmail(){
		_db_email = Core.String.trim(inputUserName.value);
		var msg="";
		if(_db_email==""){
			msg = "用户名不为空";
		}
		if(msg==="")return true; //验证通过
		showTips($E("errorMsg"), msg);
		inputUserName.focus();
		return false;
	}
	function checkPassword(){
		_db_password = inputPassWord.value;
		var msg="";
		if(_db_password==""){
			msg = "密码不为空";
		}
		if(msg==="")return true;
		showTips($E("errorMsg"), msg);
		inputPassWord.focus();
		return false;
	}
	function showTips(node, msg){
		_db_iserr = 1;
		node.style.display = "";
		if(msg)node.innerHTML = msg;
	}
	
	function hideTips(node){
		_db_iserr = 0;
		node.style.display = "none";
	}
	
	bindForm.onsubmit = function(){
		if( !checkForm() ){return false;}//验证表单
		//有验证码的情况
		if (typeof sinaSSOController != 'undefined' && typeof sinaSSOController.loginExtraQuery != 'undefined'){
			if (typeof sinaSSOController.loginExtraQuery.door != 'undefined'){
				var vcode = $E("login_vcode").value;
				sinaSSOController.loginExtraQuery.door = vcode || 1;
			}
		}
		var callback = function(result){
			if(result.result){
				var postForm = $E("hiddenForm");
				postForm.action = "http://control.blog.sina.com.cn/baidubind/bind.php";
				postForm.method = "post";
				postForm.submit();
			}else{
				var tpl = '<table id="#{panel}" class="CP_w" style="display:none;">'+
				'<thead id="#{titleBar}">'+
					'<tr>'+
						'<th class="tLeft"><span></span></th>'+
						'<th class="tMid">'+
							'<div class="bLyTop">'+
								'<strong id="#{titleName}">提示</strong>'+
								'<cite><a id="#{btnClose}" href="#" class="CP_w_shut" title="关闭">关闭</a></cite>'+
							'</div>'+
						'</th>'+
						'<th class="tRight"><span></span></th>'+
					'</tr>'+
				'</thead>'+
				'<tfoot>'+
					'<tr>'+
						'<td class="tLeft"><span></span></td>'+
						'<td class="tMid"><span></span></td>'+
						'<td class="tRight"><span></span></td>'+
					'</tr>'+
				'</tfoot>'+
				'<tbody>'+
					'<tr>'+
						'<td class="tLeft"><span></span></td>'+
						'<td class="tMid" id="#{content}">'+
						'<div class="CP_layercon1" id="login_ckimg">'+
						'<div class="verifyPrompt">'+
						'<p>为了保护你的账号安全，请输入验证码进行登录</p>'+
						'<div class="row1"><strong>验证码：</strong><input type="text" class="fm1" id="login_vcode"/>&nbsp;<img  id="checkImg" src="http://simg.sinajs.cn/blog7style/images/common/yzm1.gif" width="100" height="22" align="absmiddle" />&nbsp;<a href="#" id="#{reload}">换一换</a></div>'+
						'<p id="error" style="color:red; font-size:12px;"></p>'+
						'<div class="btn"><a class="SG_aBtn SG_aBtnB" href="#" id="#{strangLand}"><cite>登录</cite></a></div>'+
						'</td>'+
						'<td class="tRight"><span></span></td>'+
					'</tr>'+
				'</tbody>'+
			'</table>';
			
			var nodes = insertTemplate(document.body, tpl,"BeforeEnd");
			//确定弹出层位置
			setPos(nodes.panel);
			if($IE6){
				__addEvent(window, function(){
					nodes.entity && setPos(nodes.entity);
				}, "scroll");
			}

		    if(result.errno === '4049'){ //异地登陆，弹出验证码
				nodes.panel.style.display="";
				sinaSSOController.loginExtraQuery = { door : 0 } //初始化vcode
				$E('login_vcode').value = '';
				$E('checkImg').src = 'http://login.sina.com.cn/cgi/pin.php?r='+ Core.Math.getUniqueId() +'&s=0';
				//更换验证码
				__addEvent(nodes.reload, function(){
					$E('checkImg').src = 'http://login.sina.com.cn/cgi/pin.php?r='+ Core.Math.getUniqueId() +'&s=0';
					$E('login_vcode').value = '';
					$E('errorMsg').innerHTML = '';
				});
				//弹出层关闭
				__addEvent(nodes.btnClose, function(){
					sinaSSOController.loginExtraQuery = {}; 
					nodes.panel.style.display = 'none';
				});
				//弹出层登录
				__addEvent(nodes.strangLand, function(){
					oElement = $E("bindButton");
					if ($IE){
						oElement.click();  
					} else {
						var evt;
						if(/Mobile/i.test(navigator.userAgent)){
							evt = document.createEvent('HTMLEvents');
						}else{
							evt = document.createEvent('MouseEvents');
						}
						evt.initEvent("click",true,true);
						oElement.dispatchEvent(evt);  
					}
				});
				return;
			}
			if (result.errno === '2070'){ //验证码出错
				$E("error").innerHTML = result.reason;
				$E('login_vcode').value = '';
				return;
			}
			if(result.errno == '4047'){ //账号被锁定
				$E("errorMsg").innerHTML = result.reason;
				return;
			}
			if(result.errno == '4057'){ //账号有异常
				$E("errorMsg").innerHTML = result.reason;
				return;
			}else{
				$E("errorMsg").innerHTML = "用户名或密码不正确";
				inputPassWord.value="";
				inputPassWord.focus();
			}
		};
	}
	var bindLogin = new Lib.Login.LoginPost(callback);
	bindLogin.login(inputUserName.value,inputPassWord.value);
	$IE6 && Core.Events.stopEvent(window.event);
	return false;
	}
});
