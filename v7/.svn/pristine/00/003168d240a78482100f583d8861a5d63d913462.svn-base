/**
@module lib/kit/str/substitute
@example
var $substitute = require('lib/kit/str/substitute');
$substitute('{city}欢迎您', {city:'北京'}); //return '北京欢迎您'
**/

define('lib/kit/str/substitute',function(require,exports,module){
	/**
	简单模板函数 
	@param {string} str 要替换模板的字符串
	@param {object} obj 模板对应的数据对象
	@param {regExp} [reg=/\\?\{([^{}]+)\}/g] 解析模板的正则表达式
	@return {string} 替换了模板的字符串
	**/
	module.exports = function(str, obj, reg){
		return str.replace(reg || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) === '\\'){
				return match.slice(1);
			}
			//注意：obj[name] != null 等同于 obj[name] !== null && obj[name] !== undefined
			return (obj[name] != null) ? obj[name] : '';
		});
	};

});
