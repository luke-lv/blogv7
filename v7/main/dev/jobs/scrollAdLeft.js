$import('sina/core/dom/insertHTML.js');
$import("sina/core/system/getParam.js");
/**
 * 鼠标随时行广告 博客左侧 由广告控制 替换blogAppAd新阅天下位置
 * 该部分代码直接添加到lib/blogAppAd脚本中 此处不用
 * @author jiangwei5 2014-09-18
 */
$registJob("scrollAdLeft", function(){
    // if(!Core.System.getParam('tj')) return;
    Core.Dom.insertHTML(document.body, '<div id="sinaads_pdps54771"></div>', 'beforeend');
    
    var cookieKeyName = "sinaads_blogAppAd_" + scope.$PRODUCT_NAME + scope.$pageid;
    if (document.cookie.indexOf(cookieKeyName) === -1) {
        var insdiv = document.getElementById("sinaads_pdps54771");
        insdiv.innerHTML = ' <ins class="sinaads" data-ad-pdps="PDPS000000054771"></ins>  ';
        (sinaads = window.sinaads || []).push({
            params: {
                sinaads_ls_root: 'sinablogbody',
                sinaads_ls_cookieKey: cookieKeyName

            }
        });
        // 设置cookie屏蔽旧广告
        var expires = new Date();
        expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
        document.cookie = "blogAppAd_" + scope.$PRODUCT_NAME + scope.$pageid + '=1; expires=' + expires.toGMTString();
        console.log(111);
    }
});