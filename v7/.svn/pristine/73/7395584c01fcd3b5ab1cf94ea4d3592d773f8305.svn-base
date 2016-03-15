/**
回到顶端按钮
**/
define('mods/view/toTop', function (require, exports, module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $smoothScrollTo = require('mods/kit/fx/smoothScrollTo');

	var $win = $(window);

	var ToTop = $view.extend({
		defaults : {
			node : null
		},
		events : {
			'[role="button"] click' : 'scrollToTop',
			'[role="close"] click' : 'close'
		},
		build : function(){
			this.check();
		},
		setEvents : function(action){
			$win[action]('scroll', this.proxy('check'));
		},
		check : function(){
			if(this.disabled){return;}
			var stop = $win.scrollTop();
			if(stop > 0){
				this.show();
			}else{
				this.hide();
			}
		},
		close : function(){
			this.disabled = true;
			this.setEvents('off');
			this.hide();
		},
		show : function(){
			this.role('root').show();
		},
		hide : function(){
			this.role('root').hide();
		},
		scrollToTop : function(){
			$smoothScrollTo(document.body, {
				callback : this.proxy('check')
			});
		}
	});

	module.exports = ToTop;
});

