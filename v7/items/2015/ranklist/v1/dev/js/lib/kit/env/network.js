/**
网络环境检测
@module lib/kit/env/network
**/

define('lib/kit/env/network',function(require,exports,module){

	var supportOnlineCheck = 'onLine' in navigator;

	module.exports = {
		/**
		判断是否联网
		@return {boolean} true/false
		**/
		onLine : function(){
			return supportOnlineCheck ? navigator.onLine : true;
		}
	};

});


