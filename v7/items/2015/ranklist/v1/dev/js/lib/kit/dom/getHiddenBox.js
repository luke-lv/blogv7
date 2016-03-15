/**
页面统一隐藏容器工具
@module lib/kit/dom/getHiddenBox
@example
var $getHiddenBox = require('lib/kit/dom/getHiddenBox');
$getHiddenBox().append('<div></div>');
**/
define('lib/kit/dom/getHiddenBox',function(require,exports,module){

	var $ = require('lib');

	var hiddenNode;

	var getHiddenBox = function(){
		if(!hiddenNode){
			hiddenNode = $('<div></div>').css({
				'display' : 'none',
				'position' : 'absolute',
				'top' : '-9999px',
				'left' : '-9999px'
			}).appendTo($('body'));
		}
		return hiddenNode;
	};

	module.exports = getHiddenBox;
});
