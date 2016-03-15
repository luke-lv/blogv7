$import("sina/core/system/_system.js");
$import("sina/core/string/trim.js");
/**
 * @fileoverview 将url的query字符串转换为json对象
 * @param {JSON} json  query字符串
 * @param {Boolean} isEncode  是否编码
 */
Core.System.jsonToQuery = function(json, isEncode) {
    var strArr = []
        ,getString = function(str){
            return isEncode ? encodeURIComponent(str) : str;
        };
    if( typeof json == "object"){
        for(var p in json) {
            if(p === "$nullName") {
                strArr = strArr.concat(json[p]);
                continue
            }
            if(json[p] instanceof Array){
                for(var i = 0, len = json[p].length; i < len; i++)
                    strArr.push(p + "=" + getString(json[p][i]));
            } else {
                (typeof json[p] != "function") 
                    && strArr.push(p + "=" + getString(json[p]));
          
            }
                
        }
    }
        
    return strArr.length ? strArr.join("&") : ""
}
