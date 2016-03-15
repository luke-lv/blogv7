$import("lib/lib.js");
$import("lib/register.js");
$import("lib/interface.js");

/**
 * @fileoverview 退出登录函数，退出成功发送消息 global-login-out
 * @param {Function} cb 退出登录后的回调函数
 * @param {Boolean}  reload 退出登录后是否刷新当前页
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register("tray.loginOut", function(lib){
    
    var ls = lib.Listener;
    // logout blog，无论返回什么，都必须退出博客。
    return function (cb, reload){
        
        var _curHref = encodeURIComponent(window.location.href);
        new Interface("http://control.blog.sina.com.cn/blog_rebuild/msn/api/msnLoginOut.php", "jsload").request({
            onSuccess:function(res){
                ls.notify('global-login-out', res);
                cb && cb(res);
                if (reload) {
                    window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+_curHref;
                }
                
            },
            onError:function(res){
                ls.notify('global-login-out', res);
                if (reload) {
                    window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+_curHref;
                }
                
            },
            onFail:function(res){
                ls.notify('global-login-out', res);
                if (reload) {
                    window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+_curHref;
                }
                
            }
        });
    };
});