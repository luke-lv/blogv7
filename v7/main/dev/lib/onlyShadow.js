/** 
 * @fileoverview 在指定节点中插入遮罩层
 * @author Book | liming9@staff.sina.com.cn
 * @version 0.01 | 2011-03-25
 * @importcopy $import("comps/publish/onlyShadow.js");
 * @modified W.Qiang | wangqiang1@staff.sina.com.cn
 * @version 0.02 | 2011-05-25
 * @description 为兼容IE6，insertBefore函数报错的问题，修改IE6下遮罩层的实现
 *
 */
$import("sina/sina.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getXY.js");
$import("lib/lib.js");
$import("lib/apply.js");
/** 
 * 在指定节点中插入遮罩层
 * 
 * @param {Number} opacity 遮罩层的透明度
 * @param {HTMLElement} parent 在此节点中插入遮罩层
 * @param {String} id 要插入的遮罩层的id
 * @param {Object} cfg 遮罩层配置zIndex和backgroundColor
 * @type OnlyShadow 包装了操作遮罩层的方法的对象
 */
Lib.OnlyShadow = function(opacity, parent, id, cfg){
    this.entity=null;
    this.parent = parent || document.body;
    cfg = Lib.apply({
                zIndex : 1024, 
                backgroundColor : "black"
            }, cfg);

    this._ie6Fixed=function(){ //王强修改--2010-05-25
        if (_this.entity) {
            _this.entity.style.top = document.documentElement.scrollTop + "px";
            var left = (document.documentElement.scrollLeft - _this._ie6EntityXY[0]);
            var wholeWidth = left+_this.entity.offsetWidth;
            var scrollWidth = (document.documentElement.scrollWidth  || document.body.scrollWidth);
            
            if(wholeWidth <= scrollWidth){
                _this.entity.style.left=left+"px";
            }
            if (_this.ifm) {
                _this.ifm.style.top = _this.entity.style.top;
                if(wholeWidth <= scrollWidth){
                    _this.ifm.style.left = _this.entity.style.left;
                }
            }
        }
    };
    
    var _this=this;
    
    this.resetShadowDiv = Core.Function.bind3(function(){
        if (_this.entity) {
                setTimeout(function(){
                    _this.updateSize();
                    if ($IE6 && _this.isShow()) {
                        _this.entity.style.left="0px";
                        var xy = Core.Dom.getXY(_this.entity);
                        _this._ie6EntityXY = xy;
                        _this._ie6Fixed();
                    }
                },1);
        }
    },this);
    
    this._create=function(){ //兼容IE6，王强修改--2010-05-25
        _this.entity=$C("div");
        if( id ){_this.entity.id=id}
        _this.entity.style.position="absolute";
        _this.entity.style.width=_this.getAreaWidth()+"px";
        _this.entity.style.height=_this.getAreaHeight()+"px";
        _this.entity.style.left="0px";
        _this.entity.style.top="0px";
        _this.entity.style.zIndex= cfg.zIndex;
        _this.entity.style.backgroundColor= cfg.backgroundColor;

        _this.parent.appendChild(_this.entity);
        
        _this._setOpacity(_this.entity,isNaN(opacity)?0.5:opacity);
        
        if($IE6){
            var xy = Core.Dom.getXY(_this.entity);
            _this._ie6EntityXY = xy;
            var left = (document.documentElement.scrollLeft - _this._ie6EntityXY[0]);
            _this.entity.style.left=left+"px";
        }
        _this.addIframe();
        Core.Events.addEvent(window,_this.resetShadowDiv,"resize");
                
        _this.setFixed(true);
        _this.hidden();
    };
    
    (function initialize(){
        if(id && $E(id)){
            _this.entity = $E(id);
        }else{
            _this._create();
        }
    })();
    
};

