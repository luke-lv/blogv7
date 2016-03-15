/**
@module lib/kit/func/once
@example
var $once = require('lib/kit/func/once');
var fn = $once(function(){
	console.info('output');	
});
fn(); //log output
fn(); //will do nothing
**/

define('lib/kit/func/once',function(require,exports,module){

	/**
	包装为仅触发一次的函数
	@param {function} fn 要延迟触发的函数
	@param {object} [bind] 函数的this指向
	**/
	module.exports = function(fn, bind){
		return function(){
			bind = bind || this;
			if(fn){
				fn.apply(bind, arguments);
				fn = bind = null;
			}
		};
	};
});

