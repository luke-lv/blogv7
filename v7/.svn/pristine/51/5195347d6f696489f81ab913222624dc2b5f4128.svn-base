/** 
 * @fileoverview 博客正文页qing组件-优质Qing文推荐
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-04-25
 */
$import("other/SinaEx.js");
$import("other/enterLeave.js");
$import("sina/core/dom/opacity.js");

$registJob('qingRecommend', function(){
    var el_recwin = $E("qingRecWindow");
    if( !el_recwin ){return}
//    var recA = el_recwin.children[0],
//        imgspan = recA.children[0],
//        rimg;
//    if(imgspan.getAttribute('imgsrc')){
//        rimg = $C('img');
//        rimg.src = imgspan.getAttribute('imgsrc');
//        recA.insertBefore(rimg, imgspan);
//        recA.removeChild(imgspan);
//    }
//    recA = imgspan = null;

    var fxtimer = 0, looptimer = 0,
        imgs = $T($E("qingRecPic"), "img"),
        len = imgs.length,
        showing = 0, //当前正在显示第i个
        popc = $IE ? 5:2,
        opc = 0;
    var _opacity = Core.Dom.opacity;

    initJob();

    SinaEx.enterLeave($E("qingRecPic"), function(li){
        var j = li.getAttribute("noo");
        showNoo(j);
    }, function(li){
        //var j = li.getAttribute("noo");
        //j!=showing && SinaEx.removeClass("current");
    }, 100);

    function showNoo(j){
        j = parseInt(j);
        if(showing===j){return}
        clearTimeout(fxtimer);
        clearTimeout(looptimer);
        SinaEx.removeClass(SinaEx.parent(imgs[showing],'li'), "current");
        SinaEx.addClass(SinaEx.parent(imgs[j],'li'), "current");
        _opacity(el_recwin, 0);
        
        var img = imgs[j];

        //北京qing组件uatrack布码
        if($E('module_911')) {
            if(j == 0) {
                el_recwin.innerHTML = '<a suda-uatrack="key=blog_qing_g&value=h_SLOT_49" href="'+img.parentNode.href
                +'" target="_blank" onclick="v7sendLog(\''+(img.parentNode.getAttribute('bigcode')||'00_00_qzj')+'\');return true;"><img src="'+img.getAttribute('bigsrc')
                +'" /><span>'+(img.getAttribute('alt')||'')+'</span></a>';
            }else if(j == 1) {
                el_recwin.innerHTML = '<a suda-uatrack="key=blog_qing_g&value=h_SLOT_50" href="'+img.parentNode.href
                +'" target="_blank" onclick="v7sendLog(\''+(img.parentNode.getAttribute('bigcode')||'00_00_qzj')+'\');return true;"><img src="'+img.getAttribute('bigsrc')
                +'" /><span>'+(img.getAttribute('alt')||'')+'</span></a>';
            }else if(j == 2) {
                el_recwin.innerHTML = '<a suda-uatrack="key=blog_qing_g&value=h_SLOT_51" href="'+img.parentNode.href
                +'" target="_blank" onclick="v7sendLog(\''+(img.parentNode.getAttribute('bigcode')||'00_00_qzj')+'\');return true;"><img src="'+img.getAttribute('bigsrc')
                +'" /><span>'+(img.getAttribute('alt')||'')+'</span></a>';
            }
            
        }else {
            el_recwin.innerHTML = '<a href="'+img.parentNode.href
                +'" target="_blank" onclick="v7sendLog(\''+(img.parentNode.getAttribute('bigcode')||'00_00_qzj')+'\');return true;"><img src="'+img.getAttribute('bigsrc')
                +'" /><span>'+(img.getAttribute('alt')||'')+'</span></a>';
        }
        opc = 30;
        qingFadeIn();
        showing = j;
        looptimer = setTimeout(loopShow, 5000);
    }
    function qingFadeIn(){
        _opacity(el_recwin, opc);
        opc += popc;
        if(opc<100){
            fxtimer = setTimeout(qingFadeIn, 15);
        }else{_opacity(el_recwin, 100)}
    }
    function loopShow(){
        var j = showing+1;
        j>=len && (j=0);
        showNoo(j);
        //setTimeout(loopShow, 5000);
    }

    function initJob(){
        for(var i=0, li; i<len; i++){
            li = SinaEx.parent(imgs[i], 'li');
            li && li.setAttribute("noo", i);
        }
        setTimeout(function(){
            el_recwin.style.background = '';
            loopShow();
        }, 5000);
    }
});
