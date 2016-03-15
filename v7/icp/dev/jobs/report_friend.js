/**
 * @fileoverview 添加好友举报
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-01-19
 */

$import("sina/sina.js");
$import("lib/component/report/blogReport2.js");

$registJob("report_friend", function(){
	var BR=new Lib.BlogReport();		
	window.report=function(bodyID){
		//var cID=bodyID.replace(/(\u3000|\s|\t)*$/gi, ""),
		  	var cID = bodyID,
			nickLink=$E("nick_"+cID).getElementsByTagName("a")[0],
			nickName=nickLink?nickLink.innerHTML:"新浪网友",
			reportUID=$E("nick_"+cID).getElementsByTagName("a")[0].href.split("/").pop(),
			userNameInfo1=nickLink?'<a target="_blank" href="'+nickLink.href+'">'+nickLink.innerHTML+'</a>':"新浪网友",
			userNameInfo2="",
			titleInfo="",
			contentInfo=$E("body_"+cID).innerHTML;
			bodyID = $UID+"_"+cID;
		BR.start("friend",nickName,bodyID,reportUID,userNameInfo1,userNameInfo2,titleInfo,contentInfo);
	};
});