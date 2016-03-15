/**
alert对话框
**/

define('mods/common/alert',function(require,exports,module){

	var $ = require('lib');
	var $reuse = require('mods/dialog/reuse');

	var TPL = {};

	TPL.dialog = [
		'<div class="msg_tit_box psfx msg_tit_box_alert">',
			'<h2 class="clearfix">',
				'<span class="fl" role="title"></span>',
				'<a class="fr" href="javascript:;" data-action="cancel"></a>',
			'</h2>',
			'<div class="cont" role="content"></div>',
			'<div class="clearfix msg_btns">',
				'<a class="sure opc_btn fl sure_alert" href="javascript:;" data-action="ok" role="ok">确定</a>',
			'</div>',
		'</div>'
	];

	var cache = $reuse({
		template : TPL.dialog,
		target : 'screen',
		parent : null,
		mask : true,
		styles : {
			'z-index' : '10000',
			'position' : 'absolute',
			'margin-left' : 0,
			'margin-top' : 0,
			'display' : 'none'
		}
	});

	module.exports = function(content, options){
		if(!options && $.isPlainObject(content)){
			options = content;
		}else{
			options = options || {};
			options.content = content;
		}

		var conf = $.extend({
			title : '提示',
			styleOk : '确定',
			relativeLayer : null,
			ok : $.noop,
			cancel : null
		}, options);

		var dialog = cache.get();
		dialog.role('title').html(conf.title);
		dialog.role('content').html(conf.content);
		dialog.role('ok').html(conf.styleOk);

		dialog.on('ok', conf.ok);
		if($.type(conf.cancel) === 'function'){
			dialog.on('cancel', conf.cancel);
		}else{
			dialog.on('cancel', conf.ok);
		}

		var relativeLayer = conf.relativeLayer;
		var showRelativeLayer = function(){
			if(relativeLayer && $.isFunction(relativeLayer.show)){
				relativeLayer.show();
			}
		};
		var hideRelativeLayer = function(){
			if(relativeLayer && $.isFunction(relativeLayer.hide)){
				relativeLayer.hide();
			}
		};

		//重用对话框时，清除了对话框自动绑定的 ok, cancel 事件
		//所以这里需要重新绑定一次
		dialog.on('ok', function(){
			showRelativeLayer();
			dialog.hide();
		});

		dialog.on('cancel', function(){
			showRelativeLayer();
			dialog.hide();
		});

		dialog.show();
		hideRelativeLayer();
	};

});
