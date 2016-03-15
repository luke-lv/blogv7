$import("sina/core/events/_events.js");
$import('sina/core/events/getEvent.js');

/**
 * 停止事件冒泡
 * @id Core.Events.removeEvent  
 * @param {Event} el event对象
 */
Core.Events.stopBubble = function(el) {
	var ev = el? el: Core.Events.getEvent();
	if (ev != null) {
		ev.cancelBubble = true;
	}
};
if(!$IE || $IE>8) {
	Core.Events.stopBubble = function(el) {
		var ev = el? el: Core.Events.getEvent();
		if (ev != null) {
			ev.stopPropagation();
		}
	};
}