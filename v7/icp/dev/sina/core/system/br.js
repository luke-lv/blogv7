/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 注册 Core 命名空间
 * 		将 Core 注册为 Sina.Core 的简写形式
 * @author shaomin | shaomin@staff.sina.com.cn
 * @author wangqiang1 | wangqiang1@staff.sina.com.cn -- Modified in 2011-07-14
 * @detect current broswer and platform version
 */
(function(_s){
	var _ua = navigator.userAgent.toLowerCase();
    /*用户操作系统判断，只判断windows*/
    var system = {
        $winXP    : /windows nt 5.1/.test(_ua),
        $winVista : /windows nt 6.0/.test(_ua),
        $win7     : /windows nt 6.1/.test(_ua),
        $macOS    : /mac/.test(_ua)
    };
    
    /*浏览器判断*/
    var browser = {
        $OPERA    : false,
        $IE6      : false,
        $IE7      : false,
        $IE8      : false,
        $IE9      : false,
        $SAFARI   : false,
        $FF2      : false,
        $FF3      : false,
        $FF4      : false,
        $FF       : false,
        $CHROME   : false,
        $TT       : false,
        $360      : false,
        $SOGO     : false,
        $Maxthon  : false
    };
    /*渲染引擎*/
    var engine = {
        $IE     : 0,
        $MOZ    : false,
        $WEBKIT : false,
        $KHTML  : false
    };
    
    if (/opera/.test(_ua) || _s.opera){
        browser.$OPERA = true;
    }else if (/chrome\/(\S+)/.test(_ua)){
        browser.$CHROME = true;
    }else if (/safari\/(\S+)/.test(_ua)){
        browser.$SAFARI = true;
    }else if (/msie/.test(_ua)){ //360、TT、sogo、baidu都使用IE的渲染引擎因此需要显示IE的版本
        engine.$IE = true;
        //中国的小版本浏览器--可能不正确
        if (/360se/.test(_ua)){
            browser.$360 = true;
        }else if (/tencenttraveler/.test(_ua)){
            browser.$TT = true;
        }else if (/se\s\S+\smetasr\s\d+\.\d+/.test(_ua)){
            browser.$SOGO = true;
        }
        var uaVersionArray = _ua.match(/msie (\d+)/);
        var version = parseInt(uaVersionArray[1]);
        engine.$IE = version;
        //IE版本---根据浏览器占有率判断先后顺序
        if (version === 8){
            browser.$IE8 = true;
        }else if (version === 6){
            browser.$IE6 = true;
        }else if (version === 9){
            browser.$IE9 = true;
        }else if (version === 7){
            browser.$IE7 = true;
        }else if(version === 10){
            browser.$IE10 = true;
        }
    
    }else if (/firefox/.test(_ua)){
        var uaVersionArray = _ua.match(/firefox\/(\d+)/);
        browser.$FF = parseInt(uaVersionArray[1]);
        if (/firefox\/3/.test(_ua)){
            browser.$FF3 = true;
        }else if (/firefox\/4/.test(_ua)){
            browser.$FF4 = true;
        }else if (/firefox\/2/.test(_ua)){
            browser.$FF2 = true;
        }
        
    }else if (/trident\/7.0/.test(_ua) && /rv:11.0/.test(_ua)){
        engine.$IE = 11;
        browser.$IE11 = true;
    }
    try{
		var t=window.external;
		browser.$Maxthon=t.max_version?true:false;
    }catch(e){}
    
    /*判断渲染引擎，IE和opera不用判断，前面已判断出*/
    if (/applewebkit\/(\S+)/.test(_ua)){
        engine.$WEBKIT = true;
    } else if (/khtml\/(\S+)/.test(_ua)){
        engine.$KHTML = true;
    } else if (/rv:([^\)]+)\) gecko\/\d{8}/.test(_ua)){
        engine.$MOZ = true;
    }
    
    browser.$MOBILE = /mobile/i.test(_ua);
    // htc手机自带浏览器识别
    if(!browser.$MOBILE){
        browser.$MOBILE = /HTC/.test(_ua);
    }
    
    function apply(thisObj,cfg){
        var p;
        for(p in cfg){
            thisObj[p] = cfg[p];
        }
    };
    apply(_s, browser);
    apply(_s, engine);
    apply(_s, system);
})(window);
