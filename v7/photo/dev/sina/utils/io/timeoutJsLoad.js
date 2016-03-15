$import("sina/utils/io/_io.js");
$import("sina/core/system/parseParam.js");
$import("sina/utils/url.js");
$import("sina/core/string/encodeDoubleByte.js");
/**
 * script事件测试
 * 
 * 测试浏览器版本
 * firefox(3.6.13) chrome(5.0.375.99) safari(5.0.2) opera(11.00)
 * 
 * 1 http状态码:500
 * firefox onerror
 * ie6,7,8 onreadystatechage(loading,loaded)
 * chrome onload
 * safari onload
 * opera  不触发任何事件
 *  
 * 2 http状态码:200
 * firefox onload
 * ie6,7,8 onreadystatechage(loading,loaded)
 * chrome onload
 * safari onload
 * opera  onload onreadystatechage(loaded)
 *	
 * 3 http状态码:404
 * firefox onerror
 * ie6,7,8 onreadystatechage(loading,loaded)
 * chrome onerror
 * safari onerror
 * opera  不触发任何事件
 *	
 * @fileoverview 通过script跨域读取数据 扩展自Utils.Io.JsLoad
 * 新增了超时功能
 * 设置超时的2种方法:
 * 1)设置超时时间 如果服务器端没有在超时时间内响应 则取消脚本加载 并执行超时函数
 * 2)手动取消脚本加载 并执行超时函数
 * 注:这里的取消脚本加载并不是abort掉http请求
 * 	  而是修改状态参数 不再执行回调函数
 *    所以还要受到浏览器对同一host的最大http连接的限制
 *    目前各浏览器对同一host最大http连接为:
 *    ie(6,7,8):10
 *    ie下查看方法:
 *    进入注册表
 *    HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\InternetSettings\MaxConnectionsPerServer
 *    如果没此项则按ie默认设置
 *    
 *    firefox:6
 *    firefox下查看方法:
 *    在浏览器地址栏输入about:config
 *    network.http.max-persistent-connections-per-server 这一项对应的值
 *    
 *    chrome:6(手动测试)
 *    safari:6(手动测试)
 *    opera:8(手动测试)
 *    
 * 取消了支持加载多个url功能(在opera下如返回500或404状态码 加载的script不响应任何事件 计算加载脚本的定时器则不会停止) 
 * 
 * @author zhangkai2@staff.sina.com.cn
 * @create 2011-1-4
 * @update 2011-6-22  支持jsonp
 * 
 * @param {String} url   加载的url 必填
 * @param {Object} opts
 * opts所支持属性
 * charset{String}:             加载script编码 默认utf-8
 * noreturn{Boolean}:           是否需要服务器端返回数据 true不需要 false需要  默认false 这个属性只在type为blogScript时有效
 * noencode{Boolean}:           是否对参数值进行encodeURIComponent编码 true不编码 false编码 默认false           
 * timeout{Number}:             超时时间 如果小于0则禁用超时功能 默认禁用
 * GET{Object}:                 要添加到url中的参数
 * onComplete(data){Function}:  script加载完成执行函数
 * data:服务器端返回数据
 * 
 * onException{Function}:       script加载超时执行函数
 * type{String}                 与服务器端通信方式   值可以为:jsonp或blogScript 默认blogScript
 * jsonpParamName{String}       jsonp请求方式 与服务器端约定的参数名  默认callback
 * 
 * 
 * demo:
 *  var jsLoadInstance=new Utils.Io.TimeoutJsLoad("http://localhost:8080/examples/Jsonp.jsp",{
 *			charset:"utf-8",
 *			noreturn:false,
 *			noencode:false,
 *			timeout:100000,
 *			onComplete:function(data){
 *				alert(data);
 *			},
 *			onException:function(){
 *				alert("timeout");
 *			},
 *			GET:{
 *				name1:"张三",
 *				name2:"李四"
 *			},
 *			type:"jsonp",
 *			jsonpParamName:"callback"
 *		});
 *
 *	 //手动取消请求	
 *   jsLoadInstance.abortRequest();
 */
Utils.Io.TimeoutJsLoad=function(url,opts){
	this._opts = {
	    //加载script的url
		url:"",
		//加载script编码
		charset: "utf-8",
		//是否需要服务器端返回数据
		noreturn: false,
	    //是否对参数值进行encodeURIComponent编码
		noencode: false,            
	    //超时时间
		timeout: -1,
		//要添加的参数和参数值
		GET: {},
		//加载完成函数
		onComplete: null,
		//加载超时函数
		onException: null,
		//与服务器端通信方式   值可以为:jsonp或blogScript
		type:"blogScript",
		//jsonp请求方式 与服务器端约定的参数名  默认callback
		jsonpParamName:"callback"
	};
	
	if(!url || typeof url !== "string"){
		throw new Error("url参数不能为空!");
	}
	
	this._opts.url=url;
	
	/**
	 * script是否被终止
	 */
	this.isAborted=false;
	
	/**
	 * 创建的script标示符
	 */
	this.scriptIdentifier="";
	
	/**
	 * blogScript方式返回变量标识符
	 */
	this.varname="";
	
	/**
	 * script加载是否完成
	 */
	this.loadComplete=false;
	
	/**
	 * 超时计时器
	 */
	this.timeObj;
	
	//枚举this._opts中的每个属性 并检测是否在opts中存在 如果存在 将属性值覆盖到this._opts中
	Core.System.parseParam(this._opts,opts);
	
	this.loadScript();
};

