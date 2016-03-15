$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/string/formatNumber.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/utils/io/jsload.js");

$import("lib/interface.js");
$import("lib/component/include/attention.js");
$import("lib/component/include/setPV.js");
$import("lib/checkAuthor.js");
$import("lib/uic.js");
/**
 * @fileoverview 夹页博主信息
 *
 * @author  Qiangyee | wangqiang1@staff
 * @create  2012-09-10
 */
$registJob("tjLoadBlogerInfo", function () {
	/*
     * 请求博主的访问数，每请求一次该接口，自动加一
     */
    var loadPv = function () {
        var refer = document.referrer == '0' ? '' : encodeURIComponent(document.referrer);
        if(scope.totalPv && !isNaN(scope.totalPv)) {
            $SetPV(scope.totalPv);
        } else {
            var pvurl = "";
            if(scope.$articleid) {
                // pvurl = "http://hits.blog.sina.com.cn/hits?act=4&aid=" + scope.$articleid + '&ref='+refer;
                pvurl = "http://comet.blog.sina.com.cn/api?maintype=hits&act=4&aid=" + scope.$articleid + '&ref='+refer;
            } else {
                var $uidhex = (scope.$uid * 1).toString(16);
                $uidhex.length < 8 ? $uidhex = (("00000000" + $uidhex).substr($uidhex.length, 8)) : $uidhex; 
                // pvurl = "http://hits.blog.sina.com.cn/hits?act=3&uid=" + $uidhex + '&ref='+refer;                                pvurl = "http://hits.blog.sina.com.cn/hits?act=3&uid=" + $uidhex + '&ref='+refer;
                pvurl = "http://comet.blog.sina.com.cn/api?maintype=hits&act=3&uid=" + $uidhex + '&ref='+refer;

            }
            Utils.Io.JsLoad.request(pvurl, {
                onComplete : function(data) {
                    if(data && typeof data.pv != "undefined") {
                        scope.totalPv = data.pv;
                        $SetPV(data.pv);
                    }
                },
                onException : function () {
                    $SetPV(0);
                }
            });
        }
    };

    /*
     * 载入博主关注数
     */
    var loadAttention = function () {

        var attention = new Interface("http://blogtj.sinajs.cn/api/get_attention_num.php", "jsload");
        var getVal = {
            "uid"		: scope.$uid
            ,
            "suid"		: $isLogin ? $UID : "0"
            ,
            "attention": "suid"
            //2011-05-03 积分接口一直都调用
            ,
            "userpointuid": scope.$uid
            ,
            "s"		: "1"	// blog7 多增加一个这个参数，用以区分
        };
        //当接口结合时被调用,原来的接口废弃,默认情况下这个是不会被调用的
        if(this.mashAddFriend) {
            var friendattuid = scope.$uid;
            var friendattsuid = $UID;
            if(friendattuid && friendattsuid) {
                getVal.friendattuid = friendattuid;
                getVal.friendattsuid = friendattsuid;
            } else {
                //未登录情况下不做任何处理
                this.mashAddFriend = false;
            }
        }

        attention.request({
            GET : getVal,
            onSuccess : function (oData) {

                Lib.checkAuthor();
                var followBtn = $E("comp901_btn_follow");
                if (followBtn) {
                    
                    if (oData.is_attention && oData.is_attention[scope.$uid] == 1){
                        followBtn.setAttribute("followed", "1");
                        followBtn.innerHTML = "已关注";
                    } else {
                        followBtn.onclick = function() {
                            Lib.Component.Attention();
                            if ($isLogin){
                                this.innerHTML = "已关注";
                            }
                            return false;
                        };
                    }
                }

                if(oData.svr_time) {
                    scope.$svr_time = oData.svr_time;
                }

            }
            ,
            onError  : function () {
            }
            ,
            onFail   : function () {
            }
        });
    };


    loadPv();
    if(scope.$pageid != "articletjTech"){
        loadAttention();
        Lib.Uic.getNickName([scope.$uid], function(oResult){
        });
    }
   

    
});