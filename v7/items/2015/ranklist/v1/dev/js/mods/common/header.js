/**
公共页头
**/

define('mods/common/header',function(require,exports,module){

	var $ = require('lib');
	var $notification = require('mods/model/notification');

	var root = $('#all-header');

	$(function(){
		//for unread

		var nfNode = root.find('.mail');

		var duration = 800;

		var fadeIn = function(){
			nfNode.animate({
				'opacity' : 1
			}, duration, fadeOut);
		};

		var fadeOut = function(){
			if(flashSwitch){
				nfNode.animate({
					'opacity' : 0.6
				}, duration, fadeIn);
			}
		};

		var startFlash = function(){
			flashSwitch = true;
			fadeOut();
		};

		var stopFlash = function(){
			flashSwitch = false;
		};

		var renderUnread = function(){
			var count = $notification.get('unread');
			var text = count > 9 ? '9+' : count ;
			if(count > 0){
				nfNode.html(text);
				nfNode.addClass('has_mail');
				startFlash();
			}else{
				nfNode.html('');
				nfNode.removeClass('has_mail');
				stopFlash();
			}
		};

		renderUnread();

		$notification.on('change:unread', renderUnread);
	});
	
});


