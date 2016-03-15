/**
 * @fileInfo	个人中心商讯套餐
 * @author		Qiangyee | wangqiang1@staff
 */
 
$import("sina/utils/cookie/getCookie.js");
$import("lib/jobs.js");
$import("lib/680/oppAd.js");

$registJob("rightBusinessNews", function(){
    Lib.checkAuthor();
    var isClosed = Utils.Cookie.getCookie("blogAdICP");
    if (!$isLogin || isClosed){
        return;
    }
    var onload = function(){
        if ((typeof BLOG_AD_ICP == "undefined") || !BLOG_AD_ICP){
            return;
        }
        BLOG_AD_ICP.isShow = 1;
        BLOG_AD_ICP.isICP = 1;
        new blogAd.OppAd(BLOG_AD_ICP, $E("module_964"));
    };
    var url = "http://blog.sina.com.cn/lm/temp/newblogad/2012blogmessage.js";
    Utils.Io.JsLoad.request(url, {
        charset : "gb2312",
        onComplete  : onload,
        onException : onload,
        isRemove : false
    });

});

