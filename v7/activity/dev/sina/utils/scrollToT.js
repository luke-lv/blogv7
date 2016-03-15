/**
*@description 操作滚动条到指定位置 top值 上下滚动
*@param 
  to {number} 需要滚动到的位置top值 默认0，即页面顶端
  speed {number}  滚动的速度，每次移动的时间/毫秒(setTimeout), 默认5
  step  {number} 步长，每次移动的距离, 默认10
  accelerate {number} 加速度设置，滚动距离大于指定值时，将加速滚动，但最小滚动步长不小于step指定值, 默认不加速
  cb {function} 滚动完成后的回调
*/
$import('sina/core/system/getScrollPos.js');

(function (){
    var timer;
    var prevTop;
    function setScrollTop(top){
        document.body.scrollTop = top;
        document.documentElement.scrollTop = top;
    }
    function scrollTo(to, speed, step, accelerate, cb){
        clearTimeout(timer);
        timer = null;
        
        to = to || 0;
        speed = speed || 5;
        step = step || 10;
        accelerate = accelerate;
        cb = cb || function (){};
        
        var curTop = Core.System.getScrollPos()[0];
        var _step = step;
        var _to = 0;
        if(accelerate && Math.abs(to - curTop) > accelerate){
            _step = parseInt(Math.abs(to - curTop)/100);
            _step = _step < 10 ? 10 : _step;
        }
        if(curTop == to || curTop == prevTop){
            clearTimeout(timer);
            timer = null;
            prevTop = null;
            cb();
        }else if(curTop > to){
            _to = (curTop - _step) > to ? (curTop - _step) : to;
        }else{
            _to = (curTop + _step) < to ? (curTop + _step) : to;
        }
        
        prevTop = _to;
        setScrollTop(_to);
        timer = setTimeout(function (){
            scrollTo(to, speed, step, accelerate, cb);
        }, speed);
    }
    
    Utils.scrollTo = scrollTo;
})();