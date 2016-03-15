/**
 * @fileoverview
 *    取得特定 UID 的文章分类、分类文章数
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/app.js");
$import("lib/checkAuthor.js");
/**
 * 读取文章分类，并回调
 * @param {Function} fCallBack
 */
App.getArticlesSort = function (fCallBack, uid) {
    uid = uid || scope.$uid;
    /*
     * Jsload 会把 http://blogcnf.sinajs.cn/acate?jv=x&1406758883 解析成 http://blogcnf.sinajs.cn/acate?jv=x&1406758883=
     * 所以只有临时处理创建一个 JS
     */
    var js = $C("script");
    Lib.checkAuthor();
    js.src = "http://comet.blog.sina.com.cn/api?maintype=acate&varname=x&uid=" + uid;
    js.charset = "utf-8";
    js.onload = js.onerror = js.onreadystatechange = Core.Function.bind2(function () {
        if (js && js.readyState && js.readyState != "loaded" && js.readyState != "complete") {
            return;
        }

        App.ArticlesSort = x;
        if (fCallBack != null) {
            fCallBack(App.ArticlesSort);
        }

        //清理script标记
        js.onload = js.onreadystatechange = js.onerror = null;
        js.src = "";
        js.parentNode.removeChild(js);
        js = null;
    }, this);
    document.getElementsByTagName("head")[0].appendChild(js);
};
