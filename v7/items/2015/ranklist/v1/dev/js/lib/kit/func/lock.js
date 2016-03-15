/**
@module lib/kit/func/lock
@example
var $lock = require('lib/kit/func/lock');
var request = function(){
	console.info('do request');
};
$('#input').keydown($lock(request, 200, comp));
//连续按键，仅在200ms结束后再次按键，才会再次请求
**/
define('lib/kit/func/lock',function(require,exports,module){

	/**
	包装为触发一次后，预置时间内不能再次触发的函数
	@param {function} fn 要延迟触发的函数
	@param {number} delay 延迟时间[ms]
	@param {object} [bind] 函数的this指向
	**/
	module.exports = function(fn, delay, bind){
		var timer = null;
		return function(){
			if(timer){return;}
			bind = bind || this;
			var args = arguments;
			timer = setTimeout(function(){
				timer = null;
			}, delay);
			fn.apply(bind, args);
		};
	};
});

