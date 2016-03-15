/**
 * @fileoverview uatrack曝光布码
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 * @created 20130326
 */
$import("lib/jobs.js");
$import("sina/core/dom/byClass.js");

$registJob("uatrack", function(){

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
			//北京qing组件
			var el = $E('module_911');
			if(el) {
				v7sendLog('41_01_03');
				SUDA.uaTrack("blog_blogpage", "v_qingmodulebj");
			}
			break;
		case 'profile_index':
			//个人中心顶部图片
			var el = _byClass('ad_top', 'div');
			if(el) {
				v7sendLog('41_01_01');
				SUDA.uaTrack("blog_iblog", "v_iblog");
			}
	}

});