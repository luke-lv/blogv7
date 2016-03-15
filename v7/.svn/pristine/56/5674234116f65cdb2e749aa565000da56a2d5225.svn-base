/**
 * @desc	内域邮箱注册博客
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/reg/InputName.js");
$import("comps/reg/InputPwd.js");
$import("comps/reg/InputPwdConfirm.js");
$import("comps/reg/InputNick.js");
$import("comps/reg/InputValid.js");
$import("comps/reg/InputCheck.js");
$import("comps/reg/InputSelect.js");
$import("comps/reg/InputAnswer.js");
$import("comps/reg/AttachValid.js");

$import("sina/core/dom/up.js");
$import("sina/core/dom/getElementsByClass.js");

$registJob("innerDomain", function(){
	
	var initForm = function(){
		var a = new Reg.InputName({
			colorNode:		Core.Dom.up($E("inputName"), "input"),
			entity:			$E("inputName"),
			submitBtn:		$E("inputSubmit"),
			noteTip:		"4-16 位之间，请用英文小写、数字、下划线，不能全部是数字或下划线"
		});
		
		var b = new Reg.InputPwd({
			colorNode:		Core.Dom.up($E("inputPwd"), "input"),
			entity:			$E("inputPwd"),
			submitBtn:		$E("inputSubmit"),
			noteTip:		"6-16 位字符（字母、数字、符号），区分大小写"
		});
		
		var c = new Reg.InputPwdConfirm({
			primaryPwd:		$E("inputPwd"),
			colorNode:		Core.Dom.up($E("inputPwdConfirm"), "input"),
			submitBtn:		$E("inputSubmit"),
			entity:			$E("inputPwdConfirm"),
			noteTip:		"请重复输入一次相同的登录密码"
		});
		
		var d = new Reg.InputNick({
			colorNode:		Core.Dom.up($E("inputNick"), "input"),
			entity:			$E("inputNick"),
			submitBtn:		$E("inputSubmit"),
			noteTip:		"4-20 位小写字母、数字或汉字（汉字算两位）组成"
		});
		
		var e = new Reg.InputValid({
			colorNode:		Core.Dom.up($E("inputValid"), "input"),
			entity:			$E("inputValid"),
			submitBtn:		$E("inputSubmit"),
			noteTip:		"",
			onError:		function(){
				// $E("inputPwdConfirm").value = "";
				// $E("inputPwd").value = "";
				// b.validTxt();
				// c.validTxt();
			}
		});
		
		var f = new Reg.InputCheck({
			box:			$E("inputCheck").parentNode,
			entity:			$E("inputCheck"),
			noteTip:		""
		});
		
		var g = new Reg.InputAnswer({
			colorNode:		Core.Dom.up($E("inputPwdAnswer"), "input"),
			entity:			$E("inputPwdAnswer"),
			submitBtn:		$E("inputSubmit"),
			noteTip:		"6-80 个字符，不允许特殊字符和全角字符，空格不能在首尾，下划线不能在最后，汉字算两位"
		});
		
		var h = new Reg.InputSelect({
			optionsBox:		Core.Dom.byClz(document.body, "div", "mainCenTl")[0],
			box:			$E("inputSelect").parentNode.parentNode,
			customInput:	$E("inputOtherQid"),
			showStrip:		$E("showStrip"),
			fireBtn:		$E("inputSelect"),
			targetForm:		document.forms[0]
		});
		
		
		var working = false;
		var all = [a, b, c, d, e, f, g, h];
		var subBtn = $E("inputSubmit");
		subBtn.onclick = function(){
			var i;
			for(i=0; i<all.length; i++){		//
				all[i].validTxt();
			}
			for(i=0; i<all.length; i++){		// 发现 proccessStop 则停止提交
				trace(i+": "+all[i].proccessStop);
				if(all[i].proccessStop){
					return false;
				}
			}
			if(working) return false;
			working = true;
			
			document.forms[0].submit();
			setTimeout(function(){
				working = false;
			}, 2000);
			return false;
		};
	};
	
	setTimeout(initForm, 10);

	$E("inputName").focus();
	if(!scope.$submit){
		$E("inputPwdConfirm").value = "";
		$E("inputPwd").value = "";
	}

});