Lib.OnlyShadow.prototype={
    isShow : function(){
        return this.entity.offsetHeight > 0 ? true : false;
    },
    /**
     * 显示
     */
    show:function(){
        this.entity.style.display="";
        if(this.ifm){
            this.ifm.style.display="";
        }
        if($IE6){
            this.updateSize();
            this.entity.style.left="0px";
            var xy = Core.Dom.getXY(this.entity);
            this._ie6EntityXY = xy;
            this._ie6Fixed();
        }
        //this.isShow=true;
        this.onShow();
    },
    
    /**
     * 隐藏
     */
    hidden:function(){
        this.entity.style.display="none";
        if(this.ifm){
            this.ifm.style.display="none";
        }
        //this.isShow=false;
        this.onHidden();
    },
    
    /**
     * 关闭
     */
    close:function(){
        this.hidden();
        this.destroy();
    },
    
    /**
     * 销毁
     */
    destroy:function(){
        Core.Events.removeEvent(window,this._ie6Fixed, "scroll");
        Core.Events.removeEvent(window,this.resetShadowDiv, "resize");
        this.entity.parentNode.removeChild(this.entity);
        this.entity=null;
        if(this.ifm){
            this.ifm.parentNode.removeChild(this.ifm);
            this.ifm=null;
        }
    },
    
    /**
     * 添加背景Iframe
     */
    addIframe:function(){
        this.ifm=$C("iframe");
        this._setOpacity(this.ifm,0);
        this.ifm.style.position="absolute";
        this.ifm.style.zIndex=this.entity.style.zIndex;
        this.ifm.style.left=this.entity.style.left;
        this.ifm.style.top=this.entity.style.top;
        this.ifm.style.width=this.entity.style.width;
        this.ifm.style.height=this.entity.style.height;
        this.entity.parentNode.insertBefore(this.ifm,this.entity);
        
    },
    
    /**
     * 插入到指定对象之前
     * @param {Object} obj 
     */
    insertBefore:function(obj){
        obj.parentNode.insertBefore(this.entity,obj);
        if (this.ifm) {
            this.entity.parentNode.insertBefore(this.ifm,this.entity);
        }
    },
    
    /**
     * 更新大小
     */
    updateSize:function(){
        var width  = this.getAreaWidth();
        var height = this.getAreaHeight();
        //Debug.info("width:"+width+"    height:"+height);
        this.entity.style.width  = width  + "px";
        this.entity.style.height = height + "px";
        if(this.ifm){
            this.ifm.style.width  = width  + "px";
            this.ifm.style.height = height + "px";
        }
    },
    
    /**
     * 获取显示窗口区域的高度
     */
    getAreaHeight:function(){
        var height = Math.max(document.documentElement.clientHeight  , document.body.clientHeight);
        return height;
    },
    
    /**
     * 获取显示窗口区域的宽度
     */
    getAreaWidth:function(){
        var width = document.documentElement.clientWidth || document.body.clientWidth;
        return width;
    },
    
    /**
     * 设置是否为Fixed状态
     * @param {Boolean} state 状态值
     */
    setFixed:function(state){
        if ($IE6) {
            var _this=this;
            if (state) {
                _this._ie6Fixed();
                Core.Events.addEvent(window,_this._ie6Fixed, "scroll");
            }else{
                Core.Events.removeEvent(window,_this._ie6Fixed, "scroll");
            }
            
        }else{
            this.entity.style.position = state?"fixed":"absolute";
        }
    },
    
    /**
     * 设置透明度(用Core.Dom.setStyle设置透明度有在IE6下失效的情况发生-_-!)
     */
    _setOpacity:function(obj,v){
        if ($IE) {
            obj.style.filter = "alpha(opacity=" + v*100 + ")";
        }else{
            obj.style.opacity=v;
        }
    },
    
    /**
     * 显示时触发
     */
    onShow:function(){
        
    },
    
    /**
     * 隐藏时触发
     */
    onHidden:function(){
        
    }
};
