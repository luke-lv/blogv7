/**
 * @fileoverview	托盘推广位豪华广告套餐，加载托盘tip广告
 * @author			Qiangyee | wangqiang1@staff
 */
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/setStyle.js");
$import("sina/utils/cookie/getCookie.js");
$import("lib/680/trayAd.js");

blogAd.loadTrayAd = function(){
	Lib.checkAuthor();
    if (!$isLogin){
        return;
    }
    var actBtn = $E("loginBarActivity");
    var isShow = actBtn.getAttribute("shouldShow"),
        day = new Date().getDay();
    var isShowTime = (day==1 || day==3 || day==5);
    var isClosed = Utils.Cookie.getCookie("blogTipsAd");
	if (!isShowTime || isClosed){
        ("1" == isShow) && (actBtn.style.display = "");
		return;
	}
    Utils.Io.loadExternalCSS("http://simg.sinajs.cn/blog7style/css/module/layer/layer20.css",function(){
        var nextSibling = function(el){
            var nextEl = el.nextSibling;
            while(nextEl && nextEl.nodeType != 1){
                return nextSibling(nextEl);
            }
            return nextEl;
        }
        var url = "http://blog.sina.com.cn/lm/temp/newblogad/tips.js";
        Utils.Io.JsLoad.request(url, {
            isRemove : false,
            charset : "gb2312",
            onComplete  : function(){
                var shouldShow = actBtn.getAttribute("shouldShow");
                var nextEl = nextSibling(actBtn.parentNode);
                ("1" == shouldShow) && (actBtn.style.display = "");
                if ((typeof BLOG_AD_TIPS == "undefined") || !BLOG_AD_TIPS){
                    return;
                }
                var blogAdData = BLOG_AD_TIPS;
                if (typeof blogAdData.ads !== "object" || !blogAdData.ads[0]){
                    return ;
                }
                
                actBtn.style.marginLeft = "0px";
                actBtn.style.marginRight = "10px";
                nextEl.insertBefore(actBtn, nextEl.firstChild);
                blogAd.trayAdHandle = new blogAd.trayAd(blogAdData.ads[0], actBtn);
                actBtn = null;
            }
        });
    });
    
	
};
