/**
@module lib/kit/arr/flatten
@example
var $flatten = require('lib/kit/util/flatten');
console.info($flatten([1,[2,3],[4,5]]));	//[1,2,3,4,5]
**/

define('lib/kit/arr/flatten',function(require,exports,module){

	/**
	数组扁平化
	@param {array} arr 要操作的数组
	@return {array} 经过扁平化处理的数组
	**/
	module.exports = function(arr){
		var array = [];
		for (var i = 0, l = arr.length; i < l; i++){
			var type = $.type(arr[i]);
			if (type === 'null'){
				continue;
			}
			array = array.concat(
				type === 'array' ? flatten(arr[i]) : arr[i]
			);
		}
		return array;
	};

});
