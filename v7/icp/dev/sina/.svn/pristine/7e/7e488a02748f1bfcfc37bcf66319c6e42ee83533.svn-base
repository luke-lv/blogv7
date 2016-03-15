/**
 * @fileoverview 显示的对象类，可作为绝对定位的对象的基类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-10-14
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/core/events/eventDispatcher.js");
$import("sina/core/function/defineGetter.js");
$import("sina/ui/ui.js");
$import("sina/ui/renderer/simpleRenderer.js");

/**
 * 显示对象类
 * 		事件：
 * 			beforeShow 开始显示之前被触发
 * 			show 显示完成后被触发
 * 			beforeHidden 开始隐藏前被触发
 * 			hidden 隐藏完成后被触发
 */
Ui.DisplayObject=function(parent,node){
	/**
	 * 定义getter的属性 x,y,z,width,height
	 */
	Core.Function.defineGetter(this,
		["x","y","z","width","height"],
		[this.__getX,this.__getY,this.__getZ,this.__getWidth,this.__getHeight]);
	
	this.__renderer=null;
	this.__entity=node;
	this.__isInited=false;
	this.__parent=parent || document.body;
	this.__eventDispatcher=new Core.Events.EventDispatcher(this);
	
	//renderer的事件配置
	var ed=this.__eventDispatcher;
	this.__onBeforeShow=function(){
		ed.dispatchEvent("beforeShow");
	};
	this.__onShow=function(){
		ed.dispatchEvent("show");
	};
	this.__onBeforeHidden=function(){
		ed.dispatchEvent("beforeHidden");
	};
	this.__onHidden=function(){
		ed.dispatchEvent("hidden");
	};
	
	this.__updateRenderer(Ui.SimpleRenderer);
}.$define({
	/**
	 * 是否为显示状态
	 */
	isShow : !1,
	
	/**
	 * 是否为隐藏状态
	 */
	isHidden : !0,

	/**
	 * 设置位置
	 * @param {Object} p
	 * 					x:Number
	 * 					y:Number
	 * 					z:Number
	 */
	setPosition:function(p){
		!this.__isInited && this.__initEntity();
		
		typeof p.x!=="undefined" && (this.__entity.style.left=p.x+"px");
		typeof p.y!=="undefined" && (this.__entity.style.top=p.y+"px");
		typeof p.z!=="undefined" && (this.__entity.style.zIndex=p.z);
		return this;
	},
	
	/**
	 * 设置大小
	 * @param {Object} p
	 * 					width:Number
	 * 					height:Number
	 */
	setSize:function(p){
		!this.__isInited && this.__initEntity();
		
		typeof p.width!=="undefined" && (this.__entity.style.width=p.width+"px");
		typeof p.height!=="undefined" && (this.__entity.style.height=p.height+"px");
		return this;
	},
	
	setRenderer:function(rendererConstructor){
		!this.__isInited && this.__initEntity();
		this.__updateRenderer(rendererConstructor);
		return this;
	},
	
	/**
	 * 显示对象
	 * @param {IRenderer} rendererConstructor
	 */
	show:function(rendererConstructor){
		this.isHidden = !1;
		this.isShow = !0;
		!this.__isInited && this.__initEntity();
		this.__updateRenderer(rendererConstructor);
		this.__renderer.show(this.__entity);
		return this;
	},
	/**
	 * 隐藏面板
	 * @param {IRenderer} renderer
	 * @deprecated 槽糕的api命名 @see hide
	 */
	hidden:function(rendererConstructor){
		return this.hide(rendererConstructor);
	},
	/**
	 * 隐藏对象
	 * @param {IRenderer} renderer
	 */
	hide:function(rendererConstructor){
		this.isHidden = !0;
		this.isShow = !1;
		!this.__isInited && this.__initEntity();
		
		this.__updateRenderer(rendererConstructor);
		this.__renderer.hidden(this.__entity);
		return this;
	},
	/**
	 * 设置是否允许显示对象
	 * @param {Boolean} state
	 */
	setCanShow:function(state){
		this.__renderer.setCanShow(state);
		return this;
	},
	
	/**
	 * 设置是否允许隐藏对象
	 * @param {Boolean} state
	 */
	setCanHidden:function(state){
		this.__renderer.setCanHidden(state);
		return this;
	},
	
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
	
	destroy:function(){
		if(!this.__entity){
			return;
		}
		!this.__isInited && this.__initEntity();
		
		this.__entity.parentNode && this.__entity.parentNode.removeChild(this.__entity);
		this.__entity=null;
	},
	
	/**
	 * 初始化节点对象
	 */
	__initEntity:function(){
		var st;

		!this.__entity && (this.__entity=$C("div"));
		st=this.__entity.style;
		
		st.position="absolute";
		st.left=0;
		st.top=0;
		// st.zIndex=0;			// 有点冲突

		!this.__entity.parentNode && this.__parent.appendChild(this.__entity);

		this.__isInited=true;
	},
	
	__updateRenderer:function(rendererConstructor){
		if(!rendererConstructor){
			return;
		}
		
		var addEvent=function(){
			this.__renderer.addEventListener("beforeShow",this.__onBeforeShow)
				.addEventListener("show",this.__onShow)
				.addEventListener("beforeHidden",this.__onBeforeHidden)
				.addEventListener("hidden",this.__onHidden);
		};
		
		if(!this.__renderer){
			this.__renderer=new rendererConstructor();
			addEvent.call(this);
		}else if(this.__renderer.constructor!==rendererConstructor){
			this.__renderer.removeEventListener("beforeShow", this.__onBeforeShow)
				.removeEventListener("show", this.__onShow)
				.removeEventListener("beforeHidden", this.__onBeforeHidden)
				.removeEventListener("hidden", this.__onHidden);
				
			this.__renderer=new rendererConstructor();
			addEvent.call(this);
		}
	},
	
	/**
	 * 获取X坐标
	 */
	__getX:function(){
		!this.__isInited && this.__initEntity();
		return parseInt(this.__entity.style.left);
	},
	
	/**
	 * 获取Y坐标
	 */
	__getY:function(){
		!this.__isInited && this.__initEntity();
		return parseInt(this.__entity.style.top);
	},
	
	/**
	 * 获取对象深度(z坐标)
	 */
	__getZ:function(){
		!this.__isInited && this.__initEntity();
		return parseInt(this.__entity.style.zIndex);
	},
	
	/**
	 * 获取宽度
	 */
	__getWidth:function(){
		!this.__isInited && this.__initEntity();
		return this.__getSize(this.__entity,"offsetWidth");
	},
	
	/**
	 * 获取高度
	 */
	__getHeight:function(){
		!this.__isInited && this.__initEntity();
		return this.__getSize(this.__entity,"offsetHeight");
	},
	
	/**
	 * 获取尺寸，对象在不可见状态下也能获取到真实的尺寸
	 * @param {String} p
	 */
	__getSize:function(node,p){
		var et=node,
			v,
			ov=et.style.visibility;
			
		if(et.style.display=="none"){
			et.style.visibility="hidden";
			et.style.display="";
			v=et[p];
			et.style.display="none";
			et.style.visibility=ov;
		}else{
			v=et[p];
		}
		
		return v;
	}
	
});
