/**
 * @fileoverview
 *	逐一渲染动态组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @Version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/function/bind2.js");

$import("lib/component/_component.js");
$import("lib/lazyload.js");
/**
 * 按照顺序逐一实例化动态组件并渲染
 * @param {Array} arrDefaultList	动态组件列表
 */
Lib.Component.renderByList = function (arrDefaultList) {
	Core.Array.foreach(arrDefaultList, function(oItem){
		try{
			if ($E("module_" + oItem) != null) {
				var comp = Lib.Component.instances[oItem] || new Lib.Component["Comp_" + oItem](oItem);
				if(comp.size != null && comp.load != null){
					comp.size = Lib.Component.compSize[oItem];
					try{
						comp.load();
					}catch(e){}
					Debug.log("组件：" + oItem + " 初始化成功");
				}else{
					Debug.error("组件：" + oItem + " 初始化失败，组件尺寸信息不存在");
				}
			}
			else {
				Debug.error("组件：" + oItem + " 初始化失败，页面内缺少组件的HTML节点");
			}
		}catch(e){
			Debug.error(e.message || "组件：" + oItem + " 初始化失败，请确认该组件类是否定义过");
		}finally{
		}
	});
};

Lib.Component.lazyRenderByList = function (arrDefaultList) {
	var lazyList = [];
	Core.Array.foreach(arrDefaultList, function(oItem){
		try{
			if ($E("module_" + oItem) != null) {
				var comp = Lib.Component.instances[oItem] || new Lib.Component["Comp_" + oItem](oItem);
				if(comp.size != null && comp.load != null){
					comp.size = Lib.Component.compSize[oItem];
					try{
						lazyList.push({
							dom : $E("module_" + oItem)
							,callback : Lib.Component.instances[oItem].load.bind2(Lib.Component.instances[oItem])
						});
					}catch(e){}
					Debug.log("组件：" + oItem + " 初始化成功");
				}else{
					Debug.error("组件：" + oItem + " 初始化失败，组件尺寸信息不存在");
				}
			}
			else {
				Debug.error("组件：" + oItem + " 初始化失败，页面内缺少组件的HTML节点");
			}
		}catch(e){
			Debug.error(e.message || "组件：" + oItem + " 初始化失败，请确认该组件类是否定义过");
		}finally{
		}
	});
	Lib.LazyLoad(lazyList, {});
};