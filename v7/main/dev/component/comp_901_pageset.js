/**
 * @fileoverview
 *    我的动态、关注、收藏、留言、圈子页——个人资料组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/component/class/registComp.js");
$import("component/comp_901.js");

$registComp(901, {
    /*
     * 加载 PV
     */
    "loadPv": function () {
        if (scope.totalPv && !isNaN(scope.totalPv)) {
            $SetPV(scope.totalPv);
        } else {
            var pvurl = "";
            var $uidhex = (scope.$uid * 1).toString(16);
            $uidhex.length < 8 ? $uidhex = (("00000000" + $uidhex).substr($uidhex.length - 8, 8)) : $uidhex;
            pvurl = "http://comet.blog.sina.com.cn/api?maintype=hits&act=2&flag=bl&uid=" + $uidhex + "&var=userPvCount";
            Utils.Io.JsLoad.request(pvurl, {
                onComplete: function (data) {
                    if (userPvCount && typeof userPvCount[$uidhex] != "undefined") {
                        scope.totalPv = userPvCount[$uidhex];
                        $SetPV(scope.totalPv);
                    }
                },
                onException: function () {
                    $SetPV(0);
                }, noreturn: true
            });
        }
    }
}, 901);