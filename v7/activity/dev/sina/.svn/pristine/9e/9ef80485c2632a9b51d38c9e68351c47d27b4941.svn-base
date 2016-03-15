/**
 * @fileoverview 一般的拖拽器类,实现了IDragger接口
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-10-25
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/core/events/eventDispatcher.js");
$import("sina/ui/dragger/IDragger.js");
$import("sina/ui/drag.js");

/**
 * 简单的拖拽器
 * @event
 * 		afterDrag 在托拽完成后触发
 */
Ui.SimpleDragger=function(){
	this.__drag=null;
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
		var me=this;
		
		this.__drag=new Ui.Drag(node,attachNode,isDragCapureNode);
		this.__drag.addEventListener("afterDrag",function(){
			me.__eventDispatcher.dispatchEvent("afterDrag");
		});
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
	}
});
