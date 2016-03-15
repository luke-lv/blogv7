/*
   author shaomin|shaomin@staff.sina.com.cn 6207
   desc pvdom 指页面上需要显示这个pv数的节点的前缀，
       后面会拼接_pv，包括：total，special，photo；
       同时也是接口的三种数据，总pv，专辑pv和图片的pv

*/
$import("sina/utils/io/jsload.js");
$import("sina/core/string/formatNumber.js");
 
 
function getPv(pvDom,pData){
	// var pvurl = "http://hitsw.sinajs.cn/hits?act=5";
	var pvurl = "http://comet.blog.sina.com.cn/api?maintype=hits&act=5";
	Utils.Io.JsLoad.request(pvurl, {
		GET : pData,
		onComplete : function(){
		var number = pvDom.indexOf("total")!=-1 ? Core.String.formatNumber(HitsV[pvDom]) : "("+Core.String.formatNumber(HitsV[pvDom])+")";
		  $E(pvDom).innerHTML = number;
		},
		onException : function(){
			$E(pvDom).innerHTML = "0";
		}
	});
}
