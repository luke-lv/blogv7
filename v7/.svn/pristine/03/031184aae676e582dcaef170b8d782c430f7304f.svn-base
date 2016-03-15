$import("sina/core/events/addEvent.js");
$import("sina/ui/panel.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/getElementsByClass.js");
/** 
 * @fileoverview 回到顶部
 * @author zhangkai2@staff.sina.com.cn
 * @update 2012-08-31 liming9@staff
 */
$registJob('goToTop', function(){
	var __addEvent = Core.Events.addEvent, __opacity = Core.Dom.opacity;
	//var __getElemByCls = Core.Dom.getElementsByClass;
	//创建回到顶部元素
	var myPanel=new Ui.Panel(),
		template='<div class="arr_top"><a id="#{goToTop}" title="返回顶部" href="javascript:;"><img width="59" height="59" src="http://simg.sinajs.cn/blog7style/images/center/newversion/arr_top.gif" alt="" /></a></div>';
	myPanel.setTemplate('<div id="#{panel}">'+template+'</div>').setFixed(true);
	myPanel.entity.style.zIndex = 500;
    
	var pos;
    var showing = false;
	
	if( $E("module_980") ){
		pos = Core.Dom.getXY($E("module_980"));
		pos[0] += 280;
	}
	updateLayerPos();
	
	//首次检查下滚动条位置
	if((document.documentElement.scrollTop || document.body.scrollTop)>0){
		showEffect();
	}
	//注册scroll事件
    
	__addEvent(window, function(){
		//alert(myPanel.entity.style.left)
		var sTop = document.documentElement.scrollTop || document.body.scrollTop;
		//如果回到顶部元素为隐藏状态 且scrollTop大于0 显示回到顶部元素
		if(!showing && sTop>380){
			showEffect();
		}
		if(showing && sTop<380){
			hideEffect();
		}
	},"scroll");
	
	//为回到顶部按钮注册click事件
	__addEvent(myPanel.nodes.goToTop,function(){
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
		showing = true;
        //myPanel.entity
        if($IE){
            myPanel.show();
            return;
        }
		__opacity(myPanel.entity,0);
		myPanel.show();
		var tween=new Ui.TweenStrategy(0,100,0.5);
		tween.onTween = function(v){
			__opacity(myPanel.entity,v);
		};
		tween.start();
	}
	//隐藏特效
	function hideEffect(){
		showing = false;
        if($IE){
            myPanel.hidden();
            return;
        }
        var tween=new Ui.TweenStrategy(100,0,0.5);
		tween.onTween=function(v){
			__opacity(myPanel.entity,v);
		};
		tween.onEnd=function(){
			myPanel.hidden();
		};
		tween.start();
	}
	
	/**
	 * 更新浮层位置
	 */
	function updateLayerPos(){
		var winWidth = document.documentElement.clientWidth,
			winHeight=document.documentElement.clientHeight;
		//alert(parseInt(winWidth))
		//x轴位置取右侧导航中的超链接left值
		//console.log(winWidth);
		if(!pos){
			pos=[];
			pos[0] = winWidth-80;
		}
		
		if(parseInt(winWidth)<930){
            myPanel.setPosition({x:(parseInt(winWidth)-100),y:winHeight-80}); //-38-50
        }else{
            myPanel.setPosition({x:pos[0],y:winHeight-80}); //-38-50
        }
	}
});
