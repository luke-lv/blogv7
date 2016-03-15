/**
在控制台输出信息
**/

define('mods/common/log',function(require,exports,module){

	var $ = require('lib');
	var console = window.console;
	var logs = window.AipaiLogs = [];

	module.exports = function(){
		var args = [].slice.call(arguments);
		args.unshift('[' + new Date() + ']');

		if(
			console &&
			console.log &&
			$.type(console.log) === 'function'
		){
			console.log.apply(console, args);
		}

		//收集日志方便调试
		logs.unshift(args);

		//最多收集100条日志
		if(logs.length > 100){
			logs.length = 100;
		}
	};

});

