/**
构建一个Ready事件管理组件

执行任务前判断条件是否齐备，若未未齐备，则延迟到齐备时按调用顺序执行任务。

若已条件齐备，则立即执行。

@module lib/kit/util/makeReady
@example
var $makeReady = require('lib/kit/util/makeReady');
var prop = 'not ready';
var obj = $makeReady();
setTimeout(function(){
	prop = 'ready';
	obj.setReady();
}, 1000);

console.info(prop);	//not ready

obj.ready(function(){
	console.info(prop);	//ready
});

setTimeout(function(){
	var str = 'exec immediatelly';
	obj.ready(function(){
		console.info(prop);	//ready
		console.info(str);	//exec immediatelly
	});
}, 2000);
**/

define('lib/kit/util/makeReady',function(require,exports,module){

	var $ = require('lib');

	/**
	构建一个缓存队列，在未设置条件完成前收集需要执行的任务
	@constructor module:lib/kit/util/makeReady
	**/
	module.exports = function(){
		var isReady = false;
		var cache = [];

		return {
			/**
			设置条件完成，缓存的任务会立即执行
			**/
			setReady : function(){
				isReady = true;
				if(isReady){
					while(cache.length > 0){
						cache.shift()();
					}
				}
			},
			/**
			添加条件完成时需要执行的任务
			@param {function} fn 任务函数
			**/
			ready : function(fn){
				if($.type(fn) === 'function'){
					if(isReady){
						fn();
					}else{
						cache.push(fn);
					}
				}
			},
			/**
			重置对象，清空所有任务，准备条件设置为false
			**/
			reset : function(){
				isReady = false;
				cache.length = 0;
			},
			/**
			销毁任务准备对象，清空所有任务，准备条件设置为false，尽量释放内存
			**/
			destroy : function(){
				this.reset();
			}
		};
	};

});

