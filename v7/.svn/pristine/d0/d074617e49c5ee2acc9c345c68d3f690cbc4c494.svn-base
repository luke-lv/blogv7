/**
对话框
**/

define('mods/ui/dialog',function(require,exports,module){

	var $ = require('lib');
	var $position = require('lib/more/position');
	var $overlay = require('mods/ui/overlay');
	var $screenMask = require('mods/ui/screenMask');
	var $include = require('lib/kit/arr/include');
	var $erase = require('lib/kit/arr/erase');

	var observed = $screenMask.observed;

	var Dialog = $overlay.extend({
		defaults : {
			template : '<div class="ui-dialog"></div>',
			target : 'screen',
			parent : null,
			mask : true,
			styles : {
				'z-index' : 10000,
				'position' : 'absolute',
				'display' : 'none'
			}
		},
		events : {
			'[data-action] click' : 'action'
		},
		setEvents : function(action){
			this.supr(action);
			var proxy = this.proxy();
			this[action]('ok', proxy('hide'));
			this[action]('cancel', proxy('hide'));
			this[action]('close', proxy('hide'));
			this[action]('show', proxy('maskObserve'));
			this[action]('hide', proxy('maskUnobserve'));
			this[action]('show', proxy('putToTop'));
		},
		getTarget : function(){
			var conf = this.conf;
			if(conf.target === 'screen'){
				return $(window);
			}else{
				return $(conf.target);
			}
		},
		//默认对话框显示在容器正中间
		setPosition : function(){
			var conf = this.conf;
			var target = this.getTarget();
			$position.pin({
				element : this.role('root'),
				x : '50%',
				y : '50%'
			}, {
				element : conf.target === 'screen' ? $position.VIEWPORT : target,
				x : '50%',
				y : '50%'
			});
		},
		//如果浮层内元素上有属性: data-action
		//其值会作为事件名称，在该元素被点击时触发
		action : function(evt){
			if(evt && evt.preventDefault){
				evt.preventDefault();
			}
			var node = $(evt.currentTarget);
			var action = node.attr('data-action');
			this.trigger(action, node);
		},
		//将对话框插入屏幕遮罩的监控数组
		//触发屏幕遮罩检查监控数组中对话框的数量，判断是否显示屏幕遮罩
		maskObserve : function(){
			if(this.conf.mask){
				$include(observed, this);
				$screenMask.check();
			}
		},
		maskUnobserve : function(){
			$erase(observed, this);
			$screenMask.check();
		},
		//新打开的对话框需要显示在最上面
		putToTop : function(){
			var root = this.role('root');
			root.appendTo(root.parent());
		}
	});

	module.exports = Dialog;

});


