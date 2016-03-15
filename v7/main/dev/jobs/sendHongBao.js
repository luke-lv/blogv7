$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/ui/panel.js");
$import("sina/core/dom/removeClass.js");
$import("sina/core/dom/addClass.js");
$import("sina/utils/io/loadExternalCSS.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("lib/sendLog.js");
/**
 * 发红包博客推广
 * @author xiaoyue3@staff.sina.com.cn
 * @data 2014_01_23
 * @modofied 此功能已下线 xiaoyue3 2014_02_17
 */
$registJob("sendHongBao", function(){
    var $getCookie = Utils.Cookie.getCookie,
        $setCookie = Utils.Cookie.setCookie,
        $addEvent = Core.Events.addEvent,
        $removeClass = Core.Dom.removeClass,
        $loadExternalCSS = Utils.Io.loadExternalCSS,
        $addClass = Core.Dom.addClass,
        $getXY = Core.Dom.getXY;

    if($getCookie('blog_hb_tui')){
        return;
    }
    var flag = 1;
    var myPanel=new Ui.Panel(),
        template='<div class="hongbao2013_w hongbao2013_login_w hongbao2013_small hongbao2013_show" id="#{hongbao2013_w}" style="display: block;">'+
                    '<a class="hongbao2013_close" id="#{hongbao2013_close}" href="javascript:void(0)">关闭</a>'+
                    '<div class="hongbao2013_bg"></div>'+
                    '<div class="hongbao2013 hongbao2013_login" id="#{hongbao2013}"></div>'+
                    '<a href="http://hongbao.weibo.com/" class="hongbao2013_link" id="#{hongbao2013_link}" target="_blank"></a>'+
                '</div>';
    myPanel.setTemplate('<div id="#{panel}">'+template+'</div>');
    $loadExternalCSS('http://simg.sinajs.cn/blog7style/css/activity/hongbao.css', function(){});
    
    var hongbao2013_link = myPanel.nodes.hongbao2013_link, 
        hongbao2013 = myPanel.nodes.hongbao2013, 
        hongbao2013_w = myPanel.nodes.hongbao2013_w;

    var cssSupports = (function() {
            var div = document.createElement('div'),
                vendors = 'Khtml O Moz Webkit'.split(' '),
                len = vendors.length;
            return function(prop) {
                if ( prop in div.style ) return true;
                if ('-ms-' + prop in div.style) return true;
                
                prop = prop.replace(/^[a-z]/, function(val) {
                    return val.toUpperCase();
                });

                while(len--) {
                    if ( vendors[len] + prop in div.style ) {
                    return true;
                }
            }
            return false;
        };
    })();

    var supports= cssSupports('animation');
    updateLayerPos();

    $addEvent(hongbao2013_link, function(){
        if(supports){
            $addClass(hongbao2013, 'hongbao2013_tremble');
        }else{
            if(flag){
                flag = 0;
                var tweenObj = new Ui.TweenStrategy(-6,6,0.3,function(t, b, c, d){
                    return -c*(t/=d)*(t-2)+b;
                });
                tweenObj.onTween = function(v){
                    hongbao2013.style.left = v+"px";
                };
                tweenObj.onEnd = function(){
                    flag = 1;
                    hongbao2013.style.left = 1+"px";
                };
                tweenObj.start();
            }
        }        
    },"mouseover");
   

    $addEvent(hongbao2013_link,function(){
        if(supports){
            $removeClass(hongbao2013, 'hongbao2013_tremble');
        }
    },"mouseout");
    
    $addEvent(hongbao2013_link, function(){
       v7sendLog("28_01_01");
    });

    $addEvent(myPanel.nodes.hongbao2013_close,function(){
        v7sendLog("28_01_02");
        $setCookie("blog_hb_tui","1",3*24, "/", ".blog.sina.com.cn");
        myPanel.hide();
    });

    $addEvent(window,updateLayerPos,"resize");

    //抢红包图案 大小变更
    function updateLayerPos(){
        if($getCookie('blog_hb_tui')){
            return;
        }
        var winWidth = document.documentElement.clientWidth;
        var pos = Core.Dom.getXY($E('module_901'));
        if(parseInt(winWidth)<1060){
            myPanel.hide(); 
        }else if(parseInt(winWidth)>1260){
            $removeClass(hongbao2013_w, 'hongbao2013_small');
            pos[0] -= 154;
            hongbao2013_w.style.left=pos[0] + 'px';
            myPanel.show();
        }else{
            $addClass(hongbao2013_w, 'hongbao2013_small');
            pos[0] -= 55;
            hongbao2013_w.style.left=pos[0] + 'px';
            myPanel.show();
        }
    }
});
