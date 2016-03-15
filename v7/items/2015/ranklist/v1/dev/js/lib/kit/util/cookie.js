define('lib/kit/util/cookie', function(require,exports,module){

    var $ = require('lib');

	/**
	设置、获取cookie
	@exports lib/kit/util/cookie
	**/
	var Cookie = {
		/**
		将数据保存到cookie
		@param {string} sKey cookie名称
		@param {string} sValue 要存储的值

		@param {object} [oOpts] 存储选项
		@param {string} oOpts.expire 过期时间(小时)
		@param {string} [oOpts.path='/'] 路径
		@param {string} [oOpts.domain] 域名
		@param {boolean} [oOpts.secure=false] 是否为安全连接
		@param {boolean} [oOpts.encode=true] 存储的数据是否自动用escape编码
		**/
		set: function(sKey, sValue, oOpts){
			var arr = [];
			var d, t;
			var cfg = $.extend({
				'expire': null,
				'path': '/',
				'domain': null,
				'secure': false,
				'encode': true
			}, oOpts);

			if (cfg.encode === true) {
				sValue = escape(sValue);
			}
			arr.push(sKey + '=' + sValue);

			if (cfg.path !== null) {
				arr.push('path=' + cfg.path);
			}
			if (cfg.domain !== null) {
				arr.push('domain=' + cfg.domain);
			}
			if (cfg.secure) {
				arr.push('secure');
			}
			if (cfg.expire !== null) {
				d = new Date();
				t = d.getTime() + cfg.expire * 3600000;
				d.setTime(t);
				arr.push('expires=' + d.toGMTString());
			}
			document.cookie = arr.join(';');
		},
		/**
		获取cookie中存储的数据
		@param {string} sKey cookie名称
		@return {string} 存储的数据
		**/
		get: function(sKey){
			sKey = sKey.replace( /([\.\[\]\$])/g, '\\$1');
			var rep = new RegExp(sKey + '=([^;]*)?;', 'i');
			var co = document.cookie + ';';
			var res = co.match(rep);
			if (res) {
				return res[1] || "";
			} else {
				return '';
			}
		},
		/**
		移除cookie中存储的数据
		@param {string} sKey cookie名称
		@param {object} [oOpts] 同时需要设置的选项
		**/
		remove: function(sKey, oOpts){
			oOpts = oOpts || {};
			oOpts.expire = -10;
			this.set(sKey, '', oOpts);
		}
	};

	module.exports = Cookie;

});

