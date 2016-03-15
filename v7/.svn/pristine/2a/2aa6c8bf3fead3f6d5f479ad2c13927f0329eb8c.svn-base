/**
 * 收起或展开制定的class元素
 * author：changchuan@staff.sina.com.cn
 */
$import("sina/core/dom/getElementsByClass.js");
$registJob('clickMore',function(){
	scope.clickMore = function(clazz,dom) {
		var lis = Core.Dom.getElementsByClass(document, 'li', clazz);
		for(var i=0; lis[i]; i++) {
			lis[i].style.display =lis[i].offsetHeight?"none": '';
		}		
		if(dom.innerHTML.indexOf('更多')!=-1)
		{
			dom.__htm= dom.innerHTML;
			dom.innerHTML = "点击收起↑";
		}else
		{
			dom.innerHTML = dom.__htm;
		}		
		return false ;
	}
});