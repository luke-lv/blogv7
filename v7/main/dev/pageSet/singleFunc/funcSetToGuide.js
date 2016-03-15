/**
 * @author Administrator
 */
$import("pageSet/singleFunc/funcGetSaveVars.js");
(function () {
    window.SetToGuide = function () {
        if (!guideJump.saving) {
            guideJump.saving = false;
        }
        if (guideJump.saving == false) {
            Lib.checkAuthor();
            guideJump.saving = true;

//            Ui.tween($E('topSetting'), ['opacity', 'marginTop'], [0.1, -255], 1, 'simple', {});
            $E('topSetting').style.display = 'none';
            getVars();

            var _default = new Interface("http://control.blog.sina.com.cn/riaapi/conf/module_template_manager.php", "ajax");
            _default.request({
                POST: window.postdata,
                onSuccess: function (data) {
                    Core.Events.removeEvent(window, window.beforeunloadfunc, 'beforeunload');
                    window.location.href = "http://control.blog.sina.com.cn/myblog/htmlsource/index.php?uid=" + scope.$uid + "&status=guide";
                },
                onError: function (data) {

                    winDialog.alert($SYSMSG[data.code], {
                        funcOk: function () {
                            if (data.code == 'A00004') {
                                guideJump.saving = false;
                                new Lib.Login.Ui().login(guideJump);
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
                    guideJump.saving = false;
//                    Ui.tween($E('topSetting'), ['opacity', 'marginTop'], [1, 0], 1, 'simple', {});
                    $E('topSetting').style.display = "";
                }
            });
        }
    };
    window.guideJump = function () {
        winDialog.confirm("您即将离开本页进入快速设置，是否保存后再进入？“确定”表示保存后进入，“取消”表示直接进入。", {
            funcOk: function () {
                SetToGuide();
            },
            funcCancel: function () {
                Lib.checkAuthor();
                if ($isAdmin) {
                    Core.Events.removeEvent(window, window.beforeunloadfunc, 'beforeunload');
                    window.location.href = "http://control.blog.sina.com.cn/myblog/htmlsource/index.php?uid=" + scope.$uid + "&status=guide";
                }
            },
            icon: "01"
        }, "jump");
    };
})();
