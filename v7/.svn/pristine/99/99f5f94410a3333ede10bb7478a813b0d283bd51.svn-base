$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/ui/tween/transition.js");
$import("sina/core/events/eventDispatcher.js");
$import("sina/ui/ui.js");

if(typeof xBlog ==="undefined"){
    xBlog={};
}
/**
 * 缓动策略类扩展 增加对多个属性进行缓动
 * @param {Array<Number>} startValue 起始值数组
 * @param {Array<Number>} endValue 结束值数组
 * @param {Number} duration 缓动持续时间(s)
 * @param {Function} motion 缓动公式
 */
xBlog.TweenStrategyEx=function(startValue,endValue,duration,motion){
    this.startValue=startValue || [];
    this.endValue=endValue || [];
    this.duration=duration || 0;
    this.motion=motion || Ui.Transition.simple;
    this.__eventDispatcher=new Core.Events.EventDispatcher(this);
}.$define({
    
    /**
     * 缓动公式
     */
    motion:null,
    
    /**
     * 缓动持续时间
     */
    duration:0,
    
    /**
     * 起始值
     */
    startValue:0,
    
    /**
     * 结束值
     */
    endValue:0,
    
    _itvID:0,
    
    _isTweenning:false,
    
    /**
     * 添加事件
     * @param {String} type 事件类型
     * @param {Function} handle
     */
    addEventListener:function(type,handle){
        this.__eventDispatcher.addEventListener(type,handle);
        return this;
    },
    
    /**
     * 移除事件
     * @param {String} type 事件类型
     * @param {Function} handle
     */
    removeEventListener:function(type,handle){
        this.__eventDispatcher.removeEventListener(type,handle);
        return this;
    },
    
    /**
     * 开始缓动效果
     */
    start:function(){
        if(this._isTweenning){
            return;
        }
        this._isTweenning=true;
        
        var me=this,
            t,
            sv=this.startValue,
            ev=this.endValue,
            d=this.duration,
            value=[],
            startTime=(new Date()).getTime();
            
        this._itvID=window.setInterval(function(){
            t=((new Date()).getTime()-startTime)/1000;
            t>me.duration && (t=me.duration);
            for(var i=0;i<sv.length;i++){
                value[i]=me.motion(t,sv[i],ev[i]-sv[i],d);
            }
            me.onTween && me.onTween(value);
            me.__eventDispatcher.dispatchEvent("tween",value);
            t==me.duration && me.stop();
        },25);
        return this;
    },
    
    /**
     * 停止缓动
     */
    stop:function(){
        window.clearInterval(this._itvID);
        this._isTweenning=false;
        this.onEnd && this.onEnd();
        this.__eventDispatcher.dispatchEvent("end");
        return this;
    },
    
    /**
     * 在缓动期间触发
     * @param {Number} value 当前返回的缓动值
     */
    onTween:function(value){},
    
    /**
     * 缓动结束时触发
     */
    onEnd:function(){}
});