$import("lib/lib.js");
$import("lib/register.js");
/**
 * @fileoverview 
 * 博客新布码,第三方的,缔元信的,博客部分页面引用了
 * @create 2013-07-01
 * @author Liu Xiaoyue | xiaoyue3@staff
 */
Lib.register("diYuanXinLog", function(){
    var isLoadScript = !1;
    var isLoading;
    var cache = [];
    var jsver =  (typeof $_GLOBAL != "undefined" && $_GLOBAL.ver != null)
                ? $_GLOBAL.ver["di_yuan_xin"] || "-1"
                : "-1";
    var url = "http://sjs.sinajs.cn/xblogtheme/js/di_yuan_xin.js?ver=" + jsver + ".js";
    var isLoadScript = function(){
        Utils.Io.JsLoad.request(url, {
                isRemove : !1,
                noreturn: true,
                onComplete : function () {
                    isLoading = !1;
                    isLoadScript = !0;
                    for (var i = 0, len = cache.length; i < len; i++) {
                        cache[i]();
                    };
                    cache = [];
                }
            });  
    }
    return function(fun){
        if (!0 === isLoadScript) {
            fun();
        } else if (!0 === isLoading) {
            cache.push(fun);
        } else {
            cache.push(fun);
            isLoadScript();
        }
    }
});