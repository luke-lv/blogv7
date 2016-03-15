/*
  
 * 请求博主的访问数，每请求一次该接口，自动加一
 */
 
 $import("lib/jobs.js");
 $import("action/getPv.js");

 
$registJob("loadPv", function () {
	var refer = document.referrer == '0' ? '' : document.referrer;
	var uid = (scope.$uid * 1).toString(16)	;
    uid = (uid.length < 8) ? ("00000000" + uid).match(/(\w{8})$/i)[1] : uid;
	  var pData = {
   	   	uid : 	uid
   	   }
   if($E("total_pv")){
	  pData['ref'] = refer;
   	  getPv("total_pv",pData);
	  
   }else if($E("special_pv")){
   	   pData["sid"] = ctg_id;
	   pData['ref'] = refer;
   	   getPv("special_pv",pData);
   }else if($E("photo_pv")){
   	   pData["sid"] = picInfo.ctg_id;
   	   pData["pid"] = picInfo.pic_id.replace(uid,'');
	   pData['ref'] = refer;
   	   getPv("photo_pv",pData);
   }
});