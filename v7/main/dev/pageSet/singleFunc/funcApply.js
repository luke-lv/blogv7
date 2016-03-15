/**
 * @fileoverview 页面设置中的“应用”操作
 * @author xy xinyu@staff.sina.com.cn
 */

$import("sina/core/events/removeEvent.js");

$import('sina/ui/tween.js');

$import("lib/panel.js");

$import("pageSet/singleFunc/funcGetSaveVars.js");
(function () {
    window.funcApply = function () {
        if (!funcApply.saving) {
            funcApply.saving = false;
        }
        if (funcApply.saving == false) {
            Lib.checkAuthor();
            funcApply.saving = true;
            getVars();

            var _default = new Interface("http://control.blog.sina.com.cn/riaapi/conf/module_template_manager.php", "ajax");
            _default.request({
                POST: window.postdata,
                onSuccess: function (data) {
                    funcApply.saving = false;
                    if (!scope.panel) {
                        scope.panel = new Lib.Panel();
                    }
                    scope.panel.setTemplate('<div style="background-color:#fffccc;;z-index:1000;" id="#{panel}">应用成功！</div>');
                    scope.panel.showWithDom($E('applyPageSet'), -62, 5);
                    setTimeout(function () {
                        scope.panel.hidden();
                    }, 1000);
                },
                onError: function (data) {
                    if (!scope.panel) {
                        scope.panel = new Lib.Panel();
                    }
                    scope.panel.setTemplate('<div style="background-color:yellow;z-index:1000;" id="#{panel}">应用失败！</div>');
                    scope.panel.showWithDom($E('applyPageSet'), -62, 5);
                    setTimeout(function () {
                        scope.panel.hidden();
                    }, 1000);
                    winDialog.alert($SYSMSG[data.code], {
                        funcOk: function () {
                            if (data.code == 'A00004') {
                                funcApply.saving = false;
                                new Lib.Login.Ui().login(funcApply);
                            }
                        },
                        icon: "02"
                    }, "tips");

                    if (data.code == 'A00005') {//说明权限问题，是另一个帐号登陆，所以跳到首页
                        var tips = winDialog.getDialog('tips');
                        var anchor = tips.getNodes()["btnClose"];
                        var anchor2 = tips.getNodes()["linkOk"];
                        var btnok = tips.getNodes()['btnOk'];
                        anchor2.onclick = anchor.onclick = btnok.onclick = function () {
                            Core.Events.removeEvent(window, window.beforeunloadfunc, 'beforeunload');
                            window.location.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
                        };
                        anchor2.href = anchor.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
                    }
                    funcApply.saving = false;
                }
            });
        }
    };

})();

