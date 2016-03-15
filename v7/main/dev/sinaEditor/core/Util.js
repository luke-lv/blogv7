/**
 * 常用工具函数
 * @namespace Util
 */
SinaEditor.regist('Util', function (SE) {

    var Util = {};
    /**
     * 是否在数组里
     * @memberof Util
     * @param {Array} arr - 数组
     */
    Util.inArray = function (arr, item) {
        var i = this.arrayIndexOf(arr, item)
        return i > -1 ? true : false;
    };

    /**
     * 判断arr是否为Array类型
     * @param arr
     * @returns {boolean}
     */
    Util.isArray = function (arr) {
        return '[object Array]' === Object.prototype.toString.call(arr);
    };

    /**
     * 将List类型转换为Array类型
     * @param list
     * @returns {Array}
     */
    Util.toArray = function (list) {
        var arr = [];
        if (Util.isArray(list)) {
            return list;
        } else {
            for (var i = 0, len = list.length; i < len; i++) {
                arr.push(list[i]);
            }
        }
        return arr;
    };

    /**
     * 判断是否为ECMAObject对象
     * @param o
     * @returns {boolean}
     */
    Util.isObject = function (o) {
        return '[object Object]' === o.toString();

    }

    /**
     * 改变函数的执行作用域
     * @param func
     * @param scope
     * @returns {Function}
     */
    Util.bind = function (func, scope) {
        return function () {
            func.apply(scope, arguments);
        }
    }

    /**
     * item在数组里的下标
     * @memberof Util
     * @param {Array} arr - 数组
     */
    Util.arrayIndexOf = function (arr, item) {
        var i = 0, l = arr.length;
        for (; i < l; i++) {
            if (arr[i] == item) {
                return i;
            }
        }
        return -1;
    };

    /**
     * 属性拷贝继承
     * @memberof Util
     */

    Util.extend = function (defaults, settings) {
        var args = arguments;
        defaults = defaults || {};

        if (args.length == 2) {
            defaults = Util.mix(defaults, settings);
        } else {
            for (var i = 1, len = args.length; i < len; i++) {
                defaults = Util.mix(defaults, args[i]);
            }
        }
        return defaults;
    };

    /**
     * 将对象ref的属性拷贝的o对象中，o中原有的属性会被覆盖
     * @param {object} o 原始对象
     * @param {object} ref 指定拷贝的对象
     * @param {boolean} deep 是否深度拷贝
     * @returns {object} 合并后的对象
     */
    Util.mix = function (o, ref, deep) {
        for (var p in ref) {
            if (ref.hasOwnProperty(p)) {
                if (deep && o[p] && Util.isObject(o[p])) {
                    Util.mix(o[p], ref[p], deep);
                } else {
                    o[p] = ref[p];
                }
            }
        }
        return o;

    }

    /**
     * 将对象ref的属性合并到o的属性中
     * @param {Mixed} o 原始对象
     * @param {Mixed} ref 合并的对象
     * @param {boolean} deep 是否深度合并
     * @param {boolean} original 是否保留o的原来属性
     * @returns {Mixed}
     * @memberof Util
     */
    Util.merge = function (o, ref, deep, original) {
        if (!o) {
            o = {};
        }
        for (var p in ref) {
            if (original && o[p] && !Util.isObject(o[p])) {
                continue;
            }
            if (ref.hasOwnProperty(p)) {

                if (deep && Util.isObject(ref[p])) {
                    o[p] = Util.merge(o[p] || {}, ref[p], deep, original);
                } else {
                    o[p] = ref[p];
                }
            }
        }
        return o;
    };

    /**
     * 模拟继承机制， 使得subClass继承自superClass
     * @param subClass  子类
     * @param superClass 父类
     * @param {object} proto 子类的proto属性，覆盖subClass与superClass的属性
     * @returns {object} 继承superClass后的子类对象
     */
    Util.inherits = function (subClass, superClass, proto) {
        var oldPro = subClass.prototype;
        proto = proto || {}

        var newFun = (new Function());
        newFun.prototype = superClass.prototype;
        var newPro = new newFun();
        for (var p in oldPro) {
            newPro[p] = oldPro[p];
        }
        Util.mix(newPro, proto);
        subClass.prototype = newPro;
        return (newPro.constructor = subClass);
    };

    /**
     * 遍历对象或数组
     * @param {Object|Array} arr
     * @param {Function} func
     * @returns {*}
     */
    Util.each = function (arr, func) {
        if (!arr) {
            return;
        }
        if ('length' in arr) {
            var i = 0, len = arr.length, item;
            for (; i < len; i++) {
                item = arr[i];
                if (false === func.call(item, i, item, arr)) {
                    break;
                }
            }
            return arr;
        } else {
            for (var p in arr) {
                if (arr.hasOwnProperty(p) && false === func.call(arr[p], p, arr[p], arr)) {
                    break;
                }
            }
            return arr;
        }
    }

    //window.Util = Util;

    /**
     * 顺序执行函数队列
     * @example
     * <pre>
     * Util.Deffer(function(d){
 *     setTimeout(function(){
 *         console.log(1);
 *         d.next();
 *     });
 * }).then(function(d){
 *     console.log(2);
 *     d.next();
 * }).then(function(d){
 *     setTimeout(function(){
 *         console.log(3);
 *         d.next();
 *     });
 * }).then(function(d){
 *     console.log(4);
 *     d.next();
 * }).start();
     * // print: 1 2 3 4
     * </pre>
     * @param [Function] func 执行参数
     * @returns {Deffered}
     * @constructor
     */
    Util.Deffer = function (func) {
        var deffered = {
            queue: [],
            then: function (func) {
                this.queue.push(func);
                return this;
            },
            next: function () {
                var func = this.queue.shift();
                func && func.call(null, this);
            },
            start: function () {
                this.next();
            }
        };
        func && deffered.queue.push(func);
        return deffered;
    }

    /**
     * url解析
     * @memberof Util
     * @namespace Util.urlParser
     */
    /**
     * url解析
     * @memberof Util
     * @namespace Util.urlParser
     * @param url url地址
     * @param encode 传入的url是否编码
     * @returns {{hostname: string, protocol: string, port: Number, pathname: string, search: string, hash: string, host: string, params: {}, param: param, toString: string, serialize: string}}
     */
    Util.urlParser = function (url, encode) {
        var parser = document.createElement('a');
        parser.href = url; //"http://example.com:3000/pathname/?search=test#hash";
        var search = parser.search;
        var paramstr = search.replace('?', '');
        var paramArr = paramstr.split('&'), matches, params = {};

        for (var i = paramArr.length - 1; i >= 0; i--) {
            matches = paramArr[i].match(/([^=]+)(=(.*)){0,1}/);
            if (matches && matches[1]) {
                params[matches[1]] = encode ? decodeURIComponent(matches[3]) : matches[3];
            }
        }
        var pathname = parser.pathname;
        if ('/' !== pathname.charAt(0)) {
            pathname = '/' + pathname;
        }
        return {
            hostname: parser.hostname || location.hostname,
            // => "example.com"
            protocol: parser.protocol || 'http:',
            // => "http:"
            port: parseInt(parser.port || 80),
            // => "3000"
            pathname: pathname,
            // => "/pathname/"
            search: search,
            // => "?search=test"
            hash: parser.hash,
            // => "#hash"
            host: parser.host || location.host,
            // => "example.com:3000"
            params: params,
            /**
             * 设置或获取参数值
             * @memberof Util.urlParser
             * @param {String} name 参数名称
             * @param {String} val 参数值
             * @return {String} 返回参数值
             */
            param: function (name, val) {
                if ('undefined' === typeof val) {
                    return params[name];
                } else {
                    params[name] = val
                    this.search = search = '?' + this.serialize();
                    return val;
                }
            },
            /**
             * 获取url链接地址
             * @memberof Util.urlParser
             * @return {String} url 返回url
             */
            toString: function () {
                var self = this;
                var url = self.protocol + '//' + self.hostname + (80 !== self.port ? (':' + self.port) : '') + self.pathname + self.search + self.hash;
                return url;
            },

            /**
             * 序列化一个对象为值对的形式<br>
             * 注意，只支持一级深度，多维的对象请绕过，重新实现
             * @memberof Util.urlParser
             * @return {String} 序列化之后的标准的值对形式的String
             */
            serialize: function () {
                var ar = [];
                for (var i in params) {
                    if (!params.hasOwnProperty(i)) {
                        continue;
                    }
                    if (params[i] == null || params[i] == "") {
                        ar.push(i + "=");
                    } else {
                        ar.push(i + "=" + params[i]);
                    }
                }
                var str = ar.join("&");

                return encode ? encodeURIComponent(str) : str;
            }
        }

    }

    /**
     * 过滤首尾空白
     * @memberof Util
     * @param {string} str 需要过滤的字符串
     */
    Util.trim = function (str) {
        var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" + "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" + "\u2029\uFEFF";
        ws = "[" + ws + "]";
        var trimBeginRegexp = new RegExp("^" + ws + ws + "*"), trimEndRegexp = new RegExp(ws + ws + "*$");

        return str.replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    }

    /**
     * 创建唯一ID
     * @memberof Util
     * @param {string|boolean} type 标识，如果为false这没有前缀SinaEditor_type
     */
    Util.uniqueId = (function () {
        var pre = 'SinaEditor_';
        var count = 0;
        return function (type) {
            var now = +new Date();
            return ((false !== type) ? pre + (type || '') : '') + now + '_' + (count++);
        }
    })();

    /**
     * ajax
     * @returns {request: request}
     */
    Util.ajax = function () {

        function createRequest() {
            var request = null;
            try {
                request = new XMLHttpRequest();
            } catch (trymicrosoft) {
                try {
                    request = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (othermicrosoft) {
                    try {
                        request = ActiveXObject("Microsoft.XMLHTTP");
                    } catch (failed) {
                    }
                }
            }
            return request;
        }

        function request(url, option) {
            option = option || {};
            option.onComplete = option.onComplete || function () {
            };
            option.onException = option.onException || function () {
            };
            option.returnType = option.returnType || "txt";
            option.method = option.method || "get";
            option.data = option.data || {};
            if (typeof option.GET != "undefined" && typeof option.GET.url_random != "undefined" && option.GET.url_random == 0) {
                this.rand = false;
                option.GET.url_random = null;
            }
            return loadData(url, option);
        }

        function loadData(url, option) {
            // trace("Ajax url : " + url);
            var timer;
            var request = createRequest(), tmpArr = [];
            var _url = new Util.urlParser(url);
            // 如果有需要 POST 的数据，加以整理
            if (option.POST) {
                for (var postkey in option.POST) {
                    var postvalue = option.POST[postkey];
                    if (postvalue != null) {
                        tmpArr.push(postkey + '=' + encodeURIComponent(postvalue));
                    }
                }
            }
            var sParameter = tmpArr.join("&") || "";
            // GET 方式提交的数据都放入地址中
            if (option.GET) {
                for (var key in option.GET) {
                    if (key != "url_random") {
                        _url.param(key, encodeURIComponent(option.GET[key]));
                    }
                }
            }
            if (option.rand != false) {
                // 接口增加随机数
                //_url.param("rnd", Math.random());
            }
            //      alert(_url.toString());
            // 处理回调
            request.onreadystatechange = function () {
                clearTimeout(timer);
                if (request.readyState == 4) {
                    var response, type = option.returnType;
                    try {
                        // 根据类型返回不同的响应
                        switch (type) {
                            case "txt":
                                response = request.responseText;
                                break;
                            case "xml":
                                if ($IE) {
                                    response = request.responseXML;
                                } else {
                                    var Dparser = new DOMParser();
                                    response = Dparser.parseFromString(request.responseText, "text/xml");
                                }
                                break;
                            case "json":
                                response = eval("(" + request.responseText + ")");
                                break;
                        }
                        option.onComplete(response);
                    } catch (e) {
                        option.onException(e.message, _url);
                        return false;
                    }
                }
            };
            try {
                // 发送请求
                if (option.POST) {
                    request.open("POST", _url, true);
                    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    // trace(sParameter);
                    request.send(sParameter);
                } else {
                    request.open("GET", _url, true);
                    request.send(null);
                }
                if (option.timeout && option.onTimeout) {
                    timer = setTimeout(function () {
                        onTimeout('请求超时', _url);
                    }, option.timeout);
                }
            } catch (e) {
                clearTimeout(timer);
                option.onException(e.message, _url);
                return false;
            }
            return request;
        }

        return {
            request: request
        }

    }

    /*
     *去掉html
     *
     **/
    Util.unhtml = function (str) {
        return str ? str.replace(/[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g, function (a, b) {
            if (b) {
                return a;
            } else {
                return {
                    '<': '&lt;',
                    '&': '&amp;',
                    '"': '&quot;',
                    '>': '&gt;',
                    "'": '&#39;'
                }[a]
            }

        }) : '';
    };

    Util.unit2Pixel = function (val) {
        if (!/(pt|cm)/.test(val)) {
            return val
        }
        var unit;
        val.replace(/([\d.]+)(\w+)/, function (str, v, u) {
            val = v;
            unit = u;
        });
        switch (unit) {
            case 'cm':
                val = parseFloat(val) * 25;
                break;
            case 'pt':
                val = Math.round(parseFloat(val) * 96 / 72);
        }
        return val + (val ? 'px' : '');
    }

    return Util;
});