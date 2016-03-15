$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getStyle.js");

$registJob("indexLoginLayer", function(){
	var loginLayer = $E("loginLayer");
	var	contentLayer = $E("contentLayer");

	var innerWidth = window.innerWidth;
	trace("innerWidth:"+innerWidth);
	var contentWidth = parseInt(Core.Dom.getStyle(contentLayer, "width"), 10)+20;
	trace("contentWidth:"+contentWidth);
	var loginWidth = 228;
	var rightMargin = (innerWidth-contentWidth)/2;
	
	loginLayer.style.position = "absolute";
	loginLayer.style.top = 200+"px";	
	loginLayer.style.zIndex = 100;
		
	if ((rightMargin-loginWidth)>0){
			loginLayer.style.right = rightMargin-loginWidth+"px";
	}else{
			loginLayer.style.right = rightMargin+"px";
	}
	Core.Events.addEvent(window, function(){
		innerWidth = window.innerWidth;
		if (innerWidth>contentWidth){		
			rightMargin = (innerWidth-contentWidth)/2;
			if ((rightMargin-loginWidth)>0){
				loginLayer.style.right = rightMargin-loginWidth+"px";
			}else{
				loginLayer.style.right = rightMargin+"px";
				trace("innerWidth:"+innerWidth);
				trace("aaarightMargin:"+rightMargin);
			}
		}else{	
			rightMargin = innerWidth-contentWidth;
			trace("innerWidth:"+innerWidth);	
			loginLayer.style.right = rightMargin+"px";
			trace("bbbrightMargin:"+rightMargin);
		}
			
	}, "resize");
});