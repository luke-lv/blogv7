/**
分享到微博
**/
define('mods/view/shareToWeibo', function (require, exports, module){
	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var locationHref = window.location.href;
	var ShareToWeibo = $view.extend({
		defaults: {
			node: document.body,
			ralateUid: '3839222393',
			width: 615,
			height: 505  
		},
		events: {
			'[role="shareTo-weibo"] click': 'shareTo'
		},
		shareTo: function (ev){
			ev.preventDefault();
			var tar = $(ev.currentTarget);
			console.log(locationHref);
			window.open([
				'http://service.weibo.com/share/share.php?url=',
				locationHref,
				'&appkey=&title=',
				tar.attr('data-title'),
				'(组图)&pic=',
				encodeURIComponent(tar.attr('data-src')),
				'&language=zh_cn'
			].join(''), '_blank', 'width='+ this.conf.width +',height=' + this.conf.height);
		}
	});

	module.exports = function (opts){
		return new ShareToWeibo(opts);
	};
});