/**
 * @fileoverview	托盘推广位豪华广告套餐，加载托盘tip广告
 * @author			Qiangyee | wangqiang1@staff
 */
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/nextNode.js");
$import("sina/utils/cookie/getCookie.js");
$import("lib/680/nickTrayAd.js");
$import("lib/listener.js");
blogAd.loadNickTrayAd = function(data){

    var listener = Lib.Listener;

    var actBtn = $E("loginBarActivity") || $E("divPopularize");
    var isShow = actBtn.getAttribute("shouldShow"),
        day = new Date().getDay(),
        isClosed = Utils.Cookie.getCookie("blogTipsAd");
        
    actBtn.style.display = "";
    //135投放所有广告 24不投放任何广告
    var isShowTime = (day==1 || day==3 || day==5);
    if (!isShowTime){
        return;
    }
    if (isClosed) {
        return;
    }
    
    var cssUrl = "http://simg.sinajs.cn/blog7style/css/module/layer/layer20.css";
    Utils.Io.loadExternalCSS(cssUrl, function(){
        if(data){
            if (!data || !data["isShow"]) {
                return;
            }

            if (data.logCode) {
                data.logCode = data.logCode + "|" + $UID;
            }
            blogAd.trayAdHandle = new blogAd.nickTrayAd(data, actBtn);
            actBtn = null;
        }
    });
};
