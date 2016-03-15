/**
 * @fileoverview
 *    博客正文页发表评论表单中的插入表情
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("tempLib/magicFace/magicFace.js");
$import("sina/sina.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/system/br.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/system/br.js");
$import("sina/core/string/trim.js");

$import("lib/app.js");
$import("lib/sendLog.js");
$import("lib/checkAuthor.js");

$import("tempLib/insertSmiles/smilesDialog.js");
$import("tempLib/insertSmiles/smilesDataV2.js");

App.insertSmilesForm2 = Core.Class.create();
App.insertSmilesForm2.prototype = {
    // 默认参数
    defalutConfig: {
        sortCount: 6,
        clickCallback: function () {
        },
        recommCount: 8
    },
    /**
     *
     * @param {JSONObject} oOption    初始化插入表情的选项
     * {
	 * 	sortNode		[必选]推荐分类节点
	 * 	sortCount		[必选]推荐分类个数
	 * 	clickCallback	[可选]点击表情的回调函数
	 * 	recommNode		[可选]推荐表情节点
	 * 	recommCount		[可选]推荐表情个数
	 * }
     */
    // 初始化
    initialize: function (oOption) {
        this.option = oOption || {};
        if (this.option.sortNode == null) {
            return;		// 缺少必要的参数
        }
        for (var key in this.defalutConfig) {
            if (this.option[key] == null) {
                this.option[key] = this.defalutConfig[key];
            }
        }

        if (scope.smilesDataV2 == null) {
            this.getSmilesData();
        } else {
            this.data = scope.smilesDataV2;
            this.renderUI();
        }
    },
    // 取得表情数据
    getSmilesData: function () {
        var __this = this;
        var smileData = Utils.Io.JsLoad.request([
                {    "url": "http://www.sinaimg.cn/uc/myshow/blog/misc/gif/smileConfig8.js?varname=smileConfig"
                }
            ], {
                onComplete: function (oData) {
                    scope.smilesData = oData;
                    __this.data = oData;
                    __this.renderUI();
                },
                onException: function () {
                }
            });
    },
    // 渲染推荐表情
    renderUI: function () {
        var __this = this;
        var count = 1;	// 取数据计数
        var first6sort = [];	// 最热门6个分类
        var first6hot = [];		// 最热门8个表情
        var firstSort;			// 第一个分类

        var _fragement = document.createDocumentFragment();
        var _sorts = $C("div");	// 推荐分类
        var _more = $C("span");	// 更多
        var _clearit = $C("div");	// 清除浮动 DIV

        firstSort = this.data && this.data["302"] && this.data["302"].data;
        // 渲染推荐表情
        if ($E(this.option.recommNode) != null) {
            _fragement = document.createDocumentFragment();
            for (var i = 0; i < this.option.recommCount; i++) {/*wujian 魔法表情不一样*/
                _title = firstSort[i].name;
                var _code = firstSort[i].code;
                var _swfName = firstSort[i].swf;
                node = $C("li");
                //node = $C("a");
                //node.href = "#";
                (function (val) {
                    node.onclick = Core.Function.bind3(function (key, title, swfName) {

                        __this.option.clickCallback(key, title, swfName);
                        v7sendLog('32_01_20');

                        var pid = scope.$pageid;
                        if (pid) {
                            val += '';
                            val = val.length == 1 ? '0' + val : val;
                            v7sendLog($_GLOBAL.faceCountRecommLinkTable[pid] + '_' + val + '_010_' + key, pid, '');
                        }
                        Core.Events.stopEvent();
                        return false;
                    }, null, [_code, _title, _swfName]);
                })(i + 8);
                node.hideFocus = true;

                // <div style="position:absolute; top:37px; left:36px;"><a href="#"><img src="../../images/common/img_arrow_r.gif" width="14" height="13"  alt="" align="absmiddle" /></a></div>
                var tempHTML = '<a href="#"><img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + _code + 'T.gif" alt="' + _title + '" title="' + _title + '" height="50" width="50"/></a>';
                if (_swfName) {
                    tempHTML = tempHTML + '<div class="arr"><a href="#" onclick="window.$magicFacePlay(\'' + _swfName + '\');return false;" ><img src="http://simg.sinajs.cn/blog7style/images/common/img_arrow_r.gif" width="14" height="13" title="播放表情" alt="" align="absmiddle" /></a></div>';
                }
                node.innerHTML = tempHTML;
                _fragement.appendChild(node);
            }
            $E(this.option.recommNode).appendChild(_fragement);
        }

        count = first6sort = first6hot = firstSort = _fragement = _sorts = _more = _morelink = _clearit = _code = key = _title = node = null;

    }
};

