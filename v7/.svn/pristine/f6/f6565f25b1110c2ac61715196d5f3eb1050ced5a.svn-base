/**
遮罩
**/

define('mods/ui/mask',function(require,exports,module){

	var $ = require('lib');
	var $position = require('lib/more/position');
	var $overlay = require('mods/ui/overlay');

	var Mask = $overlay.extend({
		defaults : {
			template : '<div class="ui-mask"></div>',
			target : 'screen',
			parent : null,
			styles : {
				'z-index' : 10,
				'position' : 'absolute',
				'opacity' : '0.6',
				'background' : '#000',
				'display' : 'none'
			}
		},
		setEvents : function(action){
			this.supr(action);
			$(window)[action]('resize', this.proxy('onResize'));
		},
		setStyles : function(styles){
			var conf = this.conf;
			styles = styles || {};

			if(conf.target === 'screen'){
				styles.position = 'fixed';
				styles.width = '100%';
				styles.height = '100%';
			}else{
				var target = this.getTarget();
				styles.position = 'absolute';
				styles.width = target.width() + 'px';
				styles.height = target.height() + 'px';
			}
			this.role('root').css(styles);
		},
		getTarget : function(){
			var conf = this.conf;
			if(conf.target === 'screen'){
				return $(window);
			}else{
				return $(conf.target);
			}
		},
		setPosition : function(){
			var conf = this.conf;
			var target = this.getTarget();
			$position.pin({
				element : this.role('root'),
				x : '0%',
				y : '0%'
			}, {
				element : conf.target === 'screen' ? $position.VIEWPORT : target,
				x : '0%',
				y : '0%'
			});
		},
		onResize : function(){
			this.update();
		}
	});

	module.exports = Mask;

});


