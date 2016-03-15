$import("lib/lib.js");
$import("lib/register.js");
$import("lib/util/loadScript.js");
/**
 * @fileoverview 
 * 新浪zhitou广告
 * @create 2013-08-22
 * @author Qiangyee | wangqiang1@staff
 */
Lib.register("execZhitou", function(lib){
    //说明：
    //https://github.com/acelan86/sinaads/wiki/sinaads%E4%BB%8B%E7%BB%8D#%E6%8A%95%E6%94%BE%E6%96%B9%E6%B3%95
    var url = "http://d5.sina.com.cn/litong/zhitou/sinaads/release/sinaads.js";
    document.createElement('inc');
    return function(fun){
        lib.util.loadScript(url, fun);
    }
});
