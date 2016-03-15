/*
 * 随检测文本的高度自动变化
 * author liming | liming1@staff.sina.com.cn
 * modified shaomin | shaomin@staff.sina.com.cn
 * modified dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/setStyle2.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/core/math/getRandomNumber.js");
$import("comps/_comps.js");


Comps.magicTextarea = function(oNode, nLength, minHeight, callback) {
	var commentHeight = null;
	var isCloned = null;
	var _rnd = Core.Math.getRandomNumber(0, 10000);
	var callback = callback || function(){};
	
	if (oNode == null) {
		return;
	}
	if (typeof oNode == "string") {
		oNode = $E(oNode);
	}
	
	// 让指定文本框随着用户的输入，总是多显示一个空行
	var listenNode = function () {
		var nodeHeight;
		var valueLength;
		
		if ($IE && document.activeElement != this) {
			return;
		}
		
		valueLength = Core.String.byteLength(oNode.value);
		if (valueLength > nLength) {
			callback(oNode);			// 传入 callback 事件源节点
			oNode.value = Core.String.leftB(oNode.value, nLength);
		}
		
		if ($MOZ) {				// ff chrome 通用
			
			// 用一个高度为 0 的克隆 textarea 来计算实际内容的高度，用于和按行数计算的高度比较，选择较大者用于输入框的实际高度
			var valueHeight;
			var lineHeight;
			
			// 每个 textarea 一个 clone，保证样式宽度相同
			if (!$E("clonedTextarea_"+_rnd)) {
				isCloned = this.cloneNode(true);
				
				isCloned.className = oNode.className;
				Core.Dom.setStyle2(isCloned, {
					"height" : "0px",
					"visibility" : "hidden",
					"position" : "absolute",
					"left" : "0px",
					"zIndex": -1
				});
				
				isCloned.id = "clonedTextarea_"+_rnd;
				oNode.parentNode.appendChild(isCloned);
			}
			
			isCloned.value = this.value;
			
			valueHeight = window.parseInt(isCloned.scrollHeight);
			lineHeight = parseInt(Core.Dom.getStyle(this, "lineHeight")) * (this.value.split("\n").length - 1) + 18;
			nodeHeight = (lineHeight > valueHeight) ? lineHeight : valueHeight;
		}
		else {
			var range = this.createTextRange();
			
			// 如果文本框是多行，且最后一行是空行，额外增加 15 像素高度，以免不自动撑高
			nodeHeight = parseInt(range.boundingHeight) + (/\r\n$/.test(this.value) && this.value != "" ? 19 : 4);
		}
		
		// Core.Dom.setStyle(this, "paddingBottom", "20px");
		if(typeof minHeight == "number"){
			nodeHeight = nodeHeight < minHeight ? minHeight : nodeHeight;		// 保证最小高度。
		}
		Core.Dom.setStyle(this, "height", (nodeHeight) + "px");
	};
	
	if ($FF) {
		Core.Events.addEvent(oNode, listenNode.bind2(oNode), "input");
	}
	else {
		Core.Events.addEvent(oNode, listenNode.bind2(oNode), "mouseout");
		Core.Events.addEvent(oNode, listenNode.bind2(oNode), "keyup");
		Core.Events.addEvent(oNode, listenNode.bind2(oNode), "keypress");
	}
	Core.Events.addEvent(oNode, listenNode.bind2(oNode), "focus");
	
};


