$import("lib/lib.js");
/**
 * 注册组件新方法
 * @author Qiangyee | wangqiang1@staff
 * @example
    注册静态组件
<code>
 		Lib.register("historyM", function(lib){
            
            var that = {
                init : function(){
                    alert("aaa");
                }
            };
            return that;
        });
</code>
注册需要new的组件
<code>
        Lib.register("historyM", function(lib){
            
            var that = {
                init : function(){
                    alert("aaa");
                }
            };
            return function(){
                alert(1);
            };
        });
</code>
 */
Lib.register = function(name, fn){
    var ns = name.split(".");
    var obj = {},
        tmp,
        nsobj = Lib;

    while (tmp = ns.shift()) {
        if (ns.length) {
            if (nsobj[tmp] === undefined) {
                nsobj[tmp] = {};
            }
            nsobj = nsobj[tmp];
        } else {
            if (nsobj[tmp] === undefined) {
                nsobj[tmp] = fn(Lib);
            }
        }
    }
};