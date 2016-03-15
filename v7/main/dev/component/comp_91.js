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

$registComp(91, {

    "load": function () {
        this.setContent('<div class="cloneWidget" style="padding:0px;"><div class="finance' + this.size + '">' + '<div id="comp_' + this.compId + '_content"></div></div>' + ($isAdmin ? '' : '<p class="fincAddToBlog" style="padding-bottom:5px;"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" /> 添加到我的博客</a></p>') + '</div>');
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
            this._subString = function (__stringTarget, __intLength) {
                var __stringTargetTransformed = __stringTarget.replace(/[xy]/g, "z").replace(/[^\x00-\xff]/g, "xy");
                if (__stringTargetTransformed.length > __intLength) {
                    __stringTargetTransformed = __stringTargetTransformed.substr(0, __intLength);
                    var __objectMatched = __stringTargetTransformed.match(/xy/g);
                    var __numberX = __objectMatched == null ? 0 : __objectMatched.length;
                    if (__stringTargetTransformed.substr(__intLength - 1, 1) == "x") {
                        return __stringTarget.substr(0, __intLength - 1 - __numberX);
                    } else {
                        return __stringTarget.substr(0, __intLength - __numberX);
                    }
                } else {
                    return __stringTarget;
                }
            };
            this._tab = function (__stringKey) {
                var __arrayCode = ["OU", "OD", "CU", "CD"];
                for (var i in __arrayCode) {
                    var __stringCode = __arrayCode[i];
                    this._get("sfw_fund_tab_" + __stringCode).className = __stringCode == __stringKey ? "cur" : "";
                    this._get("sfw_fund_target_" + __stringCode).style.display = __stringCode == __stringKey ? "" : "none";
                }
            };
            this._stop = function () {
                this._stringType = null;
                this._revent(this._elementHandleOU, "click", this._eventTabOU);
                this._elementHandleOU = null;
                this._revent(this._elementHandleOD, "click", this._eventTabOD);
                this._elementHandleOD = null;
                this._revent(this._elementHandleCU, "click", this._eventTabCU);
                this._elementHandleCU = null;
                this._revent(this._elementHandleCD, "click", this._eventTabCD);
                this._elementHandleCD = null;
                this._elementContainer.innerHTML = '';
                this._elementContainer = null;
                window[this._stringSystemKey] = null;
            };
            this._start = function (__stringContainer, __stringType) {
                window[this._stringSystemKey] = this;
                this._elementContainer = this._get(__stringContainer);
                this._stringType = __stringType;
                this._stringContainer = __stringContainer;
                this._load("http://hq.sinajs.cn/format=text&rn=" + this._random() + "&list=of_up_10_d,of_down_10_d,fund_up_d_10,fund_down_d_10", this._bind(function () {
                    var __stringTemplate = {
                        "s": '<div class="finance_tag"><ul><li class="cur" id="sfw_fund_tab_OU"><span>开涨</span></li><li id="sfw_fund_tab_OD"><span>开跌</span></li><li id="sfw_fund_tab_CU"><span>封涨</span></li><li id="sfw_fund_tab_CD"><span>封跌</span></li></ul></div><div class="tag_contants" id="sfw_fund_target_OU"><div class="fincTab"><table class="finctable"><tr><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">收益率</th></tr>@OU@</table></div></div><div class="tag_contants" id="sfw_fund_target_OD" style="display:none;"><div class="fincTab"><table class="finctable"><tr><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">收益率</th></tr>@OD@</table></div></div><div class="tag_contants" id="sfw_fund_target_CU" style="display:none;"><div class="fincTab"><table class="finctable"><tr><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">周增长率</th></tr>@CU@</table></div></div><div class="tag_contants" id="sfw_fund_target_CD" style="display:none;"><div class="fincTab"><table class="finctable"><tr><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">周增长率</th></tr>@CD@</table></div></div>',
                        "m": '<div class="finance_tag"><ul><li class="cur" id="sfw_fund_tab_OU"><span>开基涨幅</span></li><li id="sfw_fund_tab_OD"><span>开基跌幅</span></li><li id="sfw_fund_tab_CU"><span>封基涨幅</span></li><li id="sfw_fund_tab_CD"><span>封基跌幅</span></li></ul></div><div class="tag_contants" id="sfw_fund_target_OU"><div class="fincTab"><table class="finctable"><tr><th class="col1">序号</th><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">收益率</th></tr>@OU@</table></div></div><div class="tag_contants" id="sfw_fund_target_OD" style="display:none;"><div class="fincTab"><table class="finctable"><tr><th class="col1">序号</th><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">收益率</th></tr>@OD@</table></div></div><div class="tag_contants" id="sfw_fund_target_CU" style="display:none;"><div class="fincTab"><table class="finctable"><tr><th class="col1">序号</th><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">周增长率</th></tr>@CU@</table></div></div><div class="tag_contants" id="sfw_fund_target_CD" style="display:none;"><div class="fincTab"><table class="finctable"><tr><th class="col1">序号</th><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">周增长率</th></tr>@CD@</table></div></div>',
                        "l": '<div class="finance_tag"><ul><li class="cur" id="sfw_fund_tab_OU"><span>开基涨幅</span></li><li id="sfw_fund_tab_OD"><span>开基跌幅</span></li><li id="sfw_fund_tab_CU"><span>封基涨幅</span></li><li id="sfw_fund_tab_CD"><span>封基跌幅</span></li></ul></div><div class="tag_contants" id="sfw_fund_target_OU"><div class="fincTab"><table class="finctable"><tr><th class="col1">序号</th><th class="col2">代码</th><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">收益率</th></tr>@OU@</table></div></div><div class="tag_contants" id="sfw_fund_target_OD" style="display:none;"><div class="fincTab"><table class="finctable"><tr><th class="col1">序号</th><th class="col2">代码</th><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">收益率</th></tr>@OD@</table></div></div><div class="tag_contants" id="sfw_fund_target_CU" style="display:none;"><div class="fincTab"><table class="finctable"><tr><th class="col1">序号</th><th class="col2">代码</th><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">周增长率</th></tr>@CU@</table></div></div><div class="tag_contants" id="sfw_fund_target_CD" style="display:none;"><div class="fincTab"><table class="finctable"><tr><th class="col1">序号</th><th class="col2">代码</th><th class="col3">名称</th><th class="col4">净值(元)</th><th class="col5">周增长率</th></tr>@CD@</table></div></div>'
                    }[__stringType];
                    var __stringItem = {
                        "s": '<tr><td class="col3"><a href="http://biz.finance.sina.com.cn/suggest/lookup_n.php?country=fund&q=@t@@0@" target="_blank">@1@</a></td><td class="col4">@3@</td><td class="col5">@2@</td></tr>',
                        "m": '<tr><td class="col1"><abbr class="num">@i@</abbr></td><td class="col3"><a href="http://biz.finance.sina.com.cn/suggest/lookup_n.php?country=fund&q=@t@@0@" target="_blank">@1@</a></td><td class="col4">@3@</td><td class="col5">@2@</td></tr>',
                        "l": '<tr><td class="col1"><abbr class="num">@i@</abbr></td><td class="col2"><a href="http://biz.finance.sina.com.cn/suggest/lookup_n.php?country=fund&q=@t@@0@" target="_blank">@0@</a></td><td class="col3"><a href="http://biz.finance.sina.com.cn/suggest/lookup_n.php?country=fund&q=@t@@0@" target="_blank">@1@</a></td><td class="col4">@3@</td><td class="col5">@2@</td></tr>'
                    }[__stringType];
                    var __numberMax = {
                        "s": 8,
                        "m": 16,
                        "l": 20
                    }[__stringType];
                    var __objectKey = {
                        "OU": "of_up_10_d",
                        "OD": "of_down_10_d",
                        "CU": "fund_up_d_10",
                        "CD": "fund_down_d_10"
                    };
                    for (var j in __objectKey) {
                        var __stringResult = "";
                        for (var i in window[__objectKey[j]]) {
                            var __arrayItem = window[__objectKey[j]][i];
                            var __stringCurrent = __stringItem.replace(/@i@/g, (i * 1 + 1)).replace(/@t@/g, "");
                            for (var k in __arrayItem) {
                                var __stringValue = __arrayItem[k];
                                switch (k * 1) {
                                    case 0:
                                        break;
                                    case 1:
                                        __stringValue = this._subString(__arrayItem[k].toString(), __numberMax);
                                        break;
                                    case 2:
                                        __stringValue = (__stringValue * 1).toFixed(2) + "%";
                                        break;
                                    case 3:
                                        break;
                                }
                                __stringCurrent = __stringCurrent.replace(new RegExp("@" + k + "@", "g"), __stringValue);
                            }
                            __stringResult += __stringCurrent;
                        }
                        __stringTemplate = __stringTemplate.replace("@" + j + "@", __stringResult);
                    }
                    this._elementContainer.innerHTML = __stringTemplate;
                    this._elementHandleOU = this._get("sfw_fund_tab_OU");
                    this._eventTabOU = this._bind(this._tab, ["OU"]);
                    this._aevent(this._elementHandleOU, "click", this._eventTabOU);
                    this._elementHandleOD = this._get("sfw_fund_tab_OD");
                    this._eventTabOD = this._bind(this._tab, ["OD"]);
                    this._aevent(this._elementHandleOD, "click", this._eventTabOD);
                    this._elementHandleCU = this._get("sfw_fund_tab_CU");
                    this._eventTabCU = this._bind(this._tab, ["CU"]);
                    this._aevent(this._elementHandleCU, "click", this._eventTabCU);
                    this._elementHandleCD = this._get("sfw_fund_tab_CD");
                    this._eventTabCD = this._bind(this._tab, ["CD"]);
                    this._aevent(this._elementHandleCD, "click", this._eventTabCD);
                }), "GB2312");
            };
            this._initialize = function (__stringContainer, __stringType) {
                this._stringSystemKey = "SinaFinanceWidgetFund";
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