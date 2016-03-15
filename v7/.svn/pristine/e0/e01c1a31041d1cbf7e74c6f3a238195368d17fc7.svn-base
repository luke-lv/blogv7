/**
@module lib/kit/obj/find
@example
var $find = require('lib/kit/obj/find');
var obj = {a:{b:{c:1}}};
console.info($find(obj,'a.b.c'));	//1
console.info($find(obj,'a.c'));		//undefined
**/

define('lib/kit/obj/find',function(require,exports,module){

	/**
	查找对象路径上的值
	@param {object} object 要查找的对象
	@param {string} path 要查找的路径
	@return {*} 对象路径上的值
	**/
	module.exports = function(object, path){
		path = path || '';
		if(!path){return object;}
		if(!object){return;}

		var queue = path.split('.');
		var name;
		var pos = object;

		while(queue.length){
			name = queue.shift();
			if(!pos[name]){
				return pos[name];
			}else{
				pos = pos[name];
			}
		}

		return pos;
	};

});


