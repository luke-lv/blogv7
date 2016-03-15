/**
 * @desc	百合感言浮层，符合条件强制弹出
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */
 
$import("comps/baihe/happyDialog.js");

$registJob("forceHappy", function(){
	var __awardId = scope.$lot_data;
	trace("forceHappy_"+__awardId);
	
	if(__awardId == 4 || __awardId == 5 || __awardId == 9){
		new Baihe.happyDialog({
			onSuccess:function(){
				scope.$lot_data = 0;
			}
		}).show(__awardId);
	}
});


