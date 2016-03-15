/**
 * @fileoverview
 *	定义组件基础类 Lib.Component
 *		包括各组件最基础方法的定义
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2009-08-07
 * @history
 */
$import("sina/core/class/create.js");
$import("lib/component/class/_class.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/removeNode.js");

Lib.Component.Comp = Core.Class.create();
/**
 * 给组件基础类扩展方法
 */
Lib.Component.Comp.prototype = {
	/**
	 * 组件初始化
	 */
	initialize	: function (sId) {
		// 如果缺少组件 ID 或尺寸，就不做初始化
		if(this.isInit == true || sId == null || Lib.Component.compSize[sId] == null){
			return;
		}
		else {
			this.isInit = true;
			this.compId = sId;
			this.size = Lib.Component.compSize[sId];
			// Lib.Component 的静态属性 instances 用来保存当前实例化的组件列表，以组件 ID 做 Keys
			Lib.Component.instances[sId] = this;
			return this;
		}
	}
	/**
	 * 保存当前组件 ID
	 */
	,compId		: null
	/**
	 * 获取组件整个 HTML 节点
	 */
	,getContainer	: function () {
		return $E("module_" + this.compId);
	}
	/**
	 * 获得组件标题 HTML 节点
	 */
	,getTitle	: function () {
		return Core.Dom.getElementsByClass($E("module_" + this.compId), "span", "title")[0];
	}
	/**
	 * 获得组件管理 HTML 节点
	 */
	,getManage	: function () {
		var manageNode = Core.Dom.getElementsByClass($E("module_" + this.compId), "span", "edit");
		if(manageNode.length != 0){
			return manageNode[0];
		}else{
			Debug.error('组件添加管理链接失败，检查组件' + this.compId + '标题栏 SPAN[class=edit] 是否存在');
			return null;
		}
	}
	/**
	 * 取得内容区域 HTML 节点
	 */
	,getContent	: function () {
		var contentNode = Core.Dom.getElementsByClass($E("module_" + this.compId), "div", "SG_connBody");
		if(contentNode.length != 0){
			return contentNode[0];
		}else{
			Debug.error('组件内容节点获取失败，检查组件' + this.compId + '内 DIV[class=SG_connBody] 是否存在');
			return null;
		}
	}
	///// 组件节点获取结束 /////
	
	///// 组件处理流程相关函数开始 /////
	/**
	 * 组件载入数据开始，必须重载
	 * 这是组件实例化以后的入口函数，实例化组件以后需要调用该实例的 load 方法
	 */
	,load		: function () {
		trace("load compId=" + this.compId);
		this.setContent("");
	}
	/**
	 * 重载组件
	 */
	,reload		: function (sSize) {
		this.clearContent();
		this.load();
	}
	///// 组件处理流程相关函数结束 /////
	
	///// 组件渲染相关函数开始 /////
	/**
	 * 设置组件标题
	 * @param {String} sTitle
	 */
	,setTitle	: function (sTitle) {
		var titleNode = this.getTitle();
		if(titleNode){
			titleNode.innerHTML = sTitle || "";
		}
	}
	/**
	 * 设置组件管理链接，最起码有个管理链接
	 */
	,setManage	: function () {
		var manageNode = this.getManage();
		if($isAdmin && manageNode){
			manageNode.innerHTML = '<span class="move"><a href="#" '
								+ 'onclick="funcMoveUpDown.up(' + this.compId + ');return false;">↑</a><a href="#" '
								+ 'onclick="funcMoveUpDown.down(' + this.compId + ');return false;">↓</a></span>'
								+ '<a href="#" onclick="hiddenComponents(\'' + this.compId
								+ '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
		}
	}
	/**
	 * 设置组件内容
	 * @param {sContent} sContent
	 */
	,setContent	: function (sContent) {
		sContent = typeof sContent == "string" ? sContent : sContent + "";
		this.getContent().innerHTML = sContent || "";
	}
	/**
	 * 清空组件内容
	 */
	,clearContent	: function () {
		this.getContent().innerHTML = "";
	}
	///// 组件渲染相关函数结束 /////
	/**
	 * 删除组件节点
	 */
	,remove		: function (){
		Core.Dom.removeNode(this.getContainer());
		this.finalize();
	}
	/**
	 * 组件注销
	 */
	,finalize	: function () {
		this.isInit = null;
		Lib.Component.instances[this.compId] = null;
	}
};