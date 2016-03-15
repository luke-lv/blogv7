/**
屏幕遮罩
**/

define('mods/ui/screenMask',function(require,exports,module){

	var $ = require('lib');
	var $mask = require('mods/ui/mask');
	var $body = $(document.body);

	var mask = new $mask({
		template : '<div class="ui-screen-mask"></div>',
		target : 'screen',
		styles : {
			'z-index' : 9999,
			'position' : 'fixed',
			'width' : '100%',
			'height' : '100%',
			'opacity' : '0.6',
			'background' : '#000',
			'display' : 'none'
		}
	});

	mask.observed = [];
	mask.check = function(){
		if(this.observed.length){
			this.show();
		}else{
			this.hide();
		}
	};

	var prevWidth = 0;
	//屏幕遮罩开启时，禁止屏幕滚动
	mask.on('show', function(){
		prevWidth = $body.width();
		$body.css('width', prevWidth + 'px');
		$body.css('overflow', 'hidden');
	});

	mask.on('hide', function(){
		prevWidth = 0;
		$body.css('overflow', '');
		$body.css('width', '');
	});

	module.exports = mask;

});


