/**
 * @fileoverview 通用方法
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

SinaBlog680.utils = {};
SinaBlog680.cookie = {};

//准备模拟对象、空函数等
var LS, noop = function(){}, notSupport = {set:noop,get:noop,remove:noop,clear:noop,each:noop,obj:noop,length:0};

//优先探测userData是否支持，如果支持，则直接使用userData，而不使用localStorage
//以防止IE浏览器关闭localStorage功能或提高安全级别(*_* 万恶的IE)
//万恶的IE9(9.0.11）)，使用userData也会出现类似seesion一样的效果，刷新页面后设置的东西就没有了...
//只好优先探测本地存储，不能用再尝试使用userData
(function(){
	// 先探测本地存储
	// 尝试访问本地存储，如果访问被拒绝，则继续尝试用userData，注： "localStorage" in window 却不会返回权限错误
	// 防止IE10早期版本安全设置有问题导致的脚本访问权限错误
	if( "localStorage" in window ){
		try{
			LS = window.localStorage;
			return;
		}catch(e){
			//如果报错，说明浏览器已经关闭了本地存储或者提高了安全级别
			//则尝试使用userData
		}
	}
	
	//继续探测userData
	var o = document.getElementsByTagName("head")[0], hostKey = window.location.hostname || "localStorage", d = new Date(), doc, agent;
	
	//typeof o.addBehavior 在IE6下是object，在IE10下是function，因此这里直接用!判断
	//如果不支持userData则跳出使用原生localStorage，如果原生localStorage报错，则放弃本地存储
	if(!o.addBehavior){
		try{
			LS = window.localStorage;
		}catch(e){
			LS = null;
		}
		return;
	}
	
	try{ //尝试创建iframe代理，以解决跨目录存储的问题
		agent = new ActiveXObject('htmlfile');
		agent.open();
		agent.write('<s' + 'cript>document.w=window;</s' + 'cript><iframe src="/favicon.ico"></iframe>');
		agent.close();
		doc = agent.w.frames[0].document;
		//这里通过代理document创建head，可以使存储数据垮文件夹访问
		o = doc.createElement('head');
		doc.appendChild(o);
	}catch(e){
		//不处理跨路径问题，直接使用当前页面元素处理
		//不能跨路径存储，也能满足多数的本地存储需求
		o = document.getElementsByTagName("head")[0];
	}
	
	//初始化userData
	try{
		d.setDate(d.getDate() + 36500);
		o.addBehavior("#default#userData");
		o.expires = d.toUTCString();
		o.load(hostKey);
		o.save(hostKey);
	}catch(e){
		//防止部分外壳浏览器的bug出现导致后续js无法运行
		//如果有错，放弃本地存储
		return;
	}
	//开始处理userData
	//处理了userData设置的key不能以数字开头的问题
	var root, attrs;
	try{
		root = o.XMLDocument.documentElement;
		attrs = root.attributes;
	}catch(e){
		//防止部分外壳浏览器的bug出现导致后续js无法运行
		//如果有错，放弃本地存储
		return;
	}
	var prefix = "p__hack_", spfix = "m-_-c",
		reg1 = new RegExp("^"+prefix),
		reg2 = new RegExp(spfix,"g"),
		encode = function(key){ return encodeURIComponent(prefix + key).replace(/%/g, spfix); },
		decode = function(key){ return decodeURIComponent(key.replace(reg2, "%")).replace(reg1,""); };
	//创建模拟对象
	LS = {
		length: attrs.length,
		isVirtualObject: true,
		getItem: function(key){
			//IE9中 通过o.getAttribute(name);取不到值，所以才用了下面比较复杂的方法。
			return (attrs.getNamedItem(encode(key)) || {nodeValue: null}).nodeValue||root.getAttribute(encode(key));
		},
		setItem: function(key, value){
			//IE9中无法通过 o.setAttribute(name, value); 设置#userData值，而用下面的方法却可以。
			try{
				root.setAttribute( encode(key), value);
				o.save(hostKey);
				this.length = attrs.length;
			}catch(e){//这里IE9经常报没权限错误,但是不影响数据存储
			}
		},
		removeItem: function(key){
			//IE9中无法通过 o.removeAttribute(name); 删除#userData值，而用下面的方法却可以。
			try{
				root.removeAttribute( encode(key) );
				o.save(hostKey);
				this.length = attrs.length;
			}catch(e){//这里IE9经常报没权限错误,但是不影响数据存储
			}
		},
		clear: function(){
			while(attrs.length){
				this.removeItem( attrs[0].nodeName );
			}
			this.length = 0;
		},
		key: function(i){
			return attrs[i] ? decode(attrs[i].nodeName) : undefined;
		}
	};
	//提供模拟的"localStorage"接口
	if( !("localStorage" in window) ) {
		window.localStorage = LS;
	}
})();

//二次包装localstorage接口
SinaBlog680.utils.localStorage = !LS ? notSupport : {
	set : function(key, value){
		//fixed iPhone/iPad 'QUOTA_EXCEEDED_ERR' bug
		if( this.get(key) !== undefined ) {
			this.remove(key);
		}
		LS.setItem(key, value);
		this.length = LS.length;
	},
	//查询不存在的key时，有的浏览器返回null，这里统一返回undefined
	get : function(key){
		var v = LS.getItem(key);
		return v === null ? undefined : v;
	},
	remove : function(key){ LS.removeItem(key);this.length = LS.length; },
	clear : function(){ LS.clear();this.length = 0; },
	//本地存储数据遍历，callback接受两个参数 key 和 value，如果返回false则终止遍历
	each : function(callback){
		var list = this.obj(), fn = callback || function(){}, key;
		for(key in list) {
			if( fn.call(this, key, this.get(key)) === false ) {
				break;
			}
		}
	},
	//返回一个对象描述的localStorage副本
	obj : function(){
		var list={}, i=0, n, key;
		if( LS.isVirtualObject ){
			list = LS.key(-1);
		}else{
			n = LS.length;
			for(; i<n; i++){
					key = LS.key(i);
					list[key] = this.get(key);
			}
		}
		return list;
	},
	length : LS.length
};


//html转dom
SinaBlog680.utils.htmlToDom = function(html) {
	var div = document.createElement('div');
	div.innerHTML = html;
	return div.childNodes;
};
//判断是否为空对象
SinaBlog680.utils.isEmptyObject = function(O){
  for (var x in O){
	return false;
  }
  return true;
};
//获取一定范围内随机整数
SinaBlog680.utils.getRandomInt = function(min, max) {
	return Math.floor((max-min+1)*Math.random()) + min;
};

/**
 * 读取cookie
 * @param {Object} cookie的名字
 * @return {String} cookie的值
 * @example
 * var value = Utils.Cookie.getCookie(name);
 */
