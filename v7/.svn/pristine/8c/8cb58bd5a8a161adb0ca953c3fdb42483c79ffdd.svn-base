/**
基本覆盖物
**/

define('mods/ui/overlay',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $view = require('lib/mvc/view');

	var Overlay = $view.extend({
		defaults : {
			template : '<div class="ui-overlay"></div>',
			parent : null,
			styles : {
				'z-index' : 1,
				'display' : 'none',
				'position' : 'absolute'
			}
		},
		build : function(){
			this.model = new $model();
			this.setStyles(this.conf.styles);
		},
		setStyles : function(styles){
			styles = styles || {};
			this.role('root').css(styles);
		},
		setParent : function(){
			var conf = this.conf;
			var root = this.role('root');
			var curParent = root.get(0).parentNode;
			var parent = null;
			if(conf.parent){
				parent = $(conf.parent).get(0);
			}else{
				parent = document.body;
			}
			if(parent !== curParent){
				root.appendTo(parent);
				//切换 parentNode 后，第一次定位计算会出错，执行2遍可得正确结果
				//在 update 函数中还有一次 setPosition
				this.setPosition();
			}
		},
		setPosition : $.noop,
		setEvents : function(action){
			this.model[action]('change:visible', this.proxy('checkVisible'));
		},
		update : function(){
			this.setParent();
			this.setStyles();
			this.setPosition();
		},
		checkVisible : function(){
			var root = this.role('root');
			if(this.model.get('visible')){
				root.css('display', 'block');
				this.trigger('show');
			}else{
				root.css('display', 'none');
				this.trigger('hide');
			}
		},
		toggle : function(){
			if(this.model.get('visible')){
				this.hide();
			}else{
				this.show();
			}
		},
		show : function(){
			this.model.set('visible', true);
			this.update();
		},
		hide : function(){
			this.model.set('visible', false);
		},
		destroy : function(){
			this.role('root').remove();
			this.supr();
		}
	});

	module.exports = Overlay;

});


