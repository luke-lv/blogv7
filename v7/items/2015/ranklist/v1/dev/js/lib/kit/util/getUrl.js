/**
规范化URL地址
**/
define('lib/kit/util/getUrl', function(require,exports,module){

	var a = document.createElement('a');

	module.exports = function(path){
		a.href = path;
		return a.href;
	};

});