/**
 * 从子节点中去掉空节点
 * @param {Array} 所有的子节点
 * @return 返回没有空节点的子节点数组
 */
Lib.children = function (chs) {
    var cArr = [];
    for (var i = 0; chs[i]; i++) {
        if (chs[i].nodeType == 1) {
            cArr.push(chs[i]);
        }
    }
    return cArr;
}

App.insertSmilesDialog2 = function (sSortId, fCallback, sPositionNode, arrPosiPix) {
    App.insertSmilesDialog2.callback = fCallback;
    if (scope.smileDialog == null) {
        scope.smileDialog = new App.smilesDialog2();
    }
    scope.smileDialog.setSort(sSortId, fCallback);
    var xy = Core.Dom.getXY($E(sPositionNode));
    var x = xy[0] + arrPosiPix[0];
    var y = xy[1] + arrPosiPix[1];
    scope.smileDialog.setPosition(x, y);
    scope.smileDialog.show();
};

//scope.commEditor = new commEditor('frame','commentArea');

// 包装的页面唯一表情浮层
/**
 *
 * @param {Object} sTextarea    需要绑定的文本框节点
 * @param {Object} sSortNode    推荐分类节点
 * @param {Object} sRecommNode    推荐表情节点
 * @param {Object} fCallBack    点击某表情的回调函数
 * @param {Object} sPositionNode定位浮层的节点
 * @param {Object} arrPix        定位浮层的偏移量
 * @param {Object} sFrame        对应的iframe节点的ID
 * @param {Object} opt_evnets        事件object,结构,normal,interval:定时器里的方法,before:在定时器以前执行,after:在定时器以后执行.表示正常的方法,
 :{'normal' : {event:function},'interval':{'before':function,'after':function}}
 注:befor和after的方法中，会传递frame的id和area对象
 * @param {Object} cfg         显示表情数目配置,sortCount小表情，recommCount大表情
 */