SinaBlog680.cookie.getCookie = function (name) {
	name = name.replace(/([\.\[\]\$])/g,'\\\$1');
	var rep = new RegExp(name + '=([^;]*)?;','i'); 
	var co = document.cookie + ';';
	var res = co.match(rep);
	if (res) {
		return res[1] || "";
	}
	else {
		return "";
	}
};
/**
 * 设置cookie
 * @param {String} name cookie名
 * @param {String} value cookie值
 * @param {Number} expire Cookie有效期，单位：小时
 * @param {String} path 路径
 * @param {String} domain 域
 * @param {Boolean} secure 安全cookie
 * @example
 * Utils.Cookie.setCookie('name','sina',null,"")
 */
SinaBlog680.cookie.setCookie = function (name, value, expire, path, domain, secure) {
	var cstr = [];
	cstr.push(name + '=' + escape(value));
	if(expire){
		var dd = new Date();
		var expires = dd.getTime() + expire * 3600000;
		dd.setTime(expires);
		cstr.push('expires=' + dd.toGMTString());
	}
	if (path) {
		cstr.push('path=' + path);
	}
	if (domain) {
		cstr.push('domain=' + domain);
	}
	if (secure) {
		cstr.push(secure);
	}
	document.cookie = cstr.join(';');
};
/**
 * 删除cookie
 * @param {String} name cookie名
 */
SinaBlog680.cookie.deleteCookie = function(name) {
	document.cookie = name + '=;' + 'expires=Fri, 31 Dec 1999 23:59:59 GMT;'; 
};
/**
 * 模板函数
 * @param {String} template 模板字符串
 * @param {array} data 数据
 */
SinaBlog680.utils.tplToData = function(template, data) {
	// var i = 0;
	// var len = data.length;
	var fragment = '';
	// 遍历数据集合里的每一个项，做相应的替换
	function replace(obj) {
		var t, key, reg;
		　　　　　　
		//遍历该数据项下所有的属性，将该属性作为key值来查找标签，然后替换
		for (key in obj) {
			reg = new RegExp('{{' + key + '}}', 'ig');
			t = (t || template).replace(reg, obj[key]);
		}

		return t;
	}
	// for (; i < len; i++) {
	// 	fragment += replace(data[i]);
	// }
	fragment = replace(data);

	return fragment;
};
/**
 * 同步加载js
 * @param {String} url js地址
 * @param {function} callback
 */
SinaBlog680.utils.loadScript = function(url, callback) {
	var _script = document.createElement("script");

	_script.type = "text/javascript";
	_script.src = url;
	document.getElementsByTagName("head")[0].appendChild(_script);

	if (_script.readyState){  //IE
		_script.onreadystatechange = function(){
			if (_script.readyState == "loaded" || _script.readyState == "complete"){
				_script.onreadystatechange = null;
				if(callback) {
					callback();
				}
			}
		};
	} else {  //Others
		_script.onload = function(){
			if(callback) {
				callback();
			}
		};
		_script.onerror = function() {
			if(callback) {
				callback();
			}
		};
	}
};