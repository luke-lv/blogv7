/**
@module lib/kit/str/bLength
@example
var $bLength = require('lib/kit/str/bLength');
$bLength('中文cc');  //return 6
**/

define('lib/kit/str/bLength',function(require,exports,module){
	/**
	获取字符串长度，一个中文算2个字符
	@param {string} str 要计算长度的字符串
	@return {number} 字符串长度
	**/
	module.exports = function(str){
		if (!str) {
			return 0;
		}
		var aMatch = str.match(/[^\x00-\xff]/g);
		return (str.length + (!aMatch ? 0 : aMatch.length));
	};

});
