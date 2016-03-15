/**
@module lib/kit/str/decodeHTML
@example
var $decodeHTML = require('lib/kit/str/decodeHTML');
$decodeHTML('&amp;&lt;&gt;$nbsp;&quot;');  //return '&<> "'
**/

define('lib/kit/str/decodeHTML',function(require,exports,module){
	/**
	解码HTML，将实体字符转换为HTML字符
	@param {string} str 含有实体字符标记的字符串
	@return {string} HTML字符串
	**/
	module.exports = function(str){
		if(typeof str !== 'string'){
			throw 'decodeHTML need a string as parameter';
		}
		return str.replace(/&quot;/g,'"').
			replace(/&lt;/g,'<').
			replace(/&gt;/g,'>').
			replace(/&#39;/g,'\'').
			replace(/&nbsp;/g,'\u00A0').
			replace(/&#32;/g,'\u0020').
			replace(/&amp;/g,'&');
	};

});
