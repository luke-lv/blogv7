/**
@module lib/kit/util/template
@example
var $tpl = require('lib/kit/util/template');
var TPL = $tpl({
	item : [
		'<div>',
			'<a href="#">test</a>',
		'</div>'
	],
	str : '<a href="#">test</a>'
});
TPL.item;  //['<div>','<a href="#">test</a>','</div>']
TPL.get('item');  //'<div><a href="#">test</a></div>'
TPL.str; //'<a href="#">test</a>'
TPL.get('str'); //'<a href="#">test</a>'
**/
define('lib/kit/util/template',function(require,exports,module){

	var $ = require('lib');

	/**
	模板管理器

	模板对象是一个简单的单体对象，每个属性为一个模板数组或者模板字符串。

	模板数组在定义时不会做任何处理，但在获取时会被转换为模板字符串。

	这个机制是为了减少代码初始化时字符串拼接带来的性能消耗。

	@constructor module:lib/kit/util/template
	@param {object} obj 模板对象
	**/
	module.exports = function(obj){
		var tpl = {};
		var that = {};

		/**
		配置模板
		@function set
		@memberof module:lib/kit/util/template
		@param {object} object 模板对象
		**/
		that.set = function(object){
			$.extend(that, object);
			$.extend(tpl, object);
		};

		/**
		获取模板字符串
		@function get
		@memberof module:lib/kit/util/template
		@param {string} name 模板名称
		@return {string} 拼接完成的模板字符串
		**/
		that.get = function(name){
			var str = '';
			var part = tpl[name];
			if(part){
				if(typeof part === 'string'){
					str = part;
				}else if(Array.isArray(part)){
					tpl[name] = str = part.join('');
				}
			}
			return str;
		};

		that.set(obj);

		return that;
	};

});

