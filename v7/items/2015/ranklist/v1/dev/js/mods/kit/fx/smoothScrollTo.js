/**
平滑滚动到某个元素
**/
define('mods/kit/fx/smoothScrollTo',function(require,exports,module){

	var $ = require('lib');

	var smoothScrollTo = function(node, spec){
		var conf = $.extend({
			delta : 0,
			callback : $.noop
		},spec);

		var offset = $(node).offset();
		var target = offset.top + conf.delta;
		var duration = 1000;
		var callback  = conf.callback;

		var prevStep;
		var stayCount = 3;
		var timer = setInterval(function(){
			var sTop = $(window).scrollTop();
			var delta = sTop - target;
			if(delta > 0){
				delta = Math.floor(delta * 0.8);
			}else if(delta < 0){
				delta = Math.ceil(delta * 0.8);
			}

			var step = target + delta;
			if(step === prevStep){
				stayCount --;
			}
			prevStep = step;

			window.scrollTo(0, step);

			if(step === target || stayCount <= 0){
				stopTimer();
			}
		}, 16);

		var stopTimer = function(){
			if(timer){
				clearInterval(timer);
				timer = null;
				window.scrollTo(0, target);
				if($.isFunction(callback)){
					callback();
				}
			}
		};

		setTimeout(function(){
			stopTimer();
		}, 3000);
	};

	module.exports = smoothScrollTo;

});

