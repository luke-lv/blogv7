/**
 * @fileoverview
 *	发好友邀请
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/class/create.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/utils/form/sinput.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/template.js");
//$import("lib/debug/verifyCodeDebug.js");
$import("lib/login/info.js");
$import("lib/lib.js");
$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");
$import("lib/component/include/invite_tpl.js");
$import("lib/login/loginPost.js");
$import("lib/interface.js");
$import("lib/msg/inviteMSG.js");
$import("lib/openBlog.js");
$import("lib/blogv/getVHTML.js");
$import("lib/sendLog.js");

Lib.Invite_Base = Core.Class.create();
Lib.Invite_Base.prototype = {
		"html"	: ['<div class="CP_layercon2 addFriendItem">'
			,'<div class="toWho">#{head_image}<span>#{nickname}</span></div>'
			,'<div class="formTowho">'
				,'<div class="row1" style="display:#{login};">登录名：'
					,'<input id="invite_loginname" type="text" class="fm1" style="width:80px;"/>&nbsp;&nbsp;&nbsp;'
					,'密码：<input id="invite_password" type="password" class="fm1" style="width:73px;" maxlength="16"/>'
					,'&nbsp;&nbsp;<a target="_blank" href="http://login.sina.com.cn/getpass.html">找回密码</a><em class="SG_txtc">'
					,'|</em><a target="_blank" href="http://login.sina.com.cn/signup/signupmail.php?entry=blog&srcuid='+scope.$uid+'&src=blogicp">注册</a>'
					,'<input id="saveOnline_invite" type="checkbox" checked value="" style="display:inline-block;margin-top:3px;"/><label for="saveOnline_invite" style="margin-top:10px; display:inline-block;">记住登录状态</label>'
					,'<span id="saveCaution_invite" style="color:#999; margin-left:10px; display:none;">建议在网吧/公用电脑上取消该选项</span>'
				,'</div><p id="invite_user_error" class="ErrTips" style="display:none;">请输入正确的登录名或密码</p>'
				,'<div class="row2"><textarea id="invite_content"></textarea></div>'
				,'<div class="row1"><span id="invite_limit" class="SG_floatR SG_txtc">您还可以输入#{content_length}个汉字</span>'
				,'验证码：<input type="text" id="invite_checkcode" maxlength="4"'
					,' style="width:60px" class="fm1" name="input"/>&nbsp;'
				,'<img height="16" width="51" id="invite_checkimage" src="#{checkImage}" align="absmiddle" />&nbsp;'
				,'<a id="invite_checklink" href="#" onclick="return false;">换一下</a>'
				,'<p id="invite_code_error" class="ErrTips" style="display:none;"></p></div>'
				,'<div class="btn">'
					,'<a id="invite_submit" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite>'
					,'#{dialogTitle}</cite></a>&nbsp;&nbsp;'
					,'<a id="invite_cancel" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite>取消</cite></a>'
				,'</div>'
			,'</div>'
			,'</div>'
			].join("")
	,dialogName		: "invite"
	,initialize	: function (sUid, onlineTime) {
		this.uid = sUid;
		this.onlineTime = onlineTime || 15;		//登录保存天数。
		Lib.checkAuthor();
		/*BEGIN:发纸条优化--04/07/2011, add by W.Qiang | wangqiang1@staff.sina.com.cn*/
		if(!this.isAllowSend()){
			return;
		}
		/*END*/
        
		var data = {
			head_image	: this.headImage != null ? this.headImage : '<img src="' + ("http://portrait" + (this.uid % 8 + 1)+ ".sinaimg.cn/" + this.uid + "/blog/50")
							+ '" align="absmiddle" alt="' + scope.owenerNickName + '" title="' + scope.owenerNickName + '" />'
			,nickname	: this.title()
			,login		: $isLogin ? 'none' : ''
			,checkImage	: "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + Math.random()
			,content_length	: this.contentLength / 2
			,dialogTitle	: this.dialogTitle
		};		
		var content = new Ui.Template(this.html).evaluate(data);
		
		if (this.dialog == null) {
//			Debug.log("对话框尚不存在");
			window.$inviteDialog=this.dialog = winDialog.createCustomsDialog({
				content: "",
				title: this.dialogTitle,
				tpl: Lib.invite_tpl
			});
			this.dialog.addEventListener("hidden",function(){
				this.destroy();
			});
		}else{
//			Debug.log("对话框已经存在");
		}
		this.dialog.setContent(content);
		this.dialog.setMiddle();
