/**
封装闪烁动作
**/
define('mods/kit/fx/flashAction',function(require,exports,module){

	var flashAction = function(options){
		var conf = $.extend({
			times : 3,
			delay : 100,
			actionOdd : $.noop,
			actionEven : $.noop,
			recover : $.noop
		}, options);

		var queue = [];
		for(var i = 0; i < (conf.times * 2 + 1); i++){
			queue.push( (i + 1) * conf.delay );
		}

		$.each(queue, function(index, time){
			setTimeout(function(){
				if(index >= queue.length - 1){
					conf.recover();
				}else{
					if(index % 2 === 0){
						conf.actionEven();
					}else{
						conf.actionOdd();
					}
				}
			}, time);
		});
	};

	module.exports = flashAction;
});
