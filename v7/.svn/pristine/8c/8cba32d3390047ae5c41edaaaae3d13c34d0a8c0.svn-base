/**
 * @author W.Qiang | wangqiang1@staff.sina.com.cn
 * @description 获取推广链接
 */

/**
 * 获取用户的推广链接
 * @param {Object} cfg 
 * 			uid 用户ID
 */
$import("sina/core/string/format.js");
scope.getPromoteURL = function(cfg){
	var tempUrl='http://blog.sina.com.cn/u/'+cfg.uid;
	var promoteURLSuffix = "http://sina.allyes.com/main/adfclick?db=sina&bid=204720,290418,295665&cid=0,0,0&sid=288937&advid=358&camid=37389&show=ignore";
	if(cfg.isPromote){
		tempUrl = promoteURLSuffix + ( $UID ? "&kv={0}|99999&url={1}".format($UID,tempUrl):"&url={0}".format(tempUrl))
	}
	//布码官博入口--已不需要推广
	if(cfg.uid == 1259295385){
		var bumaURL = 'http://blog.sina.com.cn/u/'+cfg.uid;
		tempUrl='http://sina.allyes.com/main/adfclick?db=sina&bid=204720,256856,261931&cid=0,0,0&sid=253209&advid=358&camid=37389&show=ignore&url='+bumaURL;
	}
	return tempUrl;
}