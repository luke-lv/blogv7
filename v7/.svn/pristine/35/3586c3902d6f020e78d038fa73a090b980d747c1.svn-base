/**
 * @fileoverview
 *    删除文章到草稿箱
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
App.deleteDraftArticle = Core.Class.define(null, App.ArticleMange, {
    // 接口地址
    "Interface": new Interface("http://control.blog.sina.com.cn/admin/article/article_draft_del.php", "jsload")
    // 是否需要登录
    , "needLogin": function () {
        Lib.checkAuthor();
        return !$isAdmin;
    }
    // 弹出的确认信息，如果没有就不设置此项
    //,"confirmMSG"	: $SYSMSG.B03007
    , "confirmMSG": $SYSMSG.B03016, "textOk": "是", "textCancel": "否"
    // 请求接口的参数
    // 请求接口的参数
    , "param": {
        "blog_id[]": function () {
            return this.articleId;
        }, "uid": scope.$uid
    }
    // 请求成功的回调函数
    , "requestOk": function () {
        window.location.reload();
    }
});