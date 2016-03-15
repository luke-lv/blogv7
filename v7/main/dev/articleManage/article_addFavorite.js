/**
 * @fileoverview
 *    收藏文章
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/class/define.js");

$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("articleManage/ArticleMange.js");
$import("msg/articleManageMSG.js");
$import("msg/blogSystemMSG.js");
App.addFavoriteArticle = Core.Class.define(null, App.ArticleMange, {
    // 接口地址
    "Interface": new Interface("http://control.blog.sina.com.cn/admin/article/favourites_save.php", "jsload")
    // 是否需要登录
    , "needLogin": function () {
        Lib.checkAuthor();
        return !$isLogin;
    }
    // 请求接口的参数
    , "param": {
        "blog_id": function () {
            return this.articleId;
        }, "uid": scope.$uid
    }
    // 请求成功的回调函数
    , "requestOk": function () {
        if ($E('f_' + scope.$articleid)) {
            $E('f_' + scope.$articleid).innerHTML = $E('f_' + scope.$articleid).innerHTML.replace(/\((\d*)\)/gi, function (a,
                                                                                                                           b) {
                return '(' + (window.parseInt(b) + 1) + ')';
            });
        }
        winDialog.alert($SYSMSG.B03020, {icon: "03"});
    }
});