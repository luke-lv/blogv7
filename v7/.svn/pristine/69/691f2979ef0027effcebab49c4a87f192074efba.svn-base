/**
 * @fileoverview
 *	Textarea 框自动适应高度
 	通过一个和当前 Textarea 样式一样，但高度为1px的隐藏Textarea来计算
 	当前 Textarea 内容的实际高度，并让当前 Textarea 高度(style.height)
 	和隐藏 Textarea 	的“内容高度”保持同步
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/math/getRandomNumber.js");
$import("lib/app.js");

/**
 * 自动计算 Textarea 的高度
 * @param {String} sTextareaId	需要自动缩放高度的 Textarea 的高度
 * @param {String} sClassName	假的 Textarea 的 ClassName
 */
App.textareaAutoHeight = function (sTextareaId, sClassName){
	// 创建一个假的 Textarea 来度量当前 Textarea 的高度
	$E(sTextareaId).setAttribute("fakeClass", sClassName);
	var fakeTextarea;
	if($E("fakeTextarea") == null){
		fakeTextarea = $C("textarea");
		fakeTextarea.id = "fakeTextarea";
		fakeTextarea.className = sClassName;
		document.body.appendChild(fakeTextarea);
	}
	var change = function (e) {
		var _evt = Core.Events.getEvent();
		var __target = _evt.target || _evt.srcElement;
		var _fakeClass = __target.getAttribute("fakeClass");
		var _fakeTextarea = $E("fakeTextarea");
		if(_fakeTextarea.className != _fakeClass){
			_fakeTextarea.className = _fakeClass;
		}
		setTimeout(function () {
			_fakeTextarea.value = __target.value;
			// 一定要先取一次 scrollHeight，第二次取到的才是正确的
			!isNaN(_fakeTextarea.scrollHeight) && (__target.style.height = Math.max(_fakeTextarea.scrollHeight, 39) + "px");
		}, 10);
	};
	Core.Events.addEvent(sTextareaId, change, "keyup");
	Core.Events.addEvent(sTextareaId, change, "propertychange");
	Core.Events.addEvent(sTextareaId, change, "input");
};