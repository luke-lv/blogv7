/**
* jQuery 简单的tab切换
*/
define('mods/kit/util/simpleTabSwitch', function (require, exports, module){
	var $ = require('lib');
	// jquery 简单标签切换
	function tabSwitch(trigger, list, curClass){
		trigger.each(function (i){
			$(this).data('index', i);
		}).on('click', function (){
			$(this).addClass(curClass).siblings().removeClass(curClass);
			list.hide().eq($(this).data('index')).show();
		});
		list.each(function (i){
			$(this).data('index', i);
		});
	}

	module.exports = tabSwitch;
});