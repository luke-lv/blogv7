/**
 * @desc	百合注册对话框
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/utils/cookie/setCookie.js");

$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
$import("lib/classUtils.js");

$import("comps/baihe/_baihe.js");
$import("comps/baihe/dialog/Dialog.js");
$import("comps/baihe/regTemplate.js");

$import("comps/ijax_2.js");


Baihe.regDialog = function(opt){
	var __this = this;
	opt = opt || {};
	this.onSuccess = opt.onSuccess || function(){};
	this.onError = opt.onError || function(){};
	this.onFail = opt.onFail || function(){};
	
	// phoneNum;
	// email;
	// password;
	// marriageInput;
	// marriageChoice;
	// marriageBtn;
	// userSexInput;
	// userSexChoice;
	// userSexBtn;
	// agreement;
	// submitBtn;
	// errTips;
	
	this.submitVal = {};
	// phoneNum;
	// email;
	// password;
	// marriage;
	// userSex;
	// agreement;
	
	this.postData = {};
	this.inProgress = false;
	
	// 
	this.template = Baihe.registTemplate;
	this.initDialogTemplate("baihe_regist");
	this.initDialogEvents();
	
	this.loadingNode = createNode("<img style='display:none; padding:10px 0 0 10px;' src='http://simg.sinajs.cn/blog7style/images/common/loading.gif'/>");
	Core.Dom.insertAfter(this.loadingNode, this.nodes.submitBtn.parentNode);
	
	this.onShow = function(){
		__this.nodes.phoneNum.focus();
	};
	
	function createNode(html){
		var _box = $C("div");
		var _node;
		_box.innerHTML = html;
		_node = _box.childNodes[0];
		return _node;
	}
	
}.$extend(Baihe.Dialog).$defineProto({
	
	initDialogEvents:function(){
		this.$super.initDialogEvents();
		var __this = this;
		var __nodes = this.nodes;
		
		var userSexLi = __nodes.userSexChoice.getElementsByTagName("a");
		var marriageLi = __nodes.marriageChoice.getElementsByTagName("a");
		for(var i=0; i<userSexLi.length; i++){
			(function(idx){
				var targNode = userSexLi[idx];
				Core.Events.addEvent(targNode, function(){		// 这个必须冒泡
					__nodes.userSexInput.innerHTML = targNode.innerHTML;
				}, "click");
			})(i);
		}
		for(var j=0; j<marriageLi.length; j++){
			(function(idx){
				var targNode = marriageLi[idx];
				Core.Events.addEvent(targNode, function(){		// 这个必须冒泡
					__nodes.marriageInput.innerHTML = targNode.innerHTML;
				}, "click");
			})(j);
		}
		
		Core.Events.addEvent(__nodes.marriageBtn, function(){			// 选择婚姻
			__this.selectShow("marriage");
			Core.Events.stopEvent();
		}, "click");
		
		Core.Events.addEvent(__nodes.userSexBtn, function(){			// 选择性别
			__this.selectShow("userSex");
			Core.Events.stopEvent();
		}, "click");
		
		Core.Events.addEvent(__nodes.entity, function(){				// 隐藏所有 select
			__this.selectShow("");
		}, "click");
		
		Core.Events.addEvent(__nodes.submitBtn, function(){				// 提交
			__this.ok();
		}, "click");
		
		
		// 四行 input 的逻辑
		Core.Events.addEvent(__nodes.phoneNum, function(){
			__nodes.phoneNum.select();
			__this.changeStateOnFocus('phoneNum');
		}, "focus");
		Core.Events.addEvent(__nodes.phoneNum, function(){
			__this.changeStateOnBlur('phoneNum');
		}, "blur");
		
		Core.Events.addEvent(__nodes.nickName, function(){
			__nodes.nickName.select();
			__this.changeStateOnFocus('nickName');
		}, "focus");
		Core.Events.addEvent(__nodes.nickName, function(){
			__this.changeStateOnBlur('nickName');
		}, "blur");
		
		// type 不能被修改
		Core.Events.addEvent(__nodes.password, function(){
			__nodes.password.select();
		}, "focus");
		Core.Events.addEvent(__nodes.password_faked, function(){
			__this.changeStateOnFocus('password');
		}, "focus");
		Core.Events.addEvent(__nodes.password, function(){
			__this.changeStateOnBlur('password');
		}, "blur");
		
		Core.Events.addEvent(__nodes.email, function(){
			__nodes.email.select();
			__this.changeStateOnFocus('email');
		}, "focus");
		Core.Events.addEvent(__nodes.email, function(){
			__this.changeStateOnBlur('email');
		}, "blur");
	},
	
	changeStateOnFocus:function(nodeName){
		var __this = this;
		switch(nodeName){
			case 'phoneNum':
				__tryToClear(this.nodes.phoneNum);
				break;
			case 'nickName':
				__tryToClear(this.nodes.nickName);
				break;
			case 'email':
				__tryToClear(this.nodes.email);
				break;
			case 'password':
				this.nodes.password_faked.style.display = "none";
				this.nodes.password.style.display = "";
				this.nodes.password.focus();
				break;
		}
		function __tryToClear(targNode){
			if(Core.String.trim(targNode.value) == targNode.getAttribute("_value")){
				targNode.value = "";
				__this.delClass(targNode, "beforehand");
			}
		}
	},
	
	changeStateOnBlur:function(nodeName){
		var __this = this;
		switch(nodeName){
			case 'phoneNum':
				__tryToRestore(this.nodes.phoneNum);
				break;
			case 'nickName':
				__tryToRestore(this.nodes.nickName);
				break;
			case 'email':
				__tryToRestore(this.nodes.email);
				break;
			case 'password':
				if(!this.nodes.password.value){
					this.nodes.password_faked.style.display = "";
					this.nodes.password.style.display = "none";
				}
				break;
		}
		function __tryToRestore(targNode){
			if(!Core.String.trim(targNode.value)){
				__this.addClass(targNode, "beforehand");
				targNode.value = targNode.getAttribute("_value");
			}
		}
	},
	
	checkValid:function(){
		var phoneNum = this.submitVal.phoneNum = Core.String.trim(this.nodes.phoneNum.value);
		var nick = this.submitVal.nick = Core.String.trim(this.nodes.nickName.value);
		var email = this.submitVal.email = Core.String.trim(this.nodes.email.value);
		var password = this.submitVal.password = Core.String.trim(this.nodes.password.value);
		var userSex = this.submitVal.userSex = Core.String.trim(this.nodes.userSexInput.innerHTML);
		var marriage = this.submitVal.marriage = Core.String.trim(this.nodes.marriageInput.innerHTML);
		var agreement = this.submitVal.agreement = this.nodes.agreement.checked;
		
		// 11 位，首位为 1，全为数字
		if(phoneNum){
			if(phoneNum == this.nodes.phoneNum.getAttribute("_value")){
				this.showErr("请输入手机号码");
				this.nodes.phoneNum.focus();
				return false;
			}else if(/[^0-9]/.test(phoneNum)){
				this.showErr("手机号必须全为数字");
				this.nodes.phoneNum.focus();
				return false;
			}else if(phoneNum.slice(0, 1) != "1"){
				this.showErr("手机号不规范");
				this.nodes.phoneNum.focus();
				return false;
			}else if(!/^(.{11})$/.test(phoneNum)){
				this.showErr("手机号长度为 11 位");
				this.nodes.phoneNum.focus();
				return false;
			}
		}else{
			this.showErr("请输入手机号码");
			this.nodes.phoneNum.focus();
			return false;
		}
		
		// 昵称
		if(nick){
			// if(!/^(.{1,12})$/.test(nick))
			if(nick == this.nodes.nickName.getAttribute("_value")){
				this.showErr("请输入您的昵称");
				this.nodes.nickName.focus();
				return false;
			}else if(Core.String.byteLength(nick)>24){
				this.showErr("昵称长度不能超过 24 个字符");
				this.nodes.nickName.focus();
				return false;
			}
		}else{
			this.showErr("请输入您的昵称");
			this.nodes.nickName.focus();
			return false;
		}
		
		// 采用 msn 那个
		if(email){
			if(email == this.nodes.email.getAttribute("_value")){
				this.showErr("请输入邮箱地址");
				this.nodes.email.focus();
				return false;
			}else if(!/^[a-z0-9][a-z0-9.\-_]*@[a-z0-9][a-z0-9_\-.]*\.[a-z]{2,3}$/i.test(email)){
				this.showErr("请输入有效的邮箱");
				this.nodes.email.focus();
				return false;
			}
		}else{
			this.showErr("请输入邮箱地址");
			this.nodes.email.focus();
			return false;
		}
		
		// 6-16 位，全角
		if(password){
			if(password == this.nodes.password.getAttribute("_value")){
				this.showErr("请输入密码");
				this.changeStateOnFocus("password");
				return false;
			}else if(/[^\x21-\x7e]/.test(password)){
				this.showErr("密码存在非法字符");
				this.changeStateOnFocus("password");
				return false;
			}else if(!/^(.{6,16})$/.test(password)){
				this.showErr("密码长度为 6 至 16 位");
				this.changeStateOnFocus("password");
				return false;
			}
		}else{
			this.showErr("请输入密码");
			this.changeStateOnFocus("password");
			return false;
		}
		
		// 仅仅是必选
		if(marriage){
			if(marriage == "单身"){
				marriage = "1";
			}else if(marriage == "非单身"){
				marriage = "0";
			}else{
				this.showErr("您的婚姻状况？");
				return false;
			}
		}else{
			this.showErr("您的婚姻状况？");
			return false;
		}
		
		// 仅仅是必选
		if(userSex){
			if(userSex == "男"){
				userSex = "1";
			}else if(userSex == "女"){
				userSex = "0";
			}else{
				this.showErr("您的性别？");
				return false;
			}
		}else{
			this.showErr("您的性别？");
			return false;
		}
		
		// 仅仅是必选
		// 		if(!agreement){
		// 	this.showErr("必须注册！");
		// 	return false;
		// }
		
		this.postData.mobile = phoneNum;
		this.postData.name = nick;
		this.postData.email = email;
		this.postData.password = password;
		this.postData.gender = userSex;
		this.postData.single = marriage;
		// this.postData.name = this.getUserNick();
		return true;
	},
	
	selectShow:function(targ){
		var allSelect = {
			userSex:	this.nodes.userSexChoice,
			marriage:	this.nodes.marriageChoice
		};
		for(var selectName in allSelect){
			if(targ == selectName){
				allSelect[targ].style.display = "block";
			}else{
				allSelect[selectName] && (allSelect[selectName].style.display = "none");	// 会 for in 出 undefined？我去。
			}
		}
	},
	
	showErr:function(str){
		this.nodes.errTips.innerHTML = str;
	},
	
	hideErr:function(){
		this.nodes.errTips.innerHTML = "";
	},
	
	showLoading:function(){						// 不能共用 errTips。
		this.loadingNode.style.display = "inline-block";
	},
	
	hideLoading:function(){
		this.loadingNode.style.display = "none";
	},
	
	progressStart:function(){
		this.inProgress = true;
		this.showLoading();
	},
	
	progressOver:function(){
		this.inProgress = false;
		this.hideLoading();	
	},
	
	getUserNick:function(){
		var SUPCookie = Utils.Cookie.getCookie("SUP");
		var transed_SUPCookie = decodeURIComponent(decodeURIComponent(SUPCookie));
		var matchCookie = transed_SUPCookie.match(/nick=([\x20-\x7e]+?)&sex/);
		var matchLoginName = matchCookie && matchCookie.length && matchCookie[1];
		return matchLoginName;			// 可能是 encode 的
	},
	
	reset:function(){
		this.nodes.errTips.innerHTML = "";
		this.nodes.phoneNum.value = "";
		this.nodes.email.value = "";
		this.nodes.password.value = "";
		this.nodes.marriageInput.innerHTML = "请选择";
		this.nodes.userSexInput.innerHTML = "请选择";
		this.nodes.agreement.checked = true;
	},
	
	ok:function(){
		if(Baihe.userChangeDetected()) return;			// 登录组件已引本类
		
		var __this = this;
		if(this.inProgress) return;
		this.progressStart();
		
		if(!this.checkValid()){
			this.progressOver();
			return;
		}
		
		this.nodes.errTips.innerHTML = "";
		Utils.Io.Ijax_2.request("http://control.blog.sina.com.cn/baihe/interface.php?action=user_reg", {
			timeout: 15000,
			POST: __this.postData,
			onComplete:function(res){
				if(res.code == "A00006"){
					__this.hide();						// 成功则关闭浮层，不弹对话框
					__this.onSuccess();
					Lib.checkAuthor();
					if($isLogin)
					Utils.Cookie.setCookie("baihe_"+$UID, __this.postData.email+"|"+__this.postData.password, 24, "/", ".blog.sina.com.cn");
				}else{
					__this.showErr(res.data || "注册失败");
					__this.onError();
				}
				__this.progressOver();
			},
			onException:function(res){
				if(res == "timeout"){					// 这个判断不对。res 不存在时会报错
					__this.showErr("系统超时，请稍候再试");
				}else{
					__this.showErr("系统繁忙");
				}
				__this.progressOver();
				__this.onFail();
			}
		});
	},
	
	hideSomeFormItems:function(seq, isReservedSpace){
		var nodesHash = {				// 按表单顺序排列
			1:this.nodes.phoneNum,
			2:this.nodes.nickName,
			3:this.nodes.email,
			4:this.nodes.password,
			5:this.nodes.marriageInput,
			6:this.nodes.userSexInput,
			7:this.nodes.agreement
		}
		if(typeof seq.length == "undefined"){
			seq = [seq];
		}
		for(var i=0; i<seq.length; i++){
			if(isReservedSpace){
				nodesHash[seq[i]].style.visibility = "hidden";
			}else{
				nodesHash[seq[i]].style.display = "none";
			}
		}
	}
}).$mixProto(Lib.classUtils);




