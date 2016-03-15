$import("lib/jobs.js");
$import("sina/utils/io/jsload.js");
/**
 * @fileoverview 用户登录记住状态后，状态到期的情况统计
 * @author   Qiangyee | wangqiang1@staff
 * @created  2012-01-09
 */
$registJob("loginStatus", function(){
    var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/padblog/padInfo.php?rnd="+Math.random();
    Utils.Io.JsLoad.request(url,{
        onComplete : function(){}
        ,onException : function(){}
    });
});


