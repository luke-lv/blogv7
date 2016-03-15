/**
 * @fileoverview
 *     删除定时发布里的文章
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 */
$import("sina/core/class/define.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("articleManage/ArticleMange.js");
$import("msg/articleManageMSG.js");
$import("msg/blogSystemMSG.js");

App.deleteClockpub = Core.Class.define(null, App.ArticleMange, {
    // 接口地址
    "Interface": new Interface("http://control.blog.sina.com.cn/admin/article/article_clockpub_del.php", "jsload")
    // 是否需要登录
    , "needLogin": function () {
        Lib.checkAuthor();
        return !$isAdmin;
    }
    // 弹出的确认信息，如果没有就不设置此项
    , "confirmMSG": '博文删除后将无法恢复，确定要删除吗？', "textOk": "是", "textCancel": "否"
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
    }, requestError: function (oData) {
        //trace(data);
        if (oData.code === 'B00011') {
            //winDialog.alert('博文已发布，不在定时列表中', {
            winDialog.alert('博文已不在定时列表中', {
                funcOk: function () {
                    window.location.reload();
                },
                icon: "01"
            });
        } else {
            showError(oData.code);
        }
    }
});