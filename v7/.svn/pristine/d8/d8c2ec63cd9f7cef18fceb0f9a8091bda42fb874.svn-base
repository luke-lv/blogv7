/**
 * @fileoverview
 *    取得特定 UID 的指定文章的阅读数、评论数、收藏数
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/array/foreach.js");

$import("lib/app.js");
$import("lib/interface.js");
/**
 * 取得特定 UID 的指定文章的阅读数、评论数、收藏数
 * @param {String|Number} sUid
 * @param {Array} aArticleLists
 * @param {Function} fCallBack
 * @return {JsonObject}    以文章 ID 为 Key 的 JSON 对象
 * @example
 App.getArticlesDetailNumber(1406758883
 , ["53d96fe300eo5f","53d96fe300dzb5","53d96fe300dt4v"]
 , function(data){
							Debug.dir(data);
				});
 */

// 接口返回只能是 $ScriptLoader 格式，所以被迫写了一个全局的 Json 对象来响应回调
$ScriptLoader = {
    callback: {}, response: function (sId, oData) {

        // 十六进制 UID
        // UID升级修改uidHex位数，可能为9位，by wangqiang1
        var sUidHex = (scope.$uid * 1).toString(16);
        // sUidHex = sUidHex.substr(sUidHex.length - 8, 8);
        var sUidLen = sUidHex.length;
        if (8 > sUidLen) {
            for (var i = 0, len = 8 - sUidLen; i < len; i++) {
                sUidHex = '0' + sUidHex;
            }
        }
        var result = {};
        for (var key in oData) {
            result[sUidHex + "01" + key] = oData[key];
        }

        this.callback[sId].func(result);
        //直接在这里截取顶的信息，不知会不会被下掉
        var pageId = scope.$pageid;

        if (pageId == 'article_new' || pageId == 'articleM_new' || pageId == 'article' || pageId == 'articleM' || !pageId.indexOf('articletj')) {
            var func = scope.useNewInterfaceToGetNum;
            if (!func) {
                scope.useNewInterfaceToGetNum = {};
                func = scope.useNewInterfaceToGetNum;
            }
            var diggerNum = 0;
            for (var x in oData) {
                diggerNum = oData[x]['d'];
                break;
            }
            if (func) {
                var diggNumStr = 'digg_m_' + scope.$articleid;
                var obj = {};
                obj[diggNumStr] = diggerNum;
                if (func.onSuccess) {
                    func.onSuccess(obj);
                } else {
                    var count = 0;
                    var timmer = setInterval(function () {
                        if (count > 300) {
                            clearInterval(timmer);
                            if (func && func.onException) {
                                func.onException(obj)
                            }
                            return;
                        }
                        if (func && func.onSuccess) {
                            clearInterval(timmer);
                            func.onSuccess(obj);
                        }
                        count++;
                    }, 100);
                }
            }
        }
    }
};
App.getArticlesDetailNumber = function (sUid, aArticleLists, fCallBack) {

    if (aArticleLists == null || aArticleLists.length == 0) {
        return {};
    }

    sUid = sUid || scope.$uid;
    // 十六进制 UID
    // var sUidHex = "00000000" + (scope.$uid * 1).toString(16);
    var sUidHex = (scope.$uid * 1).toString(16); // uid升级成为64位，by wangqiang1,2013-10-10
    // sUidHex = sUidHex.substr(sUidHex.length - 8, 8);
    var sUidLen = sUidHex.length;
    if (8 > sUidLen) {
        for (var i = 0, len = 8 - sUidLen; i < len; i++) {
            sUidHex = '0' + sUidHex;
        }
    }
    // 文章 ID 不包括前面的 UID 部分
    var aids = [];

    // 整理文章 ID 数据
    Core.Array.foreach(aArticleLists, function (oItem) {
        aids.push(oItem.replace(sUidHex + "01", ""));
    });
    /*
     * Jsload 无法请求文章评论数阅读数接口，C接口，因此参数格式乃至顺序都不能变
     * 所以只有临时处理创建一个 JS，原谅我吧，第二次这样干了，都是 C 接口闹的
     */
    var js = $C("script");
    var random = Math.ceil(Math.random() * 10000);
    while ($ScriptLoader.callback[random] != null) {
        random = Math.ceil(Math.random() * 10000);
    }
    // 将当前的回调函数保存起来，免得多个请求同时发起的时候，回调错误
    var requestId = "aritlces_number_" + random;
    $ScriptLoader.callback[requestId] = {
        func: fCallBack, uid: sUid
    };
    //从张强的接口改回老接口，因为广东地区有用户反应无法显示阅读数2011-01-06
    //js.src = "http://blogcnf.sinajs.cn/num?uid=" + sUidHex + "&aids=" + aids.join(",") + "&requestId=" + requestId;
    //改为张强提供的接口  ngix模块 2011-01-05
    //js.src = "http://blognum.sinajs.cn/num?uid=" + sUidHex + "&aids=" + aids.join(",") + "&requestId=" + requestId;
    //王京提供 2011-06-07
    // var src = "http://blogtj.sinajs.cn/api/num.php?uid=" + sUidHex + "&aids=" + aids.join(",") + "&requestId=" + requestId;
    var src = "http://comet.blog.sina.com.cn/api?maintype=num&uid=" + sUidHex + "&aids=" + aids.join(",") + "&requestId=" + requestId;
    if (scope.$pageid == 'indexM' || scope.$pageid == 'index') {
        src += '&fetch=r,c,z,f';
    }
    if (scope.$pageid == 'articlelist' || scope.$pageid == 'articlelistM') {
        src += '&fetch=c,r';
    }
    js.src = src;

    js.charset = "utf-8";
    js.onload = js.onerror = js.onreadystatechange = Core.Function.bind2(function () {
        if (js && js.readyState && js.readyState != "loaded" && js.readyState != "complete") {
            return;
        }
        //清理script标记
        js.onload = js.onreadystatechange = js.onerror = null;
        js.src = "";
        js.parentNode.removeChild(js);
        js = null;
    }, this);
    document.getElementsByTagName("head")[0].appendChild(js);
};
