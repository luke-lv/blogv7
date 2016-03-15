/** 
 * @fileoverview 事件代理思想，绑定一个UL或OL的鼠标进入和离开事件，使鼠标事件只作用于li元素
 * @author Book | liming9@staff.sina.com.cn
 * @version 31 | 2011-08-17
 */
$import("sina/core/events/addEvent.js");
$import("other/SinaEx.js");
/**
 * 绑定一个UL或OL的鼠标进入和离开事件，使鼠标事件只作用于li元素
 * @method
 * @param {HTMLElement} wrapEle 包装着li元素的UL或OL节点
 * @param {Function} fnOver 鼠标移入的处理事件，会以目标li作参数调用
 * @param {Function} fnOut 鼠标移出的处理事件，会以目标li作参数调用
 * @param {Number} delaytime 事件处理延迟毫秒数
 */
SinaEx.enterLeave = function(wrapEle, fnOver, fnOut, delaytime){
	var __addEvent = Core.Events.addEvent,
		
		_lastover = null, //上次鼠标移入的li
		_overtimer = 0,
		_outtimer = 0;
	
	fnOver = fnOver||function(){};
	fnOut = fnOut||function(){};
	delaytime = delaytime||0;
	
	//鼠标移入
	__addEvent(wrapEle, function(event){
		clearTimeout(_outtimer);
		
		var e = event || window.event, ele = e.target||e.srcElement;
		_overtimer = setTimeout(function(){
			if( _lastover && SinaEx.contains(_lastover, ele) )return;
			var t = SinaEx.parent(ele, "li");
			if( t ){
				if(_lastover){ //这是必要的
					fnOut(_lastover);
				}
				fnOver(t);
				_lastover = t;
			}else if(_lastover){
				fnOut(_lastover);
				_lastover = null;
			}
		}, delaytime);
	}, "mouseover");
	//鼠标移出
	__addEvent(wrapEle, function(){
		clearTimeout(_overtimer);
		
		_outtimer = setTimeout(function(){
			if(_lastover){
				fnOut(_lastover);
				_lastover = null;
			}
		}, delaytime);
	}, "mouseout");
	
};
