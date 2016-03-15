/**
 * @fileoverview
 *    删除文章到回收站
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/class/define.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/showError.js");
$import("articleManage/ArticleMange.js");
$import("msg/articleManageMSG.js");
$import("msg/blogSystemMSG.js");
$import("lib/accountChecker.js");

App.deleteArticle = Core.Class.define(null, App.ArticleMange, {
    // 接口地址
    "Interface": new Interface("http://control.blog.sina.com.cn/admin/article/article_del_recycle.php", "ijax")
    // 是否需要登录
    , "needLogin": function () {
        trace('检查用户');
        Lib.checkAuthor();
        return !$isAdmin;
    }
    // 弹出的确认信息，如果没有就不设置此项
    , "confirmMSG": $SYSMSG.B03006
    // 请求接口的参数
    , "param": {
        "getType": "POST", "blog_id[]": function () {
            return this.articleId;
        }, "uid": scope.$uid
    }
    // 请求成功的回调函数
    , "requestOk": function () {
        window.location.reload();
    }
    // 请求完成，但出错的回调函数
    , "requestError": function (oData) {
        //console.log(oData);
        if (oData && oData.code === 'B30001') {
            new Lib.AccountChecker(oData.data.ssoUseUrl);
        } else {
            showError(oData.code);
        }
    }
});