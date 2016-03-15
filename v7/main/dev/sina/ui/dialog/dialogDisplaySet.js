/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @FileOverview 对话框不同的显示方式集合
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-09-09
 */

$import("sina/sina.js");
$import("sina/ui/tween.js");
$import("sina/core/dom/setStyle.js");

var DialogDisplaySet={
	
	/**
	 * 渐显(隐)效果
	 */
	alpha1:{
		show:function(dom,offsetY,callBack){
			var v=0,deltaY=0,startY=parseInt(dom.style.top)-offsetY;
			dom.style.top=startY;
			
			Core.Dom.setStyle(dom,"opacity", v);
			dom.style.display="";
			var itvId=window.setInterval(function(){
				//渐显
				if (v <= 1) {
					Core.Dom.setStyle(dom, "opacity", v);
				}
				
				//从上到下位移
				if(deltaY <= startY+offsetY){
					dom.style.top=startY+deltaY+"px";
				}
				
				deltaY+=1.5;
				v+=0.05;
				
				if(v>0.9 && parseInt(dom.style.top)>=startY+offsetY){
					window.clearInterval(itvId);
					if(callBack){
						callBack();
					}
				}
			},10);
		},
		hidden:function(dom,offsetY,callBack){
			var v=1;
			var startY=parseInt(dom.style.top);
			var endY=startY-offsetY;
			var currentY=startY;

			var itvId=window.setInterval(function(){
				//渐隐
				if (v >= 0) {
					Core.Dom.setStyle(dom, "opacity", v);
				}
				
				//从下到上位移

				if(currentY>=endY){
					dom.style.top=currentY +"px";
				}
				
				currentY-=1.5;
				v-=0.05;
				
				if(v<=0 && currentY<endY){
					window.clearInterval(itvId);
					if(callBack){
						callBack();
					}
				}
			},10);
		}
	},
	
	alpha:{
		show:function(dom,offsetY,callBack){
			Core.Dom.setStyle(dom,"opacity", 0.3);
			dom.style.display="";
			
			dom.style.top=parseInt(dom.style.top)-offsetY+"px";
			var y1=parseInt(dom.style.top)+offsetY;
			Ui.tween(dom,["top","opacity"],[y1,0.9],0.4,"simple",{
				end:callBack
			});
		},
		hidden:function(dom,offsetY,callBack){
			var y1=parseInt(dom.style.top)-offsetY;
			Ui.tween(dom,["top","opacity"],[y1,0],0.2,"simple",{
				end:callBack
			});
		}
	},
	
	/**
	 * 下落效果
	 */
	fallDown:{
		show:function(dom,y0,y1,callBack){
			dom.style.display="";
			dom.style.top=y0+"px";
			Ui.tween(dom,"top",y1,0.6,"bounceEaseOut",{
				end:callBack
			});
		},
		hidden:function(dom,y0,y1,callBack){
			dom.style.display="";
			dom.style.top=y0+"px";
			Ui.tween(dom,"top",y1,0.6,"strongEaseIn",{
				end:callBack
			});
		}
	}
};
