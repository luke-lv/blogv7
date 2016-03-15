/**
控制器:该类继承自 lib/mvc/base 。
一般控制器负责事件分发，但前端组件视图与dom事件隔离会带来大量代码量，因此修改方案：
将控制器变成一个组织模块的组件。dom事件交给视图层处理，业务逻辑事件在控制器层绑定。

@see module:lib/mvc/base
@module lib/mvc/controller
@example
var $controller = require('lib/mvc/controller');

var obj = new $controller();

obj.on('detach', function(){
	console.info('obj detached');
});

var MyController = $controller.extend({
	build : function(){
		this.objs.child = obj;
	}
});

var myobj = new MyController();
myobj.detach();	//console output 'obj detached'

**/
define('lib/mvc/controller',function(require,exports,module){
	var $ = require('lib');
	var $base = require('lib/mvc/base');
	var $delegate = require('lib/mvc/delegate');

	//遍历从属实例的方法
	//{String} name 要调用的子对象方法名称
	var traverse = function(name){
		if(this.objs){
			$.each(this.objs, function(k, o){
				if( o && $.isFunction(o[name])){
					o[name]();
				}
			});
		}
	};

	var Controller = $base.extend({
		/**
		类的默认选项对象，绑定在原型上，不要在实例中直接修改这个对象。
		@type {object}
		**/
		defaults : {

		},

		/**
		组件是否已被安装。
		@type {boolean}
		**/
		attached : false,

		/**
		基础工厂元件类
		@constructor module:lib/mvc/controller
		@param {object} [options] 选项
		**/
		initialize : function(options){
			this.objs = {};
			this.setOptions(options);
			this.build();
			this.attach();
		},

		/**
		组件安装方法，会在初始化时自动调用.
		它会调用 this.setEvents('on')，产生 attach 事件，并调用从属实例的 attach 方法。
		之后会设置属性 attached 为 true 。

		@event module:lib/mvc/controller#attach
		**/
		attach : function(){
			if(this.attached){return;}
			this.setEvents('on');
			traverse.call(this, 'attach');
			this.trigger('attach');
			this.attached = true;
		},

		/**
		组件卸载方法，会在销毁时自动调用.
		它会调用 this.setEvents('off')，产生 detach 事件，并调用从属实例的 detach 方法。
		之后会设置属性 attached 为 false 。

		@event module:lib/mvc/controller#detach
		**/
		detach : function(){
			if(!this.attached){return;}
			this.trigger('detach');
			traverse.call(this, 'detach');
			this.setEvents('off');
			this.attached = false;
		},

		/**
		遍历从属实例，执行 destroy 方法。
		**/
		destroyObjs : function(){
			traverse.call(this, 'destroy');
		},

		/**
		销毁组件。
		**/
		destroy : function(){
			this.destroyObjs();
			this.detach();
			this.off();
			this.objs = null;
			this.bound = null;
		}
	});

	module.exports = Controller;

});

