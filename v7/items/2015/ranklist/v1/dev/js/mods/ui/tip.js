/**
简单提示信息
**/

define('mods/ui/tip',function(require,exports,module){

	var $ = require('lib');
	var $position = require('lib/more/position');
	var $overlay = require('mods/ui/overlay');

	var Tip = $overlay.extend({
		defaults : {
			template : '<div class="ui-tip"></div>',
			target : 'screen',
			parent : null,
			styles : {
				'z-index' : 10000,
				'position' : 'absolute',
				'padding' : '10px',
				'color' : '#fff',
				'background' : 'rgb(0,0,0)',
				'background-color' : 'rgba(0,0,0,0.5)',
				'display' : 'none'
			}
		},
		getTarget : function(){
			var conf = this.conf;
			if(conf.target === 'screen'){
				return $(window);
			}else{
				return $(conf.target);
			}
		},
		setStyles : function(styles){
			var conf = this.conf;
			styles = styles || {};
			if(conf.target === 'screen'){
				styles.position = 'fixed';
			}else{
				styles.position = 'absolute';
			}
			this.role('root').css(styles);
		},
		//tip浮层一般显示在容器底部
		setPosition : function(){
			var conf = this.conf;
			var target = this.getTarget();
			var height = this.role('root').height() + 20;
			$position.pin({
				element : this.role('root'),
				x : '50%',
				y : '50%'
			}, {
				element : conf.target === 'screen' ? $position.VIEWPORT : target,
				x : '50%',
				y : '100% - ' + height + 'px'
			});
		}
	});

	//下面的方法可以区分浏览器来添加
	Tip.methods({
		checkVisible : function(){
			var root = this.role('root');
			if(this.model.get('visible')){
				if(root.css('display') === 'none'){
					root.css({
						'margin-top' : '100px',
						'opacity' : 0,
						'display' : 'block'
					});
				}
				root.stop().animate({
					'margin-top' : 0,
					'opacity' : 1
				}, {
					duration : 300
				});
				this.trigger('show');
			}else{
				root.stop().animate({
					'margin-top' : '100px',
					'opacity' : 0
				}, {
					duration : 300,
					complete : function(){
						root.css('display', 'none');
					}
				});
				this.trigger('hide');
			}
		}
	});

	module.exports = Tip;

});


