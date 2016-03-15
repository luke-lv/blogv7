/**
placeholder兼容性相关函数
获取input的实际value
**/
define('mods/kit/dom/getValue',function(require,exports,module){

	var $ = require('lib');

	module.exports = function(node){
		node = $(node);
		var text = node.attr('placeholder');
		var value = node.val();
		if(value === text){
			return '';
		}else{
			return $.trim(value);
		}
	};

});
