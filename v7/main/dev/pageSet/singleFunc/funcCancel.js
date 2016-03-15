/**
 * @fileoverview 取消页面设置
 * @author xinyu@staff.sina.com.cn
 */
$import('msg/pageSetMSG.js');
$import('sina/core/events/removeEvent.js');
(function () {
    window.funcCancel = function () {
        winDialog.confirm($SYSMSG.B90001, {
            funcOk: function () {
                trace("点击了确定");
                Core.Events.removeEvent(window, window.beforeunloadfunc, 'beforeunload');
                window.location.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
            }
        }, 'pagecancel');
        var pageclose = winDialog.getDialog('pagecancel');
        var anchor = pageclose.getNodes()["linkOk"];
        anchor.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
    };
})();
