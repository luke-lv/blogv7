/**
@module lib/kit/arr/erase
@example
var $erase = require('lib/kit/util/erase');
console.info($erase([1,2,3,4,5],3));	//[1,2,4,5]
**/

define('lib/kit/arr/erase',function(require,exports,module){

	/**
	删除数组中的对象
	@param {array} arr 要操作的数组
	@param {*} item 要清除的对象
	@return {number} 对象原本所在位置
	**/
	module.exports = function(arr, item){
		var index = arr.indexOf(item);
		if(index >= 0){
			arr.splice(index, 1);
		}
		return index;
	};

});