//		this.dialog.setFixed(true);

		//TODO 出错验证，暂时关闭 2011-05-12
		//scope.verifyCodeDebug($E('invite_checkimage'));
		//$E('invite_checkimage').src="http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + Math.random();

		this.dialog.show();
		this.dialog.setAreaLocked(true);
		Utils.Form.limitMaxLen($E("invite_content"), this.contentLength);
		Core.Events.addEvent("invite_submit", Core.Function.bind2(this.checkData, this));
		Core.Events.addEvent("invite_cancel", Core.Function.bind2(this.closeDailog, this));
		
		var changeCheckImage = function () {
			$E("invite_checkimage").src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + Math.random();
		};
		
		Core.Events.addEvent("invite_checkimage", changeCheckImage);
		Core.Events.addEvent("invite_checklink", changeCheckImage);
		
		// 内容输入框获得焦点时候检查剩余字数
		Core.Events.addEvent("invite_content", Core.Function.bind2(function () {
			clearInterval(this.check);
			this.check = setInterval(Core.Function.bind2(function (){
				var lengthOfContent = Core.String.byteLength($E("invite_content").value);
				var visibleCount = Math.max(0, Math.floor((this.contentLength - lengthOfContent)/2));
				$E("invite_limit").innerHTML = "您还可以输入" + visibleCount + "个汉字";
			}, this), 500);
		}, this), "focus");
		// 内容输入框失去焦点时候停止检查
		Core.Events.addEvent("invite_content", Core.Function.bind2(function () {
			clearInterval(this.check);
			this.check = null;
		}, this), "blur");
		
		this.initSaveCaution();
		this.reloadName();
	},
	
	/*
	 * 根据博主的设置判断，是否允许发送小纸条和加为好友，默认为可以发送
	 * 此方法会在检查用户是否登录后调用
	 * 这里采用抽象方法的设计思想，需要在发送小纸条和加好友类里重写此方法来判断是否可以发送小纸条和加博主为好友
	 * 
	 * @author   W.Qiang | wangqiang1@staff.sina.com.cn
	 * @date     04/07/2011
	 * 
	 */
	isAllowSend : function(){
		return true;
	},
	
	//未登录时的网吧、公用电脑警示tip
	initSaveCaution : function(){
		var cautionCheck = $E("saveOnline_invite");
		var cautionTip = $E("saveCaution_invite");
		if (!$isLogin) {
			cautionCheck[$IE ? "onclick" : "onchange"] = validChecked;
		}
		//validChecked();
        var cancelStatus = 1;
		function validChecked(){
			if (cautionCheck.checked) {
				cautionTip.style.display = "inline-block";
			}
			else {
				cautionTip.style.display = "none";
			}
            
            if (cancelStatus) {
                var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/padblog/padInfo.php?ck_login=A00002&rnd="+Math.random();
                Utils.Io.JsLoad.request(url,{
                    onComplete : function(){}
                    ,onException : function(){}
                });
                cancelStatus = null; 
            }
		}
	},
	reloadName : function() {		//总是记住登录名
		var userInfo = Lib.Login.info();
		var defaultName = userInfo.ln;
		if(defaultName){
			$E("invite_loginname").value = defaultName;
		}
	},
	
	// 检查客户端表单的填写
	checkData	: function () {
		// 用户名密码是否为空
		if (!$isLogin) {
			this.username = Core.String.trim($E("invite_loginname").value);
			this.password = Core.String.trim($E("invite_password").value);
			if (this.username == "" || this.password == "") {
				$E("invite_user_error").style.display = "";
				return;
			}else{
				$E("invite_user_error").style.display = "none";
			}
		}
		// 验证码是否为空
		this.checkcode = Core.String.trim($E("invite_checkcode").value);
		if (this.checkcode == "" || this.checkcode.length < 4) {
			$E("invite_code_error").innerHTML = "请输入正确的验证码";
			$E("invite_code_error").style.display = "";
			return;
		}else{
			$E("invite_code_error").style.display = "none";
		}
		
		// 如果没登录，就先登录
		if(!$isLogin){
			if($E("saveOnline_invite").checked){
        		v7sendLog('48_01_39_1');
        	}else{
        		v7sendLog('48_01_39_0');
        	}
			this.login();
		}else{
			var me = this;
			scope.blogOpener.showDialog(function() {
				me.postContent();
			});
		}
	}
	// 执行登录
	,login	: function () {
		this.request = new Lib.Login.LoginPost(Core.Function.bind2(function (loginStatus) {
			if(loginStatus.result){
	            //登陆成功
	            //Utils.Cookie.setCookie("remberloginname", escape($E("invite_loginname").value), 2400, "/", ".blog.sina.com.cn");
	            if (this.postContent) {
					Lib.checkAuthor();
					$tray.renderLogin();
					var me = this;
					scope.blogOpener.showDialog(function() {
						me.postContent();
					});
	            }
	        }else{
	            //登陆失败
	            trace("登陆失败 ：" + loginStatus.reason);
				$E("invite_user_error").style.display = "";
	        }
		},this),false,"referer:"+location.hostname+location.pathname+",func:000"+(/messagesend/.test(this.Interface.url.url) ? "2" : "3"));		//添加统计点。0002 0003
		this.request.login(this.username, this.password, ($E("saveOnline_invite").checked ? this.onlineTime : null));
	}
	// 提交成功或者失败的 HTML
	,"resultHTML"	: new Ui.Template(['<div class="CP_layercon1">'
			, '<div class="CP_prompt">'
			, '<img class="SG_icon #{icon}" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"'
				,' width="50" height="50" align="absmiddle" />'
			, '<table class="CP_w_ttl"><tr><td>#{content}</td></tr></table>'
			, '<p class="CP_w_btns_Mid"><a class="SG_aBtn SG_aBtnB" href="#" '
				,'onclick="window.$inviteDialog && window.$inviteDialog.hidden();return false;"><cite> 确定 </cite></a></p>'
			, '</div>'
		, '</div>'].join(""))
	// 提交数据
	,"postContent"	: function () {
		// 刷新托盘
		$tray.renderLogin();
		var i_addInvite = this.Interface;
		var param = {
			tuid		: this.uid
			,fuid		: $UID
			,authcode	: Core.String.trim($E("invite_checkcode").value)
			,content	: $E("invite_content").value
			,varname	: "addFriendRequest"
			,version	: 7
			,rnd		: new Date().valueOf()
		};
		i_addInvite.request({
			GET : param
			,onSuccess	: Core.Function.bind2(function (){
				v7sendLog('45_01_13_'+ scope.$uid);
				var data = {
					icon		: "SG_icon203"
					,content	: this.successMSG()
				};
				this.dialog.setContent(this.resultHTML.evaluate(data));
				if(this.afterSubmit != null){
					this.afterSubmit();
				}
			}, this)
			,onError	: Core.Function.bind2(function (oData) {
				if(oData.code == "A20109" || oData.code == "A20004"){
					$E("invite_user_error").innerHTML = $SYSMSG[oData.code];
					$E("invite_user_error").style.display = "";
				}else if(oData.code == "A20003" || oData.code == "A20103"){			//验证码错误。
					$E("invite_code_error").innerHTML = $SYSMSG[oData.code];
					$E("invite_code_error").style.display = "";
					$E("invite_checkimage").src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + Math.random();
					$E("invite_checkcode").value = "";
				}else if(oData.code == "A11007"){				//未开通。
					var msg = $SYSMSG["A11007"].replace("#{linkNewBlog}", "http://blog.sina.com.cn/u/"+$UID);
					winDialog.alert(msg);
				}else{
					var data = {
						icon		: "SG_icon202"
						,content	: $SYSMSG[oData.code].replace(/#{nick}/, scope.owenerNickName)
					};
					this.dialog.setContent(this.resultHTML.evaluate(data));
				}
				if(this.afterSubmit != null){
					this.afterSubmit();
				}
			}, this)
			,onFail		: Core.Function.bind2(function () {
					var data = {
						icon		: "SG_icon202"
						,content	: $SYSMSG.A00001
					};
					this.dialog.setContent(this.resultHTML.evaluate(data));				
			}, this)
		});
	}
	,"closeDailog"	: function () {
		this.dialog.hidden();
	}
};

