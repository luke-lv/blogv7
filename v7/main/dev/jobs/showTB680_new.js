$import('sina/core/dom/insertHTML.js');
$import("article/ad/insertIns.js");
$import("lib/execZhitou.js");
/**
 * @fileoverview 新版博文页加入淘宝广告
 *
 * @create 2014-11-03
 * @author zhihang1
 */
$registJob("showTB680_new", function (){
    // 找到第一列
    // var module_901 = $E("module_901");
    // 插入淘宝广告埋点
    // var html = "<div class='SG_conn'><iframe frameborder=0 scrolling='no' marginwidth='0' marginheight='0' style='display:none;' id='tanx-a-mm_15890324_2192376_11153352'></iframe></div>";
    // var html = "<div class='SG_conn'><a style='display:none;' id='tanx-a-mm_15890324_2192376_11153352'></a></div>";
    // var html = "<div class='SG_conn'><span id='cont-tanx-a-mm_15890324_2192376_11153352'><a style='display:none;' id='tanx-a-mm_15890324_2192376_11153352'></a></span></div>";
    // var html = "<div class='adSide'><iframe frameborder=0 scrolling='no' marginwidth='0' marginheight='0' width='210' height='220' src='http://d1.sina.com.cn/litong/tanx2014/tanx_blog.html'></iframe></div>";
    // Core.Dom.insertHTML(module_901, html, 'afterend');
    Lib.execZhitou(function(res) {   // 改为pdps码投放 zhihang1@2014-12-31
        var m901 = $E("module_901");
        var adEl = blogAd.insertIns('PDPS000000033239', m901, 'afterend');
        (window.sinaads || []).push({
            element: adEl,
            params: {
                sinaads_success_handler: function() {
                    adEl.style.marginTop = '10px';
                }
            }
        });
    });
    // 下边代码由淘宝提供
    // (function(){
    //     var s   = document.createElement("script"),
    //         doc = document,
    //         h   = doc.getElementsByTagName("head")[0];

    //     if(!window.alimama_show){
    //         s.charset='gbk';
    //         s.async = true;
    //         s.src = "http://a.alimama.cn/inf.js";
    //         h.insertBefore(s, h.firstChild);
    //     }

    //     var o = {
    //         pid:"mm_15890324_2192376_11153352",
    //         width:210,
    //         height:220
    //     };
    //     alimama_onload = window.alimama_onload || [];
    //     alimama_onload.push(o);
    // })();
    
    //通过淘宝tanx请求广告数据,下面由广告部门提供
    // (function () {
    //     var tanxscr = document.createElement("script");
    //     tanxscr.charset = "gbk";
    //     tanxscr.src = "http://p.tanx.com/ex?i=mm_15890324_2192376_11153352";
    //     // document.body.insertBefore(tanxscr, document.getElementById('tanx-a-mm_15890324_2192376_11153352'));
    //     document.getElementById('tanx-a-mm_15890324_2192376_11153352').parentNode.insertBefore(tanxscr, document.getElementById('tanx-a-mm_15890324_2192376_11153352'));
    //     // document.getElementsByTagName('head')[0].appendChild(tanxscr);
    // })();


    //此处淘宝代码有bug 改成iframe直接插入到博客页面 @xiaoyue3 modified 2014-01-08
    // 下面由销售提供的淘宝广告代码
    // try{
    //     document.domain='sina.com'
    // }catch(e){};

    // (function(b, c) {
    //      function g() {
    //         var a = b.getElementById("cont-tanx-a-" + h);
    //         if (5 < i && ("undefined" === typeof c.tanxssp_show)) {
    //             try {
    //                 a.removeChild(b.getElementById("tanx-a-" + h))
    //             } catch (d) {}
    //             a.innerHTML = j
    //         } else "undefined" !== typeof c.tanxssp_show || (i++, setTimeout(g, 100))
    //     }
    //     var a = b.createElement("script"),
    //         d = b.getElementsByTagName("head")[0],
    //         j = "\x3Ca href\x3D\x27http\x3A\x2F\x2Fredirect.simba.taobao.com\x2Frd\x3Fc\x3Dun\x26w\x3Dchannel\x26f\x3Dhttp\x253A\x252F\x252Fqin.taobao.com\x252F\x253Frefpid\x253Dmm\x5F15890324\x5F2192376\x5F11153352\x2526unid\x253D\x26k\x3D42fb32372ced8135\x26p\x3Dmm\x5F15890324\x5F2192376\x5F11153352\x27 target\x3D\x5Fblank\x3E\x3Cimg src\x3D\x27http\x3A\x2F\x2Fd1.sina.com.cn\x2F201312\x2F27\x2F530986.gif\x27 border\x3D0 \x2F\x3E\x3C\x2Fa\x3E",
    //         i = 0,
    //         h = "mm_15890324_2192376_11153352";
    //     // b.write("<span id='cont-tanx-a-" + h + "'><a style='display:none;' id='tanx-a-" + h + "'></a></span>");
    //     c.tanxssp_show || (a.src = "http://p.tanx.com/ex?i=" + h, d.insertBefore(a, d.firstChild));
    //     setTimeout(g, 3E3)
    // })(document, window);

});
