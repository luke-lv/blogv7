/**
@module lib/kit/str/leftB
@example
var $leftB = require('lib/kit/str/leftB');
//向汉编致敬
$leftB('世界真和谐', 6); //return '世界真'
**/

define('lib/kit/str/leftB',function(require,exports,module){
	/**
	从左到右取字符串，中文算两个字符
	@param {String} str
	@param {Number} lens
	@return {String} str
	**/
	module.exports = function(str, lens){
		var s = str.replace(/\*/g, ' ').replace(/[^\x00-\xff]/g, '**');
		str = str.slice(0, s.slice(0, lens).replace(/\*\*/g, ' ').replace(/\*/g, '').length);
		if ($.core.str.bLength(str) > lens && lens > 0) {
			str = str.slice(0, str.length - 1);
		}
		return str;
	};

});
