/**
 * @fileoverview 拖拽功能
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-10-21
 * @example
 * 	var a=new Ui.Drag($p.nodes.panel,[p2.nodes.panel,p3.nodes.panel]);
 * 
		a.addEventListener("beforeDrag",function(){
			trace("beforeDrag");
		}).addEventListener("afterDrag",function(){
			trace("afterDrag");
		}).addEventListener("drag",function(){
			trace("draging");
		});
		a.isLock=true;
		a.lockArea={
			left:0,
			top:0,
			right:500,
			bottom:500
		};
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/eventDispatcher.js");
$import("sina/core/system/br.js");
$import("sina/ui/ui.js");

/**
 * 托拽类
 * @param {Object} captureNode 捕获拖拽的节点
 * @param {Array} attachNodes 被拖拽的节点,可传入数组,也可传入单独的节点,不传些参数时,为捕获拖拽的节点
 * @param {Boolean} isDragCapureNode 是否拖拽捕获拖拽的节点(默认为true)
 * @event
 * 		beforeDrag 在准备托拽前触发
 * 		afterDrag 在托拽完成后触发
 * 		drag 托拽时触发
 */
Ui.Drag=function(captureNode,attachNodes,isDragCapureNode){
	var me=this;
	
	this.canDrag=true;
	this.isLock=false;
	this.lockArea={
		left:0,
		right:0,
		top:0,
		bottom:0
	};
	
	this.__captureNode=captureNode;
	this.__dragNodes=[];
	this.__deltaX=[];
	this.__deltaY=[];
	this.__eventDispatcher=new Core.Events.EventDispatcher(this);
	this.__isDraging=false;
	this.__canDragX=true;
	this.__canDragY=true;
	
	this.__dragHandle=function(){
		me.__drag();
	};
	this.__mouseDownHandle=function(){
		me.__isDraging=true;
		me.__eventDispatcher.dispatchEvent("beforeDrag");
		me.__setCapture(true);
	};
	this.__mouseUpHandle=function(){
		me.__isDraging && me.__eventDispatcher.dispatchEvent("afterDrag");
		me.__isDraging=false;
		me.__setCapture(false);
	};
	
	this.__initNodes(captureNode,attachNodes,isDragCapureNode);
	this.__initCaputerNode();
	
}.$define({
	
	/**
	 * 添加事件监听
	 * @param {String} type
	 * @param {Function} handle
	 */
	addEventListener:function(type,handle){
		this.__eventDispatcher.addEventListener(type,handle);
		return this;
	},
	
	/**
	 * 移除事件监听
	 * @param {String} type
	 * @param {Function} handle
	 */
	removeEventListener:function(type,handle){
		this.__eventDispatcher.removeEventListener(type,handle);
		return this;
	},
	
	destroy:function(){
		Core.Events.removeEvent(this.__captureNode,this.__mouseDownHandle,"mousedown");
		Core.Events.removeEvent(document,this.__mouseUpHandle,"mouseup");
		this.__captureNode=null;
		this.__dragNodes=null;
	},
	
	/**
	 * 初始化托拽的节点
	 * @param {Object} captureNode
	 * @param {Object} attachNodes
	 * @param {Boolean} isDragCapureNode
	 */
	__initNodes:function(captureNode,attachNodes,isDragCapureNode){
		if(attachNodes){
			attachNodes instanceof Array?this.__dragNodes=attachNodes:this.__dragNodes.push(attachNodes);
			(typeof isDragCapureNode ==="undefined" || isDragCapureNode) && this.__dragNodes.push(this.__captureNode);
		}else{
			this.__dragNodes.push(this.__captureNode);
		}
		
		var dns=this.__dragNodes,
			i=dns.length;

		while(i--){
			!dns[i].style.position && (dns[i].style.position="absolute");
			!dns[i].style.left && (dns[i].style.left=0);
			!dns[i].style.top && (dns[i].style.top=0);
		}
	},
	
	/**
	 * 初始化可捕获的节点
	 */
	__initCaputerNode:function(){
		var cn=this.__captureNode,
			me=this;

		Core.Events.addEvent(cn,this.__mouseDownHandle,"mousedown");
		Core.Events.addEvent(document,this.__mouseUpHandle,"mouseup");
	},
	
	/**
	 * 设置捕获状态
	 * @param {Boolean} isCapture
	 */
	__setCapture:function(isCapture){
		var cn=this.__captureNode,
			dns=this.__dragNodes,
			evt=Core.Events.getEvent(),
			i=dns.length;
		
		while(i--){
			this.__deltaX[i]=evt.clientX-parseInt(dns[i].style.left);
			this.__deltaY[i]=evt.clientY-parseInt(dns[i].style.top);
		}
		
		if(isCapture){
			if($IE){
				cn.setCapture();
				Core.Events.addEvent(cn,this.__dragHandle,"mousemove");
			}else{
				Core.Events.addEvent(document,this.__dragHandle,"mousemove");
			}
		}else{
			if($IE){
				cn.releaseCapture();
				Core.Events.removeEvent(cn,this.__dragHandle,"mousemove");
			}else{
				Core.Events.removeEvent(document,this.__dragHandle,"mousemove");
			}
		}
	},
	
	/**
	 * 拖拽
	 */
	__drag:function(){
		if(!this.canDrag){
			return;
		}
		
		var dns=this.__dragNodes,
			evt=Core.Events.getEvent(),
			i=dns.length,
			la=this.lockArea,
			dX=0,
			dY=0;
			
		this.__eventDispatcher.dispatchEvent("drag");
		
		while(i--){
			dX=evt.clientX - this.__deltaX[i];
			dY=evt.clientY - this.__deltaY[i];
			
			if (this.isLock) {
				dX = Math.min(Math.max(dX, la.left),la.right);
				dY = Math.min(Math.max(dY, la.top),la.bottom);
			}
			
			dns[i].style.left=dX+"px";
			dns[i].style.top=dY+"px";
		}
	}
});
