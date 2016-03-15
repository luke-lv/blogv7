/**
 * @desc	百合首页动画
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/baihe/interSlide.js");
$import("lib/interface.js");


$registJob("index_slide", function(){
	
	var container = $E("wlist");
	container.parentNode.style.cssText = "; overflow:hidden; height:225px;";
	
	new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=get_happy_list", "jsload").request({
		onSuccess:function(res){
			new Baihe.InterSlide({
				parent:	container,
				src:	res,
				height:	225
			});
		},
		onError:function(res){
			
		}
	});
	
});


