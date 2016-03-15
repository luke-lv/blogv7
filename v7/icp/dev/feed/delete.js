/**
 * @fileoverview 此文件是应用于博客个人中心删除博文
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created     2012-08-22
 * @vertion 0.01
 */
$import('sina/Evter.js');
$import('sina/core/dom/parent.js');
$import('sina/utils/io/jsload.js');
$import("sina/core/dom/getXY.js");
$import("lib/dialogConfig.js");
$import("sina/core/dom/removeNode.js");
$import("sina/ui/tween/tweenStrategy.js");

Evter.add('delete', function(elem){
   var _dom = Core.Dom;
   var li = _dom.parent(elem, 'li');
   var edata = Evter.data(li);
   winDialog.confirm("确定要删除此篇博文吗?",{
		subText:"",
		funcOk:function(){
			var interfaceDelete = new Interface("http://control.blog.sina.com.cn/admin/article/article_del_recycle.php","ijax");
		    interfaceDelete.request({
				POST : {
					"blog_id[]":edata.blogid,
						"uid"  :scope.$uid
				},
				onSuccess : function (data) {
					var h = li.offsetHeight;
					li.style.overflow = "hidden";
					var tween = new Ui.TweenStrategy(h, 0, 0.7, Ui.Transition.regularEaseOut);
					tween.onTween = function(val){
						li.style.height = parseInt(val, 10) + "px";
					};
					tween.onEnd = function(){
						Core.Dom.removeNode(li);
					};
					$IE?tween.onEnd():tween.start();
				},
				onError : function (cep) {
					winDialog.alert(cep.data);
				},
				onFail : function (){
				}
			});
		}
	});	

});
