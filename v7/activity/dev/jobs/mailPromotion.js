/**
 * @fileoverview 此文件是应用于博客邮箱推广位的展示
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created     2013-08-09
 * @vertion 0.01
 */
$import("lib/jobs.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/array/foreach.js");
$import("sina/utils/io/jsload.js");
$import("lib/sendSuda.js");
$import("lib/commonLog.js");

$registJob("mailPromotion", function (){
	var tapSwitch = $E("tab_switch");
	var num = parseInt(6*Math.random());
	//随机展示每一个tab标签
	var as = tapSwitch.getElementsByTagName("a");
	var cons = Core.Dom.getElementsByClass(tapSwitch.parentNode,"div","con");
	as[num].className = "cur"; 
	cons[num].style.display = "";
	sendUatrack(num);
	//切换展示内容
	Core.Array.foreach(as, function(elem, i){
		elem.onclick = function(e){
			for(var j = 0; j<6; j++){
				as[j].className = "";
				cons[j].style.display = "none";
			}
			as[i].className = "cur";
			cons[i].style.display = "";
		};
	});
	function sendUatrack(n){
		switch (n) {
	        case 0:
	        	Lib.sendSuda(function(){
		            SUDA.uaTrack("blog_mail_iframe","v_ly_tab");
		        }); 
	            break;
	        case 1:
	        	Lib.sendSuda(function(){
		            SUDA.uaTrack("blog_mail_iframe","v_ms_tab");
		        }); 
	            break;
	        case 2:
	        	Lib.sendSuda(function(){
		            SUDA.uaTrack("blog_mail_iframe","v_yl_tab");
		        }); 
	            break;
	        case 3:
	        	Lib.sendSuda(function(){
		            SUDA.uaTrack("blog_mail_iframe","v_ye_tab");
		        }); 
	            break;
	        case 4:
	        	Lib.sendSuda(function(){
		            SUDA.uaTrack("blog_mail_iframe","v_cj_tab");
		        }); 
	            break;
	        case 5:
	        	Lib.sendSuda(function(){
		            SUDA.uaTrack("blog_mail_iframe","v_xz_tab");
		        }); 
	            break;
	    }
	}
});
