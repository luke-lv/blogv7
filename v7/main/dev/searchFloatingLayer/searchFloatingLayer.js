$import('sina/core/system/getParam.js');
$import('searchFloatingLayer/searchEngineList.js');
$import('searchFloatingLayer/searchFloatingLayerTemplate.js');
$import("sina/utils/url.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/ui/panel.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("other/sinaflash.js");

/**
 * @fileoverview 搜索浮层相关业务
 * @author zhangkai2@staff.sina.com.cn
 * @created 2011-1-30
 */


// code structure modified for Interface updated		dcw1123 | chengwei1@staff.sina.com.cn
// code structure modified for compsition reason
// code reformated

scope.searchFloatingLayer = {

    // 搜索浮层数据接口 url
    dataURL: "http://control.blog.sina.com.cn/riaapi/article/search_recommend.php",

    /**
     * 是否显示搜索浮层
     * @return {Boolean} true符合条件 显示浮层 false不符合条件 不显示浮层
     */
    isDisplay: function () {
        var anchorObj = new Utils.Url(window.location.href).anchor || {};
        var keyword = anchorObj.sFLKeyword;
        var refer = document.referrer;

        // 判断是否从搜索浮层中相关博文或推荐名人超链接点击过来
        // 目前用url中是否有sFLKeyword参数判断
        if (window.location.host === "blog.sina.com.cn" && keyword) {
            this.keyword = keyword;
            this.encode = anchorObj.sFLEncode || "utf-8";
            return true;
        }

        // 判断本页面是否从搜索引擎跳转过来
        if (!refer) return;

        var sList = scope.searchEngineList;
        var urlObj = new Utils.Url(refer);
        for (var searchEngine in sList) {
            if (urlObj.url.indexOf(searchEngine) > -1) {
                this.keyword = urlObj.getParam(sList[searchEngine]["param"]);
                if ((searchEngine === "search.sina.com.cn" || searchEngine === "www.baidu.com") && urlObj.getParam("ie")) {
                    this.encode = urlObj.getParam("ie");
                } else {
                    this.encode = sList[searchEngine]["encode"];
                }
                return true;
            }
        }
    },

    // 显示搜索浮层
    displayFloatingLayer: function (oParam) {
        var _this = this;
        if (!blogAd.getInitPermission(oParam)) return;
        oParam = oParam.ads[0];
        Utils.Io.JsLoad.request(this.dataURL, {
            charset: "utf-8",
            noencode: true,
            GET: {
                "encode": this.encode,
                "keyword": this.keyword
            },
            onComplete: function (result) {
                if (result && result.code === "A00006") {
                    _this.createFloatingLayerWithData(result.data, oParam);
                } else {
                    // 请求接口异常
                }
            }
        });
    },

    /**
     * 创建搜索浮层
     * @param {Object} data 服务器端返回数据
     */
    createFloatingLayerWithData: function (data, oParam) {
        if (data.relatedArticle && data.relatedArticle.length === 0) return;

        var searchPanel = new Ui.Panel();
        searchPanel.setTemplate('<div id="#{panel}">' + scope.searchFloatingLayerTemplate + '</div>').setFixed(true);
        searchPanel.show();

        searchPanel.entity.style.zIndex = "9999";
        updatemsnFeedFloatLayerPos($IE6 ? "" : "first");

        // 为关闭按钮注册click事件
        Core.Events.addEvent($E("searchFloatingLayer_CloseBtn"), function () {
            searchPanel.destroy();
        });

        // 为浮层注册resize事件
        Core.Events.addEvent(window, function () {
            updatemsnFeedFloatLayerPos();
        }, "resize", false);

        // 更新浮层相关博文和推荐名人内容
        this.updateContent(data, oParam);

        // 播放显示动画效果
        !$IE6 && this.playDisplayEffect(searchPanel);

        /**
         * 更新浮层位置
         * 始终固定在页面底部
         * 如果是第一次调用这个函数 将浮层显示在页面底部不可见区域
         * 为显示动画做准备
         *
         * @param {Object} first 标识是否是第一次调用这个函数
         */
        function updatemsnFeedFloatLayerPos(first) {
            var winWidth = document.documentElement.clientWidth;
            var winHeight = document.documentElement.clientHeight;
            searchPanel.setPosition({
                x: 0,
                y: winHeight - (first ? 0 : searchPanel.entity.offsetHeight)
            });
            $E("statBottomforniangs").style.width = winWidth + "px";
        }
    },

    /**
     * 更新浮层相关博文和推荐名人内容
     */
    updateContent: function (data, oParam) {
        var aArr = data.relatedArticle;
        var cArr = data.celebrity;
        var i;
        var aHTML = [];
        var cHTML = [];
        var url = "http://search.sina.com.cn/?c=blog&by=title&range=all&q=" + this.keyword + "&ie=" + this.encode;
        var __adNode = $E("searchFloatingLayer_ad");
        var __cantSeeMe;

        // 相关博文，只显示 2 条
        for (i = 0; i < aArr.length && i < 2; i++) {
            aHTML[aHTML.length] = "<li>";
            if (aArr[i].isRecommend) {
                aHTML[aHTML.length] = '<img class="SG_icon SG_icon107" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="18" height="18" title="推荐" align="absmiddle" />';
            }
            aHTML[aHTML.length] = '<a onclick="v7sendLog && v7sendLog(\'85_01_0' + (2 + i) + '\');" href="' + aArr[i].url.replace(/\?.*/, "") + '#sFLKeyword=' + this.keyword + '&sFLEncode=' + this.encode + '" target="_blank">' + aArr[i].title.replace(data.keyword, '<span class="blog_sfNm">' + data.keyword + '</span>') + '</a>';
            aHTML[aHTML.length] = "</li>";
        }

        // 当结果为1条的时候 更改样式 居中显示该数据
        if (aArr.length === 1) {
            $E("searchFloatingLayer_LeftContentArea").className = "blog_sfL blog_onlyone";
        }

        // 如果返回类型为推荐博文时 更改博文类型
        if (data.type === 1) {
            $E("searchFloatingLayer_RelatedArticle").parentNode.className = "blog_sfTit blog_nofTit";
        }

        $E("searchFloatingLayer_RelatedArticleList").innerHTML = aHTML.join("");

        // 推荐名人
        for (i = 0; i < cArr.length && i < 5; i++) {
            cHTML[cHTML.length] = "<li>";
            cHTML[cHTML.length] = "<a onclick='v7sendLog && v7sendLog(\"85_01_0" + (5 + i) + "\");' href='http://blog.sina.com.cn/u/" + cArr[i].uid + "#sFLKeyword=" + encodeURIComponent(cArr[i].uname) + "&sFLEncode=utf-8' target='_blank'>" + cArr[i].uname + "</a>";
            cHTML[cHTML.length] = "</li>";
        }
        $E("searchFloatingLayer_CelebrityList").innerHTML = cHTML.join("");

        // 相关博文超链接
        $E("searchFloatingLayer_RelatedArticle").href = url;

        // 更多超链接
        $E("searchFloatingLayer_More").href = url + "&s=2";

        // 广告加载
        if (!oParam || !__adNode) return;
        if (oParam.type == "swf") {
            this.appendSwf(oParam.ref, "", oParam.width, oParam.height, __adNode);
        } else {
            __adNode.style.cssText = "height:" + oParam.height + "px; width:" + oParam.width + "px;";
            __adNode.innerHTML = "<img src='" + oParam.ref + "' alt=''/>";
        }
        if (oParam.click) {
            __adNode.style.position = "relative";
            __cantSeeMe = this.createNode('<a href="#" target="_blank"></a>');
            __cantSeeMe.href = oParam.click;
            __cantSeeMe.style.cssText = ($IE ? "filter:alpha(opacity=0);" : "opacity:0") + "; height:" + oParam.height + "px; width:" + oParam.width + "px; background:#F00; display:block;" + "z-index:1020; position:absolute; left:0; top:0;";
            __adNode.appendChild(__cantSeeMe);
        }
        __adNode.style.marginTop = parseInt((70 - oParam.height) / 2) + "px";
    },

    createNode: function (txt) {
        var _box = $C("div");
        _box.innerHTML = txt;
        return _box.childNodes[0];
    },

    // 播放显示动画效果
    playDisplayEffect: function (panel) {
        var domElement = panel.entity;
        var top = parseInt(domElement.style.top);
        var tweenObj = new Ui.TweenStrategy(top, top - domElement.offsetHeight, 0.5);
        tweenObj.onTween = function (v) {
            domElement.style.top = v + "px";
        };
        tweenObj.onEnd = function () {
            panel.setPosition({
                x: 0,
                y: document.documentElement.clientHeight - domElement.offsetHeight
            });
        };
        tweenObj.start();
    },

    appendSwf: function (url, id, width, height, targetId) {
        // V_movie, x_id, X_width, Z_height, v_version, z_bgColor, i_useExpressInstall, c_quality, I_xir, l_redirectUrl, o_detectKey
        if (typeof sinaFlash == "undefined") return;
        var sinaFlash2 = new sinaFlash(url,							//flash 的地址
            id,								//写入到页面后的 object id。
                width + "",						//宽
                height + "",						//高
            "9",							//flash 版本
            "#FFFFFF",						//flash 背景色
            false,							//是否使用 flash 快速升级
            "High",							//清晰度
            "http://www.sina.com.cn/",		//快速升级 url
            "http://www.sina.com.cn/",		//快速升级重定向 url
            false							//是否检测flash
        );
        sinaFlash2.addParam("allowScriptAccess", "always");		//是否允许脚本互访
        sinaFlash2.addParam("wmode", "transparent");			//透明度，FF 下使用 window 模式。解决输入法问题。
        // 现在改回transparent，因为window模式的flash，会遮盖js对话框，如果用原生alert，win7下的FF会停止响应
        sinaFlash2.write(targetId);			//写入容器的 id。这个竟然是 innerHTML 直写的！不是 append。
    }
};



