/**
 * @fileoverview
 *	限制单行文本框的输入和内容
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008.12.03
 */
$import("sina/utils/form/_form.js");
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/system/br.js");

/**
 * 限制 TEXTAREA 的最大输入长度
 * @param {HTMLElement} oElement	[必选参数]TEXTAREA对象
 * @param {Number} nMaxLength		[必选参数]限制的字符长度，这里默认指的是字节，中文算两个字节
										  如果希望中文算一个字符，请把可选参数doubleByte 设置为 false
 * @param {Object} oOption 			[必选参数]输入限制的选项，以下参数均为可选
 *		{
 			doubleByte : true	//字符计算规则，默认为true表示中文算两字符长度，false表示中文算一个字符长度
 *		}
 * @example

 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-12-16
 */
Utils.Form.textareaMaxLength = function (oElement, nMaxLength, oOption) {

	oOption = oOption || {};
	
	if(isNaN(nMaxLength) == true){
		trace("请输入正确的字符长度");
	}
	oElement = $E(oElement);

	
	function resetLength(oEl){
		if(typeof oOption.doubleByte != "undefined" && oOption.doubleByte == false){
			return;
		}
		var len = oEl.value.replace(/[\x00-\xff]/g, "").length;
//		trace(len);
//		trace(">>> " + (nMaxLength - len));
		oEl.setAttribute("maxlength", (nMaxLength - len));
	}
	
	// Keep user from entering more than maxLength characters
	function doKeyPress(obj, evt){
		maxLength = obj.getAttribute("maxlength");
		var e = window.event ? event.keyCode : evt.which;
		var selectedText;
		if (window.getSelection) {
			selectedText = (obj.selectionStart != undefined && obj.selectionEnd != undefined) ? obj.value.substring(obj.selectionStart, obj.selectionEnd) : "" ;
		}
		else {
			selectedText = document.selection.createRange().text;
		}
		if ( (e == 32) || (e == 13) || (e > 47)) { //IE
			if(maxLength && (obj.value.length > maxLength-1) && selectedText == "") {
				if (window.event) {
					window.event.returnValue = null;
				} else {
					evt.cancelDefault = true;
					return false;
				}
			}
		}
		resetLength(obj);
	}
	
	function doKeyUp(obj){
//		resetLength(obj);
		maxLength = obj.getAttribute("maxlength");
		if(maxLength && obj.value.length > maxLength){
			obj.value = obj.value.substr(0, maxLength);
		}
		resetLength(obj);
	//    sr = obj.getAttribute("showremain");
	//    if (sr) {
	//        document.getElementById(sr).innerHTML = maxLength-obj.value.length;
	//    }
	}
	
	// Cancel default behavior and create a new paste routine
	function doPaste(obj){
//		resetLength(obj);
		maxLength = obj.getAttribute("maxlength");
		if(maxLength){
			if ((window.event) && ($IE)) { //IE
				var oTR = obj.document.selection.createRange();
				var iInsertLength = maxLength - obj.value.length + oTR.text.length;
				try {
					var sData = window.clipboardData.getData("Text").substr(0, iInsertLength);
					oTR.text = sData;
				}
				catch (err) {}
				if (window.event) { //IE
					window.event.returnValue = null;
				} else {
					//not IE
					obj.value = obj.value.substr(0, maxLength);
					return false;
				}
			}
		}
		resetLength(obj);
	}

	oElement.setAttribute("maxlength", parseInt(nMaxLength));
	oElement.onkeydown = function(event){
		return doKeyPress(oElement, event);
	};
	oElement.onpaste = function(){
		return doPaste(oElement);
	};
	oElement.onkeyup = function(){
		return doKeyUp(oElement);
	};
	oElement.onblur = function(){
		return doKeyUp(oElement);
	};
};