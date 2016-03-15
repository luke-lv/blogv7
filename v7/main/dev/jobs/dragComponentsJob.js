/**
 * @fileoverview 页面设置中的拖动组件job
 * @author xinyu@staff.sina.com.cn
 */
$import("pageSet/dragComp/dragBase.js");

$registJob('dragComponentsJob',function(){
	for(var i=0;i<__pageSetVar.component_list.length;i++){
			if($E('module_'+__pageSetVar.component_list[i]))
			dragBase.add(__pageSetVar.component_list[i]);
			else{
				Debug.dir(__pageSetVar.component_list[i]);
				trace(__pageSetVar.component_list[i]+"号组件根本没有，靠");
			}
	}
	
});

