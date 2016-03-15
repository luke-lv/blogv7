/**
@module lib/kit/str/dbcToSbc
@example
var $dbcToSbc = require('lib/kit/str/dbcToSbc');
$dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ');	//return 'SAASDFSADF'
**/

define('lib/kit/str/dbcToSbc',function(require,exports,module){
	/**
	全角字符转半角字符
	@param {string} str 包含了全角字符的字符串
	@return {string} 经过转换的字符串
	**/
	module.exports = function(str){
		return str.replace(/[\uff01-\uff5e]/g,function(a){
			return String.fromCharCode(a.charCodeAt(0)-65248);
		}).replace(/\u3000/g," ");
	};

});
