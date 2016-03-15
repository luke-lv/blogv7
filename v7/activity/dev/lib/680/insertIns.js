$import("lib/lib.js");
$import("lib/680/_blogAd.js");
$import("lib/register.js");
$import("sina/core/dom/insertHTML.js");
/**
 * @fileoverview 
 * 新浪zhitou广告埋点
 * @create 2013-08-22
 * @author Qiangyee | wangqiang1@staff
 */
blogAd.insertIns = function(pdps, relateEl, inc, style){
    inc = inc || 'beforeend',
    style = style || 'display:block;'
    var html = '<ins class="sinaads" data-ad-pdps="'+pdps+'" style="'+(style||'')+'"></ins>';
    relateEl = relateEl || document.body;
    return Core.Dom.insertHTML(relateEl, html, inc);
};