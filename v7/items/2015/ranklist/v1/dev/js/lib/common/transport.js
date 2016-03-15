/**
通用接口组件
@module lib/common/transport
**/
define('lib/common/transport',function(require,exports,module){

	var $ = require('lib');
	var $network = require('lib/kit/env/network');

	var Request = (function(){

		var abort = function(){
			var xhr = this.xhr;
			var conf = this.conf;
			if(
				xhr &&
				conf.dataType !== 'jsonp' &&
				conf.dataType !== 'script'
			){
				xhr.abort();
			}
		};

		var detach = function(){
			var options = this.options;
			options.onComplete = $.noop;
			options.onSuccess = $.noop;
			options.onFailure = $.noop;
		};

		var success = function(rs, status){
			status = status || {};
			var options = this.options;
			var key = status.cacheKey;
			if(key && status.type !== 'cache' && this.conf.cache){
				this.cache[key] = rs;
			}
			options.onSuccess(rs, status);
		};

		var failure = function(rs, status){
			var options = this.options;
			options.onFailure(rs, status);
		};

		var complete = function(rs, status){
			var conf = this.conf;
			var options = this.options;
			status = status || {};

			this.requesting = false;
			if(this.timer){
				clearTimeout(this.timer);
				this.timer = null;
			}

			options.onComplete(rs, status);

			if(status.error){
				options.onFailure(rs, status);
			}else{
				if($.type(options.verify) === 'function'){
					if(options.verify(rs, conf, options)){
						success.call(this, rs, status);
					}else{
						failure.call(this, rs, status);
					}
				}else{
					if(!rs){
						status.error = 'empty';
						failure.call(this, rs, status);
					}else{
						success.call(this, rs, status);
					}
				}
			}

			detach.call(this);
		};

		var send = function(){
			//用于发给$.ajax的选项
			var conf = this.conf;
			//用于配置请求额外操作的选项
			var options = this.options;

			if(this.requesting){return;}
			this.requesting = true;

			//判断是否联网
			if(!$network.onLine()){
				complete.call(this, null, {
					error : 'offline'
				});
				return;
			}

			//检查缓存
			var key = [
				options.name,
				conf.url,
				JSON.stringify(conf.data)
			].join();

			if(this.cache[key] && conf.cache){
				complete.call(this, this.cache[key], {
					cacheKey : key,
					type : 'cache'
				});
				return;
			}

			conf.success = function(data, type, xhr){
				var status = {
					type : type,
					xhr : xhr
				};
				if(this.conf.cache){
					status.cacheKey = key;
				}
				complete.call(this, data, status);
			}.bind(this);

			conf.error = function(xhr, type, error){
				complete.call(this, null, {
					error : error,
					type : type,
					xhr : xhr
				});
			}.bind(this);

			//超时处理
			if(options.timeout){
				this.timer = setTimeout(function(){
					this.timer = null;
					if(this.requesting){
						complete.call(this, null, {
							error : 'timeout',
							xhr : this.xhr
						});
						abort.call(this);
					}
				}.bind(this), options.timeout);
			}

			this.xhr = $.ajax(conf);
		};

		var Req = function(conf, options){
			this.conf = $.extend({}, conf);
			this.options = $.extend({}, options);
			this.cache = $.isPlainObject(options.cache) ? options.cache : {};
			this.timer = null;
			this.xhr = null;
			send.call(this);
		};

		Req.prototype = {
			clearCache : function(){
				this.cache = {};
			},
			//注意：取消请求未必能实际的阻止信息传递到服务端，尤其在jsonp的情况下。
			//取消请求主要用于打断超时计时，立即获取一个标记为 'cancel' 的请求结果
			cancel : function(){
				if(this.requesting){
					complete.call(this, null, {
						error : 'cancel',
						xhr : this.xhr
					});
					abort.call(this);
				}
			}
		};

		return Req;
	})();

	// Transport
	// -----------------
	// 在jQuery.ajax基础上，进一步粉装请求对象

	//没有列举全部$.ajax的选项，可根据需要自行添加其他选项
	var ajaxDefaults = {
		url : '',			//请求地址
		type : 'POST',		//请求方式 ['POST','GET','PUT','DELETE']
		dataType : 'json',	//预期服务器返回的数据类型 ['text','xml','html','script','json','jsonp']
		cache : false,		//是否缓存数据

		//下列属性在dataType为jsonp模式下启用
		jsonp : 'callback',			//jsonp请求参数名称
		scriptCharset : 'utf-8'		//script的编码
	};

	//下面的属性不会传递给$.ajax
	var transDefaults = {
		name : '',					//接口名称
		timeout : 0,				//超时时间(ms)，为0则取消超时判断
		onComplete : $.noop,		//无论成功失败，请求后都会执行的回调 $.noop()函数是一个空函数，它什么也不做。
		onSuccess : $.noop,			//成功后执行的回调
		onFailure : $.noop,			//失败后执行的回调
		//返回数据有效性验证
		verify : function(rs, conf, options){
			return !!rs;
		}
	};

	var Transport = function(options){
		this.defaults = $.extend({}, ajaxDefaults, transDefaults, options);
		this.cache = {};
	};

	$.extend(Transport.prototype, {
		//执行请求
		request : function(options){
			var conf = $.extend({}, this.defaults, options);

			var transOptions = {};
			Object.keys(transDefaults).forEach(function(key){
				transOptions[key] = conf[key] || transDefaults[key];
				delete conf[key];
			});

			if(conf.cache === true){
				transOptions.cache = this.cache;
			}else if(conf.cache){
				transOptions.cache = $.isPlainObject(conf.cache) ? conf.cache : this.cache;
				conf.cache = true;
			}

			this.req = new Request(conf, transOptions);

			return this.req;
		},
		destroy : function(){
			if(this.req){
				this.req.cancel();
				delete this.req;
			}
		}
	});

	module.exports = Transport;
});

