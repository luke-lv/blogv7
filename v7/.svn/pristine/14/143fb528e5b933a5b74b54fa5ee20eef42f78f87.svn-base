/**
 * @fileoverview 
 * 博客图片首页 淘宝的两个广告位置
 * @create 2013-09-03
 * @author Liu Xiaoyue | xiaoyue3@staff
 */

$import("sina/core/dom/byClass.js");
$import("sina/utils/insertTemplate.js");
$import("lib/checkAuthor.js");
$import("lib/680/insertIns.js");
$import("lib/execZhitou.js");

$registJob("indexTaobaoAd", function (){
	Lib.checkAuthor();
    if($isAdmin){
        return;
    }  
    //这两个广告不同时展现  
    // var col1  = Core.Dom.byClass("sinablogbody","div",document.body);

    // var comps = Core.Dom.byClass("SG_conn","div",col1[0].children[0]);

    // var insertEl = comps[0] || comps[comps.length - 1];
    // 插入淘宝广告埋点
    // var html200200 = "<div class='SG_conn'><iframe frameborder=0 scrolling='no' marginwidth='0' marginheight='0' width='210' height='220' src='http://d1.sina.com.cn/litong/tanx2014/tanx_blog.html'></iframe></div>";
   	// Utils.insertTemplate(insertEl,html200200,'AfterEnd');

    Lib.execZhitou(function(res) {   // 改为pdps码投放 zhihang1@2015-1-4
        var col1  = Core.Dom.byClass("sinablogbody","div",document.body);

        var comps = Core.Dom.byClass("SG_conn","div",col1[0].children[0]);

        var insertEl = comps[0] || comps[comps.length - 1];

        var adEl = blogAd.insertIns('PDPS000000033239', insertEl, 'afterend');
        (window.sinaads || []).push({
            element: adEl,
            params: {
                sinaads_success_handler: function() {
                    adEl.style.marginBottom = '10px';
                }
            }
        });
    });
   	// var con1 = Core.Dom.byClass("SG_colW73","div",document.body);
   	// var con_comps = Core.Dom.byClass("SG_conn","div",con1[0]);

    // var insertEl2 = con_comps[0] || con_comps[con_comps.length - 1];
   	// var html72890 = "<div class='SG_conn'><iframe frameborder=0 scrolling='no' marginwidth='0' marginheight='0' width = '728' height='90' src='http://d1.sina.com.cn/litong/zhitou/union/tanx.html?pid=mm_15890324_2192376_13724612'></iframe></div>";
   	// Utils.insertTemplate(insertEl2,html72890,'AfterEnd');
});
