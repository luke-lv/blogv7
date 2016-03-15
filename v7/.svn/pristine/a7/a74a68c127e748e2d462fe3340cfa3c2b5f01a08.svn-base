/**
@module lib/mvc/delegate
**/
define('lib/mvc/delegate', function(require,exports,module) {

	var $ = require('lib');

	/**
	事件对象绑定，将events中包含的键值对映射为代理的事件

	事件键值对格式可以为：

	- {'selector event':'method'}
	- {'event':'method'}
	- {'selector event':'method1 method2'}
	- {'event':'method1 method2'}

	@param {boolean} action 开/关代理，可选：['on', 'off']。
	@param {object} root 设置代理的根节点，可以是一个jquery对象，或者是混合了 lib/more/events 方法的对象。
	@param {object} events 事件键值对
	@param {object} bind 指定事件函数绑定的对象，必须为MVC类的实例。
	**/

	if (!Array.prototype.forEach) {  
	    Array.prototype.forEach = function(fun /*, thisp*/){  
	        var len = this.length;  
	        if (typeof fun != "function")  
	            throw new TypeError();  
	        var thisp = arguments[1];  
	        for (var i = 0; i < len; i++){  
	            if (i in this)  
	                fun.call(thisp, this[i], i, this);  
	        }  
	    };  
	}
	if (!Array.prototype.map) {

	  Array.prototype.map = function(callback, thisArg) {

	    var T, A, k;

	    if (this == null) {
	      throw new TypeError(' this is null or not defined');
	    }
	    var O = Object(this);
	    var len = O.length >>> 0;
	    if (typeof callback !== 'function') {
	      throw new TypeError(callback + ' is not a function');
	    }

	    
	    if (arguments.length > 1) {
	      T = thisArg;
	    }
	    A = new Array(len);
	    k = 0;
	    while (k < len) {

	      var kValue, mappedValue;
	      if (k in O) {
	        kValue = O[k];
	        mappedValue = callback.call(T, kValue, k, O);
	        A[k] = mappedValue;
	      }
	      
	      k++;
	    }

	    
	    return A;
	  };
	}






	module.exports = function(action, root, events, bind){

		var proxy, delegate;
		if(!root){return;}
		if(!bind || !$.isFunction(bind.proxy)){return;}

		proxy = bind.proxy();
		action = action === 'on' ? 'on' : 'off';
		delegate = action === 'on' ? 'delegate' : 'undelegate';
		events = $.extend({}, events);

		$.each(events, function(handle, method){

			var selector, event, fns = [];
			handle = handle.split(/\s+/);

			if($.type(method) === 'string'){
				fns = method.split(/\s+/).map(function(fname){
					return proxy(fname);
				});
			}else if($.isFunction(method)){
				fns = [method];
			}else{
				return;
			}

			event = handle.pop();

			if(handle.length >= 1){
				selector = handle.join(' ');
				if($.isFunction(root[delegate])){
					fns.forEach(function(fn){
						root[delegate](selector, event, fn);
					});
				}
			}else{
				if($.isFunction(root[action])){
					fns.forEach(function(fn){
						root[action](event, fn);
					});
				}
			}

		});

	};
});

