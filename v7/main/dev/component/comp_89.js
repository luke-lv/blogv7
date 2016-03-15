/**
 * @fileoverview
 *    博客首页财经组件——
 全球股市    (id=88)
 全球汇市    (id=89)
 黄金原油    (id=90)
 期货指数    (id=91)
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");

$registComp(89, {
    "load": function () {
        this.setContent('<div class="cloneWidget" style="padding:0px;"' + '><div class="finance' + this.size + (this.size == 210 ? "-2" : "") + '" ' + ($isAdmin ? 'style="padding-bottom:10px;"' : '') + '><div id="comp_' + this.compId + '_content" class="tag_contants2"></div></div>' + ($isAdmin ? '' : '<p class="fincAddToBlog" style="padding-bottom:5px;"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" /> 添加到我的博客</a></p>') + '</div>');
        var comp_size = {
            "210": "s",
            "510": "m",
            "730": "l"
        };
        this.render("comp_" + this.compId + "_content", comp_size[this.size]);
    }, "render": function (__stringContainer, __stringType) {
        new function () {
            this._get = function (__stringId) {
                return typeof __stringId == "string" ? document.getElementById(__stringId) : __stringId;
            };
            this._bind = function (__functionBind, __argumentsBind) {
                var __this = this;
                return function () {
                    var __arguments = null;
                    if (typeof __argumentsBind != "undefined") {
                        for (var i = 0; i < arguments.length; i++) {
                            __argumentsBind.push(arguments[i]);
                        }
                        __arguments = __argumentsBind;
                    } else {
                        __arguments = arguments;
                    }
                    return __functionBind.apply(__this, __arguments);
                };
            };
            this._random = function () {
                return (new Date()).getTime() + Math.random().toString().replace("0.", "");
            };
            this._load = function (__stringUrl, __functionCallback, __stringCharset) {
                var __elementScript = document.createElement("script");
                __elementScript.type = "text/javascript";
                if (typeof __stringCharset != "undefined") {
                    __elementScript.charset = __stringCharset;
                }
                __elementScript._functionCallback = typeof __functionCallback != "undefined" ? __functionCallback : new Function();
                __elementScript[document.all ? "onreadystatechange" : "onload"] = function () {
                    if (document.all && this.readyState != "loaded" && this.readyState != "complete") {
                        return;
                    }
                    this._functionCallback(this);
                    this._functionCallback = null;
                    this[document.all ? "onreadystatechange" : "onload"] = null;
                    this.parentNode.removeChild(this);
                };
                __elementScript.src = __stringUrl;
                document.getElementsByTagName("head")[0].appendChild(__elementScript);
            };
            this._image = function (__objectTarget, __stringSrc, __functionCallback) {
                var __imageTarget = typeof __objectTarget == "string" ? document.getElementById(__objectTarget) : __objectTarget;
                var __elementImage = __imageTarget.cloneNode(true);
                __elementImage._imageTarget = __imageTarget;
                __elementImage._functionCallback = typeof __functionCallback != "undefined" ? __functionCallback : new Function();
                __elementImage[document.all ? "onreadystatechange" : "onload"] = function () {
                    if (document.all && this.readyState != "loaded" && this.readyState != "complete") {
                        return;
                    }
                    if (this._imageTarget.parentNode) {
                        this._imageTarget.parentNode.replaceChild(this, this._imageTarget);
                    }
                    __elementImage._functionCallback(this);
                    __elementImage._functionCallback = null;
                    this._imageTarget = null;
                    this[document.all ? "onreadystatechange" : "onload"] = null;
                };
                __elementImage.src = __stringSrc;
            };
            this._aevent = function (__elementTarget, __stringType, __functionEvent) {
                if (window.addEventListener) {
                    __elementTarget.addEventListener(__stringType, __functionEvent, false);
                } else if (window.attachEvent) {
                    __elementTarget.attachEvent("on" + __stringType, __functionEvent);
                }
            };
            this._revent = function (__elementTarget, __stringType, __functionEvent) {
                if (window.removeEventListener) {
                    __elementTarget.removeEventListener(__stringType, __functionEvent, false);
                } else if (window.attachEvent) {
                    __elementTarget.detachEvent("on" + __stringType, __functionEvent);
                }
            };
            this._select = function (__stringCode) {
                if (typeof __stringCode == "string") {
                    this._elementSelect.value = __stringCode;
                    this._stringCode = __stringCode;
                } else {
                    this._stringCode = this._elementSelect.value;
                }
                this._get("sfw_forex_link").href = "http://finance.sina.com.cn/money/forex/hq/" + this._stringCode + ".shtml";
                this._update();
                this._refresh();
            };
            this._update = function () {
                this._load("http://hq.sinajs.cn/?rn=" + this._random() + "&list=" + this._stringCode, this._bind(function () {
                    //~  time,buy_price,sell_price,last_close_price,margin,open_price,high_price,low_price,close_price,name
                    //~  0 时间,1 买入价,2 卖出价,3 昨收盘,4 点差,5 开盘价,6 最高价,7 最低价,8 最新价,9 名称
                    var __stringKey = "hq_str_" + this._stringCode;
                    if (__stringKey in window && __stringKey != "") {
                        var __arrayData = window[__stringKey].split(",");
                        var __numberChange = __arrayData[8] * 1 - __arrayData[3] * 1;
                        var __stringFlag = "";
                        var __stringColor = "";
                        if (__numberChange > 0) {
                            __stringFlag = "+";
                            __stringColor = ' style="color:#f00;"';
                        } else if (__numberChange < 0) {
                            __stringColor = ' style="color:#008000;"';
                        }
                        __numberChange = __numberChange.toFixed(4);
                        var __numberRate = (__numberChange * 100 / (__arrayData[3] * 1)).toFixed(2);
                        this._get("sfw_forex_text").innerHTML = '<li>最新价: ' + __arrayData[8] + '</li><li>涨跌额: <span' + __stringColor + '>' + __stringFlag + __numberChange + '</span></li><li>涨跌幅: <span' + __stringColor + '>' + __stringFlag + __numberRate + '%</span></li><li>开盘价: ' + __arrayData[5] + '</li>';
                    }
                }), "GB2312");
            };
            this._refresh = function () {
                this._image("sfw_forex_image", {
                    "s": "http://image.sinajs.cn/newchart/v5/forex/min_ws/@CODE@.gif",
                    "m": "http://image.sinajs.cn/newchart/v5/forex/min_m/@CODE@.gif",
                    "l": "http://image.sinajs.cn/newchart/v5/forex/min/@CODE@.gif"
                }[this._stringType].replace("@CODE@", this._stringCode) + "?" + this._random());
            };
            this._stop = function () {
                this._stringType = null;
                clearInterval(this._numberThreadUpdate);
                clearInterval(this._numberThreadImage);
                this._revent(this._elementSelect, "change", this._eventSelect);
                this._elementSelect = null;
                this._elementContainer.innerHTML = '';
                this._elementContainer = null;
                window[this._stringSystemKey] = null;
            };
            this._start = function (__stringContainer, __stringType) {
                window[this._stringSystemKey] = this;
                this._elementContainer = this._get(__stringContainer);
                this._stringType = __stringType;
                this._stringContainer = __stringContainer;
                var __stringTemplate = {
                    "s": '<div class="fincInfoLeft" style="padding-left:35px;padding-right:35px"><div class="slec"><select id="sfw_forex_select"><option value="EUR">欧元</option><option value="DINI">美元指数</option><option value="JPY">日元</option><option value="CHF">瑞郎</option><option value="GBP">英镑</option><option value="HKD">港币</option><option value="AUD">澳元</option><option value="CAD">加元</option><option value="ERUK">欧元英镑</option><option value="ERSF">欧元瑞郎</option><option value="SFYN">瑞郎日元</option><option value="ERYN">欧元日元</option><option value="ERCA">欧元加元</option><option value="ERHK">欧元港币</option><option value="AUER">澳元欧元</option><option value="AUCA">澳元加元</option><option value="AUSF">澳元瑞郎</option><option value="UKHK">英镑港币</option><option value="UKSF">英镑瑞郎</option><option value="UKCA">英镑加元</option><option value="UKYN">英镑日元</option><option value="UKAU">英镑澳元</option><option value="CAYN">加元日元</option><option value="CAHK">加元港币</option><option value="CHFCAD">瑞郎加元</option><option value="SFHK">瑞郎港币</option><option value="HKYN">港币日元</option><option value="AUHK">澳元港币</option><option value="AUYN">澳元日元</option><option value="ERAU">欧元澳元</option><option value="UKER">英镑欧元</option></select></div><ul class="fincInfoLi" id="sfw_forex_text"></ul><a href="#" id="sfw_forex_link" target="_blank"><img id="sfw_forex_image" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" /></a><div class="dotline"></div><div class="m210-6-m"><a href="http://finance.sina.com.cn/forex/index.shtml" target="_blank">更多</a></div></div>',
                    "m": '<div class="fincInfoLeft finc6"><div class="slec"><select id="sfw_forex_select"><option value="EUR">欧元</option><option value="DINI">美元指数</option><option value="JPY">日元</option><option value="CHF">瑞郎</option><option value="GBP">英镑</option><option value="HKD">港币</option><option value="AUD">澳元</option><option value="CAD">加元</option><option value="ERUK">欧元英镑</option><option value="ERSF">欧元瑞郎</option><option value="SFYN">瑞郎日元</option><option value="ERYN">欧元日元</option><option value="ERCA">欧元加元</option><option value="ERHK">欧元港币</option><option value="AUER">澳元欧元</option><option value="AUCA">澳元加元</option><option value="AUSF">澳元瑞郎</option><option value="UKHK">英镑港币</option><option value="UKSF">英镑瑞郎</option><option value="UKCA">英镑加元</option><option value="UKYN">英镑日元</option><option value="UKAU">英镑澳元</option><option value="CAYN">加元日元</option><option value="CAHK">加元港币</option><option value="CHFCAD">瑞郎加元</option><option value="SFHK">瑞郎港币</option><option value="HKYN">港币日元</option><option value="AUHK">澳元港币</option><option value="AUYN">澳元日元</option><option value="ERAU">欧元澳元</option><option value="UKER">英镑欧元</option></select></div><ul class="fincInfoLi fli" id="sfw_forex_text"></ul></div><div class="fincConnRight"><a href="#" id="sfw_forex_link" target="_blank"><img id="sfw_forex_image" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" /></a><span class="flr"><a href="http://finance.sina.com.cn/forex/index.shtml" target="_blank">更多</a></span></div>',
                    "l": '<div class="fincInfoLeft"><div class="slec"><select id="sfw_forex_select"><option value="EUR">欧元</option><option value="DINI">美元指数</option><option value="JPY">日元</option><option value="CHF">瑞郎</option><option value="GBP">英镑</option><option value="HKD">港币</option><option value="AUD">澳元</option><option value="CAD">加元</option><option value="ERUK">欧元英镑</option><option value="ERSF">欧元瑞郎</option><option value="SFYN">瑞郎日元</option><option value="ERYN">欧元日元</option><option value="ERCA">欧元加元</option><option value="ERHK">欧元港币</option><option value="AUER">澳元欧元</option><option value="AUCA">澳元加元</option><option value="AUSF">澳元瑞郎</option><option value="UKHK">英镑港币</option><option value="UKSF">英镑瑞郎</option><option value="UKCA">英镑加元</option><option value="UKYN">英镑日元</option><option value="UKAU">英镑澳元</option><option value="CAYN">加元日元</option><option value="CAHK">加元港币</option><option value="CHFCAD">瑞郎加元</option><option value="SFHK">瑞郎港币</option><option value="HKYN">港币日元</option><option value="AUHK">澳元港币</option><option value="AUYN">澳元日元</option><option value="ERAU">欧元澳元</option><option value="UKER">英镑欧元</option></select></div><ul class="fincInfoLi" id="sfw_forex_text"></ul></div><div class="fincConnRight" style="padding-top: 0pt;"><a href="#" id="sfw_forex_link" target="_blank"><img id="sfw_forex_image" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" /></a><span class="flr"><a href="http://finance.sina.com.cn/forex/index.shtml" target="_blank">更多</a></span></div>'
                }[__stringType];
                this._elementContainer.innerHTML = __stringTemplate;
                this._elementSelect = this._get("sfw_forex_select");
                this._eventSelect = this._bind(this._select);
                this._aevent(this._elementSelect, "change", this._eventSelect);
                this._select("DINI");
                this._numberThreadUpdate = setInterval(this._bind(this._update), 10 * 1000);
                this._numberThreadImage = setInterval(this._bind(this._refresh), 60 * 1000);
            };
            this._initialize = function (__stringContainer, __stringType) {
                this._stringSystemKey = "SinaFinanceWidgetForex";
                if (this._stringSystemKey in window && window[this._stringSystemKey] != null) {
                    var __loader = window[this._stringSystemKey];
                    if (__loader._stringType != __stringType || __loader._elementContainer != this._get(__stringContainer)) {
                        __loader._stop();
                        this._start(__stringContainer, __stringType);
                    }
                } else {
                    this._start(__stringContainer, __stringType);
                }
            };
            this._initialize.apply(this, arguments);
        }(__stringContainer, __stringType);
    }
}, "dynamic");
