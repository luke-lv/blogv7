$import("sina/utils/io/jsload.js");
$import("lib/lib.js");
$import("lib/register.js");
$import("lib/sendLog.js");
$import("lib/util/json.js");
$import("lib/util/ls.js");
/**
 * @fileoverview 加载用户昵称，缓存4分钟
 * @param {String} uid 用户uid
 * @param {Function} cb 取回昵称后的回调函数
 * @param {Boolean} froceSever 是否不使用缓存，直接从服务器上取数据，默认使用缓存
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register("tray.loadUserInfo", function(lib){
    var LS = lib.util.LS;
    var JSON = lib.util.JSON;
    var sendSever = function(uid, cb){
        var url = "http://interface.blog.sina.com.cn/riaapi/profile/getNickName.php";
        Utils.Io.JsLoad.request(url, {
            GET : {
                uid : uid
            },
            onComplete  : function(r){
                //var r={"code":"A00006",data:{"full_nickname":"tpj34", "isbloguser":1, "uid":"3243441193", "nickname":"tpj34", "login_wtype":1}}
                // console.log('userinfo:', JSON.stringify(saveObj));
                if (r && 'A00006' === r.code) {
                    var n = r.data.nickname;
                    // 增加数据获取的时间
                    var saveObj = {
                        time : new Date().getTime()/1000
                    };
                    lib.apply(saveObj, r.data);
                    LS.setItem('uid'+uid, JSON.stringify(saveObj));
                    
                    cb(saveObj);
                }
            },
            onException : function(){
                
            },
            timeout : 10000
        });
    }
    return function(uid, cb, froceSever){
        
        var nickInfo = LS.getItem('uid'+uid);
        if (!froceSever && nickInfo) {
            nickInfo = JSON.parse(nickInfo);
            var currentTime = new Date().getTime()/1000;
            var waitTime = currentTime - nickInfo.time;
            if (waitTime < 4*60 && nickInfo.nickname) {
                cb(nickInfo);
                return;
            }
        }
        sendSever(uid, cb);
    };
});