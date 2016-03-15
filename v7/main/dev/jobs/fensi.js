/**
 * @fileoverview 粉丝地团组件根据组件是否加载判断是否需要加载js
 * @author xy 
 */

$import("lib/include.js");
$import("sina/core/array/findit.js");
$registJob('fensi', function(){
	var flag=false;
	if (scope.component_lists && scope.component_lists != "") {
		for (var k in scope.component_lists) {
			if (scope.component_lists[k].list.length > 0) {
				if (Core.Array.findit(scope.component_lists[k].list, 73) > -1 || Core.Array.findit(scope.component_lists[k].list, 72) > -1) {
					flag = true;
					break;
				}
			}
		}
	}
	
	if(flag==true){
		Lib.include("http://sjs.sinajs.cn/blog7/fensi.js",function(){
		});
	}
});



