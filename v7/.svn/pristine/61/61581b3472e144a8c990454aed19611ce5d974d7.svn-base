/**
 * @fileoverview
 *    file profile
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/function/bind3.js");

$import("lib/lib.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");
$import("lib/login/ui.js");

$import("msg/componentMSG.js");
/**
 * 删除留言并回调
 * @param {Number}        nMsgid
 * @param {Number}        sUid
 * @param {Function}    fCallBack
 */
Lib.deleteWallByMsgid = function (nMsgid, sUid, fCallBack) {
    Lib.checkAuthor();
    if (!$isLogin) {
        var Login = new Lib.Login.Ui();
        Login.login(Core.Function.bind3(Lib.deleteWallByMsgid, null, arguments));
        return;
    }
    Debug.log("删除留言：" + nMsgid);
    if (nMsgid == null || sUid == null) {
        Debug.error("请提供留言者 UID 和留言 Msgid");
        return;
    }
    winDialog.confirm($SYSMSG.B80102, {
        funcOk: function () {
            var i_deleteWall = new Interface("http://wall.cws.api.sina.com.cn/delete.php", "ijax");
            var param = {
                "msgid": nMsgid, "uid": $UID
            };
            // 如果选择了加入黑名单，就增加两个参数
            if ($E("comp_2_deleteToBlack") && $E("comp_2_deleteToBlack").checked) {
                param.block = 1;
                param.bid = sUid;
            }
            i_deleteWall.request({
                GET: param, onSuccess: function () {
                    if (fCallBack) {
                        fCallBack(null, null, true);
                    } else {
                        Debug.log("Reload page");
                    }
                }
            });
        }, "subText": sUid == scope.$uid ? "" : $SYSMSG.B80103, "textOk": "删除", "textCancel": "取消", "icon": "04"
    });

};