Lib.Invite = Core.Class.define(Lib.Invite_Base.prototype.initialize, Lib.Invite_Base, {
	dialogTitle	: "加好友"
	,contentLength	: 200
	,title			: function (){
        var owenerWType = isNaN(scope.owenerWType) ? -1 : parseInt(scope.owenerWType);
        var userV = Lib.blogv.getVHTML(owenerWType);
        return '加"' + scope.owenerNickName + userV + '"为好友';
    }
	,successMSG		: function (){
        return ['邀请发送成功，请等待对方确认。'
                , '<div class="CP_w_cnt SG_txtb" style="font-size:12px;font-weight:normal;">以后对方的动态（发博文，图片，投票等），都可以在<span style="color: red;">个人中心</span>查看啦！</div>'
                , '<ul class="CP_w_part CP_w_aLine">'
                , '<li><a style="font-weight:normal;font-size:12px;" href="http://control.blog.sina.com.cn/blogprofile/index.php?type=3&from=addfiend" target="_blank">到个人中心查看其他好友动态&gt;&gt;</a></li>'
                , '</ul>'].join("");
    }
	,Interface		: new Interface("http://control.blog.sina.com.cn/riaapi/profile/invitesend.php", "jsload")
	/*
	 * @override 重写isAllowSenc方法，根据博主设置判断用户是否发聊天邀请和
	 * @author   W.Qiang | wangqiang1@staff.sina.com.cn
	 * @date     04/07/2011
	 */
	,isAllowSend : function(){
		if(!scope || !scope.$private) 
			return true;
		//invitationset:好友邀请设置 0(接受好友邀请) 1(不接受好友邀请) 
		var invitSet = scope.$private.invitationset || 0;
		if(0 === invitSet){
			return true;
		}else{
			winDialog.alert($SYSMSG["A20106"]);
			return false;
		}
	}
});

