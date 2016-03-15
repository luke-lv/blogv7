$import("lib/jobs.js");
$import("lib/checkAuthor.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
/**
 * @fileoverview 用户登录记住状态后，状态到期的情况统计
 * @author   Qiangyee | wangqiang1@staff
 * @created  2012-01-09
 */
$registJob("loginStatus", function(){
    Lib.checkAuthor();
    var _getCookie = Utils.Cookie.getCookie;
    var _setCookie = Utils.Cookie.setCookie;

    var statusUid = _getCookie('_s_loginStatus');

    var loginUid = _getCookie('_s_loginuid');
    // 区分登录与非登录状态
    if ($isLogin) {
        if (loginUid === $UID) {
            return;
        }
    } else {
        if (!statusUid || (statusUid === loginUid)) {
            return;
        }
    }

    // name, value, expire, path, domain, secure
    // 布码统计
    _setCookie('_s_loginuid', $UID || statusUid, (24 - new Date().getHours()), '', 'blog.sina.com.cn');
    
    var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/padblog/padInfo.php?rnd="+Math.random();
    Utils.Io.JsLoad.request(url,{
        onComplete : function(){}
        ,onException : function(){}
    });
});
