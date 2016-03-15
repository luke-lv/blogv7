/**
 * @fileoverview 将页面设置的Div显示出来
 * @author xinyu@staff.sina.com.cn
 */
$import('sina/utils/excBeforeCloseWin.js');
$import("sina/core/events/addEvent.js");
$import("pageSet/pageSetVariables.js");
$import("pageSet/createMainTabs.js");
$import("pageSet/theme.js");
$import('pageSet/singleFunc/funcMoveUpDown.js');
$import("pageSet/singleFunc/funcApply.js");
$registJob('showPageSet', function(){
	$E('nowloading').style.display='none';
	$E('loadingover').style.display='';
	
	window.maintabs = new mainTabs($E('mainTabs'));
	var hiddendiv = $E('hiddendiv');
	if (!hiddendiv) {
		hiddendiv = $C('div');
		hiddendiv.id = 'hiddendiv';
		hiddendiv.style.display = "none";
		document.body.appendChild(hiddendiv);
	}
	
	if($E('repireP')){
		Core.Events.addEvent($E('repireP'),funcRepire);
	}
	var funcs = function(){
		window.getVars();
		var _default = new Interface("http://control.blog.sina.com.cn/riaapi/conf/module_template_manager.php", "ajax");
		_default.request({
			POST: window.postdata,
			onSuccess: function(){
			},
			onError: function(data){
			}
		});
	};
	
	 //Utils.excBeforeCloseWin('离开页面将导致数据丢失！', '将要离开页面，是否保存？', funcs);
	
	// 换一种方案
	window.beforeunloadfunc = function(){
		var evt = Core.Events.getEvent();
		if(/webkit/.test(navigator.userAgent.toLowerCase())){
			return '离开页面将导致数据丢失！';
		}else{
			evt.returnValue = '离开页面将导致数据丢失！';
		}
	};
	if(navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/)){
		Utils.excBeforeCloseWin('离开页面将导致数据丢失！', '将要离开页面，是否保存？', funcs);
	}else{
		Core.Events.addEvent(window, window.beforeunloadfunc, 'beforeunload');
	}
});





