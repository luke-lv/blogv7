/**
 * @fileoverview 留言举报
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-01-19
 */

$import("sina/sina.js");
$import("sina/utils/io/jsload.js");
$import("lib/component/report/blogReport.js");
$import("lib/uic.js");


$registJob("report_guestBook", function(){
	var hostNickName="",
		BR=new Lib.BlogReport();
		
	window.report=function(cID){
		
		var bodyID=scope.$uid+"_"+cID,
			links=$E("guestNick_"+cID).getElementsByTagName("a"),
			reportUID=links.length>0?links[0].href.split("/").pop():"",
			nickName=links.length>0?links[0].innerHTML:"新浪网友",
			userNameInfo1=$E("guestNick_"+cID).innerHTML,
			userNameInfo2="",
			titleInfo="",
			contentInfo=$E("content_"+cID).innerHTML;
			
		//获取博主昵称
		if (hostNickName === "") {
			// var url = "http://uic.internal.sina.com.cn/uic/Query.php?" + "UID="+ scope.$uid +"&Check=null&UserInfoTypes=[1]&ProductType=2";
			// Utils.Io.JsLoad.request(url, {
			// 	onComplete: function(result){
			// 		hostNickName=result && result.UserInfo && result.UserInfo[0][1];
			// 		BR.start("guestBook",nickName,bodyID,reportUID,userNameInfo1,'<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+hostNickName+'</a>',titleInfo,contentInfo);
			// 	},
			// 	onException: function(){
			// 		BR.start("guestBook","新浪网友",bodyID,reportUID,userNameInfo1,"<strong>新浪网友</strong>",titleInfo,contentInfo);
			// 	}
			// });
			Lib.Uic.getNickName([scope.$uid],function(result){
				if(result && result[scope.$uid]){
					hostNickName=result[scope.$uid];
					BR.start("guestBook",nickName,bodyID,reportUID,userNameInfo1,'<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+hostNickName+'</a>',titleInfo,contentInfo);
				}else{
					BR.start("guestBook","新浪网友",bodyID,reportUID,userNameInfo1,"<strong>新浪网友</strong>",titleInfo,contentInfo);
				}
			});
		}else{
			userNameInfo2='<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+hostNickName+'</a>';
			BR.start("guestBook",nickName,bodyID,reportUID,userNameInfo1,userNameInfo2,titleInfo,contentInfo);
		}
		return false;
	};
});