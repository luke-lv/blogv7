/**
 * @fileoverview 设置颜色
 * @author xinyu@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/ui/dialog/layer.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/flash/swf.js");
$import("sina/core/class/create.js");
$import("sina/core/events/stopEvent.js");
$import("sina/ui/template.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");

var SetColor2= Core.Class.create();

SetColor2.prototype={
	initialize:function(obj,tamplate,flashCallback){

		this.stopEvent();
		this.obj=obj;
		this.layer=new Layer(tamplate);
		this.initElement(flashCallback);
		this.setPosition();
		Core.Events.addEvent(document.body,function(){
		this.hidden();
		}.bind2(this),'click');
	},
	initElement:function(flashCallback){
		var swf_url=$_GLOBAL.flashBasicURL+"ColorPicker.swf?"+new Date().getTime();
		  Utils.Flash.swfView.Add(swf_url, this.layer.entity, "setbgcolorswf", "251", "264", "8.0.0.0", "#000",{
		  	callback: flashCallback
		  }, {
            scale: "showall",
			loop:"true",
			play:"true",
			pluginspage:"http://www.macromedia.com/go/getflashplayer",
            allowScriptAccess: "always",
            wmode: "window"
        });
		
		Core.Events.addEvent(this.layer.entity, this.stopEvent.bind2(this), "click");
		Core.Events.addEvent(this.layer.entity, this.hidden.bind2(this), "dblclick");
	},
	/**
	 * 选择颜色后的回调函数
	 * @param {Object} color
	 */
	setBackgroundColor:function(color){
		this.layer.hidden();
		this.isShow=false;
		this.obj.style.backgroundColor='#'+color;
		document.body.style.backgroundColor='#'+color;
		__pageSetVar.selectedBgColor=color;
	},
	setPosition: function(){
        var e = Core.Events.getEvent();
        var et = Core.Events.fixEvent(e);
        var ele = et.target;
        var left = Core.Dom.getLeft(ele);
        var top = Core.Dom.getTop(ele) + ele.offsetHeight + 1;
        this.layer.setPosition({
            x: left-5,
            y: top
        });
    },
	/**
	 * 停止事件传递
	 */
    stopEvent: function(){
        Core.Events.stopEvent();
    },
	/**
	 * 获取触发事件元素
	 */
    getEventElement: function(){
        var e = Core.Events.getEvent();
        var et = Core.Events.fixEvent(e);
        return et.target;
    },
	/**
	 * 执行函数，需要子类覆盖
	 */
    exec: function(){
       
    },
	/**
	 * 隐藏
	 */
    hidden: function(){
        this.layer.hidden();
		this.isShow=false;
        
    },
	/**
	 * 显示
	 */
    show: function(){
		this.isShow=this.isShow||false;
		if(this.isShow){
			this.hidden();
		}else{
			this.setPosition();
        	this.stopEvent();
        	this.layer.show();
			this.isShow=true;
//			trace('背景色是：'+Core.Dom.getStyle(document.body,"backgroundColor").replace('#',''));
			//BLOGBUG-5258 
			setTimeout(function(){
				$E('setbgcolorswf').focus();
				trace(Core.Dom.getStyle(document.body,"backgroundColor").replace('#','')+"______");
				$E('setbgcolorswf').setColor(Core.Dom.getStyle(document.body,"backgroundColor").replace('#',''));
			},300);
		}
		
    }
};


