/**
获取唯一ID 
@module lib/kit/util/getUniqueKey
**/

define('lib/kit/util/getUniqueKey',function(require,exports,module){

	var time = + new Date(), index = 1;

	/**
	生成一个不与之前重复的随机字符串
	@return {string} 随机字符串
	**/
	module.exports = function() {
		return ( time + (index++) ).toString(16);
	};

});

