/**
 * @fileoverview 修改博文分类
 * @author dcw1123@staff.sina.com.cn
 * @version 1.0
 */
$import("sina/core/class/define.js");
$import("sina/core/string/format.js");

$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("articleManage/ArticleMange.js");
$import("msg/articleManageMSG.js");
$import("msg/blogSystemMSG.js");

$import("lib/dialogConfig.js");
$import("component/include/getArticlesSort.js");

App.articleHide = Core.Class.define(null, App.ArticleMange, {

    // 接口地址
    "Interface": new Interface("http://control.blog.sina.com.cn/riaapi/article/edit_cat.php?old_cat=0&new_cat=0", "jsload"),

    // 请求接口的参数
    "param": {
        blog_id: function () {
            return this.articleId;
        }
    },

    //
    "confirmMSG": "是否要隐藏此博文",

    // 是否需要登录
    needLogin: function () {
        trace('检查用户');
        Lib.checkAuthor();
        return !$isAdmin;
    },

    requestOk: function () {
        winDialog.alert("隐藏成功", {
            "icon": "03",
            funcOk: function () {
                window.location.reload();
            }
        });
    },

    // 请求完成，但出错的回调函数
    requestError: function (sCode) {
        winDialog.alert("失败，请重试");
    }

});


