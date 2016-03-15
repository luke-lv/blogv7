/**
 * @fileoverview
 *	在博客首页没有个人资料组件的情况下，记录PV
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import('sina/utils/io/jsload.js');
$registJob('readNumPlus',function(){
	var refer = document.referrer == '0' ? '' : encodeURIComponent(document.referrer);
	var comp_list = [];
	for(var key in scope.component_lists){
		comp_list = comp_list.concat(scope.component_lists[key].list);
	}
	comp_list = ',' + comp_list.join(",") + ',';
	if(/,901,/.test(comp_list) == false && scope.$articleid == null){
		var $uidhex = (scope.$uid * 1).toString(16);
                $uidhex.length < 8 ? $uidhex = (("00000000" + $uidhex).substr($uidhex.length, 8)) : $uidhex; 
		// var pvurl = "http://hits.blog.sina.com.cn/hits?act=3&uid=" + $uidhex + '&ref=' + refer;
		var pvurl = "http://comet.blog.sina.com.cn/api?maintype=hits&act=3&uid=" + $uidhex + '&ref=' + refer;
		Utils.Io.JsLoad.request(pvurl, {
			onComplete : function(data){
				if(data && typeof data.pv != "undefined"){
					scope.totalPv = data.pv;
				}
			}
		});
	}
});