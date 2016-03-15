/**
 * @fileoverview 检测XSS攻击，为了隐蔽不直接写xssDetect了，你懂的:-O
 *
 * @author Qiangyee | wangqiang1@staff
 * @create 2012-07-30
 */
$import("sina/core/array/findit.js");

$registJob("userDetect", function(){
    // 域名白名单
    var whiteList = {
        "cn"  : {
            "sinajs" : 1,
            "sina"   : 1,
            "weibo"  : 1,
            "bshare" : 1,
            "com"    : {
                "sina" : 1,
                "msn"  : 1
            }
        },
        "com" : {
            "sina"   : 1,
            "baidu"  : 1,
            "allyes" : 1,
            "weibo"  : 1,
            "qq"     : 1,
            "google" : 1,
            "msn"    : 1,
            "163"    : 1
        }
    };
    // 已发送的域名
    var sendHosts = [];
    
    var checkHost = function(tagEls, tree, sendHost){
        var src = "",
            reg = /http\:\/\/([^\/]+)/,
            illegalHosts = [],
            _contain = Core.Array.findit,
            sendHost = sendHost || [];

        for (var i = 0, len = tagEls.length; i < len; i++){
            src = tagEls[i].src;
            if (!src || !reg.test(src)){
                continue;
            }
            var host  = src.match(reg)[1];
            var leafs = host.split(".");
            var whiteLeaf = tree;
            
            for (var l = leafs.length-1; l > -1; l--){
                whiteLeaf = whiteLeaf[leafs[l]];
                if (1 === whiteLeaf){
                    break;
                } else if (null == whiteLeaf){
                    if(-1 === _contain(sendHost, host)){
                        illegalHosts.push(host);
                    }
                    break;
                }
            }
        }
        return illegalHosts;
    };

    var sendHost = function(hosts){
        if (!hosts.length){
            return;
        }
        //类型先不做区分统一为100
        Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/riaapi/blogDetect.php", {
            GET : {
                uDomain : hosts.join(","),
                type    : 100
            },
            onComplete  : function(){},
            onException : function(){},
            timeout : 30000
        });
    };

    var convertToObject = function(hosts){
        var obj = {};
        for (var l = hosts.length-1; l > -1; l--){
            obj[hosts[l]] = 1;
        }
        return obj;
    };

    var jsHosts     = checkHost($T(document, "script"), whiteList);
    var iframeHosts = checkHost($T(document, "iframe"), whiteList);

    sendHosts = jsHosts.concat(iframeHosts);

    if (sendHosts.length){
        sendHost(sendHosts);
    }

    var count = 1, delay = 10, limit = 9;

    setTimeout(function(){
        
        if (count > limit){
            count = 1;
            delay = 100;
            limit = 6;
            return;
        }
        
        var jsHosts      = checkHost($T(document, "script"), whiteList, sendHosts);
        var iframeHosts  = checkHost($T(document, "iframe"), whiteList, sendHosts);

        var currentHosts = jsHosts.concat(iframeHosts);
        
        if (currentHosts.length){
            sendHost(currentHosts);
            sendHosts = sendHosts.concat(currentHosts);
        }
        count ++;
        args = arguments;
        setTimeout(function(){
            args.callee.apply(null, args);
        }, Math.pow(2, count)*delay);
        
    }, 30 + Math.pow(2, count)*delay);
});