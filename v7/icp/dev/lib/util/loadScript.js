$import("sina/utils/io/jsload.js");
$import("lib/register.js");
/**
 * @fileoverview 加载外部JS，并且执行回调函数，可以添加多个回调
 *  var url = 'http://sina.com.cn/aaa.js';
    Lib.util.loadScript(url, function(){alert(1)});
    Lib.util.loadScript(url, function(){alert(2)});
 * @create 2012-11-30
 * @author Qiangyee
 */
Lib.register("util.loadScript", function () {
    var TRUE = !0,
        FALSE = !1,
        cache = {};
    
    // 加载suda js然后执行缓存的suda请求
    var loadScript = function(url, item){
        Utils.Io.JsLoad.request(url, {
                isRemove : FALSE,
                noreturn: TRUE,
                onComplete : function (data) {
                    cache[url].isLoading = FALSE;
                    var cb = cache[url].cb
                    for (var i = 0, len = cb.length; i < len; i++) {
                        cb[i](data);
                    };
                    cache[url].cb = null;
                }
            });  
    }
    return function(url, fun){
        var item = cache[url];
        var cb = item && item['cb'];
        if (!item) {
            cb = [fun];
            item = {
                isLoading: TRUE,
                cb: cb
            }
            cache[url] = item;
            loadScript(url, item);
        } else if (item.isLoading) {
            cb.push(fun);
        } else {
            fun();
        }
    }
});