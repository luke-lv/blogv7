/**
 * @fileoverview
 *	给博文列表页增加文章删除等操作，由JS动态绑定事件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @modified dcw1123 | chengwei1@staff.sina.com.cn
 */
 
$import("sina/sina.js");
$import("msg/sregMsg.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/fireEvent.js");

$registJob("sSignup", function () {
	
	//是否可以关闭'密码查询问题'
	//var canCloseQ = false;
	
	var p1 = false;
	var p2 = false;
	//var pq = false;
	//var pa = false;
	//var pk = false;
	
	//var clearned = false;
	
	//var imgURL = 'http://login.sina.com.cn/cgi/pin.php';
	
	function _inLast(str) {
		var patrn = /_$/;
		if(patrn.exec(str)) {
			return true;
		}
		return false;
	}
	
	function bindEvent(ele,errEle,event,func) {
		ele[event] = function(){
			func(ele,errEle);
		};
	}
	
	/*
	 * 密码问题不需要
	 */
	 /*
	var lis = $E('selectQoption').getElementsByTagName('li');
	for(var i=0; lis[i]; i++) {
		bindEvent(lis[i],null,'onclick',function(me,errEle){
			var aHTML = me.getElementsByTagName('a')[0].innerHTML;
			$E('regquestion').value = aHTML;
			$E('regquestion').setAttribute('hasChoose','yes');
			$E('selectQoption').style.display = 'none';
			clearError($E('error4'));
			pq = true;
		});
	}
	*/
	
	function showError(errEle,msg) {
		if(errEle.className.indexOf('txtc') == -1) {
			errEle.className = 'txtc';
		}
		errEle.innerHTML = msg;
		errEle.style.display = '';
	}
	
	function clearError(errEle) {
		errEle.innerHTML = '<span class="yes"></span>';
		errEle.className = 'inputacc';
		errEle.style.display = '';
	}
	
	//密码
	bindEvent($E('regpwd'),$E('error2'),'onblur',function(me,errEle){
		var value = me.value;
		if(!value) {
			p1 = false;
			showError(errEle,'请输入密码');
			return;
		}
		if(value.indexOf(' ') != -1) {
			p1 = false;
			showError(errEle,'密码不能含有空格');
			return;
		}
		if(value.length < 6 || value.length > 16) {
			p1 = false;
			showError(errEle,'密码长度应为6-16位');
			return;
		}
		if(_inLast(value)) {
			p1 = false;
			showError(errEle,'下划线不能在最后');
			return;
		}
		patrn = /^([0-9a-zA-Z]|[._?]){6,16}$/;
		if(!patrn.exec(value)) {
			p1 = false;
			showError(errEle,'密码请勿使用特殊字符');
			return;
		}
		p1 = true;
		clearError(errEle);
	});
	
	//再次输入密码
	bindEvent($E('reregpwd'),$E('error3'),'onblur',function(me,errEle){
		var value = me.value;
		if(!value) {
			showError(errEle,'请输入确认密码');
			p2 = false;
			return;
		}
		if(value.indexOf(' ') != -1) {
			showError(errEle,'确认密码不能含有空格');
			p2 = false;
			return;
		}
		if(value.length < 6 || value.length > 16) {
			showError(errEle,'确认密码长度应为6-16位');
			p2 = false;
			return;
		}
		/**
			var patrn = /^([0-9a-zA-Z]|[._?]){6,16}_?$/;
			var arr = patrn.exec(value);
			if(!arr) {
				alert('密码请勿使用特殊字符');
			}else if(arr[1]=='_'){
				alert('下划线不能在最后');
				return;
			}
		*/
		if(_inLast(value)) {
			showError(errEle,'确认密码下划线不能在最后');
			p2 = false;
			return;
		}
		patrn = /^([0-9a-zA-Z]|[._?]){6,16}$/;
		if(!patrn.exec(value)) {
			showError(errEle,'确认密码请勿使用特殊字符');
			p2 = false;
			return;
		}
		if($E('regpwd').value != value) {
			showError(errEle,'两次密码不一致');
			p2 = false;
			return;
		}
		p2 = true;
		clearError(errEle);
	});
	
	/*
		密码问题不需要
	 */
	 /*
	bindEvent(document.body,null,'onclick',function(me,errEle){
		if(canCloseQ) {
			$E('selectQoption').style.display = 'none';
		}
	});
	
	bindEvent($E('regquestion'),null,'onmouseover',function(me,errEle){
		canCloseQ = false;
	});
	
	bindEvent($E('regquestion'),null,'onmouseout',function(me,errEle){
		canCloseQ = true;
	});
	
	bindEvent($E('selectQoption'),null,'onmouseover',function(me,errEle){
		canCloseQ = false;
	});
	
	bindEvent($E('selectQoption'),null,'onmouseout',function(me,errEle){
		canCloseQ = true;
	});
	
	bindEvent($E('selectQoption'),null,'onmouseout',function(me,errEle){
		canCloseQ = true;
	});
	
	bindEvent($E('regquestion'),$E('error4'),'onclick',function(me,errEle){
		var pos = Core.Dom.getXY(me);
		$E('selectQoption').style.position = 'absoult';
		$E('selectQoption').style.left = pos[0] + 'px';
		$E('selectQoption').style.top = (pos[1]+23) + 'px';
		$E('selectQoption').style.display = '';
	});
	
	//密码查询答案
	bindEvent($E('reganswer'),$E('error5'),'onblur',function(me,errEle){
		var value = me.value;
		if(!value) {
			pa = false;
			showError(errEle,'请输入密码查询答案');
			return;
		}
		var len = Core.String.byteLength(value);
		if(len < 6 || len > 80) {
			pa = false;
			showError(errEle,'密码查询答案长度应为6-80位');
			return;
		}
		var patrn = /^\s|\s$/;
		if(patrn.exec(value)) {
			pa = false;
			showError(errEle,'首尾不能是空格');
			return;
		}
		if(_inLast(value)) {
			pa = false;
			showError(errEle,'下划线不能在最后');
			return;
		}
		//有点小问题，全角不全
		patrn = /[\u2026\uFF00-\uFFFF]/;
		if(patrn.exec(value)) {
			pa = false;
			showError(errEle,'密码查询答案不能包含全角字符');
			return;
		}
		patrn = /[^0-9a-zA-Z\u4E00-\u9FA5\_\ ]/;
		if(patrn.exec(value)) {
			pa = false;
			showError(errEle,'密码查询答案不能包含特殊字符');
			return;
		}
		pa = true;
		clearError(errEle);
	});
	*/
	
	//--------------------------可能会被清理掉的验证码--------------------------
	/*
	bindEvent($E('regcode'),$E('error6'),'onclick',function(me,errEle){
		if(clearned) {
			return;
		}
		var img = $E('reg_check_img');
		img.src = imgURL + '?r=' + new Date().getTime();
		me.value = '';
		clearned = true;
	});
	
	//验证码
	bindEvent($E('regcode'),$E('error6'),'onblur',function(me,errEle){
		var value = me.value;
		var hasWrite = me.getAttribute('hasWrite');
		if(!value) {
			pk = false;
			if(hasWrite) {
				me.removeAttribute('hasWrite');
			}
			showError(errEle,'请输入验证码');
			return;
		}
		var patrn = /\ /;
		if(patrn.exec(value)) {
			pk = false;
			if(hasWrite) {
				me.removeAttribute('hasWrite');
			}
			showError(errEle,'验证码不能含有空格');
			return;
		}
		if(!hasWrite) {
			try {
			me.setAttribute('hasWrite','yes');
			} catch(e){console.log(e)}
		}
		pk = true;
		clearError(errEle);
	});
	*/
	//---------------------------------------------------------------------------
	
	//图片URL：http://login.sina.com.cn/cgi/pin.php?r=xxxxx
	
	$E('signUpBtn').onclick = function() {
		//debugger;
		Core.Events.fireEvent($E('regpwd'),'blur');
		Core.Events.fireEvent($E('reregpwd'),'blur');
		//if(!pq) {
		//	showError($E('error4'),'请选择密码查询问题');
		//}
		//Core.Events.fireEvent($E('reganswer'),'blur');
		//Core.Events.fireEvent($E('regcode'),'blur');
		/*
		if(!pk) {
			var hasWrite = $E('regcode').getAttribute('hasWrite');
			if(!hasWrite) {
				showError($E('error6'),'请输入验证码');
			}
		}
		*/
		if(!p1) {
			$E('regpwd').focus();
			return;
		}
		if(!p2) {
			$E('reregpwd').focus();
			return;
		}
		var sData = {};
		sData.regname = encodeURIComponent($E('regname').value);
		sData.regpwd = encodeURIComponent($E('regpwd').value);
		sData.regnick= encodeURIComponent($E('regnick').value);
		//sData.regquestion= encodeURIComponent($E('regquestion').value);
		//sData.reqanswer = encodeURIComponent($E('reganswer').value);
		//sData.regcode = encodeURIComponent($E('regcode').value);
		Utils.Io.Ajax.request('http://control.blog.sina.com.cn/special/specialreceive.php',{
			method : 'POST',
			POST : sData,
			onComplete : function(data) {
				data = eval('('+data+')');
				if(data.code == 'A00006') {
					winDialog.alert("注册成功", {
						icon:"03",
						funcOk: function(){
							window.location = 'http://control.blog.sina.com.cn/blogprofile/index.php';
						}
					});
				} else {
					//alert(data.code);
					winDialog.alert($SYSMSG[data.code], {
						icon:"01"
					});
				}
			}
		});
	}
});

