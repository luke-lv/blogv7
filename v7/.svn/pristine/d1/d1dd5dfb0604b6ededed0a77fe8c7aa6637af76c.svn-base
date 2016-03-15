
$import("nickactivity/_NickAc.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/setStyle2.js");
$import("sina/core/dom/getXY.js");

NickAc.nickLayerScroll = function(){
	var __addEvent = Core.Events.addEvent;
	var option = {
		mid: {
			'z-index': '10',
			'position':$IE6?'absolute':'fixed' ,
			'top': '50%'
		}
	}

	//点击领取 图片浮动
	var scrollGet = $E("scrollGet");
	if(!$IE6){
    	scrollGet.style.position = "fixed";
		scrollGet.style.right = 0 + "px";
		scrollGet.style.top = 450 +'px';
		__addEvent(window, showHideFunc, "scroll");
	}else{
		scrollGet.style.position = "absolute";
		var ddo = document.documentElement.offsetWidth;
		if( ddo >960){
			scrollGet.style.right = -((ddo-980)/2) + 'px';
		}else{
			scrollGet.style.right = 0 + "px";
		}
    	__addEvent(window,ie6Fixed, "scroll");
	}
	
	function ie6Fixed(){
		var dds = document.documentElement.scrollTop;
		if( dds > 400){
			scrollGet.style.top = dds - 200 + "px";
		}else{
			scrollGet.style.top = dds + "px";
		}
	}

	function showHideFunc(){
		var scrolltop = document.body.scrollTop + document.documentElement.scrollTop;
        if(scrolltop > 400){
        	setMid(scrollGet);
        }else{
        	scrollGet.style.top = 450 +'px';
        	scrollGet.style.marginTop = 0 + 'px';
        }
	}
	function setMid(obj){
		var h = 100;
		if(!$IE6){
			obj.style.marginTop = h / 2 * (-1) + 'px';
		}
		Core.Dom.setStyle2(obj, option.mid);
	}
    
};
