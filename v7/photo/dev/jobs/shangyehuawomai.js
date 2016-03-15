/**
 * @fileoverview 我买网商业化
 * @author stoneCC | changchuan@staff.sina.com.cn
 * @created 2013-10-18
 */

$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/io/jsload.js");
$import("component/woMaiAd.js");

$registJob("shangyehuawomai", function () {

    var limitrate = 15; //每次访问有1/15的几率访问缔元信接口

    //http://api.wrating.com/sinawratingcookie?callback=fndyxcallback
    var DYXGETUIDINTERFACE = "http://api.wrating.com/sinawratingcookie";

    //http://highway.blog.sina.com.cn/getUid?uid=0b9fc3799b96ff20bc9f150365ba318b&varname=requestId_11111111
    var BLOGWOMAIUSERINTERFACE = "http://highway.blog.sina.com.cn/getUid";
    var ADINTERFACE = "";

    var DYXCOOKIEKEY="dyxinfo";
    var DYXCOOKIELIVETIME= 30 * 24;

    var dyxuid ="";
    var iswomai="0";

    //开始流程
    getDYXuserInfoFromCookie();
    if(!dyxuid)
    {
        /**
         * 增加分步骤投放策略
         */
        var rnum = parseInt( Math.random() * limitrate,10 );
        if( rnum == '1')
        {
            getDYXuid( ongetDYXuid );
        }
    }else if( iswomai =="1" )
    {
        getAd();
    }else
    {
        return;
    }


    function ongetDYXuid( obj )
    {
        if(!obj || obj['code'] !=1 ||  !obj['dyxid'])
        {
            return;
        }
        dyxuid = obj['dyxid'];

        getWomaiSign(dyxuid,function( obj ){
            if(obj && obj.code=="A00006")
            {
                iswomai = obj.data.status+"";
            }
			setDYXuserInfoToCookie(dyxuid,iswomai);
            if(iswomai =='1')
            {
                getAd();
            }
        });
    }

    //展示广告
    function getAd()
    {
		new woMaiAd(dyxuid);
    }

    function getDYXuid(callback) {
        window.fndyxcallback = function (obj) {	
			try{
				callback(obj);
			}catch(e){}            
        }
        var node = document.createElement("scr" + "ipt");
        node.src = DYXGETUIDINTERFACE + "?callback=fndyxcallback";
        var header = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        header.appendChild(node);
    }


    function getWomaiSign(dyxuid, callback) {
        var url = BLOGWOMAIUSERINTERFACE + "?" + "uid=" + dyxuid;
        Utils.Io.JsLoad.request(url, {
            onComplete: callback
        });
    }

    function getDYXuserInfoFromCookie()
    {
        var cookieinfo = Utils.Cookie.getCookie( DYXCOOKIEKEY );
        var t = cookieinfo.split("_");
        if(cookieinfo && t.length==2)
        {
            dyxuid = t[0];
            iswomai = t[1];
            return true
        }
        return false;
    }

    function setDYXuserInfoToCookie(id,iwm)
    {
        Utils.Cookie.setCookie(DYXCOOKIEKEY, (id + "_" + iwm), DYXCOOKIELIVETIME, "/", "blog.sina.com.cn", false);
    }

});