Lib.invite = function(sUid){
	new Lib.Invite(sUid);
};

Lib.invite3 = function(sUid,name){
	scope.owenerNickName = name;
	new Lib.Invite(sUid);
};

Lib.Scrip = Core.Class.define(Lib.Invite_Base.prototype.initialize, Lib.Invite_Base, {
	dialogTitle		: "发纸条"
	,headImage		: ""
	,contentLength	: 300
	,title			: function (){
							return '发纸条给：' + scope.owenerNickName;
					}
	,successMSG		: function (){
							return "给" + scope.owenerNickName + "的纸条发送成功！";
					}
	,Interface		: new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagesend.php", "jsload")
	,afterSubmit	: function () {
		
	}
	/*
	 * @override 重写isAllowSenc方法，判断用户是否可以发送小纸条
	 * @author   W.Qiang | wangqiang1@staff.sina.com.cn
	 * @date     04/07/2011
	 */
	,isAllowSend    : function() {
		if(!scope || !scope.$private) 
			return true;
		var pageSet = scope.$private.pageset || 0;
		if(1 === pageSet){
			this._showMsg("A20009");
			return false;
		}
		if($isLogin){
			var isFriend = (-1 != $E("comp901_btn_invite").innerHTML.indexOf("已是好友"));
			if((2 === pageSet) && !isFriend){
				this._showMsg("A30006");
				return false;
			}
		}
		return true;
	}
	/*
	 * 显示发纸条时错误操作提示信息---主要提示博主的纸条设置时的提示
	 * @author   W.Qiang | wangqiang1@staff.sina.com.cn
	 * @date     04/07/2011
	 * 
	 */
	,_showMsg         : function(code){
		winDialog.alert($SYSMSG[code]);
	}
});

Lib.scrip = function(sUid){
	//winDialog.alert("纸条服务调整中，请稍后再试。");
	new Lib.Scrip(sUid);
};