Utils.Io.TimeoutJsLoad.prototype={
	/**
	 * 手动维护constructor指向函数本身
	 */
	constructor:Utils.Io.TimeoutJsLoad,
	/**
	 * jsonp调用计数 用来产生唯一jsonp函数名
	 */
	__jsonpCounter:(new Date()).getTime(),
	/**
	 * 加载script
	 */
	loadScript:function(){
		var opts =this._opts,
			scriptObj = $C("script"),
			head=$T(document,"head")[0],
			_this=this,
			jsonp=this._processUrl();
		
		//开启firefox script异步加载
		scriptObj.async=true;
		scriptObj.src = opts.url;
		scriptObj.charset = opts.charset;
		scriptObj.id="script"+this.scriptIdentifier;
		
		//jsonp
		if(opts.type === "jsonp"){
			window[jsonp]=originalCallback;
		}else if(opts.type === "blogScript"){
			scriptObj.onload = scriptObj.onerror = scriptObj.onreadystatechange=originalCallback;
		}
		
		/**
		 * jsonp或blogScript统一回调处理函数
		 * @param {Object} result jsonp方式服务器端返回数据
		 */
		function originalCallback(result){
			
			var type=opts.type;
			
			if (type === "blogScript" && scriptObj && scriptObj.readyState && scriptObj.readyState != "loaded" && scriptObj.readyState != "complete") {
				return;
			}
			
			_this.loadComplete=true;
			
			if(type === "jsonp"){
				window[jsonp] = undefined;
                try {
                    delete window[jsonp];
                } catch (jsonpError) {}
				
			}else if(type === "blogScript"){
				scriptObj.onload = scriptObj.onreadystatechange = scriptObj.onerror = null;
			}
			head.removeChild(scriptObj);
			
			if(!_this.isAborted && typeof opts.onComplete === "function"){
				_this.timeObj && clearTimeout(_this.timeObj);
				opts.onComplete(type === "blogScript"?window[_this.varname]:result);
			}
		}
		
		//不使用appendchild
		//参见http://bugs.jquery.com/ticket/2709,http://bugs.jquery.com/ticket/4378
		head.insertBefore(scriptObj,head.firstChild);
		
		//如果设置了超时 则开始计时
		if(opts.timeout>0){
			this.timeObj=setTimeout(function(){_this.abortRequest();},opts.timeout);
		}
	},
	/**
	 * 终止请求
	 */
	abortRequest:function(){
		
		if(this.loadComplete){
			return;
		}
		
		this.isAborted=true;
		
		//如果是opera 则更改script节点的src值 来取消加载script的阻塞状态
		if(/opera/i.test(navigator.userAgent) && $E("script"+this.scriptIdentifier)){
			$E("script"+this.scriptIdentifier).src="";
		}
		typeof this._opts.onException === "function" && this._opts.onException();
	},
	/**
	 * 将opts.GET中的参数添加到url中
	 * 
	 * 如果请求类型是blogScript
	 * 需要服务器返回数据 再添加varname参数 参数默认值为requestId_+随机数
	 * 
	 * 如果请求类型是jsonp
	 * 计算jsonp唯一回调参数名 并返回该函数名
	 */
	_processUrl:function(){
		var opts=this._opts,
			url=opts.url,
			queryString = opts.GET,
			key, 
			rnd=window.parseInt(Math.random() * 100000000),
			//该对象将url中的参数键值对和锚点参数键值对分别存到锚点属性中和参数属性中
			url_cls = new Utils.Url(url);
			
		//将opts.GET中的参数添加到url_cls对象中
		for(key in queryString) {
			url_cls.setParam(key,opts.noencode === true?queryString[key]:Core.String.encodeDoubleByte(queryString[key]));
		}
		
		this.scriptIdentifier=rnd;
		
		if(opts.type === "blogScript"){
			//如果请求需要服务器端返回数据 添加varname参数
			this.varname=url_cls.getParam("varname") || "requestId_" + rnd;
			opts.noreturn !== true && url_cls.setParam("varname",this.varname);
		}else if(opts.type === "jsonp"){
			var jsonp="jsonp" + this.constructor.prototype.__jsonpCounter++;
			url_cls.setParam(opts.jsonpParamName,jsonp);
		}	
		
		opts.url = url_cls.toString();
		
		return jsonp;
	}
}
