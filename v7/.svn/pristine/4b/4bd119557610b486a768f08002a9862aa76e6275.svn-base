$import("sina/core/events/_events.js");
$import('sina/core/events/getEvent.js');

/**
 * 停止事件默认行为，如链接跳转
 * @id Core.Events.removeEvent  
 * @param {Event} el event对象
 */
Core.Events.stopDefaultEvent = function(el) {
	var ev = el? el: Core.Events.getEvent();
	if (ev != null) {
        if (ev.preventDefault){
            ev.preventDefault();
        } else {
		    ev.returnValue = false;
        }
	}
};