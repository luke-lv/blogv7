/**
复杂交互对话框模板
**/

define('mods/dialog/content',function(require,exports,module){

	var $ = require('lib');
	var $dialog = require('mods/ui/dialog');

	var TPL = {};
	TPL.dialog = [
		'<div>',
			'<div role="padding">',
				'<div role="box" style="width:600px;overflow:hidden;background:#fff;border:1px solid #ddd; padding:10px; margin:0 auto;">',
					'<div style="overflow:hidden;border-bottom:1px solid #ddd;padding-bottom:10px;">',
						'<h3 role="title" style="float:left;"></h3>',
						'<a style="float:right;cursor:pointer;" role="close" data-action="close">关闭</a>',
					'</div>',
					'<div role="content" style="min-height:100px;overflow:hidden;"></div>',
				'</div>',
			'</div>',
		'</div>'
	];

	var ContentDialog = $dialog.extend({
		defaults : {
			template : TPL.dialog,
			target : 'screen',
			parent : null,
			mask : true,
			padding : 40,
			styles : {
				'z-index' : 10000,
				'width' : '100%',
				'height' : '100%',
				'left' : 0,
				'top' : 0,
				'overflow' : 'auto',
				'position' : 'absolute',
				'display' : 'none'
			}
		},
		setStyles : function(styles){
			styles = styles || {};

			var conf = this.conf;
			var root = this.role('root');
			var wHeight = $(window).height();
			var boxHeight = this.role('box').outerHeight();
			var padding = conf.padding || 0;

			if(boxHeight < wHeight){
				padding = Math.floor((wHeight - boxHeight) / 2);
			}

			this.role('padding').css('padding', padding + 'px 0');

			root.css(styles);
		},
		render : function(options){
			options = $.extend({
				title : '',
				content : ''
			}, options);
			this.role('title').html(options.title);
			this.role('content').html(options.content);
		}
	});

	module.exports = ContentDialog;

});

