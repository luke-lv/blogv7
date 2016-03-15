/** 
 * @fileoverview 博客正文页qing组件-优质Qing文推荐
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-05-30
 * @update liming9 2012年5月30日在qingRecommend基础上改版
 */
$import("other/SinaEx.js");
//$import("other/enterLeave.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/events/addEvent.js");

$registJob('qingRecomNew', function(){
    var el_recwin = $E("qingRecNew");
    if( !el_recwin ){return}

    var fxtimer = 0, looptimer = 0,
        imgs = $E("qingRecPic").children,
        len = imgs.length,
        showing = 0, //当前正在显示第i个
        popc = $IE ? 5:2,
        opc = 0;
    var __addEvent = Core.Events.addEvent,
        _opacity = Core.Dom.opacity;

    //initJob();

    for(var i=0; i<len; i++){
        (function(j){
            var t = 0;
            __addEvent(imgs[j], function(){
                t = setTimeout(function(){
                    showNoo(j);
                }, 100);
            }, 'mouseover');
            __addEvent(imgs[j], function(){
                clearTimeout(t);
            }, 'mouseout');
        })(i);
    }

    function showNoo(j){
        //j = parseInt(j);
        if(showing===j){return}
        clearTimeout(fxtimer);
        clearTimeout(looptimer);
        var img = imgs[j];
        SinaEx.removeClass(imgs[showing], "current");
        SinaEx.addClass(img, "current");
        _opacity(el_recwin, 0);
        
        el_recwin.innerHTML = '<a href="'+img.getAttribute('imghref')
            +'" target="_blank" onclick="v7sendLog(\''+(img.getAttribute('imgcode')||'00_00_qzj')+'\');return true;"><img src="'+img.getAttribute('imgsrc')
            +'" /><span>'+img.getAttribute('imgtitle')+'</span></a>';
        opc = 30;
        qingFadeIn();
        showing = j;
        looptimer = setTimeout(loopShow, 3000);
    }
    function qingFadeIn(){
        _opacity(el_recwin, opc);
        opc += popc;
        if(opc<100){
            fxtimer = setTimeout(qingFadeIn, 15);
        }else{
            _opacity(el_recwin, 100);
        }
    }
    function loopShow(){
        var j = showing+1;
        j>=len && (j=0);
        showNoo(j);
        //setTimeout(loopShow, 5000);
    }

    //function initJob(){
        //初始化第一张图
        el_recwin.children[0].innerHTML = '<img src="'+imgs[0].getAttribute('imgsrc')
            +'" /><span>'+imgs[0].getAttribute('imgtitle')+'</span>';
        el_recwin.style.background = '';
        setTimeout(loopShow, 3000);
    //}
});
