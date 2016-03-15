/**
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("lib/interface.js");
$import("lib/showError.js");
$import("sina/core/string/format.js");
$import("sina/core/array/foreach.js");
$import("sina/core/string/shorten.js");

$registJob("wcPrizeInfo", function() {
	var infoField = $E("wc_lottery");
	if(!infoField) return false;
	
	var infoUl = $C("ul");
	var liTemp = "<li><a style='text-decoration:none;'>{0}</a></li>";
	var content = "";
	
	new Interface("http://control.blog.sina.com.cn/2010worldcup/api/prizeinfo.php", "jsload").request({
		onSuccess:function(res){
			Core.Array.foreach(res.rows, function(elem, i){
				if(i>=3) return false;
				var nickName = Core.String.shorten(elem.content.split(" ")[0], 10);
				if(elem.content.indexOf("等奖")>-1){
					content += liTemp.format(nickName+"，"+elem.content.split(" ")[2]);		//中奖
				}else{
					content += liTemp.format(nickName+" 获得抽奖机会");						//抽奖
				}
			});
			infoUl.innerHTML = content;
			infoField.innerHTML = "";
			infoField.appendChild(infoUl);
		}
	});
});
