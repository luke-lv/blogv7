$import("lib/sendLog.js");
$import("lib/execZhitou.js");
$import("sina/utils/insertTemplate.js");

/**
 * @fileoverview 博文页 新增热卖商品广告 推荐商讯广告
 *
 * @create 2014-01-13
 * @author xiaoyue3
 */
$registJob("hotAdvertise", function(){
    var col1  = document.getElementById("column_1");
    var comps = Core.Dom.byClass("SG_conn","div",col1);

    // 找到精彩图文组件
    // var module_911  = document.getElementById("module_911") || comps[comps.length - 1];
    // 精彩图文下线了,找相关博文组件
    var module_903 = document.getElementById("module_903") || comps[comps.length - 1];
    var html = '<div class="SG_conn" suda-uatrack="key=blog_article&value=h_article53" id="hotShangPin"></div>';
    Utils.insertTemplate(module_903, html, 'BeforeBegin');
    // 精彩图文下方增加热卖商品广告
    Lib.execZhitou(function(res){
        blogAd.insertIns('PDPS000000057414', $E("hotShangPin"), 'Afterbegin');
        (window.sinaads || []).push({});
    });
    
    //找到相关博文组件
    var module_903 = document.getElementById("module_903") || comps[comps.length - 1];
    //var tpl = '<div class="SG_conn" id="recommendShangXun"><div class="SG_connHead"><span class="title">推荐商讯</span></div><div class="SG_connBody"><div class="atcTitList relaList"><ul></ul></div></div></div>';
    var tpl = '<div class="SG_conn"><!--博客左侧推荐商讯210*220按钮(扶翼) Start--><ins class="sinaads" data-ad-pdps="PDPS000000057669"></ins><script>(sinaads = window.sinaads || []).push({})</script><!--博客左侧推荐商讯210*220按钮(扶翼) End—></div>';
    Utils.insertTemplate(module_903, tpl, 'AfterEnd');
    (sinaads = window.sinaads || []).push({});  //添加广告
    // 在相关博文下方增加推荐商讯广告
    Lib.execZhitou(function(res){
        blogAd.insertIns('PDPS000000052390', $E("recommendShangXun").children[1].children[0].children[0], 'Afterbegin');
        (window.sinaads || []).push({
            params : {
                sinaads_ad_tpl : '<li class="SG_j_linedot1"><p class="atcTitCell_tit SG_dot"><a target="_blank" suda-uatrack="key=blog_article&value=h_article50" href="#{link}" onclick="try{#{monitor}}catch(e){}">#{src}</a></p><p class="atcTitCell_nm"><a target="_blank" suda-uatrack="key=blog_article&value=h_article50" href="#{link}" onclick="try{#{monitor}}catch(e){}" class="SG_linkb" style="display:inline-block;height:14px; line-height:14px; white-space:normal; overflow:hidden;">#{src1}</a></p></li>'
            }
        });
    });
    
});
