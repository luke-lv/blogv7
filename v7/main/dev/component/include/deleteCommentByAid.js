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
$import("lib/showError.js");
$import("lib/dialogConfig.js");
$import("lib/login/ui.js");

$import("msg/componentMSG.js");
/**
 * 删除评论并回调
 * @param {Number}        nCommentid
 * @param {Function}    fCallBack
 */
Lib.deleteCommentByAid = function (nCommentid, fCallBack, _uid) {
    Lib.checkAuthor();
    if (!$isLogin) {
        var Login = new Lib.Login.Ui();
        Login.login(Core.Function.bind3(Lib.deleteCommentByAid, null, arguments));
        return;
    }
    Debug.log("删除评论：" + nCommentid);

    var delfunc = function () {
        var i_deleteBlogComment = new Interface("http://control.blog.sina.com.cn/admin/comment/comment_del_post.php", "ijax");
        var param = {
            "comment_id": nCommentid,
            "uid": scope.$uid,
            "admin": 1
        };
        i_deleteBlogComment.request({
            GET: param,
            onSuccess: function () {
                if (fCallBack) {
                    fCallBack(null, null, true);
                } else {
                    Debug.log("Reload page");
                }
            }, onError: function (oData) {
                showError(oData.code);
            }, onFail: function () {
                showError("A00001");
            }
        });
    };
    //删除评论不提示，直接删除
    //delfunc();
    //删除评论提示，后接删除
    var styleState = "", friendUID = _uid, id = nCommentid;
    if (scope.$uid == friendUID || friendUID == 0) {
        styleState = ' style="display:none" ';
    }

    winDialog.confirm($SYSMSG.B80101, {
        subText: '<div ' + styleState + '><input id="cbAddToBlock_' + id + '" type="checkbox"/><label for="cbAddToBlock_' + id + '">将此人加入黑名单</label></div>',
        funcOk: function () {
            var i_deleteBlogComment = new Interface("http://control.blog.sina.com.cn/admin/comment/comment_del_post.php", "ijax");
            var param = {
                "comment_id": nCommentid,
                "uid": scope.$uid,
                "admin": 1,
                "friend_uid": friendUID,
                "is_photo": 0,
                inblack: ($E("cbAddToBlock_" + id).checked ? "1" : "0")
            };
            i_deleteBlogComment.request({
                GET: param,
                onSuccess: function () {
                    if (fCallBack) {
                        fCallBack(null, null, true);
                    } else {
                        Debug.log("Reload page");
                    }
                }, onError: function (oData) {
                    if (oData["code"] == 'A00023' || oData["code"] == 'B36023') {
                        winDialog.alert('对不起，黑名单已达到上限', {
                            funcOk: function () {
                                fCallBack(null, null, true);
                            },
                            icon: "01"
                        });
                        return;
                    }

                    showError(oData.code);
                }, onFail: function () {
                    showError("A00001");
                }
            });
        },
        textOk: "删除", icon: "04"
    });
};
