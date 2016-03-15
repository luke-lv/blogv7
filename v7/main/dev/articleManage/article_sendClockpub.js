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

App.sendClockpub = Core.Class.define(null, App.ArticleMange, {
    // 接口地址
    "Interface": new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/blog/clockPubImmediate.php", "jsload")
    // 是否需要登录
    , "needLogin": function () {
        Lib.checkAuthor();
        return !$isAdmin;
    }
    // 弹出的确认信息，如果没有就不设置此项
    //,"confirmMSG"	: '你确定要要立即发布吗？'
    //,"textOk"			: "是"
    //,"textCancel"		: "否"
    // 请求接口的参数
    // 请求接口的参数
    , "param": {
        "blog_id": function () {
            return this.articleId;
        }
        //,"uid"		: scope.$uid
        //,listImmediatePub: 1
    }
    // 请求成功的回调函数
    , "requestOk": function (data) {
        //trace(data);
        winDialog.alert("博文已发布成功", {
            funcOk: function () {
                setTimeout(function () {
                    //window.onbeforeunload=function(){};
                    window.location.href = "http://blog.sina.com.cn/s/blog_" + data + ".html";
                }, 1);
            },
            icon: "03"
        });
    }, requestError: function (oData) {
        //trace(data);
        if (oData.code === 'B40003' || oData.code === 'B36101') {
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