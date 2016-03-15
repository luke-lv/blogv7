$import("sina/core/events/addEvent.js");
$import("sina/ui/panel.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");

$registJob("gotoTop", function(){

    var __addEvent = Core.Events.addEvent, 
        __opacity = Core.Dom.opacity,
        __getLeft = Core.Dom.getLeft,
        __getTop = Core.Dom.getTop;
  
    //创建回到顶部元素
    var parent = Core.Dom.getElementsByClass(document.body, 'div', 'sinafooter');
    parent = parent && parent[0];
    var myPanel=new Ui.Panel(parent),
        template='<a id="#{gotoTop}" href="javascript:void(0);" class="BNE_feed_return"><span class="feed_return_ico"></span></a>';
    
    myPanel.setTemplate('<div id="#{panel}">'+template+'</div>').setFixed(true);
    myPanel.entity.style.zIndex = 500;

    var pos;
    
    var lastNode = $E('module_904'),
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        top = __getTop(lastNode) + lastNode.offsetHeight + 100;

    updateLayerPos();
            
    //首次检查下滚动条位置
    if(scrollTop>top){
        showEffect();
    }
    //注册scroll事件
    __addEvent(window,function(){
        //alert(myPanel.entity.style.left)
        scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
        top = __getTop(lastNode) + lastNode.offsetHeight + 100;
        //如果回到顶部元素为隐藏状态 且scrollTop大于0 显示回到顶部元素
        if(myPanel.entity.style.display==="none" && scrollTop > top ){
            showEffect();
        }

        if(scrollTop < top){
            hideEffect();
        }
    },"scroll");
    
    //为回到顶部按钮注册click事件
    __addEvent(myPanel.nodes.gotoTop,function(){
        var tween=new Ui.TweenStrategy(document.documentElement.scrollTop || document.body.scrollTop,0,0.8,function(t, b, c, d){
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        });
        tween.onTween=function(v){
            document.documentElement.scrollTop=document.body.scrollTop=v;
        }
        tween.start();
    });
    
    //resize
    __addEvent(window,updateLayerPos,"resize");
    
    //显示特效
    function showEffect(){
        Core.Dom.opacity(myPanel.entity,0);
        myPanel.show();
        var tween=new Ui.TweenStrategy(0,100,0.5);
        tween.onTween=function(v){
            __opacity(myPanel.entity,v);
        }
        tween.start();
        // myPanel.show();
    }
    //隐藏特效
    function hideEffect(){
        // var tween=new Ui.TweenStrategy(100,0,0.5);
        // tween.onTween=function(v){
        //     __opacity(myPanel.entity,v);
        // }
        // tween.onEnd=function(){
        //     myPanel.hidden();
        // }
        // tween.start();
        myPanel.hidden();
    }
    
    /**
     * 更新浮层位置
     */
    function updateLayerPos(){
        var winWidth = document.documentElement.clientWidth,
            winHeight=document.documentElement.clientHeight;

        var xx = __getLeft(lastNode),
            yy = winHeight-80;

        myPanel.setPosition({x: xx ,y: yy}); //-30-50
        
        // if(parseInt(winWidth)<930)
        //     myPanel.setPosition({x:(parseInt(winWidth)-100),y:winHeight-88}); //-38-50
        // else
        //     myPanel.setPosition({x:x,y:winHeight-88}); //-38-50
    }


});