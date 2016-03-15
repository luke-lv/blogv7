$import("sina/utils/io/_io.js");
$import("sina/core/system/br.js");
/**
 * @fileoverview 加载外部css文件到head中 并支持onload事件
 * link元素只有在ie和opera中支持onload事件
 * 其他浏览器通过其他方式来模拟onload
 * 
 * @author zhangkai2@staff.sina.com.cn
 * @create 2011-1-7
 * 
 * @param {String} url 要加载的css url
 * @param {Function} callback css加载成功后要执行的回调函数
 */
Utils.Io.loadExternalCSS = function(url,callback){
	
	if(typeof url !== "string"){
		return;
	}
	var linkObj,
		styleObj,
		head=document.getElementsByTagName("head")[0];
	 
	if($FF){
		styleObj=$C("style");
		styleObj.type="text/css";
		styleObj.innerHTML="@import url("+url+")";
		head.appendChild(styleObj);
		(function(){
			try{
				styleObj.sheet.cssRules;
				typeof callback === "function" && callback();
			}catch(e){
				setTimeout(arguments.callee, 50);
			}
		})();
	}else{
		linkObj=$C("link");
		linkObj.href=url;
		linkObj.type="text/css";
		linkObj.rel="stylesheet";
		linkObj.media = 'all';
		head.appendChild(linkObj);
		
		if($SAFARI || $CHROME){
			(function(){
				try{
					linkObj.sheet.cssRules;
					typeof callback === "function" && callback();
				}catch(e){
					setTimeout(arguments.callee, 50);
				}
			})();
		}else{
			linkObj.onload = function(){
				linkObj.onload=null;
	            typeof callback === "function" && callback();
       		}
		}
	} 
}