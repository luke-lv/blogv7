/**
placeholder兼容性处理
**/
define('mods/kit/dom/placeholder',function(require,exports,module){

	var $ = require('lib');
	var support_placeholder = 'placeholder' in $('input').get(0);

	module.exports = function(node){
		if(support_placeholder){return;}
		node = $(node);

		var text = node.attr('placeholder');
		var checkBlur = function(){
			if(!node.val()){
				node.val(text);
				node.css('color', '#a1a1a1');
			}else{
				node.css('color', '');
			}
		};

		node.on('blur', checkBlur);
		node.on('focus', function(){
			if(node.val() === text){
				node.val('');
				node.css('color', '');
			}
		});

		checkBlur();
	};

});

