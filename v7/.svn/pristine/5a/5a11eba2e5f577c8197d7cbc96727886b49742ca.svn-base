$import("sina/core/events/_events.js");
$import("sina/core/system/br.js");
/**
 * 触发指定节点上绑定相应的事件
 * @id Core.Events.fireEvent  
 * @method fireEvent
 * @param {String|HtmlElement} oElement 需要触发事件的对象
 * @param {String} sEvent 需要触发的类型，如：click, mouseover
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008.10.21
 * @example
	// 触发 testEle 的 onclick 事件
	Core.Events.fireEvent("testEle", 'click');
 */
Core.Events.fireEvent = function(oElement, sEvent){
    var evt;
	oElement = $E(oElement);
	if(oElement.fireEvent) {
		oElement.fireEvent('on' + sEvent);
	}
	else{
		if($MOBILE){
            evt = document.createEvent('HTMLEvents');
        }else{
            evt = document.createEvent('MouseEvents');
        }
		evt.initEvent(sEvent,true,true);  
		oElement.dispatchEvent(evt);  
	}  
};