/**
 * @fileoverview 对话框
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-10-25
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/core/system/br.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/ui/template.js");
$import("sina/ui/ui.js");
$import("sina/ui/panel.js");
$import("sina/ui/drag.js");
$import("sina/ui/dragger/simpleDragger.js");

/**
 * 对话框类
 * @event
 * 		beforeDrag
 * 		drag
 * 		afterDrag
 * 		beforeShow
 * 		show
 * 		beforeHidden
 * 		hidden
 */
Ui.Dialog=function(parent,node){
	var me=this;
	
	this.__dragger=null;
	this.__isBindUpadateAreaEvent=false;
	this.__isBindUpdateIE6AreaEvent=false;
	
	//拖拽时的事件句柄
	this.__beforeDragHandle=function(){
		me.__updateDraggerArea();
		me.__eventDispatcher.dispatchEvent("beforedrag");
	};
	this.__dragHandle=function(){
		me.__isSetAdamant && me.__updateIframe();
		me.__eventDispatcher.dispatchEvent("drag");
	};
	this.__afterDragHandle=function(){
		me.__isFixed && $IE6 && me.__updateIE6FCOrgPosition();
		me.__eventDispatcher.dispatchEvent("afterdrag");
	};
	
	this.__updateDraggerAreaHandle=function(){
		setTimeout(function(){
			me.__updateDraggerArea();
		},1);
	};
	
	this.__setMiddleHandle=function(){
		me.setMiddle();
	};
	
	
}.$extends(Ui.Panel).$define({
	
	setTemplate:function(tpl){
		Ui.Dialog.$super.setTemplate.call(this,tpl);
		this.__initTitleBar();
		this.setDragger(Ui.SimpleDragger);
		return this;
	},
	
	setContent:function(content){
		if(!this.nodes.content){
			return this;
		}
		
		this.nodes.content.innerHTML=new Ui.Template(content).evaluate(this.__getNodes(content,"i"));
		this.__addContentNodes(this.__getNodes(content));
		
		return this;
	},
	
	setFixed:function(state){
		Ui.Dialog.$super.setFixed.call(this,state);
		if(state){
			Core.Events.addEvent(window,this.__setMiddleHandle,"resize");
		}else{
			Core.Events.removeEvent(window,this.__setMiddleHandle,"resize");
		}
		this.__updateDraggerArea();
		return this;
	},
	
	/**
	 * 设置居中，对话框会以y轴的黄金分割率来居中显示
	 */
	setMiddle:function(){
		var areaHeight=this.__getDocumentSize().height - this.height,
			goldenSection=(Math.sqrt(5)-1)/2,
			totalSection=1,
			goldenSectionY=areaHeight * goldenSection / (goldenSection + totalSection),
			middleX=this.__getDocumentSize().width/2-this.width/2;
			
			if(!this.__isFixed){
				goldenSectionY+=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
				middleX+=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);
			}

		this.setPosition({
			x:Math.max(middleX,0),
			y:Math.max(goldenSectionY,0)
		});
		
		return this;
	},
	
	setAreaLocked:function(state){
		if(!this.__dragger){
			return this;
		}
		
		this.__dragger.setLock(state);
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
		
		if(this.nodes.content){
			typeof p.width!=="undefined" && (this.nodes.content.style.width=p.width+"px");
			typeof p.height!=="undefined" && (this.nodes.content.style.height=p.height+"px");
		}else{
			typeof p.width!=="undefined" && (this.__entity.style.width=p.width+"px");
			typeof p.height!=="undefined" && (this.__entity.style.height=p.height+"px");
		}
		
		return this;
	},
	
	/**
	 * 设置拖拽器,以通过标题栏拖拽对话框
	 * @param {IDragger} draggerConstructor
	 */
	setDragger:function(draggerConstructor){
		if(!this.nodes.titleBar || !draggerConstructor){
			return this;
		}
		
		if(!this.__dragger){
			this.__dragger=new draggerConstructor();
		}else if(this.__dragger.constructor===draggerConstructor){
			return this;
		}

		this.__updateDragger(draggerConstructor);
		return this;
	},
	
	destroy:function(){
		if(!this.__entity){
			return;
		}
		Ui.Dialog.$super.destroy.call(this);
		Core.Events.removeEvent(window,this.__updateDraggerAreaHandle,"resize");
		Core.Events.removeEvent(window,this.__setMiddleHandle,"resize");
	},
	
	__addContentNodes:function(nodes){
		var nds=this.nodes,
			k;
		
		for(k in nodes){
			nds[k]=nodes[k];
		}
	},
	
	__updateDragger:function(draggerConstructor){
		
		if (this.__dragger.constructor !== draggerConstructor) {
			this.__dragger.removeEventListener("beforedrag", this.__beforeDragHandle)
				.removeEventListener("drag", this.__dragHandle)
				.removeEventListener("afterdrag", this.__afterDragHandle);
			
			this.__dragger.destroy();
			this.__dragger=new draggerConstructor();
		}
		
		this.__dragger.setDrag(this.nodes.titleBar,this.__entity,false);
		this.__dragger.addEventListener("beforedrag", this.__beforeDragHandle)
				.addEventListener("drag", this.__dragHandle)
				.addEventListener("afterdrag", this.__afterDragHandle);
	},
	
	__updateDraggerArea:function(){
		var l,t,r,b;
		if(this.__isFixed){
			l=$IE6?document.documentElement.scrollLeft:0;
			t=$IE6?document.documentElement.scrollTop:0;
			r=$IE6?document.documentElement.scrollLeft + this.__getDocumentSize().width-this.width
				:this.__getDocumentSize().width-this.width;
				
			b=$IE6?document.documentElement.scrollTop + this.__getDocumentSize().height-this.height
				:this.__getDocumentSize().height-this.height;
		}else{
			l=0;
			t=0;
			r=document.documentElement.scrollWidth-this.width;
			b=document.documentElement.scrollHeight-this.height;
		}
		this.__dragger.setArea({
			left:l,
			top:t,
			right:r,
			bottom:b
		});
	},
	
	/**
	 * 初始化标题栏
	 */
	__initTitleBar:function(){
		if(!this.nodes.titleBar){
			return;
		}
		var tb=this.nodes.titleBar;
			tb.style.cursor = "move";
			if($IE){
				Core.Events.addEvent(tb, function(){
					return false;
				}, "selectstart");
			}else{
				tb.style.MozUserSelect="none";
			}
	},
	
	/**
	 * 获取当前可见区域的尺寸
	 */
	__getDocumentSize:function(){
		var w=document.documentElement.clientWidth || document.body.clientWidth,
			h=document.documentElement.clientHeight || document.body.clientHeight;
			
		return {width:w,height:h};
	}
});
