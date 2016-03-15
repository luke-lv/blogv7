/**
confirm对话框
**/

define('mods/common/confirm',function(require,exports,module){

	var $ = require('lib');
	var $reuse = require('mods/dialog/reuse');

	var TPL = {};

	TPL.dialog = [
		'<div class="remove_photo psfx up_base">',
			'<h2 class="clearfix">',
				'<span class="fl" role="title"></span>',
				'<a class="fr" href="javascript:;" data-action="cancel"></a>',
			'</h2>',
			'<div class="creatForm" style="padding:30px 0 0 0;">',
				'<div class="tit clearfix" role="content"></div>',
				'<div class="submit_button" style="margin-left:130px;">',
				'<a role="ok" data-action="ok" type="button" class="sub1 opc_btn" style="background:#c00;text-indent:0;padding: 10px 20px;">确定</a>',
				'<a role="cancel" data-action="cancel" type="button" class="sub2 opc_btn" style="background:#ddd;padding: 10px 20px;">取消</a>',
				'</div>',
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
			title : '',
			styleOk : '确定',
			styleCancel : '取消',
			ok : $.noop,
			cancel : $.noop
		}, options);

		var dialog = cache.get();
		dialog.role('title').html(conf.title);
		dialog.role('content').html(conf.content);
		dialog.role('ok').html(conf.styleOk);
		dialog.role('cancel').html(conf.styleCancel);

		dialog.on('ok', conf.ok);
		dialog.on('cancel', conf.cancel);

		//重用对话框时，清除了对话框自动绑定的 ok, cancel 事件
		//所以这里需要重新绑定一次
		dialog.on('ok', function(){
			dialog.hide();
		});

		dialog.on('cancel', function(){
			dialog.hide();
		});

		dialog.show();
	};

});
