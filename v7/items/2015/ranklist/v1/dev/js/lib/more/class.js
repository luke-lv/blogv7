/**
类

@module lib/more/class
@author Dustin Diaz
@see https://github.com/ded/klass
@example

var $class = require('lib/more/class');

//创建类无需使用 new 关键字
var Base = $class({
	defaults : {
		name : 'base',
		val : 100
	},
	initialize : function(){
		this.name = this.defaults.name;
		this.say('hello');
	},
	say : function(str){
		console.info(this.name + ':' + str);
	}
});

var Child = Base.extend({
	defaults : {
		name : 'child'
	},
	initialize : function(){
		//调用父类的方法
		this.supr();
		this.value = this.defaults.value;
		this.show();
	}
}).methods({
	//用 methods 方法来扩充类
	show : function(){
		console.info('child name is: ' + this.name, '. value is : ' + this.value);
	}
});

var obj = new Child();

//console will output info:
//child:hello
//child name is: child . value is : undefined

**/

define('lib/more/class',function(require,exports,module){

	var context = this;
	var f = 'function';
	var fnTest = (/xyz/).test(function(){return xyz;}) ? (/\bsupr\b/) : (/.*/) ;
	var proto = 'prototype';

	function klass(o) {
		return extend.call(isFn(o) ? o : function () {}, o, 1);
	}

	function isFn(o) {
		return typeof o === f;
	}

	function wrap(k, fn, supr) {
		return function () {
			var tmp = this.supr;
			this.supr = supr[proto][k];
			var undef = {}.fabricatedUndefined;
			var ret = undef;
			try {
				ret = fn.apply(this, arguments);
			} finally {
				this.supr = tmp;
			}
			return ret;
		};
	}

	function process(what, o, supr) {
		for (var k in o) {
			if (o.hasOwnProperty(k)) {
				what[k] = (
					isFn(o[k]) &&
					isFn(supr[proto][k]) &&
					fnTest.test(o[k])
				) ? wrap(k, o[k], supr) : o[k];
			}
		}
	}

	function extend(o, fromSub) {
		// must redefine noop each time so it doesn't inherit from previous arbitrary classes
		var noop = function(){};
		noop[proto] = this[proto];

		var supr = this;
		var prototype = new noop();
		var isFunction = isFn(o);
		var _constructor = isFunction ? o : this;
		var _methods = isFunction ? {} : o;

		function fn() {
			if (this.initialize){
				this.initialize.apply(this, arguments);
			}else{
				var tmp = fromSub || isFunction && supr.apply(this, arguments);
				_constructor.apply(this, arguments);
			}
		}

		fn.methods = function (o) {
			process(prototype, o, supr);
			fn[proto] = prototype;
			return this;
		};

		fn.methods.call(fn, _methods).prototype.constructor = fn;

		fn.extend = arguments.callee;
		fn[proto].implement = fn.statics = function (o, optFn) {
			o = typeof o === 'string' ? (function () {
				var obj = {};
				obj[o] = optFn;
				return obj;
			}()) : o;
			process(this, o, supr);
			return this;
		};

		return fn;
	}

	return klass;

});