App.formInsertSmile2 = function (sTextarea, sSortNode, sRecommNode, fCallBack, sPositionNode, arrPix, sFrame,
                                 opt_evnets, cfg) {
    var _oTextNode = $E(sTextarea);
    cfg = cfg || {};
    var getPos = function () {
        if (_oTextNode.createTextRange) {
            _oTextNode.caretPos = document.selection.createRange().duplicate();
        }
    };
    if (!scope.commEditor) {
        scope.commEditor = new commEditor();
    }
    scope.commEditor.append(sFrame, sTextarea, opt_evnets);
    Core.Events.addEvent(_oTextNode, getPos, "keyup");
    Core.Events.addEvent(_oTextNode, getPos, "focus");
    Core.Events.addEvent(_oTextNode, getPos, "select");
    Core.Events.addEvent(_oTextNode, getPos, "click");
    var smileCfg = {
        sortNode: sSortNode,
        clickCallback: function (nCode, sName, swfname) {
            //使用iframe方式的插入图片
            //延迟20毫秒插入图片,不让它的焦点消失
            setTimeout(function () {
                var tempHTML = '<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + nCode + 'T.gif" alt="' + sName + '" title="' + sName + '"width="50" height="50" />';
                if (swfname) {/*wujian*/
                    //<div style="position: relative; width: 52px; height: 52px; margin: 0pt 0pt 0pt 4px;"></div>
                    tempHTML = '<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + nCode + 'T.gif" alt="' + sName + '" title="' + sName + '" swfname="' + swfname + '"  width="50" height="50" />';
                    // <div style="position:absolute; top:37px; left:36px;"><a href="#"><img src="../../images/common/img_arrow_r.gif" width="14" height="13"  alt="" align="absmiddle" /></a></div>
                    //tempHTML='&nbsp;<span class="face_arae" >'+tempHTML+'<img class="play_arr" src="http://simg.sinajs.cn/blog7style/images/common/img_arrow_r.gif" width="14" height="13"  alt="" align="absmiddle" /></span>';
                    //tempHTML='http://www.sinaimg.cn/uc/myshow/blog/misc/gif/'+ nCode + 'T.gif';
                    //tempHTML='<span  style="background-image:url('+tempHTML+'); background-repeat:no-repeat;width:52px; height:52px; display:block "><img class="play_arr"  src="http://simg.sinajs.cn/blog7style/images/common/img_arrow_r.gif" width="14" height="13"  alt="" /></span>'

                }
                scope.commEditor.insertHTML(sFrame, tempHTML);
            }, 20);
            //这里注释掉原先用textarea方式实现的插入表情方法
            /*
             var faceValue = "[emoticons=" + nCode + "]" + sName + "[/emoticons]";
             if ($IE) {
             if (_oTextNode.createTextRange && _oTextNode.caretPos) {
             var caretPos = _oTextNode.caretPos;
             caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? faceValue + ' ' : faceValue;
             _oTextNode.focus();
             } else {
             _oTextNode.value += faceValue;
             _oTextNode.focus();
             }
             }else {
             if (_oTextNode.setSelectionRange) {
             var rangeStart = _oTextNode.selectionStart;
             var rangeEnd = _oTextNode.selectionEnd;
             var tempStr1 = _oTextNode.value.substring(0, rangeStart);
             var tempStr2 = _oTextNode.value.substring(rangeEnd);
             _oTextNode.value = tempStr1 + faceValue + tempStr2;
             } else {
             _oTextNode.value += faceValue;
             }
             }
             */
            if (fCallBack) {
                fCallBack();
            }
        },
        recommNode: sRecommNode,
        positionNode: sPositionNode || sSortNode,
        arrPosPix: arrPix || [0, 0],
        sortCount: cfg.sortCount || 6,
        recommCount: cfg.recommCount || 8
    };

    new App.insertSmilesForm2(smileCfg);
};

var commEditor = function (frame, area) {
    //装载所有的frame的id
    this.fids = [];
    //装载所有的textarea,并以fids中的某个ID作为索引
    this.areas = {};
    //装载所有的iframe的window对象,并以fids中的某个ID作为索引
    this.wins = {};
    //装载所有的iframe的document对象,并以fids中的某个ID作为索引
    this.docs = {};
    //装载所有的输入监听用于替换
    this.intervals = {};
    //装载所有的监听
    this.actions = {};
    //this.win = this.frame.contentWindow;
    //this.doc = this.win.document;
    //this.init();
}

