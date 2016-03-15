/**
 * @fileoverview 保存页面设置
 * @author xinyu@staff.sina.com.cn
 */

$import("lib/interface.js");
$import("sina/core/events/removeEvent.js");
$import('sina/ui/tween.js');
$import("pageSet/singleFunc/funcGetSaveVars.js");
$import("pageSet/uidlist.js");

(function () {
    window.funcSave = function () {
        if (!funcSave.saving) {
            funcSave.saving = false;
        }
        if (funcSave.saving == false) {
            Lib.checkAuthor();
            funcSave.saving = true;
            trace("save arguments.length=" + arguments.length);
            var marginTopValue = (scope.$pageid == "guideM") ? -408 : -255;
//			Ui.tween($E('topSetting'), ['opacity', 'marginTop'], [0.1, marginTopValue], 1, 'simple', {});
            $E('topSetting').style.display = "none";
            getVars();
            var _default = new Interface("http://control.blog.sina.com.cn/riaapi/conf/module_template_manager.php", "ajax");
            _default.request({
                POST: window.postdata,
                onSuccess: function (data) {
                    Core.Events.removeEvent(window, window.beforeunloadfunc, 'beforeunload');
                    window.location.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
                },
                onError: function (data) {
                    var iconType = "02";
                    var specialTxt = $SYSMSG[data.code];

                    if (data.code == "A11106") {
                        iconType = "01";

                        specialTxt = "<span style='font-size:12px; font-weight:normal;'>" + $SYSMSG[data.code] + "\
						<br/><br/>如有疑问请咨询：<br/>电话:4008812813<br/>邮箱:ads@staff.sina.com.cn</span>"
                    }

                    winDialog.alert(specialTxt, {
                        funcOk: function () {
                            if (data.code == 'A00004') {
                                funcSave.saving = false;
                                new Lib.Login.Ui().login(funcSave);
                            }
                            if (data.code == "A11106") {
                                Core.Events.removeEvent(window, window.beforeunloadfunc, 'beforeunload');
                                window.location.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
                            }
                        },
                        icon: iconType
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
                    funcSave.saving = false;
//					Ui.tween($E('topSetting'), ['opacity','marginTop'], [1,0], 1, 'simple', {});
                    $E('topSetting').style.display = "";

                }
            });

            //保存时更新背景是否滚动的状态
            //Random | YangHao@staff.sina.com.cn
            if (__pageSetVar.isBgFixed == 1) {
                window.setBgFixed();
                window.updateFixedBgStyle();
            }
        }
    };

})();
