/**
 * @desc	百合抽奖页动画
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/baihe/interSlide.js");
$import("lib/interface.js");


$registJob("luckySlide", function(){
	
	var container = $E("wlist");
	container.style.overflow = "hidden";
	
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


