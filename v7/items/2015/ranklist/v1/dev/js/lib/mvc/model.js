/**
模型:该类继承自 lib/mvc/base

@see module:lib/mvc/base
@module lib/mvc/model
@example
var $model = require('lib/mvc/model');

var m1 = new $model({
	a : 1
});
m1.on('change:a', function(prevA){
	console.info(prevA);	//1
});
m1.on('change', function(){
	console.info('model changed');
});
m1.set('a', 2);

var MyModel = $model.extend({
	defaults : {
		a : 2,
		b : 2
	},
	events : {
		'change:a' : 'updateB'
	},
	updateB : function(){
		this.set('b', this.get('a') + 1);
	}
});

var m2 = new MyModel();
console.info(m2.get('b'));	//2

m2.set('a', 3);
console.info(m2.get('b'));	//4

m2.set('b', 5);
console.info(m2.get('b'));	//5

**/
define('lib/mvc/model',function(require,exports,module){

	var $ = require('lib');
	var $base = require('lib/mvc/base');
	var $delegate = require('lib/mvc/delegate');

	//数据属性名称
	var DATA = '__data__';

	if(!Function.prototype.bind){
			Function.prototype.bind= function(obj){
		      var _self = this, args = arguments;
		      return function() {
		      _self.apply(obj, Array.prototype.slice.call(args, 1));
		      }
		      }
	}

	



	var setAttr = function(key, value){
		if($.type(key)!=='string'){return;}
		var that = this;
		var data = this[DATA];
		if(!data){return;}
		var prevValue = data[key];

		var processor = this.processors[key];
		if(processor && $.isFunction(processor.set)){
			value = processor.set(value);
		}

		if(value !== prevValue){
			data[key] = value;
			that.changed = true;
			that.trigger('change:' + key, prevValue);
		}
	};

	var getAttr = function(key){
		var value = this[DATA][key];
		if($.isPlainObject(value)){
			value = $.extend(true, {}, value);
		}else if($.isArray(value)){
			value = $.extend(true, [], value);
		}

		var processor = this.processors[key];
		if(processor && $.isFunction(processor.get)){
			value = processor.get(value);
		}

		return value;
	};

	var removeAttr = function(key){
		delete this[DATA][key];
		this.trigger('change:' + key);
	};

	var Model = $base.extend({

		/**
		模型的默认数据
		绑定在原型上，不要在实例中直接修改这个对象。
		@type {object}
		**/
		defaults : {},

		/**
		模型的事件绑定列表
		绑定在原型上，不要在实例中直接修改这个对象。
		尽量在 events 对象定义属性关联事件。
		事件应当仅用于自身属性的关联运算。

		事件绑定格式可以为：
		
		{'event':'method'}
		{'event':'method1 method2'}
		@type {object}
		**/
		events : {},

		/**
		模型数据的预处理器
		绑定在原型上，不要在实例中直接修改这个对象。
		@type {object}
		@example
		processors : {
			name : {
				set : function(value){
					return value;
				},
				get : function(value){
					return value;
				}
			}
		}
		**/
		processors : {},

		/**
		基础工厂元件类
		@constructor module:lib/mvc/model
		@param {object} [options] 初始数据
		**/
		initialize : function(options){
			this[DATA] = {};
			this.defaults = $.extend({}, this.defaults);
			this.events = $.extend({}, this.events);
			this.processors = $.extend({}, this.processors);
			this.changed = false;

			this.build();
			this.delegate('on');
			this.setEvents('on');
			this.setOptions(options);
		},

		/**
		深度混合传入的选项与默认选项，然后混合到数据对象中
		@param {object} [options] 选项
		**/
		setOptions : function(options){
			this.set(this.defaults);
			this.supr(options);
			this.set(options);
		},

		/**
		绑定 events 对象列举的事件。在初始化时自动执行了 this.delegate('on')。
		@see module:lib/mvc/delegate
		@param {string} [action='on'] 绑定动作标记。可选：['on', 'off']
		**/
		delegate : function(action, root, events, bind){
			action = action || 'on';
			root = root || this;
			events = events || this.events;
			bind = bind || this;
			$delegate(action, root, events, bind);
		},

		/**
		数据预处理
		@param {string} key 模型属性名称。或者JSON数据。
		@param {mixed} [val] 数据
		**/
		process : function(name, spec){
			spec = $.extend({
				set : function(value){
					return value;
				},
				get : function(value){
					return value;
				}
			}, spec);
			this.processors[name] = spec;
		},

		/**
		设置模型数据
		@param {string|object} key 模型属性名称。或者JSON数据。
		@param {mixed} [val] 数据
		**/
		set : function(key, val){
			if($.isPlainObject(key)){
				$.each(key, setAttr.bind(this));
			}else if($.type(key) === 'string'){
				setAttr.call(this, key, val);
			}
			if(this.changed){
				this.trigger('change');
				this.changed = false;
			}
		},

		/**
		获取模型对应属性的值的拷贝，如果不传参数，则直接获取整个模型数据。
		@param {string} [key] 模型属性名称。
		**/
		get : function(key){
			if($.type(key) === 'string'){
				if(!this[DATA]){return;}
				return getAttr.call(this, key);
			}
			if(typeof key === 'undefined'){
				var data = {};
				$.each(this.keys(), function(i, k){
					data[k] = getAttr.call(this, k);
				}.bind(this));
				return data;
			}
		},

		/**
		获取模型上设置的所有键名
		**/
		keys : function(){
			return Object.keys(this[DATA] || {});
		},

		/**
		删除模型上的一个键
		@param {string} key 模型属性名称。
		**/
		remove : function(key){
			removeAttr.call(this, key);
			this.trigger('change');
		},

		/**
		清除模型中所有数据
		**/
		clear : function(){
			Object.keys(this[DATA]).forEach(removeAttr, this);
			this.trigger('change');
		},

		/**
		销毁模型，不会触发任何change事件。
		模型销毁后，无法再设置任何数据。
		**/
		destroy : function(){
			this.changed = false;
			this.delegate('off');
			this.supr();
			this.clear();
			this[DATA] = null;
		}
	});

	module.exports = Model;

});

