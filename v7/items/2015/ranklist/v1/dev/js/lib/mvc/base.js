/**
> 该类混合了 lib/more/events 的方法。

@see module:lib/more/events
@module lib/mvc/base
@example
var $base = require('lib/mvc/base');

var ChildClass = $base.extend({
	defaults : {
		node : null
	},
	build : function(){
		this.node = $(this.conf.node);
	},
	setEvents : function(action){
		var proxy = this.proxy();
		this.node[action]('click', proxy('onclick'));
	},
	onclick : function(){
		console.info('clicked');
		this.trigger('click');
	}
});

var obj = new ChildClass({
	node : document.body
});

obj.on('click', function(){
	console.info('obj is clicked');
});
**/
define('lib/mvc/base',function(require,exports,module){
	var $ = require('lib');
	var $class = require('lib/more/class');
	var $events = require('lib/more/events');

	var AP = Array.prototype;

	var Base = $class({
		/**
		类的默认选项对象，绑定在原型上，不要在实例中直接修改这个对象
		@type {object}
		**/
		defaults : {},

		/**
		类的实际选项，setOptions方法会修改这个对象
		@name conf
		@type {object}
		@inner
		@memberof module:lib/mvc/base
		**/

		/**
		存放代理函数的集合
		@name bound
		@type {object}
		@inner
		@memberof module:lib/mvc/base
		**/

		/**
		基础工厂元件类
		@constructor module:lib/mvc/base
		@param {object} [options] 选项
		**/
		initialize : function(options){
			this.setOptions(options);
			this.build();
			this.setEvents('on');
		},

		/**
		深度混合传入的选项与默认选项，混合完成的选项对象可通过 this.conf 属性访问
		@param {object} [options] 选项
		**/
		setOptions : function(options){
			this.conf = this.conf || $.extend(true, {}, this.defaults);
			if(!$.isPlainObject(options)){
				options = {};
			}
			$.extend(true, this.conf, options);
		},

		/**
		元件初始化接口函数，实例化元件时会自动首先调用
		@abstract
		@function
		**/
		build : $.noop,

		/**
		元件事件绑定接口函数，实例化元件时会自动在 build 之后调用
		@abstract
		@function
		@param {string} [action='on'] 绑定或者移除事件的标记，可选值有：['on', 'off']
		**/
		setEvents : $.noop,

		/**
		函数代理，确保函数在当前类创建的实例上下文中执行。
		这些用于绑定事件的代理函数都放在属性 this.bound 上。
		功能类似 Function.prototype.bind 。
		可以传递额外参数作为函数执行的默认参数，追加在实际参数之后。
		@param {string} [name='proxy'] 函数名称
		**/
		proxy : function(name){
			var that = this;
			var bound = this.bound ? this.bound : this.bound = {};
			var proxyArgs = AP.slice.call(arguments);
			proxyArgs.shift();
			name = name || 'proxy';
			if(!$.isFunction(bound[name])){
				bound[name] = function(){
					if($.isFunction(that[name])){
						var args = AP.slice.call(arguments);
						return that[name].apply(that, args.concat(proxyArgs));
					}
				};
			}
			return bound[name];
		},

		/**
		移除所有绑定事件，清除用于绑定事件的代理函数
		**/
		destroy : function(){
			this.setEvents('off');
			this.off();
			this.bound = null;
		}
	});

	Base.methods($events.prototype);

	module.exports = Base;

});

