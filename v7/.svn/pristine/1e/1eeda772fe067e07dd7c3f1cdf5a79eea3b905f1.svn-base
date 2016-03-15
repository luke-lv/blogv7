/*
   shaomin | shaomin@staff.sina.com.cn
   init cookie before job loading for vote
*/ 

 $import("sina/utils/flash/swfObject.js");
 $import("sina/core/math/getUniqueId.js");
 $import("sina/core/system/br.js");
        
 (function(){

   /*  if(!$E("swfbox")){
	 var newDiv = document.createElement("div");
	 newDiv.id = "swfbox";
	 document.body.appendChild(newDiv);
     }*/
     var readyFunS = "readyFun"; 
     function swfCookie(container, url, readyFun, swfID){
	 var showFlash = function(){
	     var FlashPlayer = new Utils.Flash.swfObject(url, swfID, "1", "1", "9", "#00ff00");
	     FlashPlayer.addParam("quality", "high");
	     FlashPlayer.addParam("allowScriptAccess", "always");
	     FlashPlayer.addVariable("readyFun", readyFun);
	     FlashPlayer.write(container);
	 };
	 
	 showFlash();
     }
 	var random="";		
	if(window.$Maxthon||window.$360||window.$TT){
		random="?uid="+Core.Math.getUniqueId(1,10);
	}
     swfCookie('swfbox',$_GLOBAL.flashBasicURL + 'voteCookie.swf'+random,readyFunS, 'swfId');
 
 })();