/**
 * @fileoverview	广告套餐分享到微博
 * @author			Qiangyee | wangqiang1@staff
 */
$import("sina/utils/url.js");

blogAd.shareToWeibo = function(oParam){
    var url = new Utils.Url('http://v.t.sina.com.cn/share/share.php'), encode=encodeURIComponent;
    if (oParam.clickCode){
        new Image().src = oParam.clickCode;
    }
    for (var p in oParam){
        if (oParam.hasOwnProperty(p)){
            url.setParam(p, encode(oParam[p]));
        }
    }
    if (!oParam.title){
        url.setParam('title', encode(oParam.title || document.title));
    }
    url.setParam('content', 'utf-8');
    var openWnd = function(){
        url = url.toString();
        if (!window.open(url, 'mb', ['toolbar=0,status=0,resizable=1,width=440,height=430,left=', (screen.width - 440) / 2, ',top=', (screen.height - 430) / 2].join('')))
            location.href = url;
    }
    if (/Firefox/.test(navigator.userAgent)){
        setTimeout(openWnd, 0);
    } else{
        openWnd();
    }
};