/**
视图:该类继承自 lib/mvc/base

@see module:lib/mvc/base
@module lib/mvc/view
@example

var $view = require('lib/mvc/view');
var TPL = {
	box : [
		'<div>',
			'<button role="button"></button>',
		'</div>'
	]
};

var TestView = $view.extend({
	defaults : {
		template : TPL.box
	},
	events : {
		'button click' : 'method1'
	},
	build : function(){
		this.role('root').appendTo(document.body);
	},
	method1 : function(evt){
		console.info(1);
	},
	method2 : function(evt){
		console.info(2);
	}
});

var obj1 = new TestView();
var obj2 = new TestView({
	events : {
		'button click' : 'method2'
	}
});

obj1.role('button').trigger('click');	//1
obj2.role('button').trigger('click');	//2

**/
define('lib/mvc/view',function(require,exports,module){
	var $ = require('lib');
	var $base = require('lib/mvc/base');
	var $delegate = require('lib/mvc/delegate');

	//获取视图的根节点
	var getRoot = function(){
		var conf = this.conf;
		var template = conf.template;
		var nodes = this.nodes;
		var root = nodes.root;
		if(!root){
			if(conf.node){
				root = $(conf.node);
			}
			if(!root || !root.length){
				if($.type(template) === 'array'){
					template = template.join('');
				}
				root = $(template);
			}
			nodes.root = root;
		}
		return root;
	};

	var View = $base.extend({
		/**
		@property {object} defaults 类的默认选项对象，绑定在原型上，不要在实例中直接修改这个对象。
		@property {string|element} defaults.node 选择器字符串，或者DOM元素，或者jquery对象，用于指定视图的根节点。
		@property {string} defaults.template 视图的模板字符串，也可以是个字符串数组，创建视图DOM时会自动join为字符串处理。
		@property {object} defaults.events 用于覆盖代理事件列表。
		@property {object} defaults.role 角色对象映射表，可指定role方法返回的jquery对象。
		**/
		defaults : {
			node : '',
			template : '',
			events : {},
			role : {}
		},

		/**
		视图的代理事件绑定列表，绑定在原型上，不要在实例中直接修改这个对象。

		事件绑定格式可以为：
		
		{'selector event':'method'}
		{'selector event':'method1 method2'}
		@type {object}
		**/
		events : {},

		/**
		基础工厂元件类
		@constructor module:lib/mvc/view
		@param {object} [options] 选项
		**/
		initialize : function(options){
			this.nodes = {};

			this.setOptions(options);
			this.build();
			this.delegate('on');
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
			this.events = $.extend({}, this.events, options.events);
		},

		/**
		绑定 events 对象列举的事件。在初始化时自动执行了 this.delegate('on')。
		@see module:lib/mvc/delegate
		@param {string} [action='on'] 绑定动作标记。可选：['on', 'off']
		**/
		delegate : function(action, root, events, bind){
			action = action || 'on';
			root = root || this.role('root');
			events = events || this.events;
			bind = bind || this;
			$delegate(action, root, events, bind);
		},

		/**
		获取 / 设置角色对象指定的jquery对象。

		注意：获取到角色元素后，该jquery对象会缓存在视图对象中
	
		@param {string} name 角色对象名称
		@param {element} [element] 角色对象指定的dom元素或者jquery对象。
		@return {element} 角色名对应的jquery对象。
		**/
		role : function(name, element){
			var nodes = this.nodes;
			var root = getRoot.call(this);
			var role = this.conf.role || {};
			if(!element){
				if(nodes[name]){
					element = nodes[name];
				}
				if(name === 'root'){
					element = root;
				}else if(!element || !element.length){
					if(role[name]){
						element = root.find(role[name]);
					}else{
						element = root.find('[role="' + name + '"]');
					}
					nodes[name] = element;
				}
			}else{
				nodes[name] = element = $(element);
			}
			return element;
		},

		/**
		清除视图缓存的角色对象
		**/
		resetRoles : function(){
			var nodes = this.nodes;
			$.each(nodes, function(name){
				if(name !== 'root'){
					nodes[name] = null;
					delete nodes[name];
				}
			});
		},

		/**
		销毁视图，释放内存
		**/
		destroy : function(){
			this.delegate('off');
			this.supr();
			this.resetRoles();
			this.nodes = {};
		}
	});

	module.exports = View;

});

