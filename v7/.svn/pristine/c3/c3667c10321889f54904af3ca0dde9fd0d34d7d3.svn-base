/**
 * @fileoverview 顶踩的展开
 * @author zhihan | zhihan@staff.sina.com.cn
 */
$import("sina/core/dom/getElementsByClass.js");

$registJob('diggerAction',function(){
	scope.showdiggimg = function(clazz) {
		var lis = Core.Dom.getElementsByClass(document, 'li', clazz);
		for(var i=0; lis[i]; i++) {
			lis[i].style.display = '';
		}
	};
});