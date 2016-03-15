/**
用户模型
**/

define('mods/model/user',function(require,exports,module){
	var $ = require('lib');
	var $channelGlobal = require('mods/channel/global');
	var $model = require('lib/mvc/model');

	var user = new $model({
		uid : ''
	});

	user.getUinfo = function(){
		var uinfo = null;
		if(window.sinaSSOController){
			uinfo = window.sinaSSOController.getSinaCookie();
		}
		return uinfo;
	};

	user.isLogin = function(){
		return !!user.getUinfo();
	};

	user.on('change:uid', function(){
		//仅在无刷新切换用户时需要用到此广播
		//实际在当前项目中，所有加载了页头的页面，用户切换登录状态都会刷新页面
		//后端同事目前不想修改如此多地方
		//所以目前的业务组件都不需要绑定这个广播
		$channelGlobal.trigger('user-change');
	});

	var checkUser = function(){
		var uinfo = user.getUinfo();
		if(uinfo){
			user.set('uid', uinfo.uid);
		}
	};

	checkUser();

	var loginLayer = window.SINA_OUTLOGIN_LAYER;
	if(loginLayer){
		loginLayer.register('login_success',function(){
			checkUser();
		}).register('logout_success',function(){
			checkUser();
		});
	}

	$channelGlobal.on('need-login', function(){
		$(document).trigger('need-login');
	});

	module.exports = user;

});
