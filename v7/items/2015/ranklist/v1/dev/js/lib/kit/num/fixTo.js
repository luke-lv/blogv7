/**
@module lib/kit/num/fixTo
@example
var $fixTo = require('lib/kit/num/fixTo');
$fixTo(0,2);	//return '00'
 */
define('lib/kit/num/fixTo', function(require,exports,module) {
	/**
	修正补位
	@param {number|string} num 要补位的数字
	@param {number} [w=2] w 补位数量
	@return {string} 经过补位的字符串
	**/
	module.exports = function(num, w){
		str = num.toString();
		w = Math.max((w || 2) - str.length + 1, 0);
		return	new Array(w).join('0') + str;
	};

});


