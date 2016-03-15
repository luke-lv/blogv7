/**
 * @fileoverview JsLoad 说明
 * 通过 HTML SCRIPT 标签异步加载数据，优点：跨域读取数据。
 * @version 1.0
 * @since 2008.08.26
 * @description :
 *     Script Loader loads data as string from any domain.
 *
 *     The web service deal with request sent from Script Loader always receives
 *     a parameter named of 'requestId' with unique value to identify current
 *     reuqest. The service must send the value of 'requestId' back as the 1st
 *     piese of data 
 *
 *     responsed data looks like below:
 *     <code>
 *           var requestId_738473289432 = { "code" : "00006", "data" : "Response Data"};
 *     </code>
 *
 *     Responded text can be plane text or serialized xml document. And in the
 *     2nd case,  Xml-String will be convert back to xml-document automatically
 *     which will be sent to user defined listener as the 2nd argument.
 *
 *     通过 script 标签以 get 方式载入任何域下的数据。
 *     返回数据的格式必须按照给定的格式输出，包括一个JsLoad发送的请求 id 和返回数据
 *
 *     发送的请求格式：
 *        http://host/path/?name=value&name=value&varname=requestId_738473289432
 *        注：其中 varname 由 JsLoad 自动添加
 *
 *     返回数据格式：
 *       var requestId_738473289432 = { "code" : "00006", "data" : "Response Data" };
 *       注：requestId_738473289432 是地址请求中带过去的参数，变量值是返回的结果，可以是字符串、数组、Json 对象等格式。
 *
 * @example

        Utils.Io.JsLoad.request(url, {
          onComplete  : Function (Array responsedData),
          onException : Function ();
          timeout : 30000
        });

        Utils.Io.JsLoad.request(url, {
          onComplete  : Function (Array responsedData)
        });

        Utils.Io.JsLoad.request(url, {});

		Utils.Io.JsLoad.request([{ "url" : "http://.../?"}, { "url" : "http://.../?"}], {
          onComplete  : Function (Array responsedData)
        });
 * 
 * @author L.Ming | liming1@staff.sina.com.cn
 */
/***************************************
 * 变更记录
 * 
 * 09.06.09 FlashSoft | fangchao@staff.sian.com.cn
 * 	重写JSLoad方法,实现自实例功能,避免参数覆盖问题,方法保持原有的不变
 * 
 **************************************/

$import("sina/utils/io/_io.js");
$import("sina/sina.js");
$import("sina/core/system/parseParam.js");
$import("sina/core/system/br.js");
$import("sina/utils/url.js");
$import("sina/core/string/encodeDoubleByte.js");

Utils.Io.JsLoad = {};
(function () {
	function createScripts (oOpts, oCFG) {
		
		processUrl(oOpts, oCFG);
		
		var urls = oOpts.urls;
		var i, len = urls.length;
		
		for(i = 0; i < len; i ++ ) {
			var js = $C("script");
			
			js.src = urls[i].url;
			js.charset = urls[i].charset;
			js.onload = js.onerror = js.onreadystatechange = function () {
				if (js && js.readyState && js.readyState != "loaded" && js.readyState != "complete") {
					return;
				}
				oCFG.script_loaded_num ++;
				//清理script标记
				js.onload = js.onreadystatechange = js.onerror = null;
                // 默认删除脚本dom 微软kb2829530更新包导致ie6-7 crash 
                // http://sria.sinaapp.com/test/crash/ie7-load-script-crash/test.html
                if ((!1) !== oOpts.isRemove) {
                    js.src = "";
                    js.parentNode.removeChild(js);
                }
				js = null; 
			};
			document.getElementsByTagName("head")[0].appendChild(js);
		}
	}
	
	function processUrl(oOpts, oCFG) {
		var urls = oOpts.urls;
		var get_hash = oOpts.GET;
		
		var i, len = urls.length;
		var key, url_cls, varname, rnd;
		for (i = 0; i < len; i++) {
			rnd =  window.parseInt(Math.random() * 100000000);
			url_cls = new Utils.Url(urls[i].url);
			
			for(key in get_hash) {
				if(oOpts.noencode == true) {
					url_cls.setParam(key, get_hash[key]);
				}
				else {
					url_cls.setParam(key, Core.String.encodeDoubleByte(get_hash[key]));
				}
			}
			
			varname = url_cls.getParam("varname") || "requestId_" + rnd;
			
			if (oOpts.noreturn != true) {
				url_cls.setParam("varname", varname);
			}

			if (oOpts.returnType == 'jsonp'){
				// 新增jsonp方式请求支持
				var name = url_cls.getParam("callback") || "callback_" + rnd;
				var callback = 'script_callbackes.'+name;
				url_cls.setParam("callback", callback);

				// oCFG.script_callbackes.push(callback);

				if (!window.script_callbackes){
					window.script_callbackes = [];
				}
				window.script_callbackes[name] = function(res){
					oCFG.is_loadcomplete = true;
					delete window.script_callbackes[name];
					if (oCFG.timeout_flag != null){
						clearTimeout(oCFG.timeout_flag);
					}
					if (oCFG.is_timeout){
						return;
					}
					if (oOpts.onComplete != null){
						oOpts.onComplete(res);
					}
				}
			}

			oCFG.script_var_arr.push(varname);
			urls[i].url = url_cls.toString();
			urls[i].charset = urls[i].charset || oOpts.charset; 
		}
	}
	
	function ancestor (aUrls, oOpts) {
		
		var _opts = {
            isRemove : !0,
			urls: [],
			charset: "utf-8",
			noreturn: false,
			noencode: false,
			returnType: '',
			timeout: -1,
			POST: {},
			GET: {},
			onComplete: null,
			onException: null
		};
		
		var _cfg = {
			script_loaded_num: 0,
			is_timeout: false,
			is_loadcomplete: false,
			script_var_arr: [],
			timeout_flag: null
		};
		
		_opts.urls = typeof aUrls == "string"? [{url: aUrls}]: aUrls;
		
		Core.System.parseParam(_opts, oOpts);
		
		createScripts(_opts, _cfg);
		
		// 定时检查完成情况
		if (_opts.returnType != 'jsonp'){
			(function () {
				
				if (_opts.noreturn == true && _opts.onComplete == null) {
					return;
				}
				var i, data = [];
				// 全部完成
				if (_cfg.script_loaded_num == _opts.urls.length) {
					_cfg.is_loadcomplete = true;
					if (_opts.onComplete != null) {	
						for(i = 0; i < _cfg.script_var_arr.length; i ++ ) {
							data.push(window[_cfg.script_var_arr[i]]);
						}
						if(_cfg.script_var_arr.length < 2) {
							_opts.onComplete(data[0]);
						}
						else {
							_opts.onComplete(data);
						}
					}
					return;
				}
				// 达到超时
				if(_cfg.is_timeout == true) {
					return;
				}
				setTimeout(arguments.callee, 50);
			})();
		}

		// 超时处理
		if(_opts.timeout > 0) {
			_cfg.timeout_flag = setTimeout(function () {
									if (_cfg.is_loadcomplete != true) {
					//					console.log("load is timeout");
										if (_opts.onException != null) {
											_opts.onException();
										}
										_cfg.is_timeout = true;
									}
								}, _opts.timeout);
		}
	}
	
	Utils.Io.JsLoad.request = function (aUrls, oOpts) {
		new ancestor(aUrls, oOpts);
	};	
})();