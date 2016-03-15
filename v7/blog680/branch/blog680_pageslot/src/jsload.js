/**
 * @fileoverview 跨域调用接口读取数据
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

SinaBlog680.jsload = {};

SinaBlog680.Url = function (url){
    url = url || "";
    this.url = url;
	this.query = {};
	this.parse();
};

SinaBlog680.Url.prototype = {
	/**
	 * 解析URL，注意解析锚点必须在解析GET参数之前，以免锚点影响GET参数的解析
	 * @param{String} url? 如果传入参数，则将会覆盖初始化时的传入的url 串
	 */
	parse : function (url){
		if (url) {
			this.url = url;
		}
	    this.parseAnchor();
	    this.parseParam();
	},
	/**
	 * 解析锚点 #anchor
	 */
	parseAnchor : function (){
	    var anchor = this.url.match(/\#(.*)/);
	    anchor = anchor ? anchor[1] : null;
	    this._anchor = anchor;
	    if (anchor != null){
	      this.anchor = this.getNameValuePair(anchor);
	      this.url = this.url.replace(/\#.*/,"");
	    }
	},
	
	/**
	 * 解析GET参数 ?name=value;
	 */
	parseParam : function (){
	    var query = this.url.match(/\?([^\?]*)/);
	    query = query ? query[1] : null;
	    if (query != null){
	      this.url = this.url.replace(/\?([^\?]*)/,"");
	      this.query = this.getNameValuePair(query);
	    }
	 },
	/**
	 * 目前对json格式的value 不支持
	 * @param {String} str 为值对形式,其中value支持 '1,2,3'逗号分割
	 * @return 返回str的分析结果对象
	 */
	getNameValuePair : function (str){
	    var o = {};
	    str.replace(/([^&=]*)(?:\=([^&]*))?/gim, function (w, n, v) {
	     	if(n == ""){return;}
	      	//v = v || "";//alert(v)
	     	//o[n] = ((/[a-z\d]+(,[a-z\d]+)*/.test(v)) || (/^[\u00ff-\ufffe,]+$/.test(v)) || v=="") ? v : (v.j2o() ? v.j2o() : v);
	    	o[n] = v || "";
		});
	    return o;
	 },
	 /**
	  * 从 URL 中获取指定参数的值
	  * @param {Object} sPara
	  */
	 getParam : function (sPara) {
	 	return this.query[sPara] || "";
	 },
	/**
	 * 清除URL实例的GET请求参数
	 */
	clearParam : function (){
	    this.query = {};
	},
	
	/**
	 * 设置GET请求的参数，当个设置
	 * @param {String} name 参数名
	 * @param {String} value 参数值
	 */
	setParam : function (name, value) {
	    if (name == null || name == "" || typeof(name) != "string") {
			throw new Error("no param name set");
		}
	    this.query = this.query || {};
	    this.query[name]=value;
	},
	
	/**
	 * 设置多个参数，注意这个设置是覆盖式的，将清空设置之前的所有参数。设置之后，URL.query将指向o，而不是duplicate了o对象
	 * @param {Object} o 参数对象，其属性都将成为URL实例的GET参数
	 */
	setParams : function (o){
	    this.query = o;
	},
	
	/**
	 * 序列化一个对象为值对的形式
	 * @param {Object} o 待序列化的对象，注意，只支持一级深度，多维的对象请绕过，重新实现
	 * @return {String} 序列化之后的标准的值对形式的String
	 */
	serialize : function (o){
		var ar = [];
		for (var i in o){
		    if (o[i] == null || o[i] == "") {
				ar.push(i + "=");
			}
			else {
				ar.push(i + "=" + o[i]);
			}
		}
		return ar.join("&");
	},
	/**
	 * 将URL对象转化成为标准的URL地址
	 * @return {String} URL地址
	 */
	toString : function (){
	    var queryStr = this.serialize(this.query);
	    return this.url + (queryStr.length > 0 ? "?" + queryStr : "") 
	                    + (this.anchor ? "#" + this.serialize(this.anchor) : "");
	},
	
	/**
	 * 得到anchor的串
	 * @param {Boolean} forceSharp 强制带#符号
	 * @return {String} 锚anchor的串
	 */
	getHashStr : function (forceSharp){
	    return this.anchor ? "#" + this.serialize(this.anchor) : (forceSharp ? "#" : "");
	}
};

function parseParam(oSource, oParams) {
	var key;
	try {
		if (typeof oParams != "undefined") {
			for (key in oSource) {
				if (oParams[key] != null) {
					oSource[key] = oParams[key];
				}
			}
		}
	}
	finally {
		key = null;
		return oSource;
	}
}

function encodeDoubleByte(str) {
	if(typeof str != "string") {
		return str;
	}
	return encodeURIComponent(str);
}

function processUrl(oOpts, oCFG) {
	var urls = oOpts.urls;
	var get_hash = oOpts.GET;
	
	var i, len = urls.length;
	var key, url_cls, varname, rnd;
	for (i = 0; i < len; i++) {
		rnd =  window.parseInt(Math.random() * 100000000);
		url_cls = new SinaBlog680.Url(urls[i].url);
		
		for(key in get_hash) {
			if(oOpts.noencode == true) {
				url_cls.setParam(key, get_hash[key]);
			}
			else {
				url_cls.setParam(key, encodeDoubleByte(get_hash[key]));
			}
		}
		
		varname = url_cls.getParam("varname") || "requestId_" + rnd;
		
		if (oOpts.noreturn != true) {
			url_cls.setParam("varname", varname);
		}
		
		oCFG.script_var_arr.push(varname);
		urls[i].url = url_cls.toString();
		urls[i].charset = urls[i].charset || oOpts.charset; 
	}
}

function createScripts(oOpts, oCFG) {
	processUrl(oOpts, oCFG);
		
	var urls = oOpts.urls;
	var i, len = urls.length;
	
	for(i = 0; i < len; i ++ ) {
		
		var js = document.createElement('script');

		js.src = urls[i].url;
		js.charset = urls[i].charset;
		js.onload = js.onerror = js.onreadystatechange = function () {
			if (js && js.readyState && js.readyState != "loaded" && js.readyState != "complete") {
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
}

//跨域调用接口获取数据
function jsload(aUrls, oOpts) {
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
	
	_opts.urls = typeof aUrls == "string"? [{url: aUrls}]: aUrls;
	

	parseParam(_opts, oOpts);

	createScripts(_opts, _cfg);

	// 定时检查完成情况
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
	
	// 超时处理
	if(_opts.timeout > 0) {
		setTimeout(function () {
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

SinaBlog680.jsload.request = function(aUrls, oOpts) {
	new jsload(aUrls, oOpts);
};