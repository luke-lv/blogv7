$import("lib/component/msnGuide/msnGuide.js");
$import("sina/core/dom/getXY.js");
$import("sina/utils/io/jsload.js");
/**
 * @fileoverview  为msn connect页面添加创建msn搬家引导浮层button
 * @author zhangkai2@staff.sina.com.cn
 * @create @created 2010-12-24
 */
$registJob("msnGuideButtonForMSNConnect", function(){
   //根据column_2元素定位button位置
   var pos=Core.Dom.getXY($E("column_2"));
   
   var aObj=$C("a");
   aObj.id="msnGuide_createMSNGuideButton";
   aObj.className="SG_aBtn positionBtn";
   aObj.href="javascript:void(0)";
   aObj.innerHTML="<cite>查看MSN服务</cite>";
   aObj.style.position="absolute";
   aObj.style.left=pos[0]+ 615 +"px";
   aObj.style.top=pos[1]+ 44 + "px";
   document.body.appendChild(aObj);
   
   //请求http://interface.blog.sina.com.cn/riaapi/profile/unread.php
   //获得正确的cookie msnBindInfo信息
   //在回调中注册按钮click事件
   Utils.Io.JsLoad.request("http://interface.blog.sina.com.cn/riaapi/profile/unread.php?product=blog&uid="+$UID,{
   	onComplete:function(){
		if(!$E("msnGuide_createMSNGuideButton")){
			return;
		}
		$E("msnGuide_createMSNGuideButton").onclick=function(){
		   	if($E("msnGuide_MSNGuideDiv")){
				return;
			}
			
			if(window.event){
				window.event.returnValue=false;
			}
			
	   	  	scope.msnGuide.createMSNGuideDiv();
   		}
	},
	onException:function(){
		if(!$E("msnGuide_createMSNGuideButton")){
			return;
		}
		
		if(window.event){
				window.event.returnValue=false;
			}
			
		$E("msnGuide_createMSNGuideButton").onclick=function(){
		   	if($E("msnGuide_MSNGuideDiv")){
				return;
			}
	   	  	scope.msnGuide.createMSNGuideDiv();
   		}
	},
	timeout:20000
   });
   aObj=null;
});