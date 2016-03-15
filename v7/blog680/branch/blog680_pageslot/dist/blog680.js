//合并文件
;(function(wnd, undefined){
// 博客广告推广工具前端投放JS
/**
 * 博客广告推广工具
 */
SinaBlog680 = {
    ver : '0.0.1'
}
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
/*
    json2.js
    2013-05-26

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
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
/*
 * @fileoverview 固定广告box组件
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

/*** 固定广告box组件 ***/
SinaBlog680.PPTBoxHelper = {
    count: 0,
    instance: {},
    getId: function() { return '_ppt_box-' + (this.count++); }
};

SinaBlog680.moveElement = function(elementID,final_x,interval) {
    if (!document.getElementById) return false;
    if (!document.getElementById(elementID)) return false;
        var elem = document.getElementById(elementID);
        if (elem.movement) {
        clearTimeout(elem.movement);
    }
    if (!elem.style.left) {
        elem.style.left = "0px";
    }
    var xpos = parseInt(elem.style.left, 10);
    if (xpos == final_x ) {
        return true;
    }
    if (xpos < final_x) {
        var dist = Math.ceil((final_x - xpos)/5);
        xpos = xpos + dist;
    }
    if (xpos > final_x) {
        var dist = Math.ceil((xpos - final_x)/5);
        xpos = xpos - dist;
    }
    elem.style.left = xpos + "px";
    var repeat = "SinaBlog680.moveElement('"+elementID+"',"+final_x+","+interval+")";
    elem.movement = setTimeout(repeat,interval);
};

//PPT盒子
function PPTBox() {
    this.uid = SinaBlog680.PPTBoxHelper.getId();
    SinaBlog680.PPTBoxHelper.instance[this.uid] = this;
    this._$ = function(id){return document.getElementById(id);};
    this.width = 400;       //宽度
    this.height = 300;      //高度
    this.picWidth = 15;     //小图宽度
    this.picHeight = 12;    //小图高度
    this.autoplayer = 0;    //自动播放间隔（秒）
    this.target = "_blank";
    this._box = [];
    this._curIndex = 0;
    this.materialtype = 1;  //物料类型
    this.slot = null;       //资源位dom元素
    this.slottype = 1;      //资源位类型，1固定，2漂浮，3弹窗
    this.sourceid = null;
    this.sudakey = null;
    this.sudavalue = null;
}
PPTBox.prototype = {
    _createMainBox : function (){
        var flashBoxWidth = this.width * this._box.length;
        var html="<div id='"+this.sourceid+"_mainbox' class='mainbox'  style='overflow:hidden;position:relative;width:"+(this.width)+"px;height:"+(this.height)+"px;'>";
        html += "<div id='"+this.sourceid+"_contentbox' class='flashbox' style='overflow:hidden;position:relative;width:"+flashBoxWidth+"px;height:"+(this.height)+"px;'></div>";
        // html += "<div id='"+this.sourceid+"_imagebox' class='imagebox' style='display: none;width:"+this.width+"px;height:"+(this.picHeight+2)+"px;top:-"+(this.picHeight+20)+"px;'></div>";
        html += "</div>";
        var el = SinaBlog680.utils.htmlToDom(html);
        this.slot.appendChild(el[0]);
        // this.slot.innerHTML = html;        
    },
    _init : function (){
        var picstyle= "";
        var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']";
        var imageHTML="";
        var flashbox = "";
        var flashboxel;
        var sudakey = this.sudakey;
        var sudavalue = this.sudavalue;
        for(var i=0;i<this._box.length;i++){
            var parame = this._box[i];
            flashbox += this.renderHTML(parame,this.width,this.height,i);
            // imageHTML ="<div class='bitdiv "+((i==0)?"curimg":"defimg")+"' title ="+parame.title+" src='bit01.gif' "+picstyle+" onclick = \""+eventstr+".clickPic("+i+")\"  onmouseover=\""+eventstr+".mouseoverPic("+i+")\"></div>" + imageHTML;
        
            //有广告数据
            if(flashbox !== '') {
                // this._createMainBox();
                if(this.slot.style.display == 'none') {
                    this.slot.style.display = '';
                }
                flashboxel = SinaBlog680.utils.htmlToDom(flashbox);
                
                if(this.slot) {
                    var slotdom = this.slot;

                    if(this.sourceid == 'SLOT_41' || this.sourceid == 'SLOT_42') {
                        if(slotdom.parentNode.style.display == 'none') {
                            slotdom.parentNode.style.display = '';
                        }
                        slotdom.parentNode.innerHTML = flashbox;
                    }else {
                        // slotdom.appendChild(flashboxel[0]);
                        slotdom.innerHTML = flashbox;
                        try {
                            if(slotdom.getAttribute('id') == 'loginBarActivity') {
                                slotdom.onmouseover = function() {
                                    slotdom.getElementsByTagName('a')[0].setAttribute('href', parame.a_href);
                                };
                                slotdom.onmouseout = function() {
                                    var href = parame.a_href.match(/url=(.+)/)[1];
                                    slotdom.getElementsByTagName('a')[0].setAttribute('href', href);
                                };
                            }
                        }catch(e){}
                    }

                    // 曝光布码
                    window.setTimeout(function() {
                        if(typeof SUDA != 'undefined' && sudakey && sudavalue) {
                            SUDA.uaTrack(sudakey, sudavalue);
                        }
                    }, 3000);
                }
            }
        }
        
        // this._$(this.sourceid+"_contentbox").innerHTML = flashbox;
        // this._$(this.sourceid+"_imagebox").innerHTML = imageHTML;

    },
    _play : function(){
        clearInterval(this._autoplay);
        var idx = this._curIndex+1;
        if(idx>=this._box.length){idx=0;}
        this.changeIndex(idx);
        var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";
        this._autoplay = setInterval(eventstr,this.autoplayer*1000);

    },
    renderHTML : function(parame,width,height,idx) {
        // var isFlash = url.substring(url.lastIndexOf('.')+1).toLowerCase()=="swf";
        var html = "";
        var slotdom = this.slot;
        var tpl_xg1 = '<p class="atcTitCell_tit SG_dot">'
                    +   '<a {{a_c_suda}} href="{{a_href}}" target="_blank" title="{{a_title}}">{{words}}</a>'
                    + '</p>'
                    + '<p class="atcTitCell_nm">'
                    +   '<a {{a_c_suda}} href="{{a_href}}" class="SG_linkb" target="_blank">{{author}}</a>'
                    + '</p>';
        
        var tpl_xg2 = '<span class="blogname">'
                    + '<a {{a_c_suda}} onclick="v7sendLog(\'41_01_07\');" href="{{a_href}}" target="_blank" title="{{a_title}}">{{words}}</a>'
                    + '</span>'
                    + '<span class="bloguser">'
                    + '<a {{a_c_suda}} onclick="v7sendLog(\'41_01_07\');" class="SG_linkb" href="{{a_href}}" target="_blank">{{author}}</a>'
                    + '</span>';

        var tpl_searchqing = '<a target="_blank" {{a_c_suda}} href="{{a_href}}"><img title="{{a_title}}" src="{{imgurl}}" alt="{{a_title}}"></a>' 
                            + '<span><a target="_blank" {{a_c_suda}} href="{{a_href}}">{{a_title}}</a></span>';

        var tpl_meishilink = '<span class="SG_dot"></span><a target="_blank" {{a_c_suda}} title="{{a_title}}" href="{{a_href}}">{{a_title}}</a>';
                    
        //materialtype 物料类型
        //1,图片 2,文字 3,相关博文 4,搜索浮层 5,美食组件文字链
        if(this.materialtype === 1) {
            var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']";
            var style = "";
            if(parame.a_href) {
                style = "cursor:pointer";
            }
            // 大家看浮层图片链接添加点击对比布码
            if(this.sourceid == 'SLOT_98') {
                var sendlog = "v7sendLog('30_01_02')";
                html = '<a '+ parame.a_c_suda +' onmousedown="'+ sendlog +'" target="_blank" href="'+parame.a_href+'">'+ '<img titlelink="'+parame.a_href+'" destxt="'+(parame.words || '')+'" title="'+ parame.a_title +'" src="'+ parame.imgurl +'" />' + '</a>';
            }else {
                html = '<a '+ parame.a_c_suda +' target="_blank" href="'+parame.a_href+'">'+ '<img titlelink="'+parame.a_href+'" destxt="'+(parame.words || '')+'" title="'+ parame.a_title +'" src="'+ parame.imgurl +'" />' + '</a>';
            }
        }else if(this.materialtype === 2) {
            var style = "";
            if(parame.a_style) {
                style = parame.a_style;
            }
            // 顶托文字链
            if(slotdom.getAttribute('id') === 'loginBarActivity') {
                if(/sina.allyes.com/g.test(parame.a_href)){
                    var href = parame.a_href.match(/url=(.+)/)[1];
                }else{
                    var href = parame.a_href;
                }
                var sendlog = "v7sendLog('41_01_11')";
                html = '<a onmousedown="'+ sendlog +'" style="'+style+'" title="'+parame.a_title+'" href="'+href+'" '+parame.a_c_suda+' target="_blank">'+parame.words+'</a>';
            }else {
                html = '<a style="'+style+'" title="'+parame.a_title+'" href="'+parame.a_href+'" '+parame.a_c_suda+' target="_blank">'+parame.words+'</a>';
            }
        }else if(this.materialtype === 3) {
            if(location.href.indexOf('tj=2') != -1) {
                html = SinaBlog680.utils.tplToData(tpl_xg2, parame);
            }else {
                html = SinaBlog680.utils.tplToData(tpl_xg1, parame);
            }
        }else if(this.materialtype === 4) {
            html = SinaBlog680.utils.tplToData(tpl_searchqing, parame);
        }else if(this.materialtype === 5) {
            html = SinaBlog680.utils.tplToData(tpl_meishilink, parame);
        }

        // else if(this.materialtype === 3) {
        //     html = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' "
        //     + "codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0' width='"+width+"' height='"+height+"'>"
        //     + "<param name=\"movie\" value=\""+url+"\" />"
        //     + "<param name='quality' value='high' />"
        //     + "<param name='wmode' value='transparent'>"
        //     + "<embed src='"+url+"' quality='high' wmode='opaque' pluginspage='http://www.macromedia.com/go/getflashplayer'"
        //     +"  type='application/x-shockwave-flash' width="+width+" height='"+height+"'></embed>"
        //     +"  </object>";
        // }

        return html;
    },
    changeIndex : function(idx){
        var parame = this._box[idx];
        SinaBlog680.moveElement(this.sourceid+"_contentbox",-(idx*this.width),1);
        // var imgs = this._$(this.sourceid+"_imagebox").getElementsByTagName("div");
        // imgs[this._box.length-1-this._curIndex].className = "bitdiv defimg";
        // imgs[this._box.length-1-idx].className = "bitdiv curimg";
        this._curIndex = idx;
    },
    mouseoverPic : function(idx){
        this.changeIndex(idx);
        if(this.autoplayer>0){
           clearInterval(this._autoplay);
           var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";
           this._autoplay = setInterval(eventstr,this.autoplayer*1000);
        }
    },
    clickPic : function(idx){
        var parame = this._box[idx];
        if(parame.a_href&&parame.a_href !== ""){
            window.open(parame.a_href,this.target);
        }
    },
    add : function (imgParam){
        this._box[this._box.length] = imgParam;
    },
    show : function () {
        var that = this;
        if(!this.slot) {
            return;
        }
        this._init();

        // if(this.autoplayer>0){
        //    var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";
        //    this._autoplay = setInterval(eventstr,this.autoplayer*1000);
        // }
    }
};
/*** 固定广告box组件 **/
﻿/*
 * @fileoverview 生成固定广告位
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

//广告资源接口返回数据
var resdata = {};

//广告资源id缓存
SinaBlog680.sourceArrCache = [];
//广告获取接口
SinaBlog680.sourceurl = 'http://interface.blog.sina.com.cn/riaapi/pageslot/pageslot.php';

var requesting = 0;


/*** 固定广告，底部调用模式 ***/
/*  调用方法
    //广告位id
    var slotArr = ['div1', 'div2', 'div3'];
    //广告资源id，一个广告位可以对应多个资源
    var sourceArr = ['SLOT_40', 'SLOT_42,SLOT_44', 'SLOT_49'];
    SinaBlog680.staticBox(slotArr, sourceArr);
*/
SinaBlog680.staticBox = function(slotArr, sourceArr) {
    //一个广告位有多个资源
    var sourceLen = sourceArr.length;
    var reqSourceArr = [];
    var cookieUtil = SinaBlog680.cookie;
    var reqdata = {
        id : reqSourceArr
    };
    
    var articleclass = '';
    if(typeof scope != 'undefined') {
        articleclass = scope.$private.articleclass;
    }

    for(var i=0;i<sourceLen;i++) {
        var subSourceArr = sourceArr[i].split(',');
        var subSourceLen = subSourceArr.length;
        if(subSourceLen > 1) {
            // var index = parseInt(cookieUtil.getCookie(slotArr[i] + '_' + 'adindex') || 0);
            // if (subSourceLen <= index) {
            //     index = 0;
            // }
            // cookieUtil.setCookie(slotArr[i] + '_' + 'adindex', 1+index, 24, "/", ".blog.sina.com.cn");
            var index = SinaBlog680.utils.getRandomInt(0, subSourceLen-1);
            reqSourceArr.push(subSourceArr[index]);
        }else if(subSourceLen == 1) {
            reqSourceArr.push(subSourceArr[0]);
        }
    }

    if(sourceArr.join().indexOf('SLOT_41') != -1 || sourceArr.join().indexOf('SLOT_42') != -1) {
        reqdata = {
            id : reqSourceArr,
            articleclass : articleclass
        };
    }else {
        reqdata = {
            id : reqSourceArr
        };
    }

    if(typeof scope != 'undefined') {
        reqdata.blogeruid = scope.$uid;
    }
    
    var SUPCookie = decodeURIComponent(cookieUtil.getCookie('SUP'));
    if(SUPCookie) {
        var matchCookie = SUPCookie.match(/uid=([\x20-\x7e]+?)&user/);
        var loginuid = matchCookie.length && matchCookie[1];
        reqdata.loginuid = loginuid;
    }
    

	var domInterval = window.setInterval(function() {
        if(document.readyState === 'complete' || document.readyState === 'interactive' || document.readyState === 'loaded') {
            
            if(typeof SUDA != 'undefined') {
                clearInterval(domInterval);
                domInterval = null;

                // 本地存储
                var lsTool = SinaBlog680.utils.localStorage;

                var slotTime = lsTool.get('slotTime');
                var timestamp = new Date().getTime();
                
                var localData = {};

                if(slotTime) {
                    // 时间差
                    var secondNum = parseInt((timestamp - slotTime)/1000, 10);
                    if(secondNum >= 600) {
                        localData = {};
                        lsTool.remove('slotData');
                        lsTool.set('slotTime', timestamp);
                    }else {
                        localData = lsTool.get('slotData') ? JSON.parse(lsTool.get('slotData')) : {};
                    }
                }else {
                    localData = {};
                    lsTool.remove('slotData');
                    lsTool.set('slotTime', timestamp);
                }
                
                var titleMatch = document.location.href.match(/(\?|&)title_key=(.+?)(?=&|$)/);
                if(titleMatch && titleMatch[2]) {
                    reqdata.title_key = decodeURIComponent(decodeURIComponent(titleMatch[2]));
                    SinaBlog680.jsload.request(SinaBlog680.sourceurl, {
                        GET : reqdata,
                        onComplete: function(res) {
                            if(res) {
                                SinaBlog680.renderBox(slotArr, reqSourceArr, res);
                                //localData[reqSourceArr] = res;
                                //lsTool.set('slotData', JSON.stringify(localData));
                            }
                        },
                        onException: function(res) {
                        }
                    });
                } else {
                    if(!localData[reqSourceArr]) {
                        SinaBlog680.jsload.request(SinaBlog680.sourceurl, {
                            GET : reqdata,
                            onComplete: function(res) {
                                if(res) {
                                    SinaBlog680.renderBox(slotArr, reqSourceArr, res);
                                    localData[reqSourceArr] = res;
                                    lsTool.set('slotData', JSON.stringify(localData));
                                }
                            },
                            onException: function(res) {
                            }
                        });
                    }else {
                        SinaBlog680.renderBox(slotArr, reqSourceArr, localData[reqSourceArr]);
                    }
                }
                
                
            }
        }else {
            console.log(document.readyState);
        }
    }, 500);

    // 超时
    window.setTimeout(function() {
        if(domInterval) {
            clearInterval(domInterval);
            domInterval = null;
        }
    }, 1000*10);

};
SinaBlog680.renderBox = function(slotArr, sourceArr, adData) {
    var len = slotArr.length;
    var cookieUtil = SinaBlog680.cookie;

    for(var i=0;i<len;i++) {
        var sourceid = sourceArr[i];

        //固定类型
        if(adData[sourceid] && adData[sourceid].slottype == 1) {
            var slotdom = document.getElementById(slotArr[i]);

            //判断tips广告，顶托位置
            if (typeof BLOG_AD_TIPS != 'undefined' && BLOG_AD_TIPS != null && slotArr[i] === 'loginBarActivity') {
                continue;
            }

            if(slotdom) {
                var resarr = adData[sourceid].res;
                
                if(resarr.length) {
                    var box = new PPTBox();
                    box.width = adData[sourceid].width;
                    box.height = adData[sourceid].height;
                    box.sourceid = sourceid;
                    box.materialtype = adData[sourceid].materialtype;
                    box.autoplayer = 0;
                    box.slot = slotdom;
                    
                    //一个广告资源多个物料信息
                    if(resarr.length === 1) {
                        box.add(resarr[0]);
                        box.sudakey = resarr[0].a_v_suda_key;
                        box.sudavalue = resarr[0].a_v_suda_value;
                        box.show();
                        
                    }else if(resarr.length > 1) {
                        var randomIndex = SinaBlog680.utils.getRandomInt(0, resarr.length-1);
                        box.add(resarr[randomIndex]);
                        box.sudakey = resarr[randomIndex].a_v_suda_key;
                        box.sudavalue = resarr[randomIndex].a_v_suda_value;
                        box.show();
                    }

                    // 对相关博文的两个广告做特殊处理
                    // if(sourceid === 'SLOT_41' || sourceid === 'SLOT_42') {
                    //     if(slotdom.parentNode.style.display == 'none') {
                    //         slotdom.parentNode.style.display = '';
                    //     }
                    // }
                    if(slotdom.style.display == 'none') {
                        slotdom.style.display = '';
                    }
                }
            }
        }
        // else {
        //     console.log('slottype error');
        // }
    }
};

/*** 顶部调用，埋点方式 start ***/
SinaBlog680.preloadSlots = function(sourceArr) {
	for(var i=0;i<sourceArr.length;i++) {
		SinaBlog680.sourceArrCache.push(sourceArr[i]);
	}
};
SinaBlog680.reqAD = function() {
	requesting = 1;
	SinaBlog680.jsload.request(SinaBlog680.sourceurl, {
    	GET : {
            id : SinaBlog680.sourceArrCache
		},
        onComplete: function(res) {
        	for(var key in res) {
        		resdata[key] = res[key];
        	}
            requesting = 0;
        },
        onException: function(res) {
        }
    });
};
SinaBlog680.fillSlot = function(sourceid, slotid) {	
    var placeEle = '<a id="placeEle_'+sourceid+'"></a>';
    if(!slotid) {
        document.write(placeEle);
    }

    var checkdata = window.setInterval(function() {
    	//domready后执行
    	if(document.readyState ==="complete") {
	        if(!SinaBlog680.utils.isEmptyObject(resdata)) {
	            clearInterval(checkdata);
	            var adData = resdata;
	            //没有数据的情况
	            if(!adData || !adData[sourceid]) {            	
	                return;
	            }
	            var box = new PPTBox();
	            box.width = adData[sourceid].width;
	            box.height = adData[sourceid].height;
	            box.sourceid = sourceid;
	            box.materialtype = adData[sourceid].materialtype;
	            box.autoplayer = 0;
	            if(slotid) {
	                box.slot = document.getElementById(slotid);
	            }else {
	                box.slot = document.getElementById('placeEle_'+sourceid).parentNode;
	            }
	            
	            for(var j=0;j<adData[sourceid].res.length;j++) {
	                box.add(adData[sourceid].res[j]);
	                box.show();

	                var viewKey = adData[sourceid].res[j].a_v_suda_key;
	                var viewValue = adData[sourceid].res[j].a_v_suda_value;
	                SinaBlog680.sudaView(sourceid, viewKey, viewValue);
	            }

	        }else {
	        	if(requesting === 0) {
	        		SinaBlog680.reqAD();
	        	}
	        }
    	}
    }, 500);
    
    // 超时
    window.setTimeout(function() {
        if(checkdata) {
            clearInterval(checkdata);
        }
    }, 1000*10);
};

//针对顶托延迟加载
SinaBlog680.fillTopBar = function(sourceid) {
	
    var topBarInterval = window.setInterval(function() {
        var topbar_login = document.getElementById('loginBarActivity');
        var topbar_nologin = document.getElementById('divPopularize');
        if(document.readyState === "complete") {
        	if(topbar_login) {
	            //判断是否是tips广告
	            if (typeof BLOG_AD_TIPS==="undefined" || !BLOG_AD_TIPS ){
	                SinaBlog680.fillSlot(sourceid, 'loginBarActivity');
	            }
	            clearInterval(topBarInterval);
	        }
	        if(topbar_nologin) {
	            //判断是否是tips广告
	            if (typeof BLOG_AD_TIPS==="undefined" || !BLOG_AD_TIPS ){
	                SinaBlog680.fillSlot(sourceid, 'divPopularize');
	            }
	            clearInterval(topBarInterval);
	        }
        }
    }, 3000);

    //超时
    window.setTimeout(function() {
    	if(topBarInterval) {
    		clearInterval(topBarInterval);
    	}
    }, 3000*10);
};
/*** 顶部调用，埋点方式 end ***/

/*** 曝光布码 ***/
SinaBlog680.sudaView = function(sourceid, key, value) {
    window.setTimeout(function() {
        var el = document.getElementById(sourceid+'_mainbox');
        if(typeof SUDA !== 'undefined' && el) {
            SUDA.uaTrack(key, value);
        }
    }, 3000);
};
// 底部工具
})(window);
