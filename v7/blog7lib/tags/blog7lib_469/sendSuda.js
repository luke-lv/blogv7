$import("lib/lib.js");
$import("lib/register.js");
$import("lib/util/loadScript.js");
/**
 * @fileoverview 
 * 全局suda布码
 * @create 2012-08-13
 * @author Qiangyee | wangqiang1@staff
 */
Lib.register("sendSuda", function(lib){
    var url = "http://www.sinaimg.cn/unipro/pub/suda_s_v851c.js";
    return function(fun){
        lib.util.loadScript(url, fun);
    }
});