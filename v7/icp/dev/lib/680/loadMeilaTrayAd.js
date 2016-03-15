/**
 * @fileoverview	托盘推广位豪华广告套餐，加载托盘tip广告
 * @author			Qiangyee | wangqiang1@staff
 */
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/setStyle.js");
$import("sina/utils/cookie/getCookie.js");
$import("lib/680/meilaTrayAd.js");

blogAd.loadMeilaTrayAd = function(){
	Lib.checkAuthor();
    if (!$isLogin){
        return;
    }

    var actBtn = $E("loginBarActivity");
    var isShow = actBtn.getAttribute("shouldShow"),
        day = new Date().getDay();
    var isShowTime = 1;//(day==1 || day==3 || day==5); 后期会改为2、4、6显示
    var isClosed = Utils.Cookie.getCookie("blogTipsAd");
	if (!isShowTime || isClosed){
        ("1" == isShow) && (actBtn.style.display = "");
		return;
	}
    var nextSibling = function(el){
        do{
            el = el.nextSibling;
        }while(el && el.nodeType!==1);
        return el;
    }

    var shouldShow = actBtn.getAttribute("shouldShow");
    var nextEl = nextSibling(actBtn.parentNode);
    ("1" == shouldShow) && (actBtn.style.display = "");
    // 非首都用户显示 ^_^
    if (!$_GLOBAL.tipsMeila || !$_GLOBAL.tipsMeila.isShow || !scope.$test){
        return;
    }
    
    actBtn.style.marginLeft = "0px";
    actBtn.style.marginRight = "10px";
    nextEl.insertBefore(actBtn, nextEl.firstChild);
    blogAd.trayAdHandle = new blogAd.meilaTrayAd($_GLOBAL.tipsMeila, actBtn);
    actBtn = null;
    
	
};
