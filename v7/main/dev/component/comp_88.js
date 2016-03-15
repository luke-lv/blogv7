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

$registComp(88, {

    "load": function () {
        this.setContent('<div class="cloneWidget" ' + ($isAdmin ? 'style="padding:0px;"' : 'style="padding:0px;"') + '><div class="finance' + this.size + '" ' + (this.size != 210 ? 'style="padding-bottom:15px;"' : '') + '><div id="comp_' + this.compId + '_content"></div></div>' + ($isAdmin ? '' : '<p class="fincAddToBlog" style="padding-bottom:5px;"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" /> 添加到我的博客</a></p>')) + '</div>';
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
            this._parseHq = function (type, code, adnlObj) {
                var sData = window[["hq_str_", code].join("")].split(",");
                var _getSt = function (value) {
                    return value != 0 ? (value > 0 ? "up" : "down") : "default";
                };
                switch (type) {
                    case "cn":
                        var _price = (sData[1] * 1).toFixed(2);
                        var _obj = {
                            name: sData[0],
                            price: _price,
                            change: (sData[2] * 1) > 0 ? "+" + (sData[2] * 1).toFixed(2) : (sData[2] * 1).toFixed(2),
                            rate: (sData[3] * 1) > 0 ? ["+", sData[3], "%"].join("") : [sData[3], "%"].join(""),
                            upordown: _getSt((sData[2] * 1))
                        };
                        break;
                    case "hk":
                        var _price = sData[6];
                        var _obj = {
                            name: sData[0],
                            price: _price,
                            change: (sData[7] * 1) > 0 ? "+" + sData[7] : sData[7],
                            rate: (sData[8] * 1) > 0 ? ["+", sData[8], "%"].join("") : [sData[8], "%"].join(""),
                            upordown: _getSt((sData[7] * 1))
                        };
                        break;
                    case "bb":
                        var _price = sData[1];
                        var _obj = {
                            name: sData[0],
                            price: _price,
                            change: (sData[2] * 1) > 0 ? "+" + sData[2] : sData[2],
                            rate: (sData[3] * 1) > 0 ? ["+", sData[3], "%"].join("") : [sData[3], "%"].join(""),
                            upordown: _getSt((sData[2] * 1))
                        };
                        break;
                    case "us":
                        var _price = sData[1];
                        var _obj = {
                            name: sData[0],
                            price: _price,
                            change: (sData[4] * 1) > 0 ? "+" + sData[4] : sData[4],
                            rate: (sData[2] * 1) > 0 ? ["+", sData[2], "%"].join("") : [sData[2], "%"].join(""),
                            upordown: _getSt((sData[2] * 1))
                        };
                        break;
                    case "fu":
                        var _change = sData[0] - sData[7];
                        var _price = (sData[0] * 1).toFixed(2);
                        var _obj = {
                            price: _price,
                            change: _change > 0 ? "+" + _change.toFixed(2) : _change.toFixed(2),
                            rate: _change > 0 ? ["+", (_change / sData[7] * 100).toFixed(2),
                                "%"].join("") : [(_change / sData[7] * 100).toFixed(2), "%"].join(""),
                            upordown: _getSt(_change)
                        };
                        break;
                }
                _obj.code = _obj;
                if (adnlObj) {
                    for (var i in adnlObj) {
                        _obj[i] = adnlObj[i];
                    }
                    ;
                }
                return _obj;
            };
            this._tab = function (__stringKey) {
                var __arrayCode = ["CN", "AS", "US", "EU"];
                for (var i in __arrayCode) {
                    var __stringCode = __arrayCode[i];
                    this._get("sfw_global_tab_" + __stringCode).className = __stringCode == __stringKey ? "cur" : "";
                    this._get("sfw_global_target_" + __stringCode).style.display = __stringCode == __stringKey ? "" : "none";
                }
            };
            this._tabSub = function (__stringKey) {
                var __arrayCode = ["sh000001", "sz399001"];
                for (var i in __arrayCode) {
                    var __stringCode = __arrayCode[i];
                    this._get("sfw_global_tab_CN_tab_" + __stringCode).className = __stringCode == __stringKey ? "cur" : "";
                    this._get("sfw_global_tab_CN_target_" + __stringCode).style.display = __stringCode == __stringKey ? "" : "none";
                }
            };
            this._update = function () {
                this._load("http://hq.sinajs.cn/?rn=" + this._random() + "&list=s_sh000001,s_sz399001,hkHSI,b_NKY,b_TWSE,b_FSSTI,gb_dji,gb_ixic,gb_inx,hf_DJS,b_UKX,b_DAX,b_CAC,b_INDEXCF", this._bind(function () {
                    var __fill = this._bind(function (__stringCode, __stringType) {
                        var __stringKey = "hq_str_" + __stringCode;
                        if (__stringKey in window && __stringKey != "") {
                            var __objectData = this._parseHq(__stringType, __stringCode);
                            __objectData["PRICE"] = __objectData.price;
                            __objectData["CHANGE"] = __objectData.change;
                            __objectData["RATE"] = __objectData.rate;
                            var __objectColor = {"default": "", "up": ' style="color:#008000;"', "down": ' style="color:#f00;"'};
                            var __objectTextTemplate = {
                                "s": '<span class="spcol1">@PRICE@</span><span class="spcol1"@COLOR@>@CHANGE@</span><span class="spcol1"@COLOR@>@RATE@</span>',
                                "m": '<span class="spcol1">@PRICE@</span><span class="spcol1"@COLOR@>@CHANGE@</span><span class="spcol1"@COLOR@>@RATE@</span>',
                                "l": '<span class="spcol1">@PRICE@</span><span class="spcol1"@COLOR@>@CHANGE@</span><span class="spcol1"@COLOR@>@RATE@</span>'
                            };
                            if (__stringType == "cn") {
                                __objectColor = {"default": "", "up": ' style="color:#f00;"', "down": ' style="color:#008000;"'};
                                __objectTextTemplate = {
                                    "s": '<p class="p1">@PRICE@</p><p class="p2"@COLOR@>@CHANGE@ (@RATE@)</p>',
                                    "m": '<p class="p1">@PRICE@</p><p class="p2"@COLOR@>@CHANGE@ (@RATE@)</p>',
                                    "l": '<p class="p1">@PRICE@</p><p class="p2"@COLOR@>@CHANGE@ (@RATE@)</p>'
                                };
                            }
                            __objectData["COLOR"] = __objectColor[__objectData.upordown];
                            if (this._stringType != null && this._stringType != undefined) {
                                var __stringTextTemplate = __objectTextTemplate[this._stringType];
                                var __replace = function (__stringTemplate, __objectData) {
                                    var __stringResult = __stringTemplate;
                                    for (var i in __objectData) {
                                        __stringResult = __stringResult.replace(new RegExp("@" + i + "@", "g"), __objectData[i]);
                                    }
                                    return __stringResult;
                                };
                                this._get("sfw_global_text_" + __stringCode).innerHTML = __replace(__stringTextTemplate, __objectData);
                            }
                        }
                    });
                    var __arrayCode = [
                        {"code": "s_sh000001", "type": "cn"},
                        {"code": "s_sz399001", "type": "cn"},
                        {"code": "hkHSI", "type": "hk"},
                        {"code": "b_NKY", "type": "bb"},
                        {"code": "b_TWSE", "type": "bb"},
                        {"code": "b_FSSTI", "type": "bb"},
                        {"code": "gb_dji", "type": "us"},
                        {"code": "gb_ixic", "type": "us"},
                        {"code": "gb_inx", "type": "us"},
                        {"code": "hf_DJS", "type": "fu"},
                        {"code": "b_UKX", "type": "bb"},
                        {"code": "b_DAX", "type": "bb"},
                        {"code": "b_CAC", "type": "bb"},
                        {"code": "b_INDEXCF", "type": "bb"}
                    ];
                    for (var i in __arrayCode) {
                        __fill(__arrayCode[i]["code"], __arrayCode[i]["type"]);
                    }
                }), "GB2312");
            };
            this._refresh = function () {
                var __stringSrc = {
                    "s": "http://image2.sinajs.cn/newchart/min.wap/@CODE@.gif",
                    "m": "http://image.sinajs.cn/newchart/small/n@CODE@.gif",
                    "l": "http://image2.sinajs.cn/newchart/min/n/@CODE@.gif"
                }[this._stringType];
                this._image("sfw_global_tab_CN_image_sh000001", __stringSrc.replace("@CODE@", "sh000001") + "?" + this._random());
                this._image("sfw_global_tab_CN_image_sz399001", __stringSrc.replace("@CODE@", "sz399001") + "?" + this._random());
            };
            this._stop = function () {
                this._stringType = null;
                clearInterval(this._numberThreadUpdate);
                clearInterval(this._numberThreadImage);
                this._revent(this._elementHandleCN, "click", this._eventTabCN);
                this._elementHandleCN = null;
                this._revent(this._elementHandleAS, "click", this._eventTabAS);
                this._elementHandleAS = null;
                this._revent(this._elementHandleUS, "click", this._eventTabUS);
                this._elementHandleUS = null;
                this._revent(this._elementHandleEU, "click", this._eventTabEU);
                this._elementHandleEU = null;
                this._revent(this._elementHandlesh000001, "click", this._eventTabSubsh000001);
                this._elementHandlesh000001 = null;
                this._revent(this._elementHandlesz399001, "click", this._eventTabSubsz399001);
                this._elementHandlesz399001 = null;
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
                    "s": '<div class="finance_tag"><ul><li class="cur" id="sfw_global_tab_CN"><span>中国</span></li><li id="sfw_global_tab_AS"><span>亚太</span></li><li id="sfw_global_tab_US"><span>北美</span></li><li id="sfw_global_tab_EU"><span>欧洲</span></li></ul></div><div class="tag_contants" id="sfw_global_target_CN"><div class="financeTxt"><ul class="finatag"><li class="cur" id="sfw_global_tab_CN_tab_sh000001"><h5>上证综指</h5><div id="sfw_global_text_s_sh000001">--</div></li><li id="sfw_global_tab_CN_tab_sz399001"><h5>深证成指</h5><div id="sfw_global_text_s_sz399001">--</div></li></ul></div><div class="financeImg" id="sfw_global_tab_CN_target_sh000001"><a href="http://finance.sina.com.cn/realstock/company/sh000001/nc.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_global_tab_CN_image_sh000001" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div><div class="financeImg" id="sfw_global_tab_CN_target_sz399001" style="display:none;"><a href="http://finance.sina.com.cn/realstock/company/sz399001/nc.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_global_tab_CN_image_sz399001" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div></div><div class="tag_contants" id="sfw_global_target_AS" style="display:none;"><div class="overSea"><dl><dt>香港恒生指数</dt><dd><div id="sfw_global_text_hkHSI">--</div></dd><dt>日经225指数</dt><dd><div id="sfw_global_text_b_NKY">--</div></dd><dt>台湾加权指数</dt><dd><div id="sfw_global_text_b_TWSE">--</div></dd><dt>新加坡海峡时报指数</dt><dd><div id="sfw_global_text_b_FSSTI">--</div></dd></dl></div></div><div class="tag_contants" id="sfw_global_target_US" style="display:none;"><div class="overSea"><dl><dt>道琼斯</dt><dd><div id="sfw_global_text_gb_dji">--</div></dd><dt>纳斯达克</dt><dd><div id="sfw_global_text_gb_ixic">--</div></dd><dt>标普500</dt><dd><div id="sfw_global_text_gb_inx">--</div></dd><dt>道指期货</dt><dd><div id="sfw_global_text_hf_DJS">--</div></dd></dl></div></div><div class="tag_contants" id="sfw_global_target_EU" style="display:none;"><div class="overSea"><dl><dt>英金融时报指数</dt><dd><div id="sfw_global_text_b_UKX">--</div></dd><dt>德国DAX指数</dt><dd><div id="sfw_global_text_b_DAX">--</div></dd><dt>法CAC40指数</dt><dd><div id="sfw_global_text_b_CAC">--</div></dd><dt>俄MICEX指数</dt><dd><div id="sfw_global_text_b_INDEXCF">--</div></dd></dl></div></div>',
                    "m": '<div class="finance_tag"><ul><li class="cur" id="sfw_global_tab_CN"><span>中国</span></li><li id="sfw_global_tab_AS"><span>亚太</span></li><li id="sfw_global_tab_US"><span>北美</span></li><li id="sfw_global_tab_EU"><span>欧洲</span></li></ul><span class="SG_more"><a href="http://finance.sina.com.cn/money/globalindex/index.shtml" target="_blank">更多</a>&gt;&gt;</span></div><div class="tag_contants" id="sfw_global_target_CN"><div class="financeTxt"><ul class="finatag"><li class="cur" id="sfw_global_tab_CN_tab_sh000001"><h5>上证综指</h5><div id="sfw_global_text_s_sh000001">--</div></li><li id="sfw_global_tab_CN_tab_sz399001"><h5>深证成指</h5><div id="sfw_global_text_s_sz399001">--</div></li></ul></div><div class="financeImg" id="sfw_global_tab_CN_target_sh000001"><a href="http://finance.sina.com.cn/realstock/company/sh000001/nc.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_global_tab_CN_image_sh000001" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div><div class="financeImg" id="sfw_global_tab_CN_target_sz399001" style="display:none;"><a href="http://finance.sina.com.cn/realstock/company/sz399001/nc.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_global_tab_CN_image_sz399001" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div></div><div class="tag_contants" id="sfw_global_target_AS" style="display:none;"><div class="overSea"><dl><dt>香港恒生指数</dt><dd><div id="sfw_global_text_hkHSI">--</div></dd><dt>日经225指数</dt><dd><div id="sfw_global_text_b_NKY">--</div></dd><dt>台湾加权指数</dt><dd><div id="sfw_global_text_b_TWSE">--</div></dd><dt>新加坡海峡时报指数</dt><dd><div id="sfw_global_text_b_FSSTI">--</div></dd></dl></div></div><div class="tag_contants" id="sfw_global_target_US" style="display:none;"><div class="overSea"><dl><dt>道琼斯</dt><dd><div id="sfw_global_text_gb_dji">--</div></dd><dt>纳斯达克</dt><dd><div id="sfw_global_text_gb_ixic">--</div></dd><dt>标普500</dt><dd><div id="sfw_global_text_gb_inx">--</div></dd><dt>道指期货</dt><dd><div id="sfw_global_text_hf_DJS">--</div></dd></dl></div></div><div class="tag_contants" id="sfw_global_target_EU" style="display:none;"><div class="overSea"><dl><dt>英金融时报指数</dt><dd><div id="sfw_global_text_b_UKX">--</div></dd><dt>德国DAX指数</dt><dd><div id="sfw_global_text_b_DAX">--</div></dd><dt>法CAC40指数</dt><dd><div id="sfw_global_text_b_CAC">--</div></dd><dt>俄MICEX指数</dt><dd><div id="sfw_global_text_b_INDEXCF">--</div></dd></dl></div></div>',
                    "l": '<div class="finance_tag"><ul><li class="cur" id="sfw_global_tab_CN"><span>中国</span></li><li id="sfw_global_tab_AS"><span>亚太</span></li><li id="sfw_global_tab_US"><span>北美</span></li><li id="sfw_global_tab_EU"><span>欧洲</span></li></ul><span class="SG_more"><a href="http://finance.sina.com.cn/money/globalindex/index.shtml" target="_blank">更多</a>&gt;&gt;</span></div><div class="tag_contants" id="sfw_global_target_CN"><div class="financeTxt"><ul class="finatag"><li class="cur" id="sfw_global_tab_CN_tab_sh000001"><h5>上证综指</h5><div id="sfw_global_text_s_sh000001">--</div></li><li id="sfw_global_tab_CN_tab_sz399001"><h5>深证成指</h5><div id="sfw_global_text_s_sz399001">--</div></li></ul></div><div class="financeImg" id="sfw_global_tab_CN_target_sh000001"><a href="http://finance.sina.com.cn/realstock/company/sh000001/nc.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_global_tab_CN_image_sh000001" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div><div class="financeImg" id="sfw_global_tab_CN_target_sz399001" style="display:none;"><a href="http://finance.sina.com.cn/realstock/company/sz399001/nc.shtml" style="background-color:#fff; display:block;" target="_blank"><img id="sfw_global_tab_CN_image_sz399001" src="http://www.sinaimg.cn/cj/money/images/progress0.gif" alt=""></a></div></div><div class="tag_contants" id="sfw_global_target_AS" style="display:none;"><div class="overSea"><dl><dt>香港恒生指数</dt><dd><div id="sfw_global_text_hkHSI">--</div></dd><dt>日经225指数</dt><dd><div id="sfw_global_text_b_NKY">--</div></dd><dt>台湾加权指数</dt><dd><div id="sfw_global_text_b_TWSE">--</div></dd><dt>新加坡海峡时报指数</dt><dd><div id="sfw_global_text_b_FSSTI">--</div></dd></dl></div></div><div class="tag_contants" id="sfw_global_target_US" style="display:none;"><div class="overSea"><dl><dt>道琼斯</dt><dd><div id="sfw_global_text_gb_dji">--</div></dd><dt>纳斯达克</dt><dd><div id="sfw_global_text_gb_ixic">--</div></dd><dt>标普500</dt><dd><div id="sfw_global_text_gb_inx">--</div></dd><dt>道指期货</dt><dd><div id="sfw_global_text_hf_DJS">--</div></dd></dl></div></div><div class="tag_contants" id="sfw_global_target_EU" style="display:none;"><div class="overSea"><dl><dt>英金融时报指数</dt><dd><div id="sfw_global_text_b_UKX">--</div></dd><dt>德国DAX指数</dt><dd><div id="sfw_global_text_b_DAX">--</div></dd><dt>法CAC40指数</dt><dd><div id="sfw_global_text_b_CAC">--</div></dd><dt>俄MICEX指数</dt><dd><div id="sfw_global_text_b_INDEXCF">--</div></dd></dl></div></div>'
                }[__stringType];
                this._elementContainer.innerHTML = __stringTemplate;
                this._elementHandleCN = this._get("sfw_global_tab_CN");
                this._eventTabCN = this._bind(this._tab, ["CN"]);
                this._aevent(this._elementHandleCN, "click", this._eventTabCN);
                this._elementHandleAS = this._get("sfw_global_tab_AS");
                this._eventTabAS = this._bind(this._tab, ["AS"]);
                this._aevent(this._elementHandleAS, "click", this._eventTabAS);
                this._elementHandleUS = this._get("sfw_global_tab_US");
                this._eventTabUS = this._bind(this._tab, ["US"]);
                this._aevent(this._elementHandleUS, "click", this._eventTabUS);
                this._elementHandleEU = this._get("sfw_global_tab_EU");
                this._eventTabEU = this._bind(this._tab, ["EU"]);
                this._aevent(this._elementHandleEU, "click", this._eventTabEU);

                this._elementHandlesh000001 = this._get("sfw_global_tab_CN_tab_sh000001");
                this._eventTabSubsh000001 = this._bind(this._tabSub, ["sh000001"]);
                this._aevent(this._elementHandlesh000001, "click", this._eventTabSubsh000001);
                this._elementHandlesz399001 = this._get("sfw_global_tab_CN_tab_sz399001");
                this._eventTabSubsz399001 = this._bind(this._tabSub, ["sz399001"]);
                this._aevent(this._elementHandlesz399001, "click", this._eventTabSubsz399001);
                this._update();
                this._refresh();
                this._numberThreadUpdate = setInterval(this._bind(this._update), 10 * 1000);
                this._numberThreadImage = setInterval(this._bind(this._refresh), 60 * 1000);
            };
            this._initialize = function (__stringContainer, __stringType) {
                this._stringSystemKey = "SinaFinanceWidgetGlobal";
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
