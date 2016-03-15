/**
 * @desc blog 推广短信下发
 * @author fuqiang3
 * @date 2014/06/18
 */
$import("lib/jobs.js");
$import("sina/core/dom/addClass.js");
$import("sina/core/dom/removeClass.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import('sina/core/events/stopDefaultEvent.js');
$import('sina/utils/io/ijax.js');
$import('sina/core/string/trim.js');
$import('lib/checkRegExp.js');
$import("lib/sendLog.js");

$registJob("blogapp", function(){
	//事件绑定
	var addEvent = Core.Events.addEvent;	
	var stopDefaultEvent = Core.Events.stopDefaultEvent;
	var getByAttr = Core.Dom.getElementsByAttr;
	var phoneNumberInput = getByAttr(document,"node-type","phoneNumber")[0];
	var checkCodeInput = getByAttr(document,"node-type","checkcode")[0];
	var sendMsgBtn = getByAttr(document,"node-action","sendMsg")[0];
	var checkCodeImg = getByAttr(document,"node-type","checkcodeimg")[0];
	var msgWrap = Core.Dom.getElementsByClass(document,'p','app_msg_w')[0];
	var trim = Core.String.trim;

	var phonePlaceHolder = '请输入手机号';
	var checkCodePlaceHolder = '验证码';
    var ERR_MSG = {
        "A00006": "已将短信发送到您的手机。如未收到，请用手机直接访问下载：http://blog.sina.cn",
        "A00001": "验证码错误",
        "A00002": "手机号错误",
        "A00003": "系统繁忙",
        "default": "系统异常，短信发送失败"
    };
	function setMsg(msg,type){
		var html = "<span class='app_msg_"+type+"'>"+msg+"</span>";	
		msgWrap.innerHTML = html;
	}

	function clearMsg(){
		msgWrap.innerHTML = ''; 
	}
	
	function changeClass(ele){
		Core.Dom.addClass(ele,"app_msg_focus");
		clearMsg();
	}
	function removeClass(ele){
		Core.Dom.removeClass(ele,"app_msg_focus");
	}

	function phoneFocus(){
		var val = trim(this.value);
		if(val == phonePlaceHolder) this.value = '';	
		changeClass(this);
	}

	function codeFocus(){
		var val = trim(this.value);
		if(val == checkCodePlaceHolder) this.value = '';	
		changeClass(this);
	}

	function phoneBlur(){
		var val = trim(this.value);
		if(val === "") this.value = phonePlaceHolder;	
		removeClass(this);
	}

	function codeBlur(){
		var val = trim(this.value);
		if(val === "") this.value = checkCodePlaceHolder;	
		removeClass(this);
	}

	function checkPhone(){
		var val = trim(phoneNumberInput.value);
		if(isNaN(val) || val.length < 11 || !Lib.checkRegExp.mobileNew(val)){
			setMsg('手机号格式不正确','wnumber');
			return false;
		}
		return true;
	}

	function checkCode(){
		var val = trim(checkCodeInput.value);	
		if(val.length < 4){
			setMsg('验证码格式不正确','wma');
			return false;
		}
		return true;
	}

	function checkInput(){
		return checkPhone() && checkCode();
	}

	function reloadCode(){
		var last = checkCodeImg.src.lastIndexOf('?');
		checkCodeImg.src = checkCodeImg.src.slice(0, last > -1 ? last : checkCodeImg.src.length) + "?_t="+new Date().valueOf();	
	}

	function initCheckCode(){
		checkCodeImg.style.cssText = "display:block;cursor:pointer;";
		reloadCode();
	}

	addEvent(phoneNumberInput,phoneFocus,"focus");	
	addEvent(checkCodeInput,codeFocus,"focus");	
	addEvent(phoneNumberInput,phoneBlur,"blur");	
	addEvent(checkCodeInput,codeBlur,"blur");	

	addEvent(phoneNumberInput,checkInput,"blur");	
	addEvent(checkCodeInput,checkInput,"blur");	

	addEvent(sendMsgBtn,function(e){
		stopDefaultEvent(e);	
		if(checkInput()){
			//成功失败，服务器返回错误都用下面这局打印就ok了
			var phonenum = phoneNumberInput.value;
			var code = checkCodeInput.value;
            v7sendLog("22_01_01");
			//ajax,请求，失败alert 系统
			Utils.Io.Ijax.request('http://interface.blog.sina.com.cn/riaapi/mobile_message/mobile_message.php',{
				onComplete:function(ret){
					//更具ret判断结果，打印回执
                    ret = eval("("+ (ret||"{}") +")");
                    var code = ret.code || "default";
                    setMsg(ERR_MSG[code],'wnumber');
                    v7sendLog("22_01_02_" + ret.code);
                    // ret.code == "A00006" ? v7sendLog("22_01_02") :'';
                    reloadCode();
				},
				onException:function(msg){
					setMsg(msg,'wnumber');
                    v7sendLog("22_01_02_Exception");
                    reloadCode();
				},
				method:"POST",
				POST:{
					phone_num: trim(phoneNumberInput.value),
                    message_vcode: trim(checkCodeInput.value),
                    from: "blog"
				},
				returnType:"json"
			});
			
		}
	});	

	addEvent(checkCodeImg,reloadCode);

	initCheckCode();

});
