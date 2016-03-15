$import("lib/lib.js");
$import("lib/register.js");
/**
* @fileoverview 本地存储方法
* @author Qiangyee | wangqiang1@staff
* @created 2013-04-12
*/
Lib.register("util.JSON", function(lib){
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON
var json = (function(wnd, undefined){
    //如果已经支持了，则不再处理
    if( wnd.JSON )
        return wnd.JSON;
    /*
     * IE系列
     */
    var json = {

        parse: function (sJSON) { 
            return new Function("return " + sJSON)(); 
        },
        
        stringify: function (vContent) {
            if (vContent instanceof Object) {
            var sOutput = "";
            if (vContent.constructor === Array) {
                for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
                return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
            }
            if (vContent.toString !== Object.prototype.toString) { return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\""; }
            for (var sProp in vContent) { sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ","; }
            return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
            }
            return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
        }
    };
    return json;
})(window);

   return json;
});