commEditor.prototype = {
    init: function (sFrame) {
        var doc = this.docs[sFrame];
        try {
            doc.body.designMode = 'on';
        } catch (e) {
        }
        doc.open();
        //this.doc.writeln('<html><head style></head><body style="width:100%;height:100%" designMode="on"></body></html>');
        doc.writeln(this.getEditorHTML(''));
        doc.body.contentEditable = true;

        //使得编辑区域 按TAB键时能跳到 验证码选项框
        var win = doc.parentWindow;
        Lib.checkAuthor();
        doc.body.onkeydown = function (e) {
            try {
                if ((e || win.event).keyCode == 9) {
                    $E('login_' + ($isLogin ? 'check' : 'name')).focus();
                    return false;
                }
            } catch (err) {
            }
        };

        doc.close();
    },

    lazyInit: function (fId) {
        var me = this;
        return function () {
            var cDoc = me.docs[fId];
            if (cDoc.body.getAttribute('inited')) {
                return;
            }
            trace('执行一次:' + fId);
            me.init(fId);
            me.bindListener(fId);
            cDoc.body.setAttribute('inited', 'yes');
        }
    },

    append: function (sFrame, sTextarea, actions) {
        actions = actions || {};
        if (!actions.interval) {
            actions.interval = {};
        }
        if (!actions.interval.before) {
            actions.interval.before = function () {
            };
        }
        if (!actions.interval.after) {
            actions.interval.after = function () {
            };
        }
        //var fId = sFrame.id;
        //var aId = sTextarea.id;
        var frame = $E(sFrame);
        this.wins[sFrame] = frame.contentWindow;
        this.actions[sFrame] = actions;
        var me = this;

        function getDoc() {
            try {
                me.docs[sFrame] = frame.contentWindow.document;
                me.areas[sFrame] = $E(sTextarea);
                if ($IE) {
                    me.docs[sFrame].body.onclick = me.lazyInit(sFrame);
                } else {
                    (me.lazyInit(sFrame))();
                }
            } catch (e) {
                setTimeout(getDoc, 150);
            }
        }

        getDoc();
    },

    frameFilter: function (body) {
        var d = false;
        var val = body.innerHTML;
        val = val.replace(/<script[\s\S]*<\/script>/ig, "");
        val = val.replace(/<style[\s\S]*<\/style>/ig, "");
        val = val.replace(/<!-{2,}[\s\S]*?-{2,}>/g, "");
        val = val.replace(/<([^>]+).*?>/ig, function (all, str) {
            var tagName = str.split(" ")[0].toLowerCase();
            switch (tagName) {
                case '/p' :
                    return "<br>";
                case 'br' :
                    return all;
                case 'img' :
                    if (all.toLowerCase().indexOf("http://www.sinaimg.cn/uc/myshow/blog") > 0 || all.toLowerCase().indexOf("http://simg.sinajs.cn/blog7style/images/common") > 0) {
                        if (all.toLowerCase().indexOf("t.gif") == -1 && all.toLowerCase().indexOf("img_arrow_r.gif") == -1) {
                            return '';
                        }
                        return all;
                    } else {
                        return "";
                    }
                default :
                    return ""
            }
        });
        val = val.replace(/\n/g, "");
        body.innerHTML = val;
    },

    bindListener: function (sFrame) {
        var doc = this.docs[sFrame];
        var area = this.areas[sFrame];
        var win = this.wins[sFrame];
        var actions = this.actions[sFrame];
        var me = this;
        if ($IE) {
            doc.onkeydown = function () {
                var event = win.event;
                if (event.keyCode == 8) {
                    var ele = me.getFocusElement(sFrame);
                    if (ele && ele.tagName.toUpperCase() == 'IMG') {
                        ele.parentNode.removeChild(ele);
                        event.keyCode = 0;
                        event.returnValue = false;
                    }
                }
            }
        }
        Core.Events.addEvent(doc.body, (function (frameBody) {
            return function (e) {
                me.intervals[sFrame] = setInterval(function () {
                    actions.interval.before(sFrame, area);
                    me.clearFrameHTML(frameBody);
                    var imgs = frameBody.getElementsByTagName('img');
                    for (var i = 0; imgs[i]; i++) {
                        imgs[i].removeAttribute('style');
                        imgs[i].removeAttribute('height');
                        imgs[i].removeAttribute('width');
                    }
                    actions.interval.after(sFrame, area);
                }, 400);
            }
        })(doc.body), 'focus');
        Core.Events.addEvent(doc.body, (function (frameBody) {
            return function (e) {
                clearInterval(me.intervals[sFrame]);
            }
        })(doc.body), 'blur');
        if (actions.normal) {
            for (var event in actions.normal) {
                Core.Events.addEvent(doc.body, actions.normal[event], event);
            }
        }
    },

    clearFrameHTML: function (frameBody) {
        var me = this;
        var arr = ['a', 'input'];
        var needIt = false;
        for (var i = 0; arr[i]; i++) {
            if (frameBody.getElementsByTagName(arr[i]).length > 0) {
                needIt = true;
                break;
            }
        }
        if (needIt) {
            me.frameFilter(frameBody);
        } else {
            var imgs = frameBody.getElementsByTagName('img');
            for (var i = 0; imgs[i]; i++) {
                var srcInd = imgs[i].src.indexOf('http://www.sinaimg.cn/uc/myshow/blog');
                var tInd = imgs[i].src.toLowerCase().indexOf('t.g');
                var playButton = imgs[i].src.indexOf('http://simg.sinajs.cn/blog7style/images/common/img_arrow_r.gif');
                if ((srcInd == -1 || tInd == -1) && playButton == -1) {
                    me.frameFilter(frameBody);
                    break;
                }
            }
        }
    },
    /**
     * 获取编辑器内聚焦元素
     */
    getFocusElement: function (fid) {
        if (!$IE) {
            var select = this.win.getSelection();
            var range = select.getRangeAt(0);
            var elm = range.commonAncestorContainer;
            if (elm.tagName) {
                if (elm.tagName.toLowerCase() == "body") {
                    return elm;
                }
            }
            if (!range.collapsed) {
                if (range.startContainer == range.endContainer || (1 && range.startContainer == range.endContainer.parentNode)) {
                    if (range.startOffset - range.endOffset < 2 || 1) {
                        if (range.startContainer.hasChildNodes()) {
                            return range.startContainer.childNodes[range.startOffset];
                        }
                    }
                }
                return elm.parentNode;
            } else {
                return elm.parentNode;
            }

        } else {
            var range = this.docs[fid].selection.createRange();
            return range.item ? range.item(0) : range.parentElement();
        }
    },

    clearHTML: function (fId) {
        var doc = this.docs[fId];
        doc.body.innerHTML = '';
        //以下两行为了去除：FF下博文评论里加图片，图片正在编辑时就提交，提交了编辑框还会留下
        doc.body.setAttribute("contenteditable", false);
        doc.body.setAttribute("contenteditable", true);
    },

    /**
     * 向编辑器的iframe的body中插入html
     * @param {String} s_html
     */
    insertHTML: function (fId, s_html) {
        if ($IE) {
            //如果之前没有点击初始化，并直接发出评论,就直接初始化
            (this.lazyInit(fId))();
        }
        var win = this.wins[fId];
        var doc = this.docs[fId];
        if ($IE) {
            try {
                win.focus();
                var oRang = doc.selection.createRange();
                if (doc.selection.type.toLowerCase() == "control") {
                    var tempRange = doc.body.createTextRange();
                    tempRange.moveToElementText(oRang.item(0));
                    oRang = tempRange;
                }
                oRang.pasteHTML(s_html);
                oRang.collapse(false);
                oRang.select();
            } catch (e) {
                //trace(e);
            }
        } else {
            //第一次插入图片，内容并不是为空的，而是以一个'%0A'空格作为内容
            if (($CHROME || $SAFARI) && (encodeURIComponent(doc.body.innerHTML) == '%0A' || doc.body.innerHTML == '')) {
                doc.body.focus();
            }
            this.execCommand('insertHTML', s_html, fId);
            if (!$CHROME && !$SAFARI) {
                doc.body.focus();
            }
        }
    },
    /**
     * 执行编辑器内iframe的execCommand命令
     * @param {String} cmd
     * @param {String} value
     */
    execCommand: function (cmd, value, fId) {
        var win = this.wins[fId];
        var doc = this.docs[fId];
        win.focus();
        doc.execCommand(cmd, "", value);
        win.focus();
    },

    handleChange: function (fId) {
        var body = this.docs[fId].body;
        this.areas[fId].value = this.getHandledStr(body);
    },

    getHandledStr: function (body) {
        var strArr = [];
        if (body.hasChildNodes()) {
            body = body.childNodes;
            for (var i = 0; body[i]; i++) {
                strArr.push(this.handleDom(body[i]));//,true));
            }
        } else {
            strArr.push(this.handleDom(body));
        }
        return strArr.join('').replace(/\u00A0/ig, ' ');
    },

    handleDom: function (ele) {
        if (ele.nodeType == 3) {
            var val = ele.nodeValue;
            //if(!($FF || $FF2) && !isSub) {
            //	val += '\n';
            //}
            if (!Core.String.trim(val)) {
                return '';
            }
            return this.reEscapeHTML(val);
        } else if (ele.nodeType == 1) {
            //处理节点,要调用配置文件
            if (ele.hasChildNodes() && ((ele.childNodes.length != 1) || (ele.childNodes.length == 1 && ele.childNodes[0].tagName))) {
                //如果有子节点,再进行一次递归
                var strArr = [];
                if (ele.tagName) {
                    var tN = ele.tagName.toUpperCase();
                    if (tN == 'DIV' || tN == 'P') {
                        strArr.push('\n');
                    }
                }
                ele = ele.childNodes;
                for (var i = 0; ele[i]; i++) {
                    strArr.push(this.handleDom(ele[i]));//,true));
                }
                return /*'|STR|'+*/strArr.join('');
            } else {
                //具体到某个节点
                var tN = ele.tagName.toUpperCase();
                if (tN == 'IMG') {
                    //图片节点，如果是别的图片，只显示
                    if (ele.src.indexOf('http://www.sinaimg.cn/uc/myshow/blog') != -1) {
                        //初步判断应该是要显示的图片
                        if (ele.src.indexOf('T.g') == -1) {
                            //表示是小图标
                            return '';
                        }
                        var nCode = ele.src.split('T.g')[0];
                        nCode = nCode.substring(nCode.lastIndexOf('/') + 1, nCode.length);
                        var sName = ele.getAttribute('title');
                        var swfname = ele.getAttribute('swfname');

                        if (!swfname && nCode[0] == "W") {
                            swfname = nCode + "S.swf";
                        }
                        if (sName) {
                            if (swfname) {/*wujian*/
                                return /*'|img|'+*/'[magicemoticons=' + nCode + ' swfname=' + swfname + ']' + sName + '[/magicemoticons]';
                            } else {
                                //要显示的图片
                                return /*'|img|'+*/'[emoticons=' + nCode + ']' + sName + '[/emoticons]';
                            }

                        }
                    } else {
                        return '';
                    }
                } else if (tN == 'BR') {
                    return /*'|BR|'+*/'\n';
                } else if (tN == 'DIV' || tN == 'P') {
                    var val = ele.innerHTML || '';
                    return '\n' + /*'|DIV-p|' +*/ this.reEscapeHTML(val);
                } else if (tN == 'SCRIPT' || tN == 'STYLE') {
                    return '';
                } else {
                    val = ele.innerHTML || ele.value || '';
                    return /*'?'+tN+'?'+*/this.reEscapeHTML(val);
                }
            }
        }
        return '';
    },
    reEscapeHTML: function (str) {
        str = str.replace(/\n/g, '');
        str = str.replace(/&nbsp;/g, ' ');
        str = str.replace(/&quot;/g, '"');
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        str = str.replace(/&amp;/g, '&');
        return str;
    },
    /**
     * @param {String} sContent bodyеhtml
     */
    getEditorHTML: function (sContent) {
        var html = "";
        html += "<html>";
        html += "<head>";
        html += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
        html += "<style>\
		p {\
			*margin:0.2em auto;\
		}\
		body {\
			margin: 0;\
			scrollbar-face-color: #ffffff;\
			scrollbar-highlight-color: #ffffff;\
			scrollbar-shadow-color: #c0c1bb;\
			scrollbar-3dlight-color: #c0c1bb;\
			scrollbar-arrow-color: #c9cbb6;\
			scrollbar-track-color: #f4f5f0;\
			scrollbar-darkshadow-color: #ffffff;\
			scrollbar-base-color: #ffffff;\
			padding: 10px;\
			word-wrap: break-word;\
			overflow: scroll;\
			overflow-x: auto;\
			height: 90%;\
			font-size: 14px;\
		}\
		body, td, textarea, input, br, div, span{\
			font-family: '', Verdana,Arial, Helvetica, sans-serif;\
			line-height:1.5;\
		}\
		img{\
			border: 0;\
		}\
		html{\
			height: 100%;\
			cursor: text;\
		}\
		pre{\
			white-space:normal;\
		}\
		form{margin: 0;}\
		body table{font-size: 14px;}\
		.border{ border:1px dashed #cfcfcf;}\
		</style>\
		<script>document.domain='sina.com.cn';</script>\
		";
        html += "</head>";
        html += "<body>";
        html += sContent;
        html += "</body>";
        html += "</html>";
        return html;
    }
}