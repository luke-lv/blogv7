$import("lib/login/_login.js");
/**
 * @fileoverview 获取用户登录的相关信息
 *
 * @create 2013-03-06
 * @author Qiangyee
 */
Lib.Login.info = function (){
    var info;
    // {ln: "wjhxxx@sina.com", nick: "xxx", uid: "xxxxxx"}
    if (window["sinaSSOController"] 
        && (info = sinaSSOController.getLoginInfo())) {
        return info;
    } else {
        return {};
    }
};
