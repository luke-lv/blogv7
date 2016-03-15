/**
@module lib/kit/arr/contains
@example
var $contains = require('lib/kit/arr/contains');
console.info($contains([1,2,3,4,5],3));	//true
**/

define('lib/kit/arr/contains',function(require,exports,module){

	/**
	确认对象是否在数组中
	@param {array} arr 要操作的数组
	@param {*} item 要搜索的对象
	@return {boolean} 如果对象在数组中，返回true
	**/
	module.exports = function(arr, item){
		var index = arr.indexOf(item);
		return index >= 0;
	};

});


