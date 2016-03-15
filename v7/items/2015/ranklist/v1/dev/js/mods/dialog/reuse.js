/**
获取可重用对话框
**/

define('mods/dialog/reuse',function(require,exports,module){

	var $ = require('lib');
	var $dialog = require('mods/ui/dialog');

	module.exports = function(spec){

		//可重用的对话框存储在 cache 队列中
		var cache = [];

		//队列有最大限制，如果队列已满，对话框隐藏时直接销毁
		var maxLength = 5;

		var that = {};

		var defaults = $.extend({}, spec);

		//可以通过 get 方法取得缓存的对话框实例
		that.get = function(){
			var dialog;
			var conf = $.extend({}, defaults);

			//如果队列为空，则创建新的对话框实例
			if(cache.length){
				dialog = cache.shift();
			}else{
				dialog = new $dialog(conf);

				//对话框隐藏时，存入队列
				dialog.on('hide', function(){
					if(cache.length >= maxLength){
						dialog.destroy();
					}else{
						cache.push(dialog);
					}
				});
			}

			dialog.off('ok');
			dialog.off('close');
			dialog.off('cancel');
			dialog.role('title').html('');
			dialog.role('content').html('');

			return dialog;
		};

		return that;
	};

});

