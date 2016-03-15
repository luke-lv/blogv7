/**
 * @fileoverview 托盘tips广告
 * @author Qiangyee | wangqiang1@staff
 * @created 2011-12-20
 */

$import('sina/sina.js');
$import('lib/680/loadNickTrayAd.js');
$import("lib/execZhitou.js");
$import("lib/680/insertIns.js");

$registJob('trayTipsAd', function(){
    function renderTipsAd(){
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
		var top = 30,
			left = Core.Dom.getXY(actBtn)[0];
        // 为了正常显示销售广告没辙了
        showOrHideChild(false);
        var $adEl = blogAd.insertIns('PDPS000000033238', actBtn, '', 'display:inline');
        (window.sinaads || []).push({
            element: $adEl,
            params: {
				sinaads_tip_top: top,
				sinaads_tip_left: left,
                sinaads_success_handler: function(){
					try{
						window.BLOG_AD_TIPS = 1;
					}catch(e){}
                },
                sinaads_fail_handler: function(){
                    showOrHideChild(true);
                    var refer = document.referrer;
                    if(refer){
                        var host = refer.match(/(\:\/\/)(.*?)(\/)/g);
                        refer = host && host[0].replace(/(\:\/\/){0,}(\/){0,}/g,"");
                    }else{
                        refer="";
                    }

                    // var url = "http://blogtj.sinajs.cn/riaapi/afterLoadChannel/after_load_channel.php";
                    var url = 'http://comet.blog.sina.com.cn/api?maintype=load_channel';
                    Utils.Io.JsLoad.request(url, {
                        GET : {
                            uid:window.$UID,
                            bloguid: scope.$uid,
                            refer: refer
                        },
                        onComplete  : function(result){
                            if(result && result.code === "A00006"){
                                //使用此全局变量的时候，记得不用的时候要清空
                                data = result.data;
                                data = data && data.weicaopan && data.weicaopan.weicaopan_con;
                                blogAd.loadNickTrayAd(data);    
                            }
                        }
                    });
                },
                sinaads_ad_zindex: 590
            }
            
        });
    }

    function renderPDPS000000033236(){
        if($E('module_980')){
            blogAd.insertIns('PDPS000000033236', $E('module_980').children[0], 'beforeend');
            (window.sinaads || []).push({});
        }
    }

    Lib.execZhitou(function(){
        renderTipsAd();
        renderPDPS000000033236();
    });
    
});
