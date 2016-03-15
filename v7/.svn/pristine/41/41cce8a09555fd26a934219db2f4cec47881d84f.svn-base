/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 发博文/发照片/发视频 再添加图片冲印
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/ui/slide.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopBubble.js");
$import("sina/core/dom/getElementsByClass.js");

$import("lib/jobs.js");

$registJob("write", function(){
    if(!(scope.login && scope.myself)) return;
    var writeSlide = new Ui.Slide("SG_Publish_Sub", {
        duration: 0.5
    });

    // writeSlide.node.children[5].style.display = "none";
    // writeSlide.node.children[6].style.display = "none";
    writeSlide.hide();
	
	var sps = !!$E("SG_PhotoPrint_Sub");
	if( sps ){ //如果图片冲印按钮存在
		var photoPrint = new Ui.Slide("SG_PhotoPrint_Sub", {
			duration: 0.5
		});
		photoPrint.hide();
	}
    
	var dropNode = Core.Dom.getElementsByClass($E("SG_Publish"), "span", "wrtblog_arrow");
	if(dropNode != null){
		Core.Events.addEvent(dropNode[0], function(){
			 sps && photoPrint.slideOut();
			writeSlide.slideIn();
		}, "mouseover");
	}
	
	Core.Events.addEvent(dropNode[0], function(e){ Core.Events.stopEvent(e); });
    
    Core.Events.addEvent("SG_Publish_Sub", function(){
   
        Core.Events.stopBubble();
        setTimeout(function(){
            writeSlide.slideOut();
        }, 1000);
    }, "mousedown");
    
    //Core.Events.addEvent("SG_Publish_Sub", function(){
    //    setTimeout(function(){
    //        writeSlide.slideOut();
    //    }, 500);
    //}, "mouseout");
    
    Core.Events.addEvent(document.body, function(){
        writeSlide.slideOut();
    }, "mousedown");

	if( sps ){ //如果图片冲印按钮存在
		var photoPrintDropNode = Core.Dom.getElementsByClass($E("SG_PhotoPrint"), "span", "olPrint_arrow");
		if(photoPrintDropNode != null){
			//trace("span evnet");
			Core.Events.addEvent(photoPrintDropNode[0], function(){
				writeSlide.slideOut();
				photoPrint.slideIn();
				//trace("span over")
			}, "mouseover");
		}
		
		Core.Events.addEvent(photoPrintDropNode[0], function(e){ Core.Events.stopEvent(e); });
		
		Core.Events.addEvent("SG_PhotoPrint_Sub", function(){
			Core.Events.stopBubble();
			setTimeout(function(){
				 photoPrint.slideOut();
			}, 1000);
		}, "mousedown");

		Core.Events.addEvent(document.body, function(){
			 photoPrint.slideOut();
		}, "mousedown");
	}
});
