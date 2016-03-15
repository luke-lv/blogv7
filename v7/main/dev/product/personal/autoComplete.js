/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @将一个特定格式的json拼成querystring.
 * @2009-08-14 Modified by Random | YangHao@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("lib/interface.js");
$import("sina/core/string/trim.js");

scope.jsonToQuery = function (JSON, isEncode) {
    var _Qstring = [];
    var _fdata = function (data) {
        data = Core.String.trim(data.toString());
        if (isEncode) {
            return encodeURIComponent(data);
        } else {
            return data;
        }
    };
    if (typeof JSON == "object") {
        for (var k in JSON) {
            if (JSON[k] instanceof Array) {
                for (var i = 0, len = JSON[k].length; i < len; i++) {
                    _Qstring.push(k + "=" + _fdata(JSON[k][i]));
                }
            } else {
                _Qstring.push(k + "=" + _fdata(JSON[k]));
            }
        }
    }
    if (_Qstring.length) {
        return _Qstring.join("&");
    } else {
        return "";
    }
};

/*
 *autocomplate Robin Young | yonglin@staff.sina.com.cn
 */
(function (proxy) {

    //创建一个标签
    var $C = function (tname) {
        return document.createElement(tname);
    };
    //获取一个标签
    var $E = function (id) {
        if (typeof id == "string") {
            return document.getElementById(id);
        } else {
            return id;
        }
    };
    //把一个方法帮定到一个对象上
    var bind = function (fun, obj) {
        var __method = fun;
        return function () {
            return __method.apply(obj, arguments);
        };
    };
    //为dom对象帮定事件
    var adEvent = function (elm, func, evType, useCapture) {
        var _el = $E(elm);
        if (_el == null) {
            return false;
        }
        if (typeof useCapture == 'undefined') {
            useCapture = false;
        }
        if (typeof evType == 'undefined') {
            evType = 'click';
        }
        if (_el.addEventListener) {
            _el.addEventListener(evType, func, useCapture);
            return true;
        } else if (_el.attachEvent) {
            var r = _el.attachEvent('on' + evType, func);
            return true;
        } else {
            _el['on' + evType] = func;
            return true;
        }
    };
    //为dom对象移除一个事件
    var rmEvent = function (oElement, fHandler, sName, useCapture) {
        var _el = $E(oElement);
        if (_el == null) {
            return false;
        }
        if (typeof fHandler != "function") {
            return false;
        }
        if (_el.addEventListener) {
            _el.removeEventListener(sName, fHandler, useCapture);
            return true;
        } else if (_el.attachEvent) {
            _el.detachEvent("on" + sName, fHandler);
            return true;
        } else {
            _el['on' + sName] = null;
            return true;
        }
    };
    //返回一个dom对象所在的位置
    var elPos = function (el) {
        var _pos = {"left": 0, "top": 0};
        var _el = el;
        while (_el.offsetParent) {
            _pos["top"] += _el.offsetTop;
            _pos["left"] += _el.offsetLeft;
            _el = _el.offsetParent;
        }
        return _pos;
    };
    //基于Interface的异步请求缓存函数，返回一个对象含有request方法
    var ajaxCache = function (url, mothed) {
        var ajax = new Object();
        var trans = new Interface(url, mothed);
        var cache = {};
        ajax.request = function (args) {
            var json = cache[proxy.jsonToQuery(args['POST'] || args['GET'])];
            if (json) {
                setTimeout(function () {
                    args['onSuccess'](json);
                }, 1);
            } else {
                args['cacheFun'] = args['onSuccess'];
                args['onSuccess'] = function (json) {
                    args['cacheFun'](json);
                    cache[proxy.jsonToQuery(args['POST'] || args['GET'])] = json;
                };
                trans.request(args);
            }
        };
        return ajax;
    };
    //autocomplate
    /**

     * @param {Object} el:所要帮定自动完成的input输入框。
     * @param {Object} data:自动完成需要的数据,如果给字符串就当作是url搜索。如果是数据对象则需要保持[{'value':'1','text':'a'},.....]格式
     * @param {Object} args:其余参数，
     class,壳元素的className
     style,壳元素的样式。
     searchNullText：搜索结果为空的时候的文本。
     searchEmptyText：当什么都没搜的时候提示的文本。
     searchFun：两个参数,数据对象，key。
     complateFun：两个参数，input框，匹配到的值。
     lightOnFun：一个参数，一个item元素。
     lightOffFun：一个参数，一个item元素。

     */
    //定义按键的编码
    var KEYENTER = 13;
    var KEYESC = 27;
    var KEYUP = 38;
    var KEYDOWN = 40;
    var KEYLEFT = 37;
    var KEYRIGHT = 39;
    var KEYBACK = 8;
    var KEYTABLE = 9;

    var ac = function (el, data, args) {
        if (!el) {
            return false;
        }
        //搜索专用文本输入框
        this.input = el;
        //提示列表元素的池子
        this.itemPool = [];
        //显示搜索结果的个数。可以看成itemPool中前多少个元素显示。
        this.showLen = 0;
        //当前选中的元素的index值。可以看成itemPool中控制显示的指针。
        this.current = -1;
        //当前搜索结果的关键字。
        this.keyText = '';
        //用于循环去查找搜索结果的定时器。
        this.timer = null;
        //自动完成提示列表的壳元素。
        this.box = $C('DIV');
        this.shell = $C('UL');
        //当一些特殊操作而产生的提示信息，非列表元素。
        this.infoEle = $C('LI');
        this.infoEle.style.display = "none";
        //控制自动完成的开关
        this.runAuto = true;
        //控制提示层的样式。
        if (args['class']) {
            this.box.className = args['class'];
        }
        if (args['style']) {
            this.box.style.cssText = args['style'];
        }
        //控制提示层的位置。
        this.box.style.position = 'absolute';
        this.box.style.zIndex = '300';
        document.body.appendChild(this.box);
        this.box.style.display = 'none';
        this.box.appendChild(this.shell);
        this.shell.appendChild(this.infoEle);
        if ($IE) {
            this.backIframe = $C('IFRAME');
            this.backIframe.style.cssText = 'width:99%;position:absolute;top:0px;left:0px;z-index:-1;';
            this.backIframe.frameBorder = '0';
            this.backIframe.setAttribute('scrolling', 'no');

            this.box.appendChild(this.backIframe);
        }
        //关于提示文本的内容
        //缺省的提交数据
        this.onSearchNullTextShow = args.onSearchNullTextShow;
        this.defalutAjaxData = {};
        this.nullTxt = args.searchNullText || null;
        this.emptyTxt = args.searchEmptyText || null;
        this.SearchNull = false;
        //处理数据，当数据为字符串时认为是ajax提示
        this.data = data;
        if (typeof data == 'string') {
            this.trans = ajaxCache(data, "jsload");
        }
        //初始化
        this.init(args);
    };
    (function (_p) {
        //alert('in3');
        //类的结构函数
        _p.init = function (args) {
            //全是方法的绑定
            this.pressFun = bind(this.press, this);
            this.focusFun = bind(this.startLoop, this);
            this.blurFun = bind(this.endLoop, this);
            this.loopFun = bind(this.looping, this);
            if ($IE) {
                adEvent(this.input, this.pressFun, 'keydown');
            } else {
                adEvent(this.input, this.pressFun, 'keypress');
            }
            adEvent(this.input, this.focusFun, 'focus');
            adEvent(this.input, this.blurFun, 'blur');
            if (args.searchFun) {
                this.searchs = args.searchFun;
            }
            if (args.complateFun) {
                this.complate = args.complateFun;
            }
            if (args.lightOnFun) {
                this.lightOn = args.lightOnFun;
            }
            if (args.lightOffFun) {
                this.lightOff = args.lightOffFun;
            }
            if (args.show) {
                this.show = args.show;
            }
        };
        _p.disp = function () {

        };
        //对于外部帮定函数的缺省函数
        _p.searchs = function (data, key) {
            var ret = [];
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i]['value'].indexOf(key) === 0) {
                    ret.push(data[i]);
                }
            }
            return ret;
        };
        _p.complate = function (inp, value, text) {
            inp.value = text;
        };
        _p.lightOn = function (item) {
            item.elem.style.background = '#C6C6C6';
        };
        _p.lightOff = function (item) {
            item.elem.style.background = '';
        };
        //用户键盘事件的处理
        _p.press = function (e) {
            //判断是否执行焦点事件 haidong
            if (!this.initLoop) {
                this.focusFun();
            }

            var ev = window.event || e;
            if (!this.runAuto) {
                return true;
            }
            switch (ev.keyCode) {
                case KEYENTER    :
                    this.ok();
                    break;
                case KEYESC        :
                    this.clear();
                    break;
                case KEYUP        :
                    this.up();
                    break;
                case KEYDOWN    :
                    this.down();
                    break;
                case KEYLEFT    :
                    this.back();
                    break;
                case KEYRIGHT    :
                    this.ok();
                    break;
                //case KEYTABLE	: this.tab();break;
            }
            if (ev.keyCode == KEYTABLE || ev.keyCode == KEYLEFT || ev.keyCode == KEYENTER || ev.keyCode == KEYRIGHT) {
                if (!$IE) {
                    ev.preventDefault();
                }
                ev.returnValue = false;
            }
            if (ev.keyCode == KEYLEFT || ev.keyCode == KEYENTER) {
                this.input.blur();
            }

        };
        _p.move = function (index) {
            if (this.current == index || this.showLen <= 0) {
                return false;
            }
            if (this.current >= 0 && this.current <= this.showLen - 1) {
                this.lightOff(this.itemPool[this.current]);
            }
            this.lightOn(this.itemPool[index]);
            this.current = index;
        };
        _p.up = function () {
            if (this.current <= 0) {
                this.move(this.showLen - 1);
            } else {
                this.move(this.current - 1);
            }
        };
        _p.down = function () {
            if (this.current >= this.showLen - 1) {
                this.move(0);
            } else {
                this.move(this.current + 1);
            }
        };
        _p.back = function () {
            //alert('back');
        };
        _p.ok = function () {
            //没有匹配时按回车 haidong
            if (!this.itemPool[this.current]) {
                return false;
            }
            this.complate(this.input, this.itemPool[this.current]["value"], this.itemPool[this.current]['elem'].innerHTML);
            setTimeout(bind(this.hidd, this), 100);
            //this.stop();
            //alert('OK');
            //this.bind.OK(this.itemPool[this.current]);
        };
        _p.tab = function () {
            //alert('tab');
        };
        _p.stop = function () {
            this.endLoop();
            this.runAuto = false;
        };
        _p.begin = function () {
            this.runAuto = true;
        };
        //搜索过程的处理
        _p.looping = function () {
            var _inputValue = Core.String.trim(this.input.value);
            if (this.keyText == _inputValue) {
                return false;
            } else {
                if (!_inputValue.length) {
                    for (var i = 0, len = this.showLen; i < len; i++) {
                        this.itemPool[i].elem.style.display = 'none';
                    }
                    this.keyText = '';
                    if (this.emptyTxt) {
                        this.infoEle.style.display = '';
                        this.infoEle.innerHTML = this.emptyTxt;
                    }
                    this.box.style.display = '';
                    if ($IE) {
                        this.backIframe.height = this.infoEle.offsetHeight + 'px';
                    }
                    return false;
                } else {

                    //如果已经没搜索到了，那之后的搜索也不会有内容，则不请求。
                    if (this.SearchNull && this.keyText.length) {
                        if (_inputValue.indexOf(this.keyText) === 0) {
                            return false;
                        }
                    }
                    this.keyText = _inputValue;
                    this.infoEle.style.display = 'none';
                }
                if (typeof this.data == 'string') {
                    var postData = {'spell': this.keyText};
                    for (var k in this.defalutAjaxData) {
                        postData[k] = this.defalutAjaxData[k];
                    }
                    this.trans.request({
                        'GET': postData,
                        'onSuccess': bind(function (json) {
                            this.show(json);
                        }, this),
                        'onError': bind(function () {
                            this.box.style.display = 'none';
                        }, this)
                    });
                } else {
                    this.show(this.searchs(this.data, this.keyText));
                }
            }
        };

        _p.startLoop = function () {
            this.initLoop = true; //标志完成haidong
            //repostion
            var pos = elPos(this.input);
            this.box.style.top = pos['top'] + parseInt(this.input.offsetHeight) + 'px';
            this.box.style.left = pos['left'] + 'px';
            //this.endLoop();
            if (!this.runAuto) {
                return false;
            }
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.timer = setInterval(this.loopFun, 400);
            if (!this.input.value.length) {
                for (var i = 0, len = this.showLen; i < len; i++) {
                    this.itemPool[i].elem.style.display = 'none';
                }
                if (this.emptyTxt) {
                    this.infoEle.style.display = '';
                    this.infoEle.innerHTML = this.emptyTxt;
                }
            }
            this.keyText = '';
            this.box.style.display = '';
            if ($IE) {
                this.backIframe.height = this.infoEle.offsetHeight + 'px';
            }
            this.loopFun();
        };

        _p.endLoop = function () {
            setTimeout(bind(function () {
                this.infoEle.style.display = 'none';
            }, this), 50);
            try {
                clearInterval(this.timer);
            } catch (exp) {
            }
            setTimeout(bind(this.hidd, this), 100);
        };

        //关于浮层显示的一些代码
        _p.show = function (data) {
            this.box.style.display = '';
            if (this.current != -1) {
                this.lightOff(this.itemPool[this.current]);
            }
            this.showLen = data.length;
            this.current = -1;
            for (var i = 0; i < data.length; i++) {
                if (typeof data[i] == 'string') {
                    data[i] = {'value': data[i], 'text': data[i]};
                }
                if (i >= this.itemPool.length) {
                    var zj = this.getItem(i);
                    zj.set(data[i].value, data[i].text);
                    this.itemPool.push(zj);
                    this.shell.appendChild(zj.elem);
                } else {
                    this.itemPool[i].set(data[i].value, data[i].text);
                    this.itemPool[i].elem.style.display = '';
                }
            }
            for (var i = this.itemPool.length, len = data.length; i > len; i--) {
                this.itemPool[i - 1].elem.style.display = "none";
            }
            if (data.length <= 0) {
                if (this.nullTxt) {
                    this.infoEle.style.display = '';
                    this.infoEle.innerHTML = this.nullTxt;
                    if (this.onSearchNullTextShow) {
                        this.onSearchNullTextShow();
                    }
                    this.box.style.display = '';
                } else {
                    this.box.style.display = 'none';
                }
                if ($IE) {
                    this.backIframe.height = this.shell.offsetHeight + 'px';
                }
                this.SearchNull = true;
            } else {
                this.infoEle.style.display = 'none';
                this.box.style.display = '';
                if ($IE) {
                    this.backIframe.height = this.shell.offsetHeight + 'px';
                }
                this.SearchNull = false;
            }
        };
        _p.hidd = function () {
            this.box.style.display = 'none';
            //this.clear();
        };
        _p.clear = function () {
            for (var i = 0, len = this.showLen; i < len; i++) {
                this.shell.removeChild(this.itemPool[i]);
            }
            this.showLen = 0;
            this.current = -1;
        };

        //关于表现效果的代码

        //等到一个用于显示一条搜索结果的item
        /**

         * @param {Object} index 自身的索引
         * @param {method} 函数返回一个item,包含了一个set方法，它接受两个参数(value,text)
         */
        _p.getItem = function (index) {
            var item = {
                'value': null,
                'elem': $C("LI"),
                'index': index
            };
            item.set = function (value, text) {
                item.value = value;
                item.elem.innerHTML = text || value;
            };
            item.focus = function () {
                this.move(item.index);
            };
            item.elem.setAttribute("unselectable", "on");
            adEvent(item.elem, bind(item.focus, this), 'mouseover');
            //解决点击自动完成会使焦点失去而点不上的问题。
            adEvent(item.elem, function (e) {
                var ev = window.event || e;
                if (!$IE) {
                    ev.preventDefault();
                }
                ev.returnValue = false;
                return false;
            }, 'mousedown');
            adEvent(item.elem, bind(function () {
                this.ok();
                this.input.blur();
            }, this), 'click');
            return item;
        };
    })(ac.prototype);

    proxy.autoComplate = ac;
})(scope);
