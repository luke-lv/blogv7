/**
 * @fileoverview
 *	file profile
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/class/create.js");
$import("sina/core/array/foreach.js");

$import("lib/component/_component.js");
/**
 * 创建组件基础类
 */
Lib.Component = Core.Class.create();

/**
 * Lib.Component 的静态属性
 *	用来保存当前实例化的组件列表，以组件 ID 做 Keys
 */ 
Lib.Component.instances = Lib.Component.instances || {};

/**
 * Lib.Component 的静态属性
 *	用来保存当前页面初始化状态的组件尺寸，分栏后重新计算

 */
Lib.Component.compSize = {};

/**
 * Lib.Component 的静态方法
 *	得到页面初始化时的组件尺寸，数据来源于 scope.component_lists
 */
Lib.Component.getInitCompSize = function () {
	// 如果页面已输出组件的配置，就取得各组件的尺寸，存入 Lib.Component.compSize
	if(scope.component_lists != null){
		var compList = scope.component_lists;		
		for( var key in compList){
			if(compList[key].list.length > 0){
				Core.Array.foreach(compList[key].list, function (oItem){
					Lib.Component.compSize[oItem] = compList[key].size;
				});
			}
		}
		return true;
	}else{
		return null;
	}
};

/**
 * Lib.Component 的静态方法
 *	用指定尺寸刷新某一特定的组件
 * @param {Number} sCompId	组件ID
 * @param {Object} oOption	刷新时的选项
 * 			width		组件宽度
 *  		addManage	是否要加管理链接
 *  		forceRefresh是否要强制刷新
 */
Lib.Component.refresh = function(sCompId, oOption){
	oOption = oOption || {};
	try {
	if (Lib.Component.instances[sCompId] == null) {
		if(typeof Lib.Component["Comp_" + sCompId] == "undefined"){
			$registComp(sCompId, {}, "static");
		}
		
		Lib.Component.instances[sCompId] = new Lib.Component["Comp_" + sCompId](sCompId);
	}
	}catch(e){/*alert(e.message);*/}
	Debug.log("刷新组件 " + sCompId + " ，新宽度是 " + oOption.width);
	Debug.log("组件 " + sCompId + " 增加管理链接：" + oOption.addManage);
	Lib.Component.instances[sCompId].reload(oOption.width, oOption.addManage, oOption.forceRefresh);
};

/**
 * 设置指定的组件
 * @param {String|Number} sCompId
 */
Lib.Component.set = function (sCompId){
	Debug.log("展开组件 " + sCompId + " 的设置功能");
	if(Lib.Component.instances[sCompId] == null){
		Lib.Component.instances[sCompId] = new Lib.Component["Comp_" + sCompId](sCompId);
	}
	Lib.Component.instances[sCompId].getUserSet();
};