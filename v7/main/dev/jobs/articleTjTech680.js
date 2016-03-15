$import("article/ad/tjRightAd.js");
$import("article/ad/topAd.js");
$import("lib/sendLog.js");
$import("lib/execZhitou.js");
/**
 * @fileoverview 通栏广告与300x500广告首先出来
 *
 * @create 2012-11-27
 * @author Qiangyee
 */
if (window["BlogAd"]){
    // 博客推荐博文页与博客推荐博文夹页打通顶部两轮播950*90通栏
    Lib.execZhitou(function(res){
        blogAd.insertIns('PDPS000000049439', $E("trayFlashConnetion").parentNode, 'beforebegin');
        (window.sinaads || []).push({});
    });
    // 夹页广告右侧中部300x500广告位
    Lib.execZhitou(function(res){
        blogAd.insertIns('PDPS000000054034', $$E('module_tj_ad2'), 'beforebegin');
        (window.sinaads || []).push({});
    });
    // 广告夹页右上侧300x250广告
    Lib.execZhitou(function(res){
        blogAd.insertIns('PDPS000000053790', $E('module_tj_ad1'), 'beforebegin');
        (window.sinaads || []).push({});
    });
}
