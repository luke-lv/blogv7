$import("sina/core/system/_system.js");
$import("sina/core/string/trim.js");
/**
 * @fileoverview 将url的query字符串转换为json对象 
 * @param {Object} queryStr  query字符串
 * @param {Object} isEncode  是否编码
 */
Core.System.queryToJson = function(queryStr, isEncode) {
    queryStr = Core.String.trim(queryStr);
    if(!queryStr) {
        return {};
    }
    var params = queryStr.split("&")
        ,json  = {}
        ,getString = function(str){
            return isEncode ? decodeURIComponent(str) : str;
        };
    for(var i = 0, len = params.length; i < len; i++) {
        var param = params[i]
        if (param) {
            var tmp    = param.split("=")
                ,key   = tmp[0]
                ,value = tmp[1];
            if (tmp.length<2) {
                value  = key;
                key = "$nullName"
            }
            if (!json[key]) {
                json[key] = getString(value);
            } else {
                (json[key] instanceof Array) != !0 && (json[key] = [json[key]]);
                json[key].push(getString(value));
            }
        };
    }
    return json;
}
