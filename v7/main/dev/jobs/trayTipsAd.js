$import('sina/sina.js');
$import("sina/core/dom/nextNode.js");
$import("sina/core/dom/getXY.js");

$import('lib/680/loadNickTrayAd.js');
$import("lib/checkAuthor.js");
$import("lib/listener.js");
$import("lib/execZhitou.js");
$import("lib/680/insertIns.js");
/**
 * @fileoverview 博客托盘tips广告
 * @author Qingyee | wangqiang1@staff
 * @created 2011-08-07
 */
$registJob('trayTipsAd', function(){
    
    var listener = Lib.Listener;
    var topbarAdLoaded
        ,trayLoaded
        ,adData;
    var showAdCondition = function(data){ 
        //data.weicaopan.result
        data = data && data.weicaopan && data.weicaopan.weicaopan_con;
        Lib.execZhitou(function(){

            function showOrHideChild(isShow) {
                var node = actBtn.firstChild,
                    style = isShow?'':'none';
                while (node) {
                    if ('a' === node.nodeName.toLowerCase()) {
                        node.style.display = style;
                    }
                    node = node.nextSibling;
                }
            }
            var actBtn = $E("loginBarActivity") || $E("divPopularize");
            actBtn.style.display = '';
            var $bar = actBtn.parentNode;
            var top = $bar.parentNode.offsetHeight, left, actBtnXY;
            
            // 为了正常显示销售广告没辙了
            showOrHideChild(false);
            // 先显示后隐藏，方便定位
            if ('none' === $bar.style.display) {
                $bar.style.position = 'absolute';
                $bar.style.top = '-40px';
                $bar.style.display = '';
                actBtnXY = Core.Dom.getXY(actBtn);
                var $logo = $E('login_bar_logo_link_350');
                $logo.style.display = '';
                var offset = $logo.children[0].offsetWidth;
                left = offset + actBtnXY[0];
                // console.log(left);
                if (topbarAdLoaded) {
                    top += 90;
                }

                $bar.style.position = '';
                $bar.style.top = '';
                $bar.style.display = 'none';
                $logo.style.display = 'none';
            } else {
                actBtnXY = Core.Dom.getXY(actBtn);
                top += actBtnXY[1];
                left = actBtnXY[0];
            }
            
            // console.log('top:', top, 'left:', left);
            var $adEl = blogAd.insertIns('PDPS000000033238', actBtn);

            (window.sinaads || []).push({
                element: $adEl,
                params: {
                    sinaads_tip_top: top,
                    sinaads_tip_left: left,
                    sinaads_success_handler: function(){
                        showOrHideChild(false);
                        window.BLOG_AD_TIPS = 1;
                    },
                    sinaads_fail_handler: function(){
                        showOrHideChild(true);
                        blogAd.loadNickTrayAd(data);
                    },
                    sinaads_ad_zindex: 590
                }
                
            });
        });
    
        // 此处没有放在微操盘条件里，是因为考虑销售广告的事！
        // 销售广告优先于我们自己的广告。
        listener.off({
            name : "ad_show_hide_conditions",
            callBack : showAdCondition
        });
        showAdCondition = null;
    }

    // 监听销售广告加载消息
    listener.on({
        name     : "ad_show_hide_conditions",
        callBack : function(data){
            if ('undefined' !== typeof topbarAdLoaded) {
                showAdCondition(data);
            } else {
                adData = data;
            }
            trayLoaded = !0;
        }
    });
    // 监听销售广告加载消息
    listener.on({
        name     : "topad680-show-end",
        callBack : function(data){
            topbarAdLoaded = data.show;
            if (trayLoaded) {
                showAdCondition(adData);
            }
            
        }
    });

});