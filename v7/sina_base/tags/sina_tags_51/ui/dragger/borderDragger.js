/**
 * @fileoverview 边框拖拽的拖拽器类,实现了IDragger接口
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-11-04
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/core/system/br.js");
$import("sina/ui/dragger/IDragger.js");
$import("sina/core/events/eventDispatcher.js");
$import("sina/ui/drag.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/ui/tween/transition.js");

/**
 * 边框形式的拖拽器
 * @event
 * 		afterDrag 在托拽完成后触发
 */
Ui.BorderDragger=function(){
	this.__drag=null;
	this.__isBindEvent=false;
	this.__border=null;
	this.__dragNode=null;
	this.__isCreated=false;
	this.__tweenX=new Ui.TweenStrategy(0,0,0.5,Ui.Transition.strongEaseOut);
	this.__tweenY=new Ui.TweenStrategy(0,0,0.5,Ui.Transition.strongEaseOut);
	this.__eventDispatcher=new Core.Events.EventDispatcher(this);
	
}.$implements(Ui.IDragger).$define({
	
	/**
	 * 添加事件监听
	 * @param {String} type
	 * @param {Function} handle
	 */
	addEventListener:function(type,handle){
		if(type.toLowerCase()==="afterdrag"){
			this.__eventDispatcher.addEventListener(type,handle);
		}else{
			this.__drag.addEventListener(type,handle);
		}
		return this;
	},
	
	/**
	 * 移除事件监听
	 * @param {String} type
	 * @param {Function} handle
	 */
	removeEventListener:function(type,handle){
		if(type.toLowerCase()==="afterdrag"){
			this.__eventDispatcher.removeEventListener(type,handle);
		}else{
			this.__drag.removeEventListener(type,handle);
		}
		return this;
	},
	
	/**
	 * 设置要拖拽的节点
	 * @param {Object} node 获取鼠标捕获事件的节点
	 * @param {Object} attachNode 跟随鼠标移动的节点
	 * @param {Boolean} isDragCapureNode 是否拖拽获取鼠标捕获事件的节点
	 */
	setDrag:function(node,attachNode,isDragCapureNode){
		if(!this.__isCreated){
			this.__createBorder(attachNode);
			this.__initTweenEvent(attachNode);
		}
		
		this.__drag=new Ui.Drag(node,this.__border,isDragCapureNode);
		this.__dragNode=attachNode;
		this.__initDragEvent();
		return this;
	},
	
	/**
	 * 设置是否锁定拖拽区域
	 * @param {Boolean} state
	 */
	setLock:function(state){
		this.__drag.isLock=!!state;
		return this;
	},
	
	/**
	 * 设置锁定的拖拽区域的范围
	 * @param {Object} area{
	 * 					left:左边界坐标,
	 *					top:上边界坐标,
	 *					right:右边界坐标,
	 *					bottom:下边界坐标
	 * 				}
	 */
	setArea:function(area){
		this.__drag.lockArea=area;
		return this;
	},
	
	destroy:function(){
		this.__drag.destroy();
	},
	
	__createBorder:function(node){
		this.__border=$C("div");
		var st=this.__border.style;
		st.border="2px dashed #BCC4D0";
		st.position="absolute";
		st.display="none";
		st.backgroundColor="transparent";
		st.MozUserSelect="none";
		document.body.appendChild(this.__border);
		this.__isCreated=true;
	},
	
	__initDragEvent:function(){
		if(this.__isBindEvent){
			return;
		}
		
		var me=this,
			bst=this.__border.style,
			nst=this.__dragNode.style,
			twX=this.__tweenX,
			twY=this.__tweenY;
			
		this.__drag.addEventListener("beforeDrag",function(){
			bst.zIndex=nst.zIndex+1;
			bst.position=nst.position;
			bst.width=me.__dragNode.offsetWidth-4+"px";
			bst.height=me.__dragNode.offsetHeight-4+"px";
			bst.left=parseInt(nst.left)+"px";
			bst.top=parseInt(nst.top)+"px";
			bst.display="";
		});
		
		this.__drag.addEventListener("afterDrag",function(){
			if ($IE6) {
				nst.left = parseInt(bst.left) + "px";
				nst.top = parseInt(bst.top) + "px";
				bst.display="none";
				me.__eventDispatcher.dispatchEvent("afterDrag");
			}
			else {
				twX.startValue=parseInt(nst.left);
				twX.endValue=parseInt(bst.left);
				
				twY.startValue=parseInt(nst.top);
				twY.endValue=parseInt(bst.top);
				
				twX.start();
				twY.start();
			}
		
		});
		this.__isBindEvent=true;
	},
	
	__initTweenEvent:function(node){
		var nst=node.style,
			bst=this.__border.style,
			me=this;
			
		this.__tweenX.addEventListener("tween",function(v){
			nst.left=v+"px";
		});
		
		this.__tweenY.addEventListener("tween",function(v){
			nst.top=v+"px";
		});
		
		this.__tweenX.addEventListener("end",function(){
			bst.display="none";
			me.__eventDispatcher.dispatchEvent("afterDrag");
		});
	}
});
