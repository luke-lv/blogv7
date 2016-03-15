/**
 * @fileoverview uatrack曝光布码
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 * @created 20130326
 */
$import("lib/jobs.js");
$import("lib/sendSuda.js");
$import("sina/core/dom/byClass.js");

$registJob("uatrack", function(){
    Lib.sendSuda(function(){
    	var pageid = scope.$pageid;
    	var _byClass = Core.Dom.byClass;
    	switch(pageid) {
    		case 'editor':
    			//发文页顶部文字链
    			var el = _byClass('msnTips_lx', 'div');
    			if(el) {
    				v7sendLog('41_01_05');
    				SUDA.uaTrack("blog_post", "v_post1");
    			}
    			
    			break;
    		case 'article':
    		case 'articleM':
    			//外地qing组件
    			// var wqing = $E('module_910');
    			//北京qing组件
    			// var bjqing = $E('module_911');
    			//被推荐博文
    			var btjblog = $E('module_909');
    			//相关博文
    			var blogxg = $E('module_903');
    			//推荐博文
    			var tjblog = $E('module_904');
    			
    			// if(wqing) {
    			// 	SUDA.uaTrack("blog_wqing_g", "v_wqing_g");
    			// }
    			// if(bjqing) {
    			// 	v7sendLog('41_01_03');
    			// 	SUDA.uaTrack("blog_bjqing_g", "v_bjqing_g");
    			// 	//qing组件三张大图布码
    			// 	SUDA.uaTrack("blog_qing_g", "v_SLOT_49");
    			// 	SUDA.uaTrack("blog_qing_g", "v_SLOT_50");
    			// 	SUDA.uaTrack("blog_qing_g", "v_SLOT_51");
    			// }
    			if(btjblog) {
    				SUDA.uaTrack("blog_btjblog", "v_btjblog");
    			}
    			if(blogxg) {
    				SUDA.uaTrack("blog_xg", "v_blogxg");
    			}
    			if(tjblog) {
    				SUDA.uaTrack("blog_tjblog", "v_tjblog");
    			}
    			break;
    	}
    });
});
