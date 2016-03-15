/**
 * @fileoverview 拖拽器接口
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-10-25
 */

$import("sina/ui/ui.js");

/**
 * 拖拽器接口
 * @event
 * 		afterDrag 在托拽完成后触发
 */
Ui.IDragger={
	/**
	 * 添加事件监听
	 * @param {String} type
	 * @param {Function} handle
	 */
	addEventListener:function(type,handle){},
	
	/**
	 * 移除事件监听
	 * @param {String} type
	 * @param {Function} handle
	 */
	removeEventListener:function(type,handle){},
	
	/**
	 * 设置要拖拽的节点
	 * @param {Object} node 捕获拖拽的节点
	 * @param {Object} attachNodes 被拖拽的节点
	 * @param {Boolean}
	 */
	setDrag:function(node,attachNodes,isDragCapureNode){},
	
	/**
	 * 设置是否锁定拖拽区域
	 * @param {Boolean} state
	 */
	setLock:function(state){},
	
	/**
	 * 设置锁定的拖拽区域的范围
	 * @param {Object} area{
	 * 					left:左边界坐标,
	 *					top:上边界坐标,
	 *					right:右边界坐标,
	 *					bottom:下边界坐标
	 * 				}
	 */
	setArea:function(area){},
	
	/**
	 * 销毁对象
	 */
	destroy:function(){}
};

