$import("lib/sendLog.js");
$import("lib/execZhitou.js");
$import('sina/core/dom/insertHTML.js');

/**
 * @fileoverview 新版博文页 热卖商品广告 推荐商讯广告
 *
 * @create 2014-11-03
 * @author zhihang1
 */
$registJob("hotAdvertise_new", function(){
    var module_903 = $E("module_903");
    var module_904 = $E("module_904");
    // 精彩图文下线
    // var module_911 = $E("module_911") || module_904;
    var html = '<div class="adSide" suda-uatrack="key=blog_article&value=h_article53" id="hotShangPin"></div>';
    Core.Dom.insertHTML(module_904, html, 'afterend');
    
    Lib.execZhitou(function(res){
        blogAd.insertIns('PDPS000000057414', $E("hotShangPin"), 'afterbegin');
        (window.sinaads || []).push({});
    });
    
/*    var tpl = '\
        <div class="adSideList" id="recommendShangXun">\
            <h2 class="adTit">推荐商讯</h2>\
            <ul class="adList"></ul>\
        </div>';
*/    
		var tpl = '<div class="adSideList"><ins class="sinaads" data-ad-pdps="PDPS000000057669"></ins><script>(sinaads = window.sinaads || []).push({})</script></div>';
		Core.Dom.insertHTML(module_903, tpl, 'afterend');
    
    Lib.execZhitou(function(res){
        blogAd.insertIns('PDPS000000052390', $E("recommendShangXun").children[1], 'afterbegin');
        (window.sinaads || []).push({
            params : {
                sinaads_ad_tpl : '\
                <li>\
                    <p class="Ltit">\
                        <a target="_blank" suda-uatrack="key=blog_article&value=h_article50" href="#{link}" onclick="try{#{monitor}}catch(e){}" class="BNE_lkA"><i class="icon i7_dot"></i>#{src}</a>\
                    </p>\
                    <p class="Lname">\
                        <a target="_blank" suda-uatrack="key=blog_article&value=h_article50" href="#{link}" onclick="try{#{monitor}}catch(e){}" class="BNE_lkB">#{src1}</a>\
                    </p>\
                </li>'
            }
        });
    });
    
});
