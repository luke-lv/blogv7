$import("sina/utils/io/_io.js");
$import("sina/sina.js");
$import("sina/core/system/parseParam.js");
$import("sina/core/system/br.js");
$import("sina/utils/url.js");
$import("sina/core/string/encodeDoubleByte.js");
if (typeof scope.msnGuideSupport == 'undefined') {
	scope.msnGuideSupport = {};
}
/**
 * 扩展自Utils.Io.JsLoad 增加了超时功能
 */
scope.msnGuideSupport.JsLoadEx = {};
(function(){
	function createScripts(oOpts, oCFG){
		processUrl(oOpts, oCFG);
		
		var urls = oOpts.urls;
		var i;
		var len = urls.length;
		var js;
		
		for(i=0; i<len; i++){
			js = $C("script");
			js.src = urls[i].url;
			js.charset = urls[i].charset;
			js.onload = js.onerror = js.onreadystatechange = function(){
				if(js && js.readyState && js.readyState!="loaded" && js.readyState!="complete"){
					return;
				}
				oCFG.script_loaded_num ++;
				
				//清理script标记
				js.onload = js.onreadystatechange = js.onerror = null;
				js.src = "";
				js.parentNode.removeChild(js);
				js = null;
			};
			document.getElementsByTagName("head")[0].appendChild(js);
		}
		
		return js;
	}
	
	function processUrl(oOpts, oCFG){
		var urls = oOpts.urls;
		var get_hash = oOpts.GET;
		
		var i, len = urls.length;
		var key, url_cls, varname, rnd;
		for(i=0; i<len; i++){
			rnd = window.parseInt(Math.random() * 100000000);
			url_cls = new Utils.Url(urls[i].url);
			
			for(key in get_hash){
				if(oOpts.noencode == true){
					url_cls.setParam(key, get_hash[key]);
				}else{
					url_cls.setParam(key, Core.String.encodeDoubleByte(get_hash[key]));
				}
			}
			
			varname = url_cls.getParam("varname") || "requestId_" + rnd;
			if(oOpts.noreturn != true){
				url_cls.setParam("varname", varname);
			}
			
			oCFG.script_var_arr.push(varname);
			urls[i].url = url_cls.toString();
			urls[i].charset = urls[i].charset || oOpts.charset; 
		}
	}
	
	function ancestor(aUrls, oOpts){
		var _opts = {
			urls: [],
			charset: "utf-8",
			noreturn: false,
			noencode: false,
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
			script_var_arr: []
		};
		
		var timer = 0;			// 超时计时器
		
		_opts.urls = typeof aUrls == "string"? [{url: aUrls}]: aUrls;
		
		Core.System.parseParam(_opts, oOpts);
		var scriptNode = createScripts(_opts, _cfg);
		
		// 定时检查完成情况
		(function(){
			if(_opts.noreturn==true && _opts.onComplete==null){
				return;
			}
			var i;
			var data = [];
			
			// 全部完成
			if(_cfg.script_loaded_num == _opts.urls.length){
				_cfg.is_loadcomplete = true;
				if(_opts.onComplete != null){
					clearTimeout(timer);
					try{
						for(i = 0; i < _cfg.script_var_arr.length; i ++ ){
							data.push(window[_cfg.script_var_arr[i]]);
						}
						if(_cfg.script_var_arr.length < 2){
							_opts.onComplete(data[0]);
						}else{
							_opts.onComplete(data);
						}
					}catch(e){
						trace("jsload: "+e);
						if(_opts.onException){
							_opts.onException(e);
						}
					}
				}
				return;
			}
			
			// 达到超时
			if(_cfg.is_timeout == true){
				return;
			}
			setTimeout(arguments.callee, 50);
		})();
		
		// 超时处理
		if(_opts.timeout > 0){
			timer = setTimeout(function(){
				if(_cfg.is_loadcomplete != true){
					if(_opts.onException != null){
						_opts.onException("timeout");
						scriptNode.src = "http://simg.sinajs.cn/blog7style/images/common/loading.gif?t="+(new Date().getTime());
					}
					_cfg.is_timeout = true;
				}
			}, _opts.timeout);
		}
		
		return scriptNode;
	}
	
	scope.msnGuideSupport.JsLoadEx.request = function(aUrls, oOpts){
		return new ancestor(aUrls, oOpts);
	};
})();