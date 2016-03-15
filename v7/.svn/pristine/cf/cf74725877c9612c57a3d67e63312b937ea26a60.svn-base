$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");

$import("lib/login/ui.js");
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
/**
 * @fileoverview 立即申请淘博会按钮
 *
 * @create 2010-12-05
 * @author Qiangyee
 */
$registJob("application", function(){

    var btn = $E("application");
    if (!btn) {
        return;
    }
    
    var _addEvent = Core.Events.addEvent;
    var _this = {
        loginSuccess : function(){
            location.hash = "#!submit";
            location.reload(true);
        },
        showLoginLayer : function(){
            var loginObj = new Lib.Login.Ui();
            loginObj.login(_this.loginSuccess);
        },
        onReceiveApplication : function(){
            Lib.checkAuthor();
            if (!$isLogin) {
                _this.showLoginLayer();
            } else {
                _this.submit();
            }
        },
        submit : function(){
            var url = "http://i.blog.sina.com.cn/blog_rebuild/riaapi/profile/tbh/shopapply.php";
            Utils.Io.JsLoad.request(url, {
                GET : {
                    ac : 1,
                    t  : 3,
                    u  : $UID
                },
                onComplete : function(result) {
                    if ("A00006" === result.code) {
                        var form = $C("form");
                        var url  = result.data + "&rnd=" + parseInt(Math.random() * 1000);
                        
                        var input = $C("input");
                        input.name = "ac";
                        input.value = 1;
                        form.method = "post";
                        form.action = url;
                        form.appendChild(input);
                        document.body.appendChild(form);
                        form.submit();
                    } else if ("A10001" === result.code) {
                        winDialog.alert("亲，您的账号不到10级的哦！", {
                            width : 300,
                            icon  : "01"
                        }, "___tips");
                    } else {
                        winDialog.alert(result.data, {
                            width : 300,
                            icon  : "01"
                        }, "___tips");
                    }
                },
                onException: function() {
                }
            });
        }
        
    };

    
    _addEvent(btn, function(e){
        _this.onReceiveApplication();
        return false;
    }, "click");

    if ("#!submit" == location.hash) {
        _this.onReceiveApplication();
    }
});
