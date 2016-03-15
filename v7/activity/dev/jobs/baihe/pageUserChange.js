/**
 * @desc	百合设置uid，用于检测用户更换登录
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("comps/baihe/userChange.js");
$import("comps/baihe/tblogAtt.js");

$registJob("detectUserChange", function(){
	
	new Baihe.userIdChange().setUid();
	
	trace("tblog_"+scope.$is_loginjoin);
	if(scope.$is_loginjoin != "yes"){		// yes 就是关注过微博
		scope.attMiniBlog();
	}
	
});



