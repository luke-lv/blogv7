/** 
 * @fileoverview 滑动显示或隐藏这种、评论、喜欢框
 * @author liming9@staff.sina.com.cn
 * @created 2018-08-21
 */
$import("mojie/_mojie.js");
$import("sina/ui/tween/tweenStrategy.js");

//startHeight小于endHeight表示展开，相反表示收起
Mojie.slideShow = function(el, startHeight, endHeight, time){
    var isShow = startHeight < endHeight;
    el.style.overflow = 'hidden';
    el.style.height = startHeight+'px';
    if( isShow ){
        el.style.display = '';
    }
    
    var tween = new Ui.TweenStrategy(startHeight, endHeight, time||0.5);
    tween.onTween = function(v){
        el.style.height = v+'px';
    };
    tween.onEnd = isShow ? function(){
        el.style.overflow = '';
        el.style.height = '';
    } : function(){
        el.style.display = 'none';
    };
    
    tween.start();
};
