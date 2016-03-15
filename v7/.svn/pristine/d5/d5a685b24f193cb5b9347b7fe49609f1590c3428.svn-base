/**
@module lib/kit/str/hyphenate
@example
var $hyphenate = require('lib/kit/str/hyphenate');
$hyphenate('libKitStrHyphenate'); //return 'lib-kit-str-hyphenate'
**/

define('lib/kit/str/hyphenate',function(require,exports,module){

	/**
	将驼峰格式变为连字符格式
	@param {string} str 驼峰格式的字符串
	@return {string} 连字符格式的字符串
	**/
	module.exports = function(str){
		return str.replace(/[A-Z]/g, function($0){
			return '-' + $0.toLowerCase();
		});
	};

});
