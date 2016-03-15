$import("sina/core/system/_system.js");
/**
 * @fileoverview 解析URL，返回json对象
 *
 * @create 2012-11-14
 * @author Qiangyee
 */
Core.System.parseURL = function(urlStr) {
    var regex = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
    var param = ["url", "scheme", "slash", "host", "port", "path", "query", "hash"];
    var matches = regex.exec(urlStr);
    var url = {};
    for(var i = 0, len = param.length; i < len; i += 1) {
        url[param[i]] = matches[i] || "";
    }
    return url
};
