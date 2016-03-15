/**
 * @fileoverview 文章管理基础类，可以扩展出删除到回收站、回收站删除、草稿箱删除、恢复、置顶、置顶替换、取消置顶、收藏等操作
 * @author L.Ming | liming1@staff.sina.com.cn
 * @modified dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/core/class/define.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/system/br.js");

$import("lib/app.js");
$import("lib/interface.js");
$import("lib/login/ui.js");
$import("lib/checkAuthor.js");
$import("lib/msg/systemMSG.js");
$import("lib/showError.js");
$import("lib/dialogConfig.js");

$import("msg/articleManageMSG.js");
$import("msg/blogSystemMSG.js");

App.ArticleMange = Core.Class.create();
Core.Class.extend(App.ArticleMange.prototype, {
    /**
     * 初始化
     * @param {String} sArticleId        文章ID，必选
     * @param {Object} oOption            选项
     *        callback        回调函数
     *
     */
    "initialize": function (sArticleId, oOption) {
        for (var key in oOption) {
            this[key] = oOption[key];
        }
        this.articleId = sArticleId;
        Lib.checkAuthor();
        this.pretreat();
    }
    // 预处理，检查参数是否齐全
    , "pretreat": function () {
        if (this.articleId == null) {
            Debug.error("ArticleManage need the article id.");
            return;
        } else {
            this.checkLogin();
            return this;
        }
    }
    // 看是否需要登录再继续后续步骤
    , "checkLogin": function () {
        this.needLogin = this.needLogin();
        Debug.log("checkLogin : " + this.needLogin);
        var $login = function (callback) {
            new Lib.Login.Ui().login(callback);
        };
        var actionConfirm = Core.Function.bind2(this.confirm, this);

        Lib.checkAuthor();
        if (this.needLogin || !$isLogin) {
            $login(actionConfirm);
        } else {
            actionConfirm();
        }
    }
    // 看是否需要用户先确认
    , "confirm": function () {
        if (!$isLogin) {
            Lib.checkAuthor();
            // 刷新托盘
            $tray.renderLogin();
        }
        this.needLogin = false;
        var tok = this.textOk || "确定";
        var tca = this.textCancel || "取消";
        if (this.confirmMSG) {
            winDialog.confirm(this.confirmMSG, {
                funcOk: Core.Function.bind2(this.doAction, this), textOk: tok, textCancel: tca
            });
        } else {
            this.doAction();
        }
    }
    // 提交数据并响应
    , "doAction": function () {
        if ($IE && Core.Events.getEvent()) {
            Core.Events.stopEvent();
        }
        var param = {};
        for (var key in this.param) {
            if (typeof this.param[key] == "function") {
                param[key] = Core.Function.bind2(this.param[key], this)();
            } else {																//added by dcw1123 / 2010.03.05
                param[key] = this.param[key];
            }
        }
        //added by yongsheng4 安全漏洞http://issue.internal.sina.com.cn/browse/SEC-3107,部分接口get改为post
        if (param.getType == "POST") {
            if (param.getType) {
                delete param.getType;
            }
            this.Interface.request({
                "POST": param, "onSuccess": this.callback || this.requestOk || function () {
                    window.location.reload();
                }, "onError": this.requestError || function (oData) {
                    showError(oData.code);
                }, "onFail": function () {
                    showError("A00001");
                }
            });
        } else {
            if (param.getType) {
                delete param.getType;
            }
            this.Interface.request({
                "GET": param, "onSuccess": this.callback || this.requestOk || function () {
                    window.location.reload();
                }, "onError": this.requestError || function (oData) {
                    showError(oData.code);
                }, "onFail": function () {
                    showError("A00001");
                }
            });
        }

    }
});