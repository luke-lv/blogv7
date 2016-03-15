/** 
 * @fileoverview blogAd 命名空间
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 */
var blogAd = {};
// 决定某广告是否可以初始化
blogAd.getInitPermission = function(oParam){
	var __root;
	if(oParam && oParam.ads && oParam.ads[0]){
		__root = oParam && oParam.ads && oParam.ads[0];
		return __root.type=="mixed" || __root.ref;
	}else{
		return false;
	}
};

