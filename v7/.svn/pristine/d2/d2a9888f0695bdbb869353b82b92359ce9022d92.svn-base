/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 发博文/发照片/发视频
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/ui/slide.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopBubble.js");
$import("sina/core/dom/getElementsByClass.js");

$import("lib/jobs.js");

$registJob("write", function(){
    var writeSlide = new Ui.Slide("SG_Publish_Sub", {
        duration: 0.5
    });

    // writeSlide.node.children[9].style.display = "none";
    // writeSlide.node.children[10].style.display = "none";
    writeSlide.hide();
    
	var dropNode = Core.Dom.getElementsByClass($E("SG_Publish"), "span", "wrtblog_arrow");
	
	var parent = writeSlide.container.parentNode.parentNode;
	
	if(dropNode != null){
		Core.Events.addEvent(dropNode[0], function(){
			writeSlide.slideIn({before:function(){
				parent.style.display = '';
			}});
		}, "mouseover");
	}
	
	Core.Events.addEvent(dropNode[0], function(e){ Core.Events.stopEvent(e); });
    
    Core.Events.addEvent("SG_Publish_Sub", function(){
        //alert(123);
        Core.Events.stopBubble();
        setTimeout(function(){
            writeSlide.slideOut({end:function(){
				parent.style.display = 'none';
			}});
        }, 1000);
    }, "mousedown");
    
    //Core.Events.addEvent("SG_Publish_Sub", function(){
    //    setTimeout(function(){
    //        writeSlide.slideOut();
    //    }, 500);
    //}, "mouseout");
    
    Core.Events.addEvent(document.body, function(){
        writeSlide.slideOut({end:function(){
			parent.style.display = 'none';
		}});
    }, "mousedown");
});
