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

$registComp(90, {
    "load": function () {
        this.setContent('<div class="cloneWidget" style="padding:0px;"' + '><div class="' + (this.size == 210 ? 'finance210-2 finance210' : 'finance' + this.size) + '">' + '<div class="tag_contants notag" id="comp_' + this.compId + '_content"></div></div>' + ($isAdmin ? '' : '<p class="fincAddToBlog" style="padding-bottom:5px;"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" /> 添加到我的博客</a></p>') + '</div>');
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
            this._tab = function (__stringKey) {
                var __arrayCode = ["GC", "CL"];
                for (var i in __arrayCode) {
                    var __stringCode = __arrayCode[i];
                    this._get("sfw_future_handle_" + __stringCode).className = __stringCode == __stringKey ? "cur" : "";
                    this._get("sfw_future_target_" + __stringCode).style.display = __stringCode == __stringKey ? "" : "none";
                }
            };
            this._update = function () {
                this._load("http://hq.sinajs.cn/?rn=" + this._random() + "&list=hf_GC,hf_CL", this._bind(function () {
                    var __fill = this._bind(function (__stringCode) {
                        var __stringKey = "hq_str_hf_" + __stringCode;
                        if (__stringKey in window && __stringKey != "") {
                            var __arrayData = window[__stringKey].split(",");
                            var __objectData = {};
                            __objectData["PRICE"] = (__arrayData[0] * 1).toFixed(2);
                            var __numberChange = __arrayData[0] * 1 - __arrayData[7] * 1;
                            var __stringFlag = "";
                            var __stringColor = "";
                            if (__numberChange > 0) {
                                __stringFlag = "+";
                                __stringColor = ' style="color:#008000;"';
                            } else if (__numberChange < 0) {
                                __stringColor = ' style="color:#f00;"';
                            }
                            __objectData["FLAG"] = __stringFlag;
                            __objectData["COLOR"] = __stringColor;
                            __objectData["CHANGE"] = __numberChange.toFixed(2);
                            __objectData["RATE"] = (__numberChange * 100 / (__arrayData[7] * 1)).toFixed(2);
                            __objectData["BEGIN"] = (__arrayData[8] * 1).toFixed(2);
                            __objectData["END"] = (__arrayData[7] * 1).toFixed(2);
                            __objectData["HIGH"] = (__arrayData[4] * 1).toFixed(2);
                            __objectData["LOW"] = (__arrayData[5] * 1).toFixed(2);
                            if (this._stringType != null && this._stringType != undefined) {
                                var __stringTextTemplate = {
                                    "s": '<p class="p1"@COLOR@>@PRICE@</p><p class="p2"@COLOR@>@FLAG@@CHANGE@ (@FLAG@@RATE@%)</p><div class="dotline"></div><ul class="fincInfoLi"><li>开盘价: @BEGIN@</li><li>昨结算: @END@</li><li>最高价: @HIGH@</li><li>最低价: @LOW@</li></ul>',
                                    "m": '<p class="p1"@COLOR@>@PRICE@</p><p class="p2"@COLOR@>@FLAG@@CHANGE@ (@FLAG@@RATE@%)</p>',
                                    "l": '<p class="p1"@COLOR@>@PRICE@</p><p class="p2"@COLOR@>@FLAG@@CHANGE@ (@FLAG@@RATE@%)</p><ul class="fincInfoLi"><li>开盘价: @BEGIN@</li><li>昨结算: @END@</li><li>最高价: @HIGH@</li><li>最低价: @LOW@</li></ul>'
                                }[this._stringType];
                                var __replace = function (__stringTemplate, __objectData) {
                                    var __stringResult = __stringTemplate;
                                    for (var i in __objectData) {
                                        __stringResult = __stringResult.replace(new RegExp("@" + i + "@", "g"), __objectData[i]);
                                    }
                                    return __stringResult;
                                };
                                this._get("sfw_future_text_" + __stringCode).innerHTML = __replace(__stringTextTemplate, __objectData);
                            }
                        }
                    });
                    __fill("GC");
                    __fill("CL");
                }), "GB2312");
            };
            this._refresh = function () {
                var __stringSrc = {
                    "s": "http://image.sinajs.cn/newchart/v5/futures/global/min_wap/@CODE@.gif",
                    "m": "http://image.sinajs.cn/newchart/v5/futures/global/mins/@CODE@.gif",
                    "l": "http://image.sinajs.cn/newchart/v5/futures/global/min/@CODE@.gif"
                }[this._stringType];
                this._image("sfw_future_image_GC", __stringSrc.replace("@CODE@", "GC") + "?" + this._random());
                this._image("sfw_future_image_CL", __stringSrc.replace("@CODE@", "CL") + "?" + this._random());
            };
            this._stop = function () {
                this._stringType = null;
                clearInterval(this._numberThreadUpdate);
                clearInterval(this._numberThreadImage);
                this._revent(this._elementHandleGC, "click", this._eventTabGC);
                this._elementHandleGC = null;
                this._revent(this._elementHandleCL, "click", this._eventTabCL);
                this._elementHandleCL = null;
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
                    "s": '<div class="financeTxt"><ul class="finatag oil"><li class="cur" id="sfw_future_handle_GC"><h5>COMEX黄金GC</h5></li><li id="sfw_future_handle_CL"><h5>NYMEX原油CL</h5></li></ul></div><div class="oil_contants" id="sfw_future_target_GC"><div id="sfw_future_text_GC"></div><div class="financeImg"><a href="http://finance.sina.com.cn/money/future/GC/quote.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_future_image_GC" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div></div><div class="oil_contants" id="sfw_future_target_CL" style="display:none;"><div id="sfw_future_text_CL"></div><div class="financeImg" id="sfw_future_target_CL"><a href="http://finance.sina.com.cn/money/future/CL/quote.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_future_image_CL" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div></div>',
                    "m": '<div class="financeTxt"><ul class="finatag"><li class="cur" id="sfw_future_handle_GC"><h5>COMEX黄金GC</h5><div id="sfw_future_text_GC"></div></li><li id="sfw_future_handle_CL"><h5>NYMEX原油CL</h5><div id="sfw_future_text_CL"></div></li></ul></div><div class="financeImg" id="sfw_future_target_GC"><a href="http://finance.sina.com.cn/money/future/GC/quote.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_future_image_GC" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div><div class="financeImg" id="sfw_future_target_CL" style="display:none;"><a href="http://finance.sina.com.cn/money/future/CL/quote.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_future_image_CL" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div>',
                    "l": '<div class="financeTxt"><ul class="finatag oil"><li class="cur" id="sfw_future_handle_GC"><h5>COMEX黄金GC</h5><div id="sfw_future_text_GC"></div></li><li id="sfw_future_handle_CL"><h5>NYMEX原油CL</h5><div id="sfw_future_text_CL"></div></li></ul></div><div class="financeImg" id="sfw_future_target_GC"><a href="http://finance.sina.com.cn/money/future/GC/quote.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_future_image_GC" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div><div class="financeImg" id="sfw_future_target_CL" style="display:none;"><a href="http://finance.sina.com.cn/money/future/CL/quote.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_future_image_CL" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div>'
                }[__stringType];
                this._elementContainer.innerHTML = __stringTemplate;
                this._elementHandleGC = this._get("sfw_future_handle_GC");
                this._eventTabGC = this._bind(this._tab, ["GC"]);
                this._aevent(this._elementHandleGC, "click", this._eventTabGC);
                this._elementHandleCL = this._get("sfw_future_handle_CL");
                this._eventTabCL = this._bind(this._tab, ["CL"]);
                this._aevent(this._elementHandleCL, "click", this._eventTabCL);
                this._update();
                this._refresh();
                this._numberThreadUpdate = setInterval(this._bind(this._update), 10 * 1000);
                this._numberThreadImage = setInterval(this._bind(this._refresh), 60 * 1000);
            };
            this._initialize = function (__stringContainer, __stringType) {
                this._stringSystemKey = "SinaFinanceWidgetFuture";